import { Router } from 'express'
import CommonController from '../controller/CommonController'

const CommonRouter = Router()

CommonRouter.get('/electricity/:studentId', CommonController.ElectricityHandler)

export default CommonRouter