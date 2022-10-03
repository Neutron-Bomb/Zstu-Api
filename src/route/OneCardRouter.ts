import { Router } from 'express'
import OneCardController from '../controller/OneCardController'

const OneCardRouter = Router()

OneCardRouter.post('/login', OneCardController.Login)

export default OneCardRouter