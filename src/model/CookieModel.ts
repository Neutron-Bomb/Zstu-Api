import { Schema } from 'mongoose'
import Database from '../util/Database'

const CookieRecord = new Schema({
    studentId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cookieJar: {
        type: JSON,
        required: true
    },
    permission: {
        type: String,
        required: true
    },
    expire: {
        type: Number,
        required: true
    }
})

const CookieModel = Database.model('cookie', CookieRecord)

export default CookieModel