const BlinkDiff = require('blink-diff'),
    imgUrl = __dirname + "/blink-diff_img/";


var arr = []
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("domDiffdb");
    var whereStr = { url: "https://www.bilibili.com/video/BV1154y1m7j1/" };
    dbo.collection('urlimg').find(whereStr).toArray(function (err, result) {
        if (err) {
            return err;
        } else {
            db.close();
            // res(result) // 返回的对象是个 Array
            console.log('End get: ', __dirname)
            // result.forEach(item => {
            //     arr.push(item.picture)
            // })
            // const diff = new BlinkDiff({
            //     imageAPath: arr[0], // 设计图
            //     imageBPath: arr[1],//页面截图
            //     threshold: 0.02, // 1% threshold
            //     imageOutputPath: imgUrl + 'Diff.png'//Diff路径
            // });

            // diff.run(function (error, result) {
            //     if (error) {
            //         throw error;
            //     } else {
            //         // console.log('diff: ', diff);
            //         // console.log(diff.hasPassed(result.code));
            //         console.log(diff.hasPassed(result.code) ? '通过' : '失败');
            //         // console.log('result: ', result);
            //         console.log('总像素:' + result.dimension);
            //         console.log('发现:' + result.differences + ' 差异.');
            //     }
            // });
        }
    });
});

