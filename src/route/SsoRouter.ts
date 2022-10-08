import { Router } from 'express'
import SsoController from '../controller/SsoController'

const SsoRouter = Router()

/**
 * @api {POST} /sso/clockin/status 获取打卡状态
 * @apiGroup SSO
 * @apiDescription 获取前一次打卡时填入的信息
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 0,
 *      "msg": "获取成功",
 *      "data": {
 *          ......
 *      }
 *  }
 */
SsoRouter.post('/clockin/status', SsoController.SsoClockInStatusHandler)

/**
 * @api {POST} /sso/clockin/ 打卡
 * @apiGroup SSO
 * @apiDescription 按照前一次的打卡信息提交打卡
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 0,
 *      "msg": "操作成功"
 *  }
 */
SsoRouter.post('/clockin', SsoController.SsoClockInHandler)

export default SsoRouter