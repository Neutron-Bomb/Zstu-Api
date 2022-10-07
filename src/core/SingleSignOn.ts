import { AxiosInstance } from "axios";
import QueryString from "qs";
import { CookieJar } from "tough-cookie";
import CryptoJS from 'crypto-js'
import createSession from "../util/Session";

class SingleSignOn {
    private studentId?: string
    private password?: string
    private session: AxiosInstance

    private constructor(studentId?: string, password?: string, cookieJarJson?: string) {
        this.studentId = studentId
        this.password = password
        this.session = createSession(cookieJarJson ? CookieJar.fromJSON(cookieJarJson) : undefined)
    }

    public static fromUserPass(studentId: string, password: string) {
        return new this(studentId, password)
    }

    public static fromCookieJar(cookieJarJson: string) {
        return new this(undefined, undefined, cookieJarJson)
    }
    
    public getCookieJar() {
        return this.session.defaults.jar
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
        const url = 'https://sso.zstu.edu.cn'
        const res = await this.session({
            url: url,
            validateStatus: () => true
        }).then(value => value.data)
        if (res.match('个人中心')) {
            return true
        }
        return false
    }

    public async login() {
        if (await this.testIfLogined()) {
            return
        }
        const url = 'https://sso.zstu.edu.cn/login'
        let res = await this.session({
            url: url,
            validateStatus: () => true
        }).then(value => {
            return value.data
        })
        const crypto = this.getCrypto(res)
        const execution = this.getExecution(res)
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
        await this.session({
            url: url,
            data: QueryString.stringify(payload),
            method: 'post',
            validateStatus: () => true
        })
        if (!await this.testIfLogined()) {
            throw Error('SSO登录失败')
        }
    }
    
    public getSession() {
        return this.session
    }
}

export default SingleSignOn