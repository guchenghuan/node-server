// 创建数据库 + 创建集合
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("webcoverage");
//     dbase.createCollection('coverageconnect', function (err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close()
//     });
// });

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("webcoverage");
    var whereStr = { name: 'game-playground' };
    dbo.collection('activitycoverage').deleteOne(whereStr, function (err, result) {
        if (err) {
            return err;
        } else {
            console.log(" --- 删除成功");
            db.close();
        }
    });
});

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("domDiffdb");
//     var mysort = { date: -1 };
//     var whereStr = { url: 'https://www.bilibili.com/v/douga/tokusatsu/' };
//     dbo.collection('autourlFiles').find(whereStr).sort(mysort).toArray(function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             const len = result.length
//             if (len > 0) {
//                 db.close();
//                 console.log('End done', result)
//             } else {
//                 console.log('no data')
//             }
//         }
//     });
// });
// 插入一条数据
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("webcoverage");
//     var myobj = [
//         {
//             aname: 'babylon-template',
//             cname: 'game-playground',
//             Date: "2021-04-27 16:50:31",
//         },
//         {
//             aname: 'bml2021',
//             cname: 'bml2021',
//             Date: "2021-04-27 16:50:31",
//         },
//         {
//             aname: 'precious-post',
//             cname: 'precious-post',
//             Date: "2021-04-27 16:50:31",
//         }
//     ]
//     dbo.collection("coverageconnect").insertMany(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("文档插入成功");
//         db.close();
//     });
// });

// function getNextSequenceValue(sequenceName) {
//     var sequenceDocument = dbo.collection("counters").findAndModify(
//         {
//             query: { _id: sequenceName },
//             update: { $inc: { sequence_value: 1 } },
//             "new": true
//         });
//     return sequenceDocument.sequence_value;
// }

// ------------------------------------------------------------------------

// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("performdb")
//     var myobj = {
//         "_id": 'productid',
//         "product_name": "Apple iPhone",
//         "category": "mobiles-1"
//     }
//     const registerCollection = dbo.collection('counters');
//     registerCollection.findOneAndUpdate(
//         { _id: 'productid' },
//         { $inc: { sequence_value: 1 } },
//         { "upsert": true, "returnOriginal": false }, (err, res) => {
//             if (err) {
//                 console.error(err);
//                 db.close();
//                 return;
//             }
//             myobj._id = res.value.sequence_value;
//             console.log('res', res)
//             console.log('--------------------------------')
//             console.log('myobj', myobj)

//         }
//     )
//     const registerCollectionupdate = dbo.collection('products');
//     registerCollectionupdate.insertOne(myobj, (err, res) => {
//         if (err) throw err;
//         console.log("数据插入成功")
//         db.close();
//     });

// })
// --------------------------------------------------------------


// /**如果一切正常，会走到这里.把userid值放入返回值，传递出去 */
// // objReturn.userid = oneUser.userid
// // objReturn.code = NetMessageID.ERROR_CODE.IS_OK;
// // objReturn.des = "注册成功";
// // .username}]注册成功,userid:${objReturn.userid}`);
// // resolve(objReturn);


// var myobj = {
//     "_id": sequenceDocument.sequence_value,
//     "product_name": "Apple iPhone",
//     "category": "mobiles"
// }

// dbo.collection("products").insertOne(myobj, function (err, res) {
//     if (err) throw err
//     console.log("数据插入成功")
//     db.close()
// })



// const formatDate = require("./app/utils/formatDate.js");
// const d = new Date()
// console.log(formatDate(d))

// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("videowebtest");
//     var whereStr = { "id": 3 };  // 查询条件
//     var updateobj = { 'comment': '第三个编辑测试' }
//     var updateStr = { $set: updateobj };
//     dbo.collection('videomaincase').updateOne(whereStr, updateStr, function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             console.log("文档更新成功");
//         }
//     });
// });


// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017';
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("performdb");
//     var obj = { "platformname": "bilibili.js" };
//     var timestart = { "Date": { "$gt": "2020-09-25 0:0:0" } };
//     var timeend = { "Date": { "$lt": "2020-09-30 16:36:28" } }
//     var whereStr = {
//         $and: [obj, timestart, timeend]
//     };
//     console.log('whereStr: ', whereStr)
//     dbo.collection("platformdata").find(whereStr).toArray(function (err, result) {
//         if (err) throw err;
//         console.log(result);
//         console.log(result.length);
//         db.close();
//     });
// });

// MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("videowebtest");
//     var whereStr = { $and: [{ "type": 2 }, { "category": 1 }] }; // 查询条件
//     console.log(whereStr)
//     // { '$and': [ { type: 2 }, { category: 1 } ] }
//     // { '$and': [ { type: 2 }, { category: 1 } ] }
//     // var mysort = { date: -1 };
//     dbo.collection('broserlogcase').find(whereStr).toArray(function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             db.close();
//             // res(result) // 返回的对象是个 Array
//             console.log('End get: ', result)
//         }
//     });
// });

// MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("videowebtest");
//     var whereStr = {};  // 查询条件
//     var updateStr = { $set: { 'desc': '等待' } };
//     dbo.collection('videomaincase').updateMany(whereStr, updateStr, function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             console.log("desc更新成功");
//             // res(result)
//         }
//     });
//     dbo.collection('videomaincase').updateMany(whereStr, { $set: { 'state': 'wait' } }, function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             console.log("state更新成功");
//             // res(result)
//         }
//     });
// });

// 删除 
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("domDiffdb");
//     var whereStr = {};
//     dbo.collection("uatbvtiles").deleteMany(whereStr, function (err, obj) {
//         if (err) throw err;
//         console.log(obj.result.n + " 条文档被删除");
//         db.close();
//     });
// });


// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("domDiffdb");
//     // var whereStr = { filename: '2020-12-17-00-54-00' }
//     var whereStr = {
//         $and: [{ "date": { "$gt": '2021-01-08 16:05:00' } }, { "date": { "$lt": '2021-01-08 16:07:00' } }]
//     }
//     var mysort = { date: 1 };
//     dbo.collection('uatbvtiles').find(whereStr).sort(mysort).toArray(function (err, result) {
//         if (err) {
//             return err;
//         } else {
//             const len = result.length
//             if (len > 0) {
//                 db.close();
//                 console.log(len)
//                 console.log(result) // 返回的对象是个 Array
//                 console.log('End done')
//             } else {
//                 console.log('no data')
//             }
//         }
//     });
// });


