import express from 'express'
import expressConfig from './config/express.json'
import 'express-async-errors'
import Logger from './util/Logger'
import CommonRouter from './route/CommonRouter'
import Error from './core/Error'
import OneCardRouter from './route/OneCardRouter'
import AcademicManagementRouter from './route/AcademicManagementRouter'
import SsoRouter from './route/SsoRouter'
import path from 'path'



const app = express()
const logger = Logger.getLogger('express')

/* Use Log4js as logger */
app.use(Logger.connectLogger(logger, {}))

/* BodyParser using json and urlencoded */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Registe routers */
app.use('/common', CommonRouter)
app.use('/onecard', OneCardRouter)
app.use('/academic', AcademicManagementRouter)
app.use('/sso', SsoRouter)

app.use(Error.errorMidware)

/* Request for doc/index.html */
app.use(express.static('doc'))

app.listen(expressConfig.port, () => {
    logger.info('Service started')
})