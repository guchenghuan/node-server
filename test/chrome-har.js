// // mangoDB 数据库操作

// videomaincase   videoruncase   videologcase

// 创建数据库 + 创建集合
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/videowebtest';
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("videowebtest");
//     dbase.createCollection('broserlogcase', function (err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close();
//     });
// });


// videomaincase   videoruncase   videologcase

// // 插入数据
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("videowebtest");
//     var myobj = {
//         "id": 1,
//         "name": "播放",
//         "rate": "100%",
//         "date": "2020-08-30 17:35:20",
//         "status": "已执行",
//         "result": "PASS",
//         "comment": "2.39.0已去除此功能",
//         "isdel": 0
//     };
//     dbo.collection("brosermaincase").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("文档插入成功");
//         db.close();
//     });
// });


// // 查询数据
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("performdb");
    var mysort = { Date: -1 };
    dbo.collection('platformdata').find().sort(mysort).toArray(function (err, result) {
        if (err) {
            console.log('err: ', err)
        } else {
            const len = result.length
            if (len > 0) {
                db.close();
                console.log('result: ', result)
            } else {
                res('no data')
            }
        }
    });
});

// // // 删除数据
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// // MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
// //     if (err) throw err;
// //     var dbo = db.db("performdb");
// //     var whereStr = { "name": '菜鸟教程test' };  // 查询条件
// //     dbo.collection("har").deleteOne(whereStr, function (err, obj) {
// //         if (err) throw err;
// //         console.log("文档删除成功");
// //         db.close();
// //     });
// // });

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {

//     if (err) throw err;
//     var dbo = db.db("performdb");
//     var whereStr = { "url": "https://www.baidu.com" };  // 查询条件
//     dbo.collection("har").find(whereStr).toArray(function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             db.close();
//             console.log(result);
//             return result
//         }
//     });


//     const d = new Date()
//     const resDate =
//         d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
//     const resTime =
//         d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
//     alldate = resDate + " " + resTime;
//     MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//         if (err) throw err
//         var dbo = db.db("performdb")
//         var myobj = { url: inserturl, har: cmdresult, data: alldate }
//         dbo.collection("har").insertOne(myobj, function (err, res) {
//             if (err) throw err
//             console.log("数据插入成功")
//             db.close()
//         })
//     })

// });

// 更新一条数据
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("videowebtest");
//     var whereStr = { "id": 1 };  // 查询条件
//     var updateStr = { $set: { "action": "编辑" } };
//     dbo.collection("videologcase").updateOne(whereStr, updateStr, function (err, res) {
//         if (err) throw err;
//         console.log("文档更新成功");
//         db.close();
//     });
// });