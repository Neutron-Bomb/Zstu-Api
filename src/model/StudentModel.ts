import { Schema  } from 'mongoose'
import Database from '../util/Database'

const StudentRecord = new Schema({
    studentId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    permissions: {
        type: Array,
        required: false
    }
})

const StudentModel = Database.model('student', StudentRecord)

export { StudentModel }