/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;
const api = require('webcoach');
const url = "mongodb://127.0.0.1:27017/"
const formatDate = require("./../utils/formatDate");

// get allinfodata from db
const getallactivitydatafromdb = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webactivity");
                var mysort = { date: -1 };
                var whereStr = {}; // 查询条件
                dbo.collection('webactivitydb').find(whereStr).sort(mysort).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result) // 返回的对象是个 Array
                            console.log('End done')
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

// get allinfodata from db
const getallactivityavgdatafromdb = (type) => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webactivity");
                var mysort = { date: -1 };
                var whereStr = { "type": type }; // 查询条件
                dbo.collection('webactivitydb').find(whereStr).sort(mysort).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result) // 返回的对象是个 Array
                            console.log('End done')
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

// get alleachdata from db
const getactivitydatafromdb = (activityurl) => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webactivity");
                var mysort = { date: -1 };
                var whereStr = { "url": activityurl }; // 查询条件
                dbo.collection('webactivityeachdb').find(whereStr).sort(mysort).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result) // 返回的对象是个 Array
                            console.log('End done')
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

// del data
const getactivitydatamovedb = (activityurl) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webactivity");
                var whereStr = { "url": activityurl };
                dbo.collection("webactivitydb").deleteOne(whereStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("webactivitydb文档插入成功");
                        res(result)
                    }
                });
            });
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webactivity");
                var whereStr = { "url": activityurl };
                dbo.collection("webactivityeachdb").deleteOne(whereStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("webactivityeachdb文档插入成功");
                        res(result)
                    }
                });
            });
        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// get coach Scores
const asyncusewebcoach = async (activityurl, types) => {
    try {
        if (types && types == 1) {
            console.log('start coach')
            const result = api.run(activityurl);
            return result;
        } else {
            console.log('start coach')
            const result = api.run(activityurl);
            return result;
        }

    } catch (e) {
        console.log(e + '//////////')
        return e
    }
};

// 执行页面性能测试
const runactivity = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const prewebcoach = await asyncusewebcoach(req.activityurl, req.types)
        // insert data 
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("webactivity");
            var webactivitydbobj = {
                "url": req.activityurl,
                "type": req.option,
                "score": prewebcoach.advice.score,
                "timings": prewebcoach.advice.timings,
                "documentTitle": prewebcoach.advice.info.documentTitle,
                "browser": prewebcoach.advice.info.browser,
                "pageContentSize": prewebcoach.advice.info.pageContentSize,
                "networkConnectionType": prewebcoach.advice.info.networkConnectionType,
                "pageContentTypes": prewebcoach.advice.info.pageContentTypes,
                "pageTransferSize": prewebcoach.advice.info.pageTransferSize,
                "date": formatDate(new Date())
            };
            var webactivityeachdbobj = {
                "url": req.activityurl,
                "accessibility": prewebcoach.advice.accessibility,
                "bestpractice": prewebcoach.advice.bestpractice,
                "performance": prewebcoach.advice.performance,
                "privacy": prewebcoach.advice.privacy,
                "date": formatDate(new Date())
            };
            dbo.collection("webactivitydb").insertOne(webactivitydbobj, function (err, res) {
                if (err) throw err;
                console.log("webactivitydb--插入成功");
            });
            dbo.collection("webactivityeachdb").insertOne(webactivityeachdbobj, function (err, res) {
                if (err) throw err;
                console.log("webactivityeachdb--插入成功");
                db.close();
            });
        });
        if (prewebcoach) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: '执行成功'
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "执行失败，请重试~",
            };
        }
        if (req.activityurl && finalobj) {
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

// 全部数据搜索
const getallactivityinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body // getallactivityavgdatafromdb
        const resultdata = await getallactivitydatafromdb().then(
            (data) => {
                return data
            }
        )
        const mainavgdata = await getallactivityavgdatafromdb('1').then(
            (data) => {
                return data
            }
        )
        const avgdata = await getallactivityavgdatafromdb('2').then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data' || mainavgdata === 'no data' || avgdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，还不存在相关数据~"
                }
            } else {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    data: resultdata,
                    mainavgdata: mainavgdata,
                    avgdata: avgdata
                }
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
            };
        }
        if (req.name && finalobj) {
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


// 单条数据搜索
const geteachinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const eachwebactivitydata = await getactivitydatafromdb(req.activityurl).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (eachwebactivitydata) {
            const neweachwebactivitydata = eachwebactivitydata[0]
            var finalobj = {
                code: "200",
                msg: "success",
                url: neweachwebactivitydata.url,
                accessibility: neweachwebactivitydata.accessibility,
                bestpractice: neweachwebactivitydata.bestpractice,
                performance: neweachwebactivitydata.performance,
                privacy: neweachwebactivitydata.privacy,
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
            };
        }
        if (req.activityurl && finalobj) {
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


// 分区数据检索图
const deleachinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const resultdata = await getactivitydatamovedb(req.activityurl).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: resultdata,
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "删除失败，请重试~",
            };
        }
        if (req.activityurl && finalobj) {
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
    runactivity, // 开始执行测试
    getallactivityinfo, // 获取全部数据
    geteachinfo, // 检索每条数据详情
    deleachinfo, // 删除单条数据
};
