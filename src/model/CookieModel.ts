import { Schema } from 'mongoose'
import Database from '../util/Database'

const CookieRecord = new Schema({
    studentId: {
        type: String,
        required: true
    },
    cookieJar: {
        type: String,
        required: true
    },
    expire: {
        type: Date,
        required: true
    },
    permission: {
        type: String,
        required: true
    }
})

const CookieModel = Database.model('cookie', CookieRecord)

export { CookieModel }