import { Router } from 'express'
import AcademicManagementController from '../controller/AcademicManagementController'

const AcademicManagementRouter = Router()

AcademicManagementRouter.post('/grades/:year/:semester', AcademicManagementController.GradesHandler)
AcademicManagementRouter.post('/schedule/:year/:semester', AcademicManagementController.ScheduleHandler)
AcademicManagementRouter.post('/turnmajor/:year/:semester', AcademicManagementController.TurnMajorHandler)
AcademicManagementRouter.post('/exams/:year/:semester', AcademicManagementController.ExamsHandler)

export default AcademicManagementRouter