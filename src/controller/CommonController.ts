import { Request, Response } from 'express'
import Common from '../core/Common'


async function ElectricityHandler(req: Request, res: Response) {
    const studentId = req.params.studentId
    res.json(await Common.Electricity(studentId))
}

async function ExerciseMileageHandler(req: Request, res: Response) {
    const studentId = req.params.studentId
    res.json(await Common.ExerciseMileage(studentId))
}

const CommonController = {
    ElectricityHandler,
    ExerciseMileageHandler
}

export default CommonController