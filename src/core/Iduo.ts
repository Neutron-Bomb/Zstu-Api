import { AxiosInstance } from 'axios'
import SingleSignOn from './SingleSignOn'
import CryptoJS from 'crypto-js'
import QueryString from 'qs'
import Formatter from './Formatter'

export const enum LOGIN_TYPE {
    EPIDEMIC_PREVENTION
}

class Iduo {
    private studentId?: string
    private sso: SingleSignOn
    private session: AxiosInstance | undefined
    private accessToken: string | undefined

    private constructor(studentId?: string, password?: string, sso?: SingleSignOn) {
        this.studentId = studentId
        this.sso = sso || SingleSignOn.fromUserPass(studentId!, password!)
    }

    public static fromUserPass(studentId: string, password: string) {
        return new this(studentId, password)
    }

    public static fromSingleSignOn(sso: SingleSignOn) {
        return new this(undefined, undefined, sso)
    }

    private randomCode() {
        return ('10000000-1000-4000-8000-100000000000').replace(/[018]/g, (function (e) {
            return (parseInt(e) ^ Math.floor(Math.random() * 16) >> parseInt(e) / 4).toString(16)
        }
        )).replace(/-/g, '')
    }

    private sha256(code: string) {
        return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(code)).toString()
    }

    private hexToBase64Url(code: string) {
        return CryptoJS.enc.Base64url.stringify(CryptoJS.enc.Hex.parse(code))
    }

    private base64Url(code: string) {
        return CryptoJS.enc.Base64url.stringify(CryptoJS.enc.Utf8.parse(code))
    }

    private async loginEpidemicPrevention() {
        const state = this.randomCode()
        const code_verifier = this.randomCode() + this.randomCode() + this.randomCode()
        const code_challenge = this.hexToBase64Url(this.sha256(code_verifier))
        const codeReg = /code=([0-9a-z]*)/gms
        let code: string | undefined
        let url = `http://fangyi.zstu.edu.cn:4500/connect/authorize?client_id=INTERNAL00000000CODE&redirect_uri=http://fangyi.zstu.edu.cn:6006/oidc-callback&response_type=code&scope=email profile roles openid iduo.api&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256&acr_values=idp:Platform&response_mode=query`
        await this.session!({
            url: url,
            beforeRedirect: (options, response) => {
                code = codeReg.exec(response.headers.location)?.at(1)
            }
        }).then(value => value.data)
        url = 'http://fangyi.zstu.edu.cn:4500/connect/token'
        const payload = {
            client_id: 'INTERNAL00000000CODE',
            client_secret: 'INTERNAL-b5d5-7eba-1d182998574a',
            code: code,
            redirect_uri: 'http://fangyi.zstu.edu.cn:6006/oidc-callback',
            code_verifier: code_verifier,
            grant_type: 'authorization_code',
        }
        let res = await this.session!({
            url: url,
            method: 'post',
            data: QueryString.stringify(payload)
        }).then(value => value.data)
        if (!res['access_token']) {
            throw Error('Iduo????????????')
        }
        this.accessToken = res['access_token']
    }

    public async login(loginType: LOGIN_TYPE = LOGIN_TYPE.EPIDEMIC_PREVENTION) {
        await this.sso.login()
        this.session = this.sso.getSession()
        if (loginType == LOGIN_TYPE.EPIDEMIC_PREVENTION) {
            await this.loginEpidemicPrevention()
        }
    }

    public getToken() {
        if (this.accessToken) {
            return this.accessToken
        }
        throw Error('Iduo?????????')
    }

    public async getClockInStatus(studentId: string) {
        const url = `http://fangyi.zstu.edu.cn:8008/form/api/DataSource/GetDataSourceByNo?sqlNo=${this.base64Url(`JTDK_XS$${studentId}`)}`
        const headers = {
            'Authorization': `Bearer ${this.getToken()}`
        }
        const res = await this.session!({
            url: url,
            headers: headers
        }).then(value => value.data)
        return Formatter.ClockInStatus(res)
    }

    public async clockIn(studentId: string) {
        const status = await this.getClockInStatus(studentId)
        const url = 'http://fangyi.zstu.edu.cn:8008/form/api/FormHandler/SubmitBusinessForm'
        const headers = {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
        }
        const payload = {
            biz: {
                GUID: "180658382B73F7511C0C649FB",
                CURRENTLOCATION: status.data.CURRENTLOCATION,
                CURRENTSITUATION: status.data.CURRENTSITUATION,
                ARRIVESTATUS: status.data.ARRIVESTATUS,
                TEMPERATURESITUATION: status.data.TEMPERATURESITUATION,
                TEMPERATURE: "",
                HEALTHCODESTATUS: status.data.HEALTHCODESTATUS,
                VACCINATIONSTATUS: status.data.VACCINATIONSTATUS,
                ZHJZSJ: status.data.ZHJZSJ,
                WJZYY: "",
                JTYY: "",
                XGYMZL: status.data.XGYMZL,
                CONFIRMEDSTATE: status.data.CONFIRMEDSTATE,
                CONFIRMEDDATETIME: null,
                CONFIRMEDQUARANTINEDATETIME: null,
                CONFIRMEDRELIEVEDATETIME: null,
                QUARANTINESTATUS: status.data.QUARANTINESTATUS,
                NOTIFICATIONMODE: "",
                QUARANTINEREASON: "",
                QUARANTINETYPE: "",
                QUARANTINELOCATION: "",
                QUARANTINESTARTTIME: "",
                ESTIMATEQUARANTINEENDTIME: "",
                PROCESSES: "",
                LIVINGHISTORYSTATUS: status.data.LIVINGHISTORYSTATUS,
                LIVINGHISTORYSTATUS1: "",
                LIVINGHISTORYLOCATION: "",
                TZRY: status.data.TZRY,
                TZRYSM: null,
                SFYHSYXBG: status.data.SFYHSYXBG,
                KYJCJG: status.data.KYJCJG,
                DQXXZT: status.data.DQXXZT,
                DQSZDWMC: null,
                TJ_QRNR: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                DKLX: "????????????",
                CLR: status.data.NAME,
                CLSJ: null,
                ZHXGR: null,
                XGNR: status.data.XGNR,
                ZHXGSJ: null
            },
            task: {},
            sign: {},
            user: {
                userId: `ZSTU/${status.data.IDCODE}`,
                userName: status.data.NAME,
                domain: "ZSTU"
            },
            conf: {
                bizId: "180658382B73F7511C0C649FB",
                platform: "Weixin",
                IsDraft: false,
                IsDeleteDraft: false
            },
            form: {
                formId: "1817056F47E744D3B8488B",
                formName: "????????????????????????"
            },
            approvalBtn: {
                code: "Submit",
                visible: true,
                title: "??????",
                size: "medium",
                type: "primary"
            }
        }
        const res = await this.session!({
            url: url,
            method: 'post',
            data: JSON.stringify(payload),
            headers: headers,
            validateStatus: () => true,
        }).then(value => value.data)
        return Formatter.ClockIn(res)
    }
}

export default Iduo