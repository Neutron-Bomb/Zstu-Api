import mongoose, { Schema } from 'mongoose'
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

async function connect() {
    if (!isConnected) {
        logger.info('Start connecting to database')
        await mongoose.connect(mongooseConfig.uri, mongooseConfig.config).then(() => { isConnected = true })
    }
}

const Database = {
    model: async (collection: string, model: Schema) => {
        await connect()
        if (isConnected) {
            return mongoose.model(collection, model)
        }
        throw Error('数据库连接错误')
    }
}

export default Database