import log4js from 'log4js'
import * as log4jsConfig from '../config/logger.json'

log4js.configure(log4jsConfig)

const Logger = log4js

export default Logger