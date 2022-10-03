class Error {
    private jsonBody: any = {}

    constructor(code: number, msg: string, extra?: string) {
        this.jsonBody.code = code
        this.jsonBody.msg = msg
        if (extra) {
            this.jsonBody.extra = extra
        }
    }

    public toJson() {
        return this.jsonBody
    }

    public static errorMidware(err: any, req: any, res: any, next: any) {
        res.json({
            code: 0,
            msg: err.message
        })
        next()
    }
}

export default Error