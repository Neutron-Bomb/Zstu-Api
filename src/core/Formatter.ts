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
}

export default Formatter