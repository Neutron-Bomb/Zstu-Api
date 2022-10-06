import { Router } from 'express'
import SsoController from '../controller/SsoController'

const SsoRouter = Router()

SsoRouter.post('/clockin', SsoController.SsoClockInHandler)

export { SsoRouter }