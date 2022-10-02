import { AxiosInstance } from "axios";
import moment from "moment";
import QueryString from "qs";
import { createWorker } from "tesseract.js";
import { CookieJar } from "tough-cookie";
import Functions from "../util/Functions";
import createSession from "../util/Session";
import Formatter from "./Formatter";

class OneCard {
    public permission = 'OneCard'

    private cookieJar?: CookieJar
    private studentId?: string
    private password?: string
    private session: AxiosInstance
    private logined = false

    constructor(studentId?: string, password?: string, cookieJar?: CookieJar) {
        this.studentId = studentId
        this.password = password
        this.cookieJar = cookieJar
        this.session = createSession(this.cookieJar)
    }

    public static fromCookieJar(cookieJar: CookieJar) {
        return new this(undefined, undefined, cookieJar)
    }

    public static fromUserPass(studentId: string, password: string) {
        return new this(studentId, password, undefined)
    }

    private async captcha() {
        const url = 'http://ykt.zstu.edu.cn/SelfSearch/validateimage.ashx'
        let captcha = undefined
        while (!Functions.isNumber(captcha)) {
            const res = await this.session({
                url: url,
                method: 'get',
                responseType: 'arraybuffer',
                validateStatus: () => true
            }).then(value => {
                return value.data
            })
            const worker = createWorker()
            await worker.load()
            await worker.loadLanguage('eng')
            await worker.initialize('eng')
            captcha = (await worker.recognize(res)).data.text
            await worker.terminate()
            return captcha
        }
    }

    /* ViewState & ViewStateGenerate & EventValidation */
    private async getEssentials(url: string) {
        const pageSource = await this.session({
            url: url
        }).then(value => {
            return value.data
        })
        const viewStateReg = /id=\"__VIEWSTATE\" value=\"(.*?)\"/
        const viewStateGenerateReg = /id=\"__VIEWSTATEGENERATOR\" value=\"(.*?)\"/
        const eventValidationReg = /id=\"__EVENTVALIDATION\" value=\"(.*?)\"/
        return {
            viewState: viewStateReg.exec(pageSource)?.at(1),
            viewStateGenerate: viewStateGenerateReg.exec(pageSource)?.at(1),
            eventValidation: eventValidationReg.exec(pageSource)?.at(1)
        }
    }

    public async login() {
        const url = 'http://ykt.zstu.edu.cn/SelfSearch/login.aspx'
        const essentials = await this.getEssentials(url)
        for (let cnt = 0; cnt < 5; ++cnt) {
            const payload = {
                __LASTFOCUS: '',
                __EVENTTARGET: 'btnLogin',
                __EVENTARGUMENT: '',
                __VIEWSTATE: essentials.viewState,
                __VIEWSTATEGENERATOR: essentials.viewStateGenerate,
                __EVENTVALIDATION: essentials.eventValidation,
                txtUserName: this.studentId,
                txtUserNameJiaMi: '',
                txtPassword: this.password,
                txtVaildateCode: await this.captcha(),
                hfIsManager: 0
            }
            const res = await this.session({
                url: url,
                method: 'post',
                data: QueryString.stringify(payload),
                validateStatus: () => true
            }).then(value => {
                return value.data
            })
            if (String(res).search('用户登录') == -1) {
                this.logined = true
                return
            }
        }
        /* If not returned above, it must be somethings went wrong */
        throw Error('Failed atfer 5 logins')
    }

    public isLogined() {
        return this.logined
    }

    public async getBalance() {
        const url = 'http://ykt.zstu.edu.cn/SelfSearch/User/Home.aspx'
        const res = await this.session({
            url: url
        }).then(value => {
            return value.data
        })
        return Formatter.Balace(res)
    }

    public async getConsumption() {
        const url = 'http://ykt.zstu.edu.cn/SelfSearch/User/ConsumeInfo.aspx'
        const essentials = await this.getEssentials(url)
        const payload = {
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            __VIEWSTATE: essentials.viewState,
            __VIEWSTATEGENERATOR: essentials.viewStateGenerate,
            __EVENTVALIDATION: essentials.eventValidation,
            ctl00$ContentPlaceHolder1$rbtnType: '0',
            ctl00$ContentPlaceHolder1$txtStartDate: '',
            ctl00$ContentPlaceHolder1$txtEndDate: '',
            ctl00$ContentPlaceHolder1$btnSearch: '查  询'
        }
        const date = new Date()
        const now = moment(date).format('yy-MM-DD')
        const pas = moment(date.setDate(date.getDate() - 10)).format('yy-MM-DD')
        payload.ctl00$ContentPlaceHolder1$txtStartDate = pas
        payload.ctl00$ContentPlaceHolder1$txtEndDate = now
        const res = await this.session({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload),
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        return Formatter.Consumption(res)
    }

    public async getAttendance() {

    }
}

export default OneCard