# Zstu-Api

## 简要说明

Zstu-Api是编写Zstu-Bot的基础，也相当于是Api Bridger，Zstu-Api会转发给定请求并将格式转换为更加友好的格式。

## 目前支持的功能（Zstu-Api-Core）

### 统一认证登录系统

- [x] 登录SSO

### 教务系统

- [x] 成绩查询
- [x] 课表查询
- [x] 考试信息查询
- [x] 转专业情况查询

### 体育管理系统

- [x] 学期公里数查询

### 费用

- [x] 校园卡余额
- [x] 剩余电量
- [x] 今日用电
- [x] 详细消费记录

### 考勤

- [x] 出入宿舍楼情况

## 开发

### 目录介绍

```
├─config     配置文件存放
├─controller 处理用户请求的Handler类
├─core       实际与接口交互的底层类
├─route      用户请求路径匹配
├─schema     数据库模型
└─util       工具类
```

### Router

例如`router/CommonRouter.ts`

```typescript
CommonRouter.get('/electricity/:studentId', CommonController.ElectricityHandler)
```

匹配请求为`electricity/：studentId`的请求，`electricity/2022111111111`即为合法请求，请求处理交给`CommonController.ElectricityHandler`处理

### Controller

```typescript
async function ElectricityHandler(req: Request, res: Response) {
    const studentId = req.params.studentId
    res.json(await Common.Electricity(studentId))
}
```

控制器作用只限于获取相关参数，并构建底层类进行处理，例如上述Controller获取了`studentId`，并传入`Common.Electricity`进行处理，最终结果以`json`格式返回

### Core

```typescript
public static async Electricity(studentId: string) {
        if (studentId.length != 13 || !Functions.isNumber(studentId)) {
            throw Error('Param studentId error')
        }
        let url = 'some_url'
        let payload = {
            ...
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
```

`Core`请求实际接口，获取`原始`数据，并传入`Formatter`进行进一步格式化处理

### Formatter

```typescript
public static Electricity(json: any) {
        let body = JSON.parse(json['body'])
        if (body['message'] == '...') {
            throw Error('some error')
        }
        return {
            code: 0,
            msg: '获取成功',
            data: {
                ...
            }
        }
    }
```

若是原始数据出现问题，或者请求失败，应直接抛出异常，异常会被`Express中间件`捕获并统一返回错误信息给用户