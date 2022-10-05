import { Request, Response } from 'express'
import moment from 'moment'
import AcademicManagement, { SEMESTER } from '../core/AcademicManagement'
import CookieModel from '../model/CookieModel'

const permission = 'academic management'

function preprocess(req: Request) {
    const year = req.params.year || moment(new Date()).format('yy')
    let semester: any = req.params.semester || SEMESTER.ALL
    switch (semester) {
        case '1':
            semester = SEMESTER.FIRST   
            break
        case '2':
            semester = SEMESTER.SECOND
            break
        case '3':
            semester = SEMESTER.THIRD
            break
        default:
            semester = SEMESTER.ALL
            break
    }
    return { year, semester }
}

async function getAcademicManagement(req: Request) {
    const studentId = req.body.studentId
    const password = req.body.password
    if (!studentId || !password) {
        throw Error('参数必须提供studentId和password')
    }
    const cookieModel = await CookieModel
    const cookie = await cookieModel.findOne({ $and: [ { studentId: studentId }, { permission: permission } ]}).then(doc => doc).catch(err => console.log(err))
    const am = (cookie && cookie.expire > (new Date()).getTime()) ? AcademicManagement.fromCookieJar(cookie.cookieJar) : AcademicManagement.fromUserPass(studentId, password)
    await am.login()
    /* Logined if no error threw */
    if (cookie && cookie.expire <= (new Date()).getTime() || !cookie) {
        cookieModel.findOneAndUpdate( { $and: [ { studentId: studentId }, { permission: permission } ]}, { cookieJar: am.getCookieJar()?.toJSON(), expire: (new Date()).getTime() + 1800 }, { upsert: true, new: true }).catch(err => console.log(err))
    }
    return am
}

async function GradesHandler(req: Request, res: Response) {
    const es = await preprocess(req)
    const am = await getAcademicManagement(req)
    res.json(await am.getGrades(es.year, es.semester))
}

async function ScheduleHandler(req: Request, res: Response) {
    const es = await preprocess(req)
    const am = await getAcademicManagement(req)
    res.json(await am.getSchedule(es.year, es.semester))
}

async function TurnMajorHandler(req: Request, res: Response) {
    const es = await preprocess(req)
    const am = await getAcademicManagement(req)
    res.json(await am.getTurnMajor(es.year, es.semester))
}

async function ExamsHandler(req: Request, res: Response) {
    const es = await preprocess(req)
    const am = await getAcademicManagement(req)
    res.json(await am.getExams(es.year, es.semester))
}

const AcademicManagementController = {
    GradesHandler,
    ScheduleHandler,
    TurnMajorHandler,
    ExamsHandler
}

export default AcademicManagementController