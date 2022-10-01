import mongoose from 'mongoose'
import * as mongooseConfig from '../config/database.json'
import Logger from '../util/Logger'

const logger = Logger.getLogger('database')

let isConnected = false

mongoose.connection.on('connected', () => {
    isConnected = true
    logger.info('Database connected')
})

mongoose.connection.on('disconnected', () => {
    isConnected = false
    logger.info('Database disconnected')
})

mongoose.connection.on('error', (error) => {
    isConnected = false
    logger.error(error)
})

const Database = {
    connect: () => {
        if (!isConnected) {
            logger.info('Start connecting to database')
            mongoose.connect(mongooseConfig.uri, mongooseConfig.config)
        } else {
            logger.warn('Database already connected')
        }
    },
    model: (model: string) => {
        if (isConnected) {
            return mongoose.model(model)
        } else {
            throw Error('Database was not connected')
        }
    }
}

export default Database