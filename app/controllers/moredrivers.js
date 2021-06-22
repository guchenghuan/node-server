/*
 * IMT project
 */

const config = require("./../../config");
const passport = require("./../utils/passport");
const User_col = require("./../models/user");
const uuidv1 = require("uuid/v1");
const fss = require('fs-extra');
var exec = require("child_process").exec;
var nodeCmd = require("node-cmd");
const path = require("path");
const fs = require("fs");
const { promise } = require("selenium-webdriver");
const { resolve } = require("path");
var MongoClient = require('mongodb').MongoClient;
const formatDate = require("./../utils/formatDate");
const autoruncase = require("./../utils/autoruncase");
const firefoxcase = require("./../utils/firefoxcase");
const edgecase = require("./../utils/edgecase");
const iecase = require("./../utils/iecase");
const Safaricase = require("./../utils/Safaricase");


var os = require('os');

// cmd 命令执行
const runcases = (args, webdriver) => {
    return new Promise((res, rej) => {
        try {
            if (parseInt(args) && webdriver === 'chromedriver') {  // 
                var newitem = 'item' + parseInt(args)
                var cmdStr = autoruncase[newitem]
            } else if (parseInt(args) && webdriver === 'firefoxdriver') {
                var newitem = 'item' + parseInt(args)
                var cmdStr = firefoxcase[newitem]
            } else if (parseInt(args) && webdriver === 'IEdriver') {
                var newitem = 'item' + parseInt(args)
                var cmdStr = iecase[newitem]
            } else if (parseInt(args) && webdriver === 'Edgedriver') {
                var newitem = 'item' + parseInt(args)
                var cmdStr = edgecase[newitem]
            } else if (parseInt(args) && webdriver === 'Safaridriver') {
                var newitem = 'item' + parseInt(args)
                var cmdStr = Safaricase[newitem]
            }
            console.log('start run')
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    console.log('not ok:' + stderr);
                    res(stderr)
                } else {
                    console.log('success done: ');
                    try {
                        console.log('start update')
                        if (stdout && stdout.indexOf("结果为") != -1) {
                            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                if (err) throw err;
                                var dbo = db.db("videowebtest");
                                var whereStr = { "id": parseInt(args) };  // 查询条件
                                var updateStr = { $set: { 'desc': '成功' } };
                                dbo.collection('videomaincase').updateOne(whereStr, updateStr, function (err, result) {
                                    if (err) {
                                        return err;
                                    } else {
                                        console.log("desc更新成功");
                                    }
                                });
                                dbo.collection('videomaincase').updateOne(whereStr, { $set: { 'state': 'success' } }, function (err, result) {
                                    if (err) {
                                        return err;
                                    } else {
                                        console.log("state更新成功");
                                    }
                                });
                            });
                        } else {
                            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                if (err) throw err;
                                var dbo = db.db("videowebtest");
                                var whereStr = { "id": parseInt(args) };  // 查询条件
                                var updateStr = { $set: { 'desc': '失败' } };
                                dbo.collection('videomaincase').updateOne(whereStr, updateStr, function (err, result) {
                                    if (err) {
                                        return err;
                                    } else {
                                        console.log("desc更新成功");
                                    }
                                });
                                dbo.collection('videomaincase').updateOne(whereStr, { $set: { 'state': 'error' } }, function (err, result) {
                                    if (err) {
                                        return err;
                                    } else {
                                        console.log("state更新成功");
                                    }
                                });
                            });
                        }
                    } catch (e) {
                        console.log('e: ', e)
                    }
                    // return data
                    res(stdout)
                }
            });
        } catch (e) {
            res(e)
        }
    })
}

// 页面初始化获取全量数据
const getdatafromdbinit = (dbname) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = { "isdel": 0 }
                dbo.collection(dbname).find(whereStr).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            db.close();
                            res(result) // 返回的对象是个 Array
                            console.log('End get')
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


// data insert log/run into db
function insertotherdatadb(dbname, obj) {
    return new Promise((res, rej) => {
        try {
            console.log('start insert other db')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err
                var dbo = db.db("videowebtest")
                var myobj = obj
                dbo.collection(dbname).insertOne(myobj, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("日志数据新增成功~");
                        res(result)
                    }
                })
            })
        } catch (e) {
            console.log('e: ', e)
            res(e)
        }
    })
}

// data search log into db
function searchlogdata(dbname) {
    return new Promise((res, rej) => {
        try {
            console.log('start search log info', dbname)
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = {};
                var mysort = { date: -1 };
                dbo.collection('broserlogcase').find(whereStr).sort(mysort).limit(50).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        db.close();
                        res(result) // 返回的对象是个 Array
                        console.log('End get: ')
                    }
                });
            });
        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// 一键拉取 
const getallcases = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        const result = await getdatafromdbinit(req.dbname).then(
            (data) => {
                return data
            }
        )
        if (result) {
            if (result === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉还没有数据哦~"
                }
            } else {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    data: result
                }
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "拉取数据失败，请尝试重新拉取~",
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

// 执行case  done
const drivercaserun = async (ctx, next) => {
    try {
        const req = ctx.request.body
        // console.log('remoteIp--', remoteIp)
        // console.log('req: ', req);
        if (req.webDriver) {
            const resultdata = await runcases(req.args, req.webDriver).then(
                (data) => {
                    return data
                }
            )
            const remoteIp = ctx.request.ip.slice(7)
            const d = new Date()
            const obj = {
                "id": parseInt(req.args),
                "date": formatDate(d),
                "data": "操作人ip: " + remoteIp + "操作浏览器: " + req.webDriver + '  详细操作： ' + resultdata,
                "action": "caseId: " + parseInt(req.args)
            }
            var togglename = 'broserlogcase'
            const otherdata = await insertotherdatadb(togglename, obj).then(
                (data) => {
                    return data
                }
            )
            // const resdata = JSON.stringify(resultdata)
            // const resultdbdata = JSON.parse(resdata)
            // console.log(resultdata);
            if (otherdata) {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    id: parseInt(req.args),
                    data: resultdata
                }
            } else {
                var finalobj = {
                    code: 404,
                    msg: "自动化执行失败，请重新尝试~",
                };
            }
            if (req.args && finalobj) {
                ctx.status = 200;
                ctx.body = finalobj;
            } else {
                ctx.body = {
                    code: 400,
                    msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
                };
            }
        } else {
            ctx.body = {
                code: 400,
                msg: "对不起，请选择需要测试的浏览器！",
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

// data update into db miancasedb
function updatedatadb(dbname) { //update 处理成传一个对象进来 ，根据updatenum 来决定对哪个进行update
    return new Promise((res, rej) => {
        try {
            console.log('start update')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = {};  // 查询条件
                var updateStr = { $set: { 'desc': '等待' } };
                dbo.collection(dbname).updateMany(whereStr, updateStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("desc更新成功");
                        res(result)
                    }
                });
                dbo.collection(dbname).updateMany(whereStr, { $set: { 'state': 'wait' } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("desc更新成功");
                        res(result)
                    }
                });
            });
        } catch (e) {
            console.log('e: ', e)
            res(e)
        }
    })

}

// 获取日志 done
const getlogdatainfo = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await searchlogdata(req.dbname).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: resultdata
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "获取日志信息失败~",
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

// 获取code 
const getcodeinfo = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await searchlogdatadb(req.dbname, req.id).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: resultdata
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "获取日志信息失败~",
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

// 重置case状态  done
const resetmainvideo = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await updatedatadb(req.dbname).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: '更新成功'
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "更新失败~",
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



module.exports = {
    drivercaserun, // 一键执行
    getallcases, // 拉取
    getlogdatainfo, // 查看日志
    getcodeinfo, // 查看代码
    resetmainvideo, // 重置状态
};
