import { Router } from 'express'; 
const router = Router({ mergeParams: true }); 
import { getLanguagesController } from '../../controllers/createCodeQuestions/getLanguagesController';


router.get('/', getLanguagesController); 
export default router; 
