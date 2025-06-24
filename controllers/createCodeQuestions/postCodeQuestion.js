const { supabase } = require("../../supabaseClient");
const { VM } = require("vm2");

exports.submitCodeAnswers = async (req, res) => {
  const { userId, exam_id, answers, timeTaken, focusLossCount } = req.body;

  // Validate required input
  if (!userId || !exam_id || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    console.log("Received submission:", {
      userId,
      exam_id,
      answers,
      timeTaken,
      focusLossCount,
    });

    // Insert new exam submission record
    const { data: submissionData, error: submissionError } = await supabase
      .from("exam_submissions")
      .insert([
        {
          submitted_at: new Date().toISOString(),
          student_id: userId,
          exam_id: exam_id,
          total_score: 0,
          time_taken: timeTaken,
          focus_loss_count: focusLossCount,
        },
      ])
      .select();

    if (submissionError || !submissionData?.length) {
      console.error("Submission insert failed:", submissionError);
      return res.status(500).json({ error: "Submission insert failed" });
    }

    const submissionId = submissionData[0].id;
    let totalScore = 0;
    const results = [];

    // Loop through each submitted answer
    for (const answer of answers) {
      const { questionId, code } = answer;

      if (!questionId || !code) {
        console.warn("Invalid answer:", answer);
        continue;
      }

      // Fetch question details including test cases and points
      const { data: question, error: questionError } = await supabase
        .from("code_questions")
        .select("*")
        .eq("question_id", questionId)
        .single();

      if (questionError || !question) {
        console.warn(`Failed to fetch question ${questionId}`, questionError);
        continue;
      }

      const testCases = question.test_cases;
      if (!Array.isArray(testCases)) {
        console.error(`Invalid test_cases for question ${questionId}: not an array`);
        continue;
      }

      console.log(`Evaluating Question ID: ${questionId}`);
      console.log("Test Cases:", testCases);

      // Setup secure sandboxed VM for code execution
      const vm = new VM({
        timeout: 1000,
        sandbox: {}
      });

      // Clean code from console logs for cleaner execution
      const cleanedCode = code.replace(/console\.log\(.*?\);?/g, "");

      let passedCount = 0;
      let feedback = "";

      // Run each test case
      for (const test of testCases) {
        try {
          // Run code in VM and get solution function
          const wrappedCode = `
            ${cleanedCode}
            solution;
          `;

          const func = vm.run(wrappedCode);

          if (typeof func !== "function") {
            throw new Error("Missing or invalid 'solution' function");
          }

          // Execute solution with test input and compare output
          const result = func(...test.input);

          if (JSON.stringify(result) === JSON.stringify(test.expected_output)) {
            passedCount++;
          } else {
            feedback += ` Input ${JSON.stringify(
              test.input
            )} → Expected ${JSON.stringify(test.expected_output)}, got ${JSON.stringify(result)}\n`;
          }
        } catch (e) {
          console.error(`Error during VM run: ${e.message}`);
          feedback += `⚠️ Error with input ${JSON.stringify(test.input)}: ${e.message}\n`;
        }
      }

      // Award full points only if all test cases pass
      const score = (passedCount === testCases.length) ? (question.points || 0) : 0;

      console.log(`Passed: ${passedCount}/${testCases.length}, Score: ${score}`);

      totalScore += score;

      // Prepare answer result for DB insert
      results.push({
        student_answer: code,
        is_correct: passedCount === testCases.length,
        score,
        ai_feedback: feedback || "✅ All test cases passed!",
        question_id: questionId,
        submission_id: submissionId,
      });
    }

    // Insert all answer results
    if (results.length > 0) {
      const { error: insertAnswersError } = await supabase
        .from("code_submissions_answers")
        .insert(results);

      if (insertAnswersError) {
        console.error("Error inserting code answers:", insertAnswersError);
        return res.status(500).json({ error: "Code answers insert failed" });
      }
    }

    // Update total score for the submission
    console.log(`Total score for submission ${submissionId}: ${totalScore}`);

    await supabase
      .from("exam_submissions")
      .update({ total_score: totalScore })
      .eq("id", submissionId);

    return res.status(200).json({ success: true, totalScore, submissionId });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
