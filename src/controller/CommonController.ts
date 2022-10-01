import { Request, Response } from 'express'
import Common from '../core/Common'


async function ElectricityHandler(req: Request, res: Response) {
    const studentId = req.params.studentId
    res.json(await Common.Electricity(studentId))
}

const CommonController = {
    ElectricityHandler
}

export default CommonController