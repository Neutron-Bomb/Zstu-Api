import { AxiosInstance } from "axios";
import QueryString from "qs";
import { CookieJar } from "tough-cookie";
import createSession from "../util/Session";
import CryptoJS from 'crypto-js'
import Formatter from "./Formatter";

export const enum SEMESTER {
    ALL = '',
    FIRST = 3,
    SECOND = 12,
    THIRD = 16
}

class AcademicManagement {
    private studentId?: string
    private password?: string
    private session: AxiosInstance


    private constructor(studentId?: string, password?: string, cookieJar?: CookieJar) {
        this.studentId = studentId
        this.password = password
        this.session = createSession(cookieJar)
    }

    public static fromUserPass(studentId: string, password: string) {
        return new this(studentId, password)
    }

    public static fromCookieJar(cookieJar: CookieJar) {
        return new this(undefined, undefined, cookieJar)
    }

    private encryptoPassword(password: string, crypto: string) {
        return CryptoJS.DES.encrypt(password, CryptoJS.enc.Base64.parse(crypto), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    }

    private getExecution(data: string) {
        const executionReg = /<p id="login-page-flowkey">(.*?)<\/p>/
        const result = executionReg.exec(data)
        if (result) {
            return result[1]
        }
    }

    private getCrypto(data: string) {
        const cryptoReg = /<p id="login-croypto">(.*?)<\/p>/
        const result = cryptoReg.exec(data)
        if (result) {
            return result[1]
        }
    }

    private async testIfLogined() {
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/sso/jasiglogin'
        const res = await this.session({
            url: url
        }).then(value => {
            return value.data
        })
        if (String(res).match('教学管理信息服务平台')) {
            return true
        }
        return false
    }

    public async login() {
        if (await this.testIfLogined()) {
            return
        }

        let url = 'https://jwglxt.webvpn.zstu.edu.cn/sso/jasiglogin'
        let res = await this.session({
            url: url
        }).then(value => {
            return value.data
        })
        let crypto = this.getCrypto(res)
        let execution = this.getExecution(res)
        url = 'https://sso.zstu.edu.cn/login'
        const payload = {
            'username': this.studentId,
            'type': 'UsernamePassword',
            '_eventId': 'submit',
            'geolocation': '',
            'execution': execution,
            'captcha_code': '',
            'croypto': crypto,
            'password': this.encryptoPassword(this.password!, crypto!),
        }
        res = await this.session({
            url: url,
            data: QueryString.stringify(payload),
            method: 'post',
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        crypto = this.getCrypto(res)
        execution = this.getExecution(res)
        url = 'https://sso-443.webvpn.zstu.edu.cn/login'
        res = await this.session({
            url: url,
            data: QueryString.stringify(payload),
            method: 'post',
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        res = await this.session({
            url: 'https://jwglxt.webvpn.zstu.edu.cn/sso/jasiglogin'
        }).then(value => {
            return value.data
        })
        if (!await this.testIfLogined()) {
            throw Error('教务管理系统登陆失败')
        }
    }

    public getCookieJar() {
        return this.session.defaults.jar
    }

    public async getGrades(year: number, semester: SEMESTER = SEMESTER.ALL) {
        if (!this.testIfLogined()) {
            throw Error('尚未登录教务系统')
        }
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/jwglxt/cjcx/cjcx_cxXsgrcj.html?doType=query'
        const payload: any = {
            'queryModel.showCount': 5000,
            xnm: year,
            xqm: semester
        }
        const res = await this.session({
            url: url,
            data: QueryString.stringify(payload),
            method: 'post'
        }).then(value => {
            return value.data
        })
        return Formatter.Grades(res)
    }

    public async getSchedule(year: number, semester: SEMESTER) {
        if (!this.testIfLogined) {
            throw Error('未登录登录教务系统')
        }
        if(semester == SEMESTER.ALL) {
            throw Error('semester不可为SEMESTER.ALL')
        }
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/jwglxt/kbcx/xskbcx_cxXsgrkb.html?gnmkdm=N2151'
        const payload = {
            xnm: year,
            xqm: semester
        }
        const res = await this.session({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload),
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        return Formatter.Schedule(res)
    }

    public async getTurnMajor(year: number, semester: SEMESTER) {
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/jwglxt/xszzy/xszzysqgl_cxXszzysqIndex.html?doType=query&pkey=&gnmkdm=N106204'
        const payload =  {
            zrxnm: year,
            zrxqm: semester
        }
        const res = await this.session({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload),
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        return Formatter.TurnMajor(res)
    }

    public async getExams(year: number, semester: SEMESTER) {
        const url = 'https://jwglxt.webvpn.zstu.edu.cn/jwglxt/kwgl/kscx_cxXsksxxIndex.html?doType=query&gnmkdm=N358105'
        const payload = {
            xnm: year,
            xqm: semester,
            'queryModel.showCount': 5000
        }
        const res = await this.session({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload),
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        return Formatter.Exams(res)
    }
}   

export default AcademicManagement