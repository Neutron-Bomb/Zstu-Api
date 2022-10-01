import { Schema  } from 'mongoose'

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

export { StudentRecord }