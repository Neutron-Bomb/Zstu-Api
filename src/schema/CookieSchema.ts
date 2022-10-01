import { Schema } from 'mongoose'

const CookieRecord = new Schema({
    studentId: {
        type: String,
        required: true
    },
    cookie: {
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

export { CookieRecord }