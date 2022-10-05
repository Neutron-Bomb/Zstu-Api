import { Router } from 'express'
import AcademicManagementController from '../controller/AcademicManagementController'

const AcademicManagementRouter = Router()

/**
 * @api {POST} /academic/grades/{year}/{semester} 教务处成绩
 * @apiGroup Academic
 * @apiDescription 获取某年某学期成绩
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * @apiParam {Number} year 学年
 * @apiParam {Number} semester 学期
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {String} data.items.what 课程名称
 * @apiSuccess {String} data.items.when 成绩录入时间
 * @apiSuccess {String} data.items.who 任课老师
 * @apiSuccess {String} data.items.grade 百分制成绩
 * @apiSuccess {String} data.items.displayGrade 成绩
 * @apiSuccess {String} data.items.credits 学分
 * @apiSuccess {String} data.items.creditsGrade 绩点
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
 *                  "what": "形势与政策",
 *                  "when": "2022-06-24 13:10:50",
 *                  "who": "张某",
 *                  "grade": "100",
 *                  "displayGrade": "100",
 *                  "credits": "0.25",
 *                  "creditsGrade": "5.00"
 *              }
 *          ]
 *      }
 *  }
 */
AcademicManagementRouter.post('/grades/:year/:semester', AcademicManagementController.GradesHandler)

/**
 * @api {POST} /academic/schedule/{year}/{semester} 教务处课表
 * @apiGroup Academic
 * @apiDescription 获取某年某学期课表
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * @apiParam {Number} year 学年
 * @apiParam {Number} semester 学期
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {String} data.items.what 课程名称
 * @apiSuccess {String} data.items.who 任课老师
 * @apiSuccess {String} data.items.where 上课地点
 * @apiSuccess {Object} data.items.when 上课时间
 * @apiSuccess {String} data.items.when.week 星期几
 * @apiSuccess {String} data.items.when.day 上课节范围
 * @apiSuccess {String} data.items.class 课程分类
 * @apiSuccess {String} data.items.credits 学分
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
 *                  "what": "英语4",
 *                  "who": "李思龙",
 *                  "where": "2-S230",
 *                  "when": {
 *                      "week": "5",
 *                      "day": "1-2"
 *                  },
 *                  "class": "通识课",
 *                  "credits": "3.0"
 *              }
 *          ]
 *      }
 *  }
 */
AcademicManagementRouter.post('/schedule/:year/:semester', AcademicManagementController.ScheduleHandler)

/**
 * @api {POST} /academic/turnmajor/{year}/{semester} 教务处转专业
 * @apiGroup Academic
 * @apiDescription 获取某年某学期转专业信息
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * @apiParam {Number} year 学年
 * @apiParam {Number} semester 学期
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {Object} data.items.to 去向
 * @apiSuccess {String} data.items.reason 转专业原因
 * @apiSuccess {String} data.items.status 当前状态
 * @apiSuccess {String} data.items.statusUpdateDate 状态更新时间
 * @apiSuccess {String} data.items.applyTime 提交申请时间
 * 
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
 *                  "to": {
 *                      "academic": "计算机科学与技术学院(人工智能学院)",
 *                      "major": "计算机类"
 *                  },
 *                  "reason": "***",
 *                  "status": "5",
 *                  "statusUpdateDate": "2022-01-21",
 *                  "applyTime": "2021-12-11"
 *              }
 *          ]
 *      }
 *  }
 */
AcademicManagementRouter.post('/exams/:year/:semester', AcademicManagementController.TurnMajorHandler)

/**
 * @api {POST} /academic/turnmajor/{year}/{semester} 教务处考试安排
 * @apiGroup Academic
 * @apiDescription 获取某年某学期考试信息
 * 
 * @apiParam {String} studentId 学号
 * @apiParam {String} password SSO密码
 * @apiParam {Number} year 学年
 * @apiParam {Number} semester 学期
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} msg 状态提示信息
 * @apiSuccess {Object} data 数据结构体
 * @apiSuccess {Number} data.count 条目数量
 * @apiSuccess {Object} data.items 具体数据
 * @apiSuccess {String} data.items.what 课程名称
 * @apiSuccess {String} data.items.where 考试地点
 * @apiSuccess {String} data.items.who 任课老师
 * 
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
 *                  "what": "英语4",
 *                  "where": "2-S230;2-S230",
 *                  "who": "2004/李某"
 *              }
 *          ]
 *      }
 *  }
 */
AcademicManagementRouter.post('/exams/:year/:semester', AcademicManagementController.ExamsHandler)

export default AcademicManagementRouter