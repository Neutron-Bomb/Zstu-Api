import { Router } from 'express'
import OneCardController from '../controller/OneCardController'

const OneCardRouter = Router()

/**
 * @api {POST} /onecard/balance 获取一卡通余额
 * @apiGroup OneCard
 * @apiDescription 获取指定账户一卡通余额
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password 一卡通密码
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {String} data.balance 账户余额
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      code: 0,
 *      msg: '获取成功',
 *      data: {
 *          balance: 10.0
 *      }
 *  }
 */
OneCardRouter.post('/balance', OneCardController.Balance)

/**
 * @api {POST} /onecard/consumption 获取消费记录
 * @apiGroup OneCard
 * @apiDescription 获取指定账户消费记录
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password 一卡通密码
 * @apiParam {String} [startDate] 时间区间开始
 * @apiParam {String} [endDate] 时间区间结束
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {String} data.items.when 消费时间
 * @apiSuccess {String} data.items.why 消费原因
 * @apiSuccess {String} data.items.what 消费设备
 * @apiSuccess {String} data.items.where 消费地点
 * @apiSuccess {String} data.items.used 费用
 * @apiSuccess {String} data.items.remain 余额
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 0,
 *      "msg": "获取成功",
 *      "data": {
 *          "count": 1,
 *          "items": [
 *              {
 *                  "when": "2022/9/2 12:12:22",
 *                  "why": "餐费支出",
 *                  "what": "物联网工作站",
 *                  "where": "M2-12-204",
 *                  "used": "19.60",
 *                  "remain": "0.00"
 *              }
 *          ]
 *      }
 *  }
 */
OneCardRouter.post('/consumption', OneCardController.Consumption)

/**
 * @api {POST} /onecard/attendance 获取考勤记录
 * @apiGroup OneCard
 * @apiDescription 获取指定考勤记录
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password 一卡通密码
 * @apiParam {String} [startDate] 时间区间开始
 * @apiParam {String} [endDate] 时间区间结束
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {String} data.items.when 考勤时间
 * @apiSuccess {String} data.items.where 考勤地点
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "code": 0,
 *      "msg": "获取成功",
 *      "data": {
 *          "count": 1,
 *          "items": [
 *              {
 *                  "when": "2022/9/22 22:49:28",
 *                  "where": "2区6#南"
 *              }
 *          ]
 *      }
 *  }
 */
OneCardRouter.post('/attendance', OneCardController.Attendance)

export default OneCardRouter