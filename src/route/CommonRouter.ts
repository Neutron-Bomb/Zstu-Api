import { Router } from 'express'
import CommonController from '../controller/CommonController'

const CommonRouter = Router()

/**
 * @api {GET} /common/electricity/{studentId} 获取宿舍电费情况
 * @apiGroup Common
 * @apiDescription 转发请求至完美校园，实现根据学号查询相关电费
 * 
 * @apiParam {String} studentId 学号
 */
CommonRouter.get('/electricity/:studentId', CommonController.ElectricityHandler)

/**
 * @api {GET} /common/exercisemileage/{studentId} 获取跑步里程数
 * @apiGroup Common
 * @apiDescription 转发请求至学校服务器，获取指定学号跑步里程数
 * 
 * @apiParam {String} studentId 学号
 */
CommonRouter.get('/exercisemileage/:studentId', CommonController.ExerciseMileageHandler)

export default CommonRouter