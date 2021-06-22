//创建文件夹
var fs = require('fs');
// const formatymd = require("../app/utils/formatymd");
// //1.异步
// fs.mkdir("./第一个目录", function (err) {
//     if (err) {
//         return console.error(err);
//     }
//     console.log("第一个目录目录创建成功。");
//     fs.mkdir("./第一个目录/test1", function (err) {
//         if (err) {
//             return console.error(err);
//         }
//         console.log("test1目录创建成功。");
//     });
//     fs.mkdir("./第一个目录/test2", function (err) {
//         if (err) {
//             return console.error(err);
//         }
//         console.log("test2目录创建成功。");
//     });
// });
// console.log("创建目录 /第一个目录/test");
// //2.同步
// fs.mkdirSync("./第二个目录");

// fs.mkdirSync("../" + formatymd(new Date()));

// fs.rmdirSync('../2020-10-28-16-46-28')

// imgUrl = __dirname + "./../../blink-diff_img";  // __dirname + "./../../blink-diff_img"
// console.log(imgUrl)
// const imgUrl = "./../blink-diff_img/"
// const increasenewfile = formatymd(new Date())
// fs.mkdirSync(imgUrl + increasenewfile);
// console.log(imgUrl)



fs.appendFile('./testfile.json', JSON.stringify({
    type: 'tag',
    tagName: 'div',
    style: { display: 'none' },
    inlineStyle: 'display: none;',
    attrs: { id: 'heimu' },
    classNames: '',
    classList: [],
    children: []
}), 'utf8', function (err, ret) {
    if (err) {
        throw err
    }
    console.log('success')
})