/*
 * IMT project
 */
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/"
// insert data
const getdataintodb = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webvedio");
                var myobj = obj
                dbo.collection("problemdata").insertOne(myobj, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("文档插入成功");
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

// del data
const getdatamovedb = (type, name) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webvedio");
                var whereStr = { $and: [{ "type": type }, { "name": name }] };
                dbo.collection("problemdata").deleteOne(whereStr, function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        console.log("文档插入成功");
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

// search each data
const getdatafromdbeach = (type, category) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webvedio");
                var whereStr = { $and: [{ "type": type }, { "category": category }] }; // 查询条件
                // console.log(whereStr)
                dbo.collection('problemdata').find(whereStr).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        db.close();
                        res(result)
                        // console.log('End get: ', result)
                    }
                });
            });

        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

// search type data
const getdatafromdbtype = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start get')
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("webvedio");
                var whereStr = obj // 查询条件
                dbo.collection('problemdata').find(whereStr).toArray(function (err, result) {
                    if (err) {
                        res(err);
                    } else {
                        const len = result.length
                        db.close();
                        res(len)
                    }
                });
            });

        } catch (e) {
            console.log('e', e)
            res(e)
        }
    })
}

const insertproblemdata = async (ctx, next) => {
    try {
        console.log('start inserting')
        const req = ctx.request.body
        const obj = {
            name: req.name,
            desc: req.desc,
            type: parseInt(req.type), // 1 web 2 video
            category: parseInt(req.category),
        }
        const resultdata = await getdataintodb(obj).then( //dbname,limitnum
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
            };
        } else {
            var finalobj = {
                code: 404,
                msg: "新增数据失败了┭┮﹏┭┮",
            };
        }
        if (req.desc && finalobj) {
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

const getproblemdata = async (ctx, next) => {
    try {
        console.log('start getting')
        const req = ctx.request.body
        const videolen = await getdatafromdbtype({ "type": 2 }).then(
            (data) => {
                return data
            }
        )
        const weblen = await getdatafromdbtype({ "type": 1 }).then(
            (data) => {
                return data
            }
        )
        const tableDataweb = await getdatafromdbeach(1, 1).then(
            (data) => {
                return data
            }
        )
        const tableDatanetworkweb = await getdatafromdbeach(1, 2).then(
            (data) => {
                return data
            }
        )
        const tableDatabroeserweb = await getdatafromdbeach(1, 3).then(
            (data) => {
                return data
            }
        )
        const tableDatavideoweb = await getdatafromdbeach(1, 5).then(
            (data) => {
                return data
            }
        )
        const tableDatanobugweb = await getdatafromdbeach(1, 4).then(
            (data) => {
                return data
            }
        )
        const tableDatacheckweb = await getdatafromdbeach(1, 6).then(
            (data) => {
                return data
            }
        )
        const tableData = await getdatafromdbeach(2, 1).then(
            (data) => {
                return data
            }
        )
        const tableDatanetwork = await getdatafromdbeach(2, 2).then(
            (data) => {
                return data
            }
        )
        const tableDatabroeser = await getdatafromdbeach(2, 3).then(
            (data) => {
                return data
            }
        )
        const tableDatavideo = await getdatafromdbeach(2, 5).then(
            (data) => {
                return data
            }
        )
        const tableDatanobug = await getdatafromdbeach(2, 4).then(
            (data) => {
                return data
            }
        )
        const tableDatacheck = await getdatafromdbeach(2, 6).then(
            (data) => {
                return data
            }
        )
        if (videolen && weblen) {
            var finalobj = {
                code: "200",
                msg: "success",
                videolen: videolen,
                weblen: weblen,
                tableDataweb: tableDataweb,
                tableDatanetworkweb: tableDatanetworkweb,
                tableDatabroeserweb: tableDatabroeserweb,
                tableDatavideoweb: tableDatavideoweb,
                tableDatanobugweb: tableDatanobugweb,
                tableDatacheckweb: tableDatacheckweb,
                tableData: tableData,
                tableDatanetwork: tableDatanetwork,
                tableDatabroeser: tableDatabroeser,
                tableDatavideo: tableDatavideo,
                tableDatanobug: tableDatanobug,
                tableDatacheck: tableDatacheck,
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

const delproblemdata = async (ctx, next) => {
    try {
        console.log('start inserting')
        const req = ctx.request.body
        const resultdata = await getdatamovedb(parseInt(req.type), req.name).then(
            (data) => {
                return data
            }
        )
        if (resultdata) {
            var finalobj = {
                code: "200",
                msg: "success",
            };
        } else {
            var finalobj = {
                code: 404,
                msg: "删除失败了┭┮﹏┭┮",
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

module.exports = {
    insertproblemdata,
    getproblemdata, // 一键拉取
    delproblemdata,
};
