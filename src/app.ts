import express from 'express'
import expressConfig from './config/express.json'
import 'express-async-errors'
import Database from './util/Database'
import Logger from './util/Logger'
import CommonRouter from './route/CommonRouter'
import Error from './core/Error'

Database.connect()
const app = express()
const logger = Logger.getLogger('express')

/* Use Log4js as logger */
app.use(Logger.connectLogger(logger, {}))

/* BodyParser using json and urlencoded */
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

/* Registe routers */
app.use('/common', CommonRouter)
app.use(Error.errorMidware)

app.listen(expressConfig.port, () => {
    logger.info('Service started')
})