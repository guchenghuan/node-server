/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;

// get alldata from db
const getalldatafromdb = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var mysort = { date: -1 };
                var whereStr = { $or: [{ "runcoderesult": "SUCESS" }, { "runcoderesult": "Fail" }] }; // 查询条件
                dbo.collection('autoallpages').find(whereStr).sort(mysort).toArray(function (err, result) {
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

// get alluatdata from db
const getalluatdatafromdb = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var mysort = { date: -1 };
                var whereStr = { $or: [{ "runcoderesult": "SUCESS" }, { "runcoderesult": "Fail" }] }; // 查询条件
                dbo.collection('uatautoallpages').find(whereStr).sort(mysort).toArray(function (err, result) {
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

// get alldata from db
const geteachdatafromdb = (whereobj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var whereStr = { $or: [{ $and: [{ "runcoderesult": "SUCESS" }, whereobj] }, { $and: [{ "runcoderesult": "Fail" }, whereobj] }] }; // 查询条件
                dbo.collection('autoallpages').find(whereStr).toArray(function (err, result) {
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

// get alldata from db
const geteachdatadetailfromdb = (whereobj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var whereStr = { $or: [{ $and: [{ "runcoderesult": "SUCESS" }, whereobj] }, { $and: [{ "runcoderesult": "Fail" }, whereobj] }] }; // 查询条件
                dbo.collection('autoallpages').find(whereStr).toArray(function (err, result) {
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

// 全部数据搜索
const allinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const resultdata = await getalldatafromdb().then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，该url下暂无数据~"
                }
            } else {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    data: resultdata
                }
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
            };
        }
        if (req.dbname && finalobj) {
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
const getuatpageinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const resultdata = await getalluatdatafromdb().then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，该url下暂无数据~"
                }
            } else {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    data: resultdata
                }
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
            };
        }
        if (req.dbname && finalobj) {
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


// 分区搜索
const eachpageinfo = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const fenquresultdata = await geteachdatafromdb({ pagecate: "分区页" }).then(
            (data) => {
                return data
            }
        )
        const bofangresultdata = await geteachdatafromdb({ pagecate: "播放页" }).then(
            (data) => {
                return data
            }
        )
        const spaceresultdata = await geteachdatafromdb({ pagecate: "个人中心" }).then(
            (data) => {
                return data
            }
        )
        const firstresultdata = await geteachdatafromdb({ pagecate: "大首页" }).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (fenquresultdata && bofangresultdata && spaceresultdata && firstresultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                fenquresultdata: fenquresultdata,
                bofangresultdata: bofangresultdata,
                spaceresultdata: spaceresultdata,
                firstresultdata: firstresultdata,
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
            };
        }
        if (req.dbname && finalobj) {
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
const drawpiesdats = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const resultdata = await geteachdatadetailfromdb({ pagecate: req.wherename }).then(
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
                msg: "查询失败，请重试~",
            };
        }
        if (req.wherename && finalobj) {
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
    allinfo, // 全部数据搜索
    getuatpageinfo, // 全部数据搜索
    eachpageinfo, // 分区搜索
    drawpiesdats, // 画图
};
