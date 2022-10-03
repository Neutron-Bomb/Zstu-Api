import QueryString from "qs";
import { gzip } from "zlib";
import Functions from "../util/Functions";
import createSession from "../util/Session";
import Formatter from "./Formatter";

class Common {
    private static session = createSession()

    public static async Electricity(studentId: string) {
        /* Valiedating */
        if (studentId.length != 13 || !Functions.isNumber(studentId)) {
            throw Error('Param studentId error')
        }
        let url = 'https://xqh5.17wanxiao.com/smartWaterAndElectricityService/SWAEServlet'
        let payload = {
            param: `{"cmd":"getstuindexpage","account":"${studentId}"}`,
            customercode: 599,
            method: 'getstuindexpage'
        }
        let res = await this.session({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload),
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        return Formatter.Electricity(res)
    }

    public static async ExerciseMileage(studentId: string) {
        const url = 'http://10.11.246.182:8029/DragonFlyServ/Api/webserver/getRunDataSummary'
        const payload = JSON.stringify({
            studentno: studentId,
            uid: studentId
        })
        const gzipedData = await new Promise((resolve, reject) => {
            gzip(payload, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then((value) => {
            return value
        })

        const res = await this.session({
            url: url,
            method: "POST",
            data: gzipedData
        }).then((value) => {
            return value.data
        })
        return Formatter.ExerciseMileage(res)
    }
}

export default Common