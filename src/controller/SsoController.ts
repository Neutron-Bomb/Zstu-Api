import { Request, Response } from 'express'
import Iduo, { LOGIN_TYPE } from '../core/Iduo'
import SingleSignOn from '../core/SingleSignOn'
import CookieModel from '../model/CookieModel'

const permission = 'sso'

async function getIduo(req: Request, loginType: LOGIN_TYPE) {
    const studentId = req.body.studentId
    const password = req.body.password
    if (!studentId || !password) {
        throw Error('参数必须提供studentId和password')
    }
    const cookieModel = await CookieModel
    const cookie = await cookieModel.findOne({ $and: [ { studentId: studentId }, { permission: permission }, { password: password } ]}).then(doc => doc)
    const sso = (cookie && cookie.expire > (new Date()).getTime()) ? SingleSignOn.fromCookieJar(cookie.cookieJar) : SingleSignOn.fromUserPass(studentId, password)
    const iduo = Iduo.fromSingleSignOn(sso)
    await iduo.login(loginType)
    /* Logined if no error threw */
    if (cookie && cookie.expire <= (new Date()).getTime() || !cookie) {
        cookieModel.findOneAndUpdate( { $and: [ { studentId: studentId }, { permission: permission }, { password: password } ]}, { cookieJar: sso.getCookieJar()?.toJSON(), expire: (new Date()).getTime() + 1800 * 1000 }, { upsert: true, new: true }).catch(err => console.log(err))
    }
    return iduo
}

async function SsoClockInHandler(req: Request, res: Response) {
    const iduo = await getIduo(req, LOGIN_TYPE.EPIDEMIC_PREVENTION)
    res.json(await iduo.clockIn(req.body.studentId))
}

async function SsoClockInStatusHandler(req: Request, res: Response) {
    const iduo = await getIduo(req, LOGIN_TYPE.EPIDEMIC_PREVENTION)
    res.json(await iduo.getClockInStatus(req.body.studentId))
}

const SsoController = {
    SsoClockInHandler,
    SsoClockInStatusHandler
}

export default SsoController