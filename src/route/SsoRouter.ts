import { Router } from 'express'
import { SsoController } from '../controller/SsoController'

const SsoRouter = Router()

SsoRouter.post('login', SsoController.SsoLoginHandler)

export { SsoRouter }