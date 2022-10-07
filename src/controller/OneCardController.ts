import { Request, Response } from 'express'
import OneCard from '../core/OneCard'
import CookieModel from '../model/CookieModel'

const permission = 'one card'

async function getOneCard(req: Request) {
    const studentId = req.body.studentId
    const password = req.body.password
    if (!studentId || !password) {
        throw Error('参数必须提供studentId和password')
    }
    const cookieModel = await CookieModel
    const cookie = await cookieModel.findOne({ $and: [ { studentId: studentId }, { permission: permission }, { password: password } ]}).then(doc => doc).catch(err => console.log(err))
    const oc = (cookie && cookie.expire > (new Date()).getTime()) ? OneCard.fromCookieJar(cookie.cookieJar) : OneCard.fromUserPass(studentId, password)
    await oc.login()
    /* Logined if no error threw */
    if (cookie && cookie.expire <= (new Date()).getTime() || !cookie) {
        cookieModel.findOneAndUpdate( { $and: [ { studentId: studentId }, { permission: permission }, { password: password } ]}, { cookieJar: oc.getCookieJar()?.toJSON(), expire: (new Date()).getTime() + 1800 * 1000 }, { upsert: true, new: true }).catch(err => console.log(err))
    }
    return oc
    
}

async function Balance(req: Request, res: Response) {
    const oc = await getOneCard(req)
    res.json(await oc.getBalance())
}

async function Consumption(req: Request, res: Response) {
    const oc = await getOneCard(req)
    res.json(await oc.getConsumption(req.body.startDate, req.body.endDate))
}

async function Attendance(req: Request, res: Response) {
    const oc = await getOneCard(req)
    res.json(await oc.getAttendance(req.body.startDate, req.body.endDate))
}

const OneCardController = {
    Balance,
    Consumption,
    Attendance
}

export default OneCardController