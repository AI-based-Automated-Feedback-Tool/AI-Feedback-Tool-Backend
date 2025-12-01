const{deleteExam}=require('../../services/deleteExam/deleteExamService');

const removeExam=async(req,res)=>{
    try{
        const result=await deleteExam(req.body);
        res.status(200).json(result);
    }catch(error){
        res.status(error.status || 500).json({error: error.message});
    }
}

module.exports = { removeExam };