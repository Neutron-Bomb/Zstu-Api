class Formatter {
    public static Electricity(json: any) {
        let body = JSON.parse(json['body'])
        if (body['message'] == '未绑定房间') {
            throw Error('该学号未绑定房间')
        }
        return {
            code: 0,
            msg: '获取成功',
            data: {
                monthUseList: body['modlist'][0]['monthuselist'],
                weekUseList: body['modlist'][0]['weekuselist'],
                dayUse: body['modlist'][0]['todayuse'],
                remain: body['modlist'][0]['odd'],
                room: body['modlist'][0]['roomfullname'],
                updateDate: body['modlist'][0]['collecdate']
            }
        }
    }

    public static Balace(str: any) {
        const balanceReg = /主钱包余额：(.*?)元/
        const balance = balanceReg.exec(str)
        if (balance) {
            return {
                code: 0,
                msg: '获取成功',
                data: {
                    balance: balance.at(1)
                }
            }
        }
        throw Error('无法获取到余额')
    }

    public static Consumption(res: any) {
        let recordReg = /<span id=\"ContentPlaceHolder1_gridView_Label.*?\">(.*?)<\/span>.*?<\/td><td>(.*?)<\/td><td align=\"right\">(.*?)<\/td><td align="right">(.*?)<\/td><td>.*?<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/gs
        let records = String(res).match(recordReg)
        let ret: any = { code: 0, msg: '获取成功', data: [] }
        recordReg = /<span id=\"ContentPlaceHolder1_gridView_Label.*?\">(.*?)<\/span>.*?<\/td><td>(.*?)<\/td><td align=\"right\">(.*?)<\/td><td align="right">(.*?)<\/td><td>.*?<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/s
        records?.forEach((record => {
            let execed = recordReg.exec(record)
            ret.data.push({
                when: execed?.at(1),
                why: execed?.at(2),
                what: execed?.at(5),
                where: execed?.at(6),
                used: execed?.at(3),
                remain: execed?.at(4)
            })
        }))
        if (ret.data.length != 0) {
            return ret
        }
        throw Error('获取失败')
    }

    public static Attendance(res: any) {
        let ret: any = { code:0, msg: '获取成功', data: [] }
        let recordReg = /<td>[^&nbsp;]*?<\/td><td>.*?<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/g
        const records = String(res).match(recordReg)
        recordReg = /<td>.*?<\/td><td>.*?<\/td><td>(.*?)<\/td><td>(.*?)<\/td>/
        records?.forEach(record => {
        let execed = recordReg.exec(record)
            ret.data.push({
                when: execed?.at(1),
                where: execed?.at(2)
            })
        })
        return ret
    }
}

export default Formatter