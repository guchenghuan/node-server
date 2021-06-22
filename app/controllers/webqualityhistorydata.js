/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;
// get data from mango which need
const getdatafromdb = (names) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var wherearr = { name: names }
                var mysort = { Date: -1 };
                dbo.collection('historydata').find(wherearr).sort(mysort).limit(10).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            // console.log(result[0].url);
                            // console.log(result.length);
                            res(result) // 返回的对象是个 Array
                            console.log('End search')
                        } else {
                            res('no data')
                        }
                    }
                });
            });

        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}


const gethistorydata = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        const resultdataDomain = await getdatafromdb('Domain').then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultdatacontent = await getdatafromdb('content').then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultdataLargesAsserts = await getdatafromdb('LargesAsserts').then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultdatasummary = await getdatafromdb('summary').then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultdatadomaintransfer = await getdatafromdb('domaintransfer').then( //dbname,limitnum
            (data) => {
                return data
            }
        )

        if (resultdataDomain && resultdatacontent && resultdataLargesAsserts && resultdatasummary && resultdatadomaintransfer) {
            var finalobj = {
                code: "200",
                msg: "success",
                Domain: resultdataDomain,
                content: resultdatacontent,
                LargesAsserts: resultdataLargesAsserts,
                summary: resultdatasummary,
                domaintransfer: resultdatadomaintransfer,
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "拉取数据失败，请尝试重新拉取~",
            };
        }
        if (req.option && finalobj) {
            ctx.status = 200;
            ctx.body = finalobj;
        } else {
            ctx.body = {
                code: 400,
                msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
            };
        }
    } catch (e) {
        console.log(e + '//////////')
        ctx.body = {
            code: 404,
            msg: "服务解析失败，请联系管理员检查服务且稍后再试",
        };
    }
};

module.exports = {
    gethistorydata, // 一键拉取
};
