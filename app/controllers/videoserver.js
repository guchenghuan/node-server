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
var os = require('os');

// cmd 命令执行
const runcases = (args, rundbname) => {
    return new Promise((res, rej) => {
        const d = new Date()
        try {
            var domaindbname
            if (rundbname === 'videoruncase') {
                domaindbname = 'videomaincase'
                if (parseInt(args)) {
                    var newitem = 'item' + parseInt(args)
                    var cmdStr = autoruncase[newitem]
                }
            } else {
                domaindbname = 'brosermaincase'
                if (parseInt(args)) {
                    var newitem = 'item' + parseInt(args)
                    var cmdStr = autoruncase[newitem]
                }
            }
            console.log('start run')
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    console.log('not ok:' + stderr);
                    const objF = {
                        "id": parseInt(args),
                        "date": formatDate(d),
                        "status": "已执行",
                        "result": "Fail",
                    }
                    // 插入执行db
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err
                        var dbo = db.db("videowebtest")
                        var myobj = objF
                        dbo.collection(rundbname).insertOne(myobj, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                console.log("失败数据新增成功~");
                            }
                        })
                    })
                    // 更改主表数据
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { "id": parseInt(args) };  // 查询条件
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'status': '已执行' } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("status更新成功");
                            }
                        });
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'result': 'Fail' } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("result更新成功");
                            }
                        });
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'date': formatDate(d) } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("result更新成功");
                            }
                        });
                    });
                    console.log("主表数据更新成功~");
                    res(stderr)
                } else {
                    console.log('success done');
                    const objS = {
                        "id": parseInt(args),
                        "date": formatDate(d),
                        "status": "已执行",
                        "result": "PASS",
                    }
                    // 插入执行db
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err
                        var dbo = db.db("videowebtest")
                        var myobj = objS
                        dbo.collection(rundbname).insertOne(myobj, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                console.log("成功数据新增成功~");
                            }
                        })
                    })
                    // 更改主表数据
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { "id": parseInt(args) };  // 查询条件
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'status': '已执行' } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("status更新成功");
                            }
                        });
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'result': 'PASS' } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("result更新成功");
                            }
                        });
                        dbo.collection(domaindbname).updateOne(whereStr, { $set: { 'date': formatDate(d) } }, function (err, result) {
                            if (err) {
                                return err;
                            } else {
                                // console.log("result更新成功");
                            }
                        });
                    });
                    console.log("主表suc数据更新成功~");
                    // return data
                    res(stdout)
                }
            });
        } catch (e) {
            res(e)
        }
    })
}


// search data from mango
const searchfromdb = (dbname, casename, limitnum) => {
    return new Promise((res, rej) => {
        try {
            if (casename && limitnum) {
                if (parseInt(limitnum) === 1) {
                    console.log('start search')
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { $and: [{ "name": { $regex: casename } }, { "isdel": 0 }] }; // 查询条件
                        dbo.collection(dbname).find(whereStr).limit(10).toArray(function (err, result) {
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
                } else {
                    console.log('start search page>1')
                    const skipnum = (parseInt(limitnum) - 1) * 10
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { $and: [{ "name": { $regex: casename } }, { "isdel": 0 }] };  // 查询条件
                        dbo.collection(dbname).find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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
                }
            } else {
                if (parseInt(limitnum) === 1) {
                    console.log('start search')
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { "isdel": 0 }; // 查询条件
                        dbo.collection(dbname).find(whereStr).limit(10).toArray(function (err, result) {
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
                } else {
                    console.log('start search page>1')
                    const skipnum = (parseInt(limitnum) - 1) * 10
                    MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("videowebtest");
                        var whereStr = { "isdel": 0 };  // 查询条件
                        dbo.collection(dbname).find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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
                }
            }
        } catch (e) {
            res(e)
        }
    })
}

// get data from mango which need
const getdatafromdb = (dbname, limitnum) => {
    return new Promise((res, rej) => {
        try {
            if (limitnum && parseInt(limitnum) === 1) {
                console.log('start get')
                MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("videowebtest");
                    var whereStr = { "isdel": 0 }
                    dbo.collection(dbname).find(whereStr).limit(10).toArray(function (err, result) {
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
            } else {
                console.log('start get page>1')
                const skipnum = (parseInt(limitnum) - 1) * 10
                MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("videowebtest");
                    var whereStr = { "isdel": 0 }
                    dbo.collection(dbname).find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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
            }
        } catch (e) {
            console.log('e', e)
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
                        const lastid = result[len - 1].id
                        const newresobj = {
                            len: len,
                            lastid: lastid
                        }
                        if (len > 0) {
                            db.close();
                            res(newresobj) // 返回的对象是个 Array
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

// data insert newcase into db
function insertdatadb(dbnamef, dbnames, obj) { //区分出不同case的数据库
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest")
                obj.id = parseInt(obj.id)
                obj.isdel = parseInt(obj.isdel)
                var myobj = obj
                const registerCollection = dbo.collection(dbnamef);
                registerCollection.findOneAndUpdate(
                    { _id: 'productid' },
                    { $inc: { sequence_value: 1 } },
                    { "upsert": true, "returnOriginal": false }, (err, res) => {
                        if (err) {
                            console.error(err);
                            db.close();
                            return;
                        }
                        myobj.id = res.value.sequence_value;
                    }
                )
                const registerCollectionupdate = dbo.collection(dbnames);
                registerCollectionupdate.insertOne(myobj, (err, result) => {
                    if (err) {
                        return err;
                    } else {
                        console.log("数据插入成功")
                        res(result)
                    }
                });
            })
        } catch (e) {
            console('e: ', e)
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
function searchlogdatadb(dbname, id) {
    return new Promise((res, rej) => {
        try {
            console.log('start search log')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = { "id": parseInt(id) };
                var mysort = { date: -1 };
                dbo.collection(dbname).find(whereStr).sort(mysort).limit(5).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        db.close();
                        res(result) // 返回的对象是个 Array
                        console.log('End get')
                    }
                });
            });
        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// data search run into db
function searchrundatadb(dbname, obj) {
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
                            // console.log(result[0].url);
                            // console.log(result.length);
                            res(len) // 返回的对象是个 Array
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

// data update into db miancasedb
function updatedatadb(dbname, updatenum, comment) { //update 处理成传一个对象进来 ，根据updatenum 来决定对哪个进行update
    return new Promise((res, rej) => {
        try {
            console.log('start update')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = { "id": parseInt(updatenum) };  // 查询条件
                var updateStr = { $set: { 'comment': comment } };
                const d = new Date()
                dbo.collection(dbname).updateOne(whereStr, updateStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("comment更新成功");
                        res(result)
                    }
                });
                dbo.collection(dbname).updateOne(whereStr, { $set: { 'date': formatDate(d) } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("date日期更新成功");
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

// delete case update status
function updatedeldatadb(id, dbname) { //update 处理成传一个对象进来 ，根据updatenum 来决定对哪个进行update
    return new Promise((res, rej) => {
        try {
            console.log('start del')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("videowebtest");
                var whereStr = { "id": parseInt(id) };  // 查询条件
                var updateStr = { $set: { 'isdel': 1 } };
                dbo.collection(dbname).updateOne(whereStr, updateStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("文档删除成功");
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

// reslove requests
const getneedfile = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const prewebcoach = await asyncusewebcoach(req.url)
        const resultdata = await searchfromdb(req.url).then(
            (data) => {
                return data
            }
        )
        const resdata = JSON.stringify(resultdata)
        const cmdresult = JSON.parse(resdata)

        if (prewebcoach && cmdresult) {
            const lastData = JSON.parse(cmdresult)
            const Toplistdata = await asyncuseToplist(lastData)
            const Deachdata = await asyncuseDomain(lastData);
            const Assertsdatas = await asyncuseAssertsData(lastData)
            const newAssertsdata = await asyncuseAsserts(Assertsdatas)
            const pagexraydatas = await pagexraydata(lastData)
            var finalobj = {
                code: "200",
                msg: "success",
                // log: lastData.log,
                // Domain: Deachdata, // 2 no
                Deach: await asyncusedomaineach(Deachdata),
                Toplist: await asyncuseToplisteach(Toplistdata), // 21 no
                Slowestresponses: await asyncuseToplistpredata(Toplistdata), //22 no 
                // // headersdata: await asyncuseheraderdata(),
                Assertsdata: await asyncuseAssertspredata(newAssertsdata),
                pagexraydata: pagexraydatas, // 1 no 
                pagesdata: await asyncusepagesdata(pagexraydatas), //no
                webcoach: prewebcoach,
                // cmdresult: lastData, // no 
                infoData: await asyncinfoData(pagexraydatas, prewebcoach),
                eachpage: await asynceachpage(lastData), // 3 no
                PageXrayasserts: await pagexrayeachdata(pagexraydatas), // no
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "服务解析失败，请联系管理员检查服务且稍后再试",
            };
        }
        if (req.url && finalobj) {
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

// 搜索  done need do webdriver design
const searchvideocase = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await searchfromdb(req.dbname, req.casename, req.limitnum).then(   // ArrayList
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，没找到您想要的~~~"
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

// 新增 done
const videocasenewinsert = async (ctx, next) => {
    try {
        console.log('start insert')
        const req = ctx.request.body // 新增需要传三个参数 casename  comments  radiotype
        // console.log('req: ', req)
        // console.log('ctx: ', ctx)
        // console.log('next: ', next)
        const resultdata = await insertdatadb(req.dbnamef, req.dbnames, req.myobj).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: '数据插入成功'
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "新增失败了，请重新尝试~",
            };
        }
        if (req.myobj && finalobj) {
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

// 一键拉取 done
const getcaseinfo = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        const resultdata = await getdatafromdb(req.dbname, req.limitnum).then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultlength = await getdatafromdbinit(req.dbname).then(
            (data) => {
                return data
            }
        )
        // const resdata = JSON.stringify(resultdata)
        // const resultdbdata = JSON.parse(resdata)
        // console.log(resultdata);
        if (resultdata && resultlength) {
            if (resultlength === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉还没有数据哦~"
                }
            } else {
                var finalobj = {
                    code: "200",
                    msg: "success",
                    data: resultdata,
                    length: resultlength.len,
                    lastid: resultlength.lastid
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

// 编辑备注确定  done
const editconform = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const remoteIp = ctx.request.ip.slice(7)
        const d = new Date()
        const obj = {
            "id": parseInt(req.updatenum),
            "date": formatDate(d),
            "data": "ip: " + remoteIp + " " + formatDate(d) + " 操作了本条case",
            "action": "编辑"
        }
        var togglename
        if (req.dbname === "videomaincase") {
            togglename = 'videologcase'
        } else {
            togglename = 'broserlogcase'
        }
        // console.log('remoteIp--', remoteIp)
        // console.log('req: ', req);
        const resultdata = await updatedatadb(req.dbname, req.updatenum, req.comment).then(
            (data) => {
                return data
            }
        )
        const otherdata = await insertotherdatadb(togglename, obj).then(
            (data) => {
                return data
            }
        )
        // const resdata = JSON.stringify(resultdata)
        // const resultdbdata = JSON.parse(resdata)
        // console.log(resultdata);
        if (resultdata && otherdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: resultdata
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "备注信息更新失败，请重新尝试~",
            };
        }
        if (req.comment && finalobj) {
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
const performcase = async (ctx, next) => {
    try {
        const req = ctx.request.body
        // console.log('remoteIp--', remoteIp)
        // console.log('req: ', req);
        const resultdata = await runcases(req.args, req.rundbname).then(
            (data) => {
                return data
            }
        )
        const remoteIp = ctx.request.ip.slice(7)
        const d = new Date()
        const obj = {
            "id": parseInt(req.args),
            "date": formatDate(d),
            "data": "操作人ip: " + remoteIp + '  详细操作： ' + resultdata,
            "action": "执行"
        }
        var togglename
        if (req.rundbname === "videoruncase") {
            togglename = 'videologcase'
        } else {
            togglename = 'broserlogcase'
        }
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
                data: resultdata
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "自动化执行失败，请重新尝试~",
            };
        }
        if (req.rundbname && finalobj) {
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

// 获取日志 done
const getLoginfo = async (ctx, next) => {
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

// 删除确认  done
const deleteconform = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const remoteIp = ctx.request.ip.slice(7)
        const d = new Date()
        const obj = {
            "id": parseInt(req.id),
            "date": formatDate(d),
            "data": "ip: " + remoteIp + " " + formatDate(d) + " 操作了本条case",
            "action": "删除"
        }
        var togglename
        if (req.dbname === "videomaincase") {
            togglename = 'videologcase'
        } else {
            togglename = 'broserlogcase'
        }
        const resultdata = await updatedeldatadb(req.id, req.dbname).then(
            (data) => {
                return data
            }
        )
        const otherdata = await insertotherdatadb(togglename, obj).then(
            (data) => {
                return data
            }
        )
        // console.log(resultdata);
        if (resultdata && otherdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: '删除成功'
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "删除失败 请重新尝试~",
            };
        }
        if (req.id && finalobj) {
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
    getneedfile,
    searchvideocase, // 搜索
    videocasenewinsert, // 新增
    getcaseinfo, // 一键拉取
    editconform, // 编辑备注确定
    performcase, // 执行case
    getLoginfo, //获取日志
    deleteconform, //删除确认
};
