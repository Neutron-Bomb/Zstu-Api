import { Request, Response } from 'express'
import Iduo, { LOGIN_TYPE } from '../core/Iduo'

async function getIduo(req: Request) {
    const studentId = req.body.studentId
    const password = req.body.password
    if (!studentId || !password) {
        throw Error('参数必须提供studentId和password')
    }
    const iduo =  Iduo.fromUserPass(studentId, password)
    await iduo.login(LOGIN_TYPE.EPIDEMIC_PREVENTION)
    return iduo
}

async function SsoClockInHandler(req: Request, res: Response) {
    const iduo = await getIduo(req)
    res.json(await iduo.clockIn())
}

async function SsoClockInStatusHandler(req: Request, res: Response) {
    const iduo = await getIduo(req)
    res.json(await iduo.getClockInStatus())
}

const SsoController = {
    SsoClockInHandler,
    SsoClockInStatusHandler
}

export default SsoController