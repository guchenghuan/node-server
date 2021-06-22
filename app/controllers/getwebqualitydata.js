/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;
// get data from mango which need
const getdatafromdb = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var mysort = { Date: -1 };
                dbo.collection('platformdata').find().sort(mysort).limit(12).toArray(function (err, result) {
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

const getdatafromdbeach = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var whereStr = obj;
                var mysort = { Date: -1 };
                dbo.collection('platformdata').find(whereStr).sort(mysort).limit(20).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result)
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

const getdatafromdbplayer = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var mysort = { Date: -1 };
                dbo.collection('playerdata').find().sort(mysort).limit(20).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result)
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

const getdatafromdbeachtime = (obj, timestartobj, timeendobj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var whereStr = {
                    $and: [obj, timestartobj, timeendobj]
                };
                var mysort = { Date: -1 };
                dbo.collection('platformdata').find(whereStr).sort(mysort).limit(20).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result)
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

const getdatafromdbplayertime = (timestartobj, timeendobj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("performdb");
                var whereStr = {
                    $and: [timestartobj, timeendobj]
                };
                var mysort = { Date: -1 };
                dbo.collection('playerdata').find(whereStr).sort(mysort).limit(20).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result)
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

const getquailtydata = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        if (req.datefirst && req.datesecond) {
            const resultdata = await getdatafromdb().then(
                (data) => {
                    return data
                }
            )
            const resultbilibilidata = await getdatafromdbeachtime({ "platformname": "bilibili.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resultacfundata = await getdatafromdbeachtime({ "platformname": "acfun.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resultaiqiyidata = await getdatafromdbeachtime({ "platformname": "aqiyi.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resulttencentdata = await getdatafromdbeachtime({ "platformname": "tencent.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resultxiguadata = await getdatafromdbeachtime({ "platformname": "xigua.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resultyoukudata = await getdatafromdbeachtime({ "platformname": "youku.js" }, { "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )
            const resultplayer = await getdatafromdbplayertime({ "Date": { "$gt": req.datefirst } }, { "Date": { "$lt": req.datesecond } }).then(
                (data) => {
                    return data
                }
            )

            if (resultdata && resultbilibilidata && resultacfundata && resultaiqiyidata && resulttencentdata && resultxiguadata && resultyoukudata && resultplayer) {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    bilibilidata: resultbilibilidata,
                    acfundata: resultacfundata,
                    aiqiyidata: resultaiqiyidata,
                    tencentdata: resulttencentdata,
                    xiguadata: resultxiguadata,
                    youkudata: resultyoukudata,
                    data: resultdata,
                    playerdatas: resultplayer
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
        } else {
            const resultdata = await getdatafromdb().then( //dbname,limitnum
                (data) => {
                    return data
                }
            )
            const resultbilibilidata = await getdatafromdbeach({ "platformname": "bilibili.js" }).then(
                (data) => {
                    return data
                }
            )
            const resultacfundata = await getdatafromdbeach({ "platformname": "acfun.js" }).then(
                (data) => {
                    return data
                }
            )
            const resultaiqiyidata = await getdatafromdbeach({ "platformname": "aqiyi.js" }).then(
                (data) => {
                    return data
                }
            )
            const resulttencentdata = await getdatafromdbeach({ "platformname": "tencent.js" }).then(
                (data) => {
                    return data
                }
            )
            const resultxiguadata = await getdatafromdbeach({ "platformname": "xigua.js" }).then(
                (data) => {
                    return data
                }
            )
            const resultyoukudata = await getdatafromdbeach({ "platformname": "youku.js" }).then(
                (data) => {
                    return data
                }
            )
            const resultplayer = await getdatafromdbplayer().then(
                (data) => {
                    return data
                }
            )

            if (resultdata && resultbilibilidata && resultacfundata && resultaiqiyidata && resulttencentdata && resultxiguadata && resultyoukudata && resultplayer) {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    bilibilidata: resultbilibilidata,
                    acfundata: resultacfundata,
                    aiqiyidata: resultaiqiyidata,
                    tencentdata: resulttencentdata,
                    xiguadata: resultxiguadata,
                    youkudata: resultyoukudata,
                    data: resultdata,
                    playerdatas: resultplayer
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
    getquailtydata, // 一键拉取
};
