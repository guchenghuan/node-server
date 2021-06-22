const fs = require("fs");
const formatymd = require("./../utils/formatymd");
const imgUrl = "./../../blink-diff_img/"
const increasenewfile = formatymd(new Date())
// fs.mkdirSync(imgUrl + increasenewfile);
fs.mkdir(imgUrl + increasenewfile, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("第一个目录目录创建成功。");
});