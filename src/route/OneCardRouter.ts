import { Router } from 'express'
import OneCardController from '../controller/OneCardController'

const OneCardRouter = Router()

OneCardRouter.post('/balance', OneCardController.Balance)
OneCardRouter.post('/consumption', OneCardController.Consumption)
OneCardRouter.post('/attendance', OneCardController.Attendance)

export default OneCardRouter