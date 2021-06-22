/*
 * IMT project
 */

var exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");
const difflib = require("./difflib");
const changetoJson = require('./filetochange')
const diffview = require("./diffview");
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var MongoClient = require('mongodb').MongoClient;
const formatDate = require("./../utils/formatDate");
const formatymd = require("./../utils/formatymd");
const puppeteer = require('puppeteer'),
    BlinkDiff = require('blink-diff')
const imgUrl = "./blink-diff_img/" // __dirname + "/blink-diff_img/";

// cmd 命令执行
const runcases = (url) => {
    return new Promise((res, rej) => {
        try {
            const increasenewfile = formatymd(new Date())
            // fs.mkdirSync(imgUrl + increasenewfile);
            fs.mkdir(imgUrl + increasenewfile, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("目录创建成功。");
            });
            // console.log("increasenewfile: ", increasenewfile);
            // console.log("imgUrl: ", imgUrl);
            // console.log("imgUrl + increasenewfile: ", imgUrl + increasenewfile);
            // fs.mkdirSync(imgUrl + increasenewfile);
            // console.log("第一个目录目录创建成功。");
            puppeteer.launch(
                {
                    headless: true, // 开启界面,
                    timeout: 30 * 1000,
                    // devtools: true,  // 开启开发者控制台  
                    //设置每个步骤放慢200毫秒
                    slowMo: 200,
                    //设置打开页面在浏览器中的宽高
                    defaultViewport: null,
                    args: ['--start-maximized'],
                    ignoreDefaultArgs: ['--enable-automation'],
                    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                }
            ).then(
                async browser => {
                    const page = await browser.newPage();
                    try {
                        // 设置 浏览器视窗
                        await page.setViewport({
                            width: 1920,
                            height: 945,
                        });
                        await page.goto(url);
                        await page
                            .waitForSelector('#app')
                            .then(async () => {
                                try {
                                    const newfilepath = await searchulrfiles(url)
                                    // console.log("newfilepath.. ", newfilepath);
                                    if (newfilepath) {
                                        // console.log("进来了.. ", newfilepath);

                                        await page.evaluate(`window.window.scrollTo(100,2000)`, {
                                            delay: 5000
                                        });
                                        await page.screenshot({ path: imgUrl + increasenewfile + '/' + 'Screenshots.png', fullPage: true }, {
                                            delay: 5000
                                        });

                                        // 处理json..................

                                        const html = await page.$eval('#app', e => e.outerHTML);
                                        const source = html
                                        const htmljson = changetoJson.toJSON(source, { skipScript: true, pureComment: true })
                                        // console.log(htmljson)

                                        fs.appendFile(imgUrl + increasenewfile + '/' + 'html.json', JSON.stringify(htmljson[0], null, 4), 'utf8', function (err, ret) {
                                            if (err) {
                                                throw err
                                            }
                                            console.log('success')
                                        })

                                        var jsonpathA = imgUrl + newfilepath + '/' + 'html.json';
                                        var olddata = fs.readFileSync(jsonpathA, 'utf8');

                                        // 进行imgdiff
                                        const diff = new BlinkDiff({
                                            imageAPath: imgUrl + newfilepath + '/' + 'Screenshots.png', // 页面截图A
                                            imageBPath: imgUrl + increasenewfile + '/' + 'Screenshots.png',// 页面截图B
                                            threshold: 2.2, // 1% threshold === 0.02 
                                            imageOutputPath: imgUrl + increasenewfile + '/' + 'Diff.png'//Diff截图
                                        });
                                        diff.run(function (error, result) {
                                            if (error) {
                                                throw error;
                                            } else {
                                                // resolve img B
                                                var filepathA = imgUrl + newfilepath + '/' + 'Screenshots.png';
                                                var bDataA = fs.readFileSync(filepathA);
                                                var base64StrA = bDataA.toString('base64');
                                                var datauri = 'data:image/png;base64,' + base64StrA;
                                                // resolve img B
                                                var filepathB = imgUrl + increasenewfile + '/' + 'Screenshots.png';
                                                var bDataB = fs.readFileSync(filepathB);
                                                var secondbase64Str = bDataB.toString('base64');
                                                var seconddatauri = 'data:image/png;base64,' + secondbase64Str;
                                                // console.log(datauri);

                                                // resolve img Diff
                                                var filepathD = imgUrl + increasenewfile + '/' + 'Diff.png';
                                                var bDataD = fs.readFileSync(filepathD);
                                                var Diffbase64Str = bDataD.toString('base64');
                                                var Diffdatauri = 'data:image/png;base64,' + Diffbase64Str;

                                                const diffresult = diff.hasPassed(result.code) ? '通过' : '失败'
                                                const diffdimension = result.dimension
                                                const diffdifferences = result.differences

                                                // 进行domdiff
                                                var jsonpathB = imgUrl + increasenewfile + '/' + 'html.json';
                                                var newdata = fs.readFileSync(jsonpathB, 'utf8');
                                                if (olddata && newdata) {
                                                    console.log('all done')
                                                    var domdiff = diffUsingJS(olddata, newdata)
                                                } else {
                                                    console.log('fail...')
                                                    var domdiff = ''
                                                }

                                                // insert data urlfiles
                                                MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                                    if (err) throw err;
                                                    var dbo = db.db("domDiffdb");
                                                    var myobj = {
                                                        "url": url,
                                                        "filename": increasenewfile,
                                                        "date": formatDate(new Date())
                                                    };
                                                    dbo.collection("urlFiles").insertOne(myobj, function (err, res) {
                                                        if (err) throw err;
                                                        console.log("urlFiles文档插入成功");
                                                        db.close();
                                                    });
                                                });
                                                // insert data fileimgs
                                                MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                                    if (err) throw err;
                                                    var dbo = db.db("domDiffdb");
                                                    var myobj = {
                                                        "filename": increasenewfile,
                                                        'firstimg': datauri,
                                                        'secondimg': seconddatauri,
                                                        'diffimg': Diffdatauri,
                                                        'result': diffresult,
                                                        'dimension': diffdimension,
                                                        'diffdifferences': diffdifferences,
                                                        'diffdom': domdiff,
                                                        'lastdom': olddata.length,
                                                        'newdom': newdata.length,
                                                        'domrate': newdata.length < olddata.length ? ((olddata.length - newdata.length) / olddata.length * 100).toFixed(2) : Math.abs((olddata.length - newdata.length) / olddata.length),
                                                        "date": formatDate(new Date())
                                                    };
                                                    dbo.collection("fileImgs").insertOne(myobj, function (err, result) {
                                                        if (err) {
                                                            return err;
                                                        } else {
                                                            console.log("fileImgs数据新增成功~");
                                                            res(result)
                                                        }
                                                    });
                                                });
                                                // console.log(diff.hasPassed(result.code) ? '通过' : '失败');
                                                // // console.log('result: ', result);
                                                // console.log('总像素:' + result.dimension);
                                                // console.log('发现:' + result.differences + ' 差异.');
                                            }
                                        });
                                    } else {
                                        // console.log("mei进来了.. ", newfilepath);
                                        const html = await page.$eval('#app', e => e.outerHTML);
                                        const source = html
                                        const htmljson = changetoJson.toJSON(source, { skipScript: true, pureComment: true })

                                        fs.appendFile(imgUrl + increasenewfile + '/' + 'html.json', JSON.stringify(htmljson[0], null, 4), 'utf8', function (err, ret) {
                                            if (err) {
                                                throw err
                                            }
                                            console.log('success')
                                        })
                                        await page.evaluate(`window.window.scrollTo(100,2000)`, {
                                            delay: 5000
                                        });
                                        await page.screenshot({ path: imgUrl + increasenewfile + '/' + 'Screenshots.png', fullPage: true }, {
                                            delay: 5000
                                        });
                                        // resolve img
                                        var filepath = imgUrl + increasenewfile + '/' + 'Screenshots.png';
                                        var bData = fs.readFileSync(filepath);
                                        var base64Str = bData.toString('base64');
                                        var datauri = 'data:image/png;base64,' + base64Str;
                                        // console.log(datauri);
                                        // insert data urlfiles
                                        MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                            if (err) throw err;
                                            var dbo = db.db("domDiffdb");
                                            var myobj = {
                                                "url": url,
                                                "filename": increasenewfile,
                                                "date": formatDate(new Date())
                                            };
                                            dbo.collection("urlFiles").insertOne(myobj, function (err, res) {
                                                if (err) throw err;
                                                console.log("urlFiles文档插入成功");
                                                db.close();
                                            });
                                        });
                                        // insert data fileimgs
                                        MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                                            if (err) throw err;
                                            var dbo = db.db("domDiffdb");
                                            var myobj = {
                                                "filename": increasenewfile,
                                                'firstimg': datauri,
                                                'secondimg': '',
                                                'diffimg': '',
                                                "date": formatDate(new Date())
                                            };
                                            dbo.collection("fileImgs").insertOne(myobj, function (err, result) {
                                                if (err) {
                                                    return err;
                                                } else {
                                                    console.log("fileImgs数据新增成功~");
                                                    res(result)
                                                }
                                            });
                                        });
                                    }
                                    await browser.close({
                                        delay: 3000
                                    });
                                } catch (e) {
                                    console.log('执行失败 error: ', e)
                                    res(e)
                                }
                            });
                    } catch (e) {
                        // return e
                        console.log('out-error: ', e);
                        res(e)
                    }
                }
            );
        } catch (e) {
            res(e)
        }
    })
}

// 对比dom
function diffUsingJS(fdata, ldata) {
    var base = difflib.stringAsLines(fdata),
        newtxt = difflib.stringAsLines(ldata),
        sm = new difflib.SequenceMatcher(base, newtxt),
        opcodes = sm.get_opcodes()

    var result = diffview.buildView({
        baseTextLines: base,
        newTextLines: newtxt,
        opcodes: opcodes,
        baseTextName: "Base Text",
        newTextName: "New Text",
        viewType: 1
    });

    var document = new JSDOM().window.document;
    var tdata = document.createElement("div");
    tdata.appendChild(result);
    return tdata.innerHTML
}

// 查询url下是否存在历史数据
const searchulrfiles = (url) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var whereStr = { 'url': url };  // 查询条件
                // console.log('whereStr: ', whereStr)
                var mysort = { date: -1 };
                dbo.collection("urlFiles").find(whereStr).sort(mysort).toArray(function (err, result) {
                    if (err) {
                        return err;
                    } else {
                        const len = result.length
                        if (len > 0) {
                            console.log('exist...')
                            const lastfile = result[0].filename
                            res(lastfile)
                        } else {
                            console.log('have no..')
                            res(false)
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


// get data from db
const getdatafromdb = (dbname, whereobj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start search')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var whereStr = whereobj
                dbo.collection(dbname).find(whereStr).toArray(function (err, result) {
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

// insert data into db  
const insertdataintodb = (dbname, obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var myobj = obj
                dbo.collection(dbname).insertOne(myobj, function (err, result) {
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

// insert data into db  
const insertotherdatadb = (obj) => {
    return new Promise((res, rej) => {
        try {
            console.log('start insert')
            MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("domDiffdb");
                var myobj = obj
                dbo.collection('logdata').insertOne(myobj, function (err, result) {
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

// 新增
const neewinsert = async (ctx, next) => {
    try {
        const req = ctx.request.body
        const obj = {
            url: req.url,
            type: req.type,
            date: formatDate(new Date()),
        }
        const resultdata = await insertdataintodb(req.dbname, obj).then(   // ArrayList
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，新增数据失败了~"
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
                msg: "新增失败，请重试~",
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

// 一级搜索
const Fsearch = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const obj = {
            type: req.type,
        }
        const resultdata = await getdatafromdb(req.dbname, obj).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，该tab下暂无数据~"
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

// 二级搜索
const Ssearch = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const obj = {
            url: req.url,
        }
        const resultdata = await getdatafromdb(req.dbname, obj).then(
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

// 三级搜索
const Tsearch = async (ctx, next) => {
    try {
        console.log('start search')
        const req = ctx.request.body //
        const obj = { filename: req.file }
        const resultdata = await getdatafromdb(req.dbname, obj).then(
            (data) => {
                return data
            }
        )
        // console.log('req', req)
        if (resultdata) {
            if (resultdata === 'no data') {
                var finalobj = {
                    code: "200",
                    msg: "抱歉，该file下暂无数据~"
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

// 手动执行
const handsrun = async (ctx, next) => {
    try {
        const req = ctx.request.body
        // console.log('remoteIp--', remoteIp)
        // console.log('req: ', req);
        const resultdata = await runcases(req.url).then(
            (data) => {
                return data
            }
        )
        const remoteIp = ctx.request.ip.slice(7)
        const d = new Date()
        const obj = {
            "url": req.url,
            "date": formatDate(d),
            "data": "操作人ip: " + remoteIp + '  执行了该diff',
        }
        const otherdata = await insertotherdatadb(obj).then(
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

// 定时执行
const setautorun = async (ctx, next) => {
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

// 删除确认  
const delurlconform = async (ctx, next) => {
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
    neewinsert, // 新增
    Fsearch, // 一级搜索
    Ssearch, // 二级搜索
    Tsearch, // 三级搜索
    handsrun, // 手动执行
    setautorun, // 定时执行
    delurlconform, //删除确认
};
