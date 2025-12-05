import Router from 'express'
import { deleteCode, runBatchCode} from '../controllers/SubmissionControls.js'
const judgeRoute = Router()

judgeRoute.post('/run-code/batch', runBatchCode)

judgeRoute.delete('/delete-code', deleteCode)

export default judgeRoute