/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/"
const formatDate = require("./../utils/formatDate");
var exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");


// del file
function deleteFolder(delPath) {
    delPath = path.join(__dirname, delPath)
    try {
        if (fs.existsSync(delPath)) {
            const delFn = function (address) {
                const files = fs.readdirSync(address)
                for (let i = 0; i < files.length; i++) {
                    const dirPath = path.join(address, files[i])
                    if (fs.statSync(dirPath).isDirectory()) {
                        delFn(dirPath)
                    } else {
                        deleteFile(dirPath, true)
                    }
                }
                /**
                * @des 只能删空文件夹
                */
                fs.rmdirSync(address);
            }
            delFn(delPath);
        } else {
            console.log('do not exist: ', delPath);
        }
    } catch (error) {
        console.log('del folder error', error);
    }
}
function deleteFile(delPath, direct) {
    delPath = direct ? delPath : path.join(__dirname, delPath)
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}

// insert coverage
const insertcoveragedata = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start  insert')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webcoverage");
                var whereStr = {};
                dbo.collection('webcoverage').find(whereStr).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        var len = result.length
                        var newid = len + 1
                        const myobj = {
                            id: newid,
                            applicationname: obj.applicationname,
                            branch: obj.branch,
                            environment: 'UAT',
                            isSelected: false,
                            name: obj.name,
                            url: obj.url,
                            servername: obj.servername,
                            date: formatDate(new Date()),
                        }
                        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("webcoverage");
                            dbo.collection("webcoverage").insertOne(myobj, function (err, result) {
                                if (err) throw err;
                                console.log("新增成功");
                                res(result)
                                db.close();
                            });
                        });
                    }
                });
            });

        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// edit coverage
const editcoveragedata = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start edit')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webcoverage");
                var whereStr = { id: parseInt(obj.updatenum) };  // 查询条件
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { "name": obj.name } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        res(result)
                    }
                });
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { "url": obj.url } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        res(result)
                    }
                });
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { "applicationname": obj.applicationname } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        res(result)
                    }
                });
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { "servername": obj.servername } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        res(result)
                    }
                });
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { "branch": obj.branch } }, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        res(result)
                    }
                });
                dbo.collection('webcoverage').updateOne(whereStr, { $set: { 'date': formatDate(new Date()) } }, function (err, result) {  // date: formatDate(new Date()),
                    if (err) {
                        return err;
                    } else {
                        res(result)
                        console.log('更新成功~')
                    }
                });
            });
        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// get data from mango which need
const getdatafromdb = (limitnum) => {
    return new Promise((res, rej) => {
        try {
            if (limitnum && parseInt(limitnum) === 1) {
                console.log('start get')
                MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("webcoverage");
                    var whereStr = {}
                    dbo.collection("webcoverage").find(whereStr).limit(10).toArray(function (err, result) {
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
                MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("webcoverage");
                    var whereStr = {}
                    dbo.collection("webcoverage").find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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
const getdatafromdbinit = () => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webcoverage");
                var whereStr = {}
                dbo.collection("webcoverage").find(whereStr).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        const newresobj = {
                            len: len
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

// search data from mango
const searchfromdb = (casename, limitnum) => {
    return new Promise((res, rej) => {
        try {
            if (casename && limitnum) {
                if (parseInt(limitnum) === 1) {
                    console.log('start search')
                    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("webcoverage");
                        var whereStr = { "name": { $regex: casename } }; // 查询条件
                        dbo.collection("webcoverage").find(whereStr).limit(10).toArray(function (err, result) {
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
                    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("webcoverage");
                        var whereStr = { "name": { $regex: casename } };  // 查询条件
                        dbo.collection("webcoverage").find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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
                    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("webcoverage");
                        var whereStr = {}; // 查询条件
                        dbo.collection("webcoverage").find(whereStr).limit(10).toArray(function (err, result) {
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
                    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("webcoverage");
                        var whereStr = {};  // 查询条件
                        dbo.collection("webcoverage").find(whereStr).skip(skipnum).limit(10).toArray(function (err, result) {
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

// tooglecoverage 
const switchcoverage = (obj) => {
    return new Promise((res, rej) => {
        try {
            if (JSON.parse(obj.isSelected)) {
                console.log('start open')
                var cmdStr = 'git clone -b' + ' ' + obj.branch + ' ' + obj.applicationname //' master 
                console.log(cmdStr)
                exec(cmdStr, function (err, stdout, stderr) {
                    if (err) {
                        console.log('open fail:' + stderr);
                    } else {
                        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                            if (err) throw err;
                            console.log('开始跟新')
                            var dbo = db.db("webcoverage");
                            var whereStr = { id: parseInt(obj.updatenum) };  // 查询条件
                            dbo.collection('webcoverage').updateOne(whereStr, { $set: { "isSelected": true } }, function (err, result) {
                                if (err) {
                                    return err;
                                } else {
                                    res(result)
                                }
                            });
                        });
                    }
                });
            } else {
                console.log('start close')
                MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("webcoverage");
                    var whereStr = { id: parseInt(obj.updatenum) };  // 查询条件
                    dbo.collection('webcoverage').updateOne(whereStr, { $set: { "isSelected": false } }, function (err, result) {
                        if (err) {
                            return err;
                        } else {
                            const filename = obj.applicationname.split('/')
                            const len = filename.length
                            let delfile = filename[len - 1]  // D:\IMT-server\jinkela
                            if (delfile) {
                                deleteFolder('../../' + delfile)
                            } else {
                                deleteFolder('../../' + filename[len - 2])
                            }
                            res(result)
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

// getcoverage 
const getnewcoverage = (obj) => {
    return new Promise((res, rej) => {
        try {
            if (JSON.parse(obj.isSelected)) {
                var productname = obj.applicationname.split('/')
                const len = productname.length
                let cdinfile = productname[len - 1]
                console.log('start git pull')
                var cmdStr = 'cd' + ' ' + cdinfile + ' &&  ' + 'git pull '
                exec(cmdStr, function (err, stdout, stderr) {
                    if (err) {
                        console.log('open fail:' + stderr);
                        res('err： ', err)
                    } else {
                        res('already up to date')
                    }
                });
            } else {
                res('coverage is closed')
            }
        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// 插入数据
const insertcoverage = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const havecoverage = await insertcoveragedata(req.myobj)

        if (havecoverage) {
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

// 编辑数据
const editcoverage = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body // getallactivityavgdatafromdb
        const resultdata = await editcoveragedata(req.myobj).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
                data: '执行成功'
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "查询失败，请重试~",
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


// 检索全部数据
const getAllcoverage = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        const resultdata = await getdatafromdb(req.limitnum).then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        const resultlength = await getdatafromdbinit().then(
            (data) => {
                return data
            }
        )
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
                    length: resultlength.len
                }
            }
        } else {
            var finalobj = {
                code: 404,
                msg: "拉取数据失败，请尝试重新拉取~",
            };
        }
        if (req.limitnum && finalobj) {
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


// 搜索覆盖率数据
const searchcoverage = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await searchfromdb(req.casename, req.limitnum).then(   // ArrayList
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
        if (req.limitnum && finalobj) {
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

// 覆盖率数据收集开关
const tooglecoverage = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await switchcoverage(req.myobj).then(   // ArrayList
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
                msg: "开启失败，请重试~",
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

// 覆盖率项目拉新
const getnewfile = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const resultdata = await getnewcoverage(req.myobj).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            if (resultdata === 'coverage is closed') {
                var finalobj = {
                    code: "200",
                    msg: "很抱歉，覆盖率收集已经关闭，无法更新"
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
                msg: "开启失败，请重试~",
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

module.exports = {
    insertcoverage, // 新增覆盖率数据
    editcoverage, // 编辑覆盖率数据
    getAllcoverage, // 查询全部覆盖率数据
    searchcoverage, // 搜索覆盖率数据
    tooglecoverage, // 覆盖率开关
    getnewfile  // 覆盖率开关
};
