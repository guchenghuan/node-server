const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");
const path = require("path");
const { JSONStorage } = require("node-localstorage");

async function netbian() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(`file:///D:/bilibili/imt-server/preScripts_js/2020-07-30-04-00-27/pages/www.bilibili.com/video/BV1U54y1S7no/query-2e3e4d1b/index.html`);//为了方便从第二页开始
    let images = await page.$$eval("td", (el) =>//图片节点，API可查看官方介绍
        el.map((x) => x.innerHTML)
        // el[1].innerHTML//获取图片的src地址
    );
    const newArr = []
    const Performance = {
        name: images[0],
        value: images[1]
    }
    const TTFB = {
        name: images[6],
        value: images[7]
    }
    const FCP = {
        name: images[12],
        value: images[13]
    }
    const LCP = {
        name: images[14],
        value: images[15]
    }
    const CLS = {
        name: images[16],
        value: images[17]
    }
    const SpeedIndex = {
        name: images[18],
        value: images[19]
    }
    const Visual99 = {
        name: images[22],
        value: images[23]
    }
    const firstPaint = {
        name: images[88],
        value: images[91]
    }
    newArr.push(Performance, TTFB, FCP, LCP, CLS, SpeedIndex, Visual99, firstPaint)
    // const arr = []
    // images.map((item) => {
    //     arr.push(item.innerHTML)
    // })
    console.log('newArr:  ', newArr)
    // console.log('images:  ', images)
    //   mkdirSync(`./images`); // 存放目录
    //   for (m of images) {
    //     await downloadImg(m, "./images/" + new Date().getTime() + ".jpg");
    //   }

    //   netbian(++i);//下一页，具体结束页可以自己限制
    // 关闭
    await browser.close();
}
netbian();//这里执行

// 同步创建目录
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false;
}

// 下载文件 保存图片
async function downloadImg(src, path) {
    return new Promise(async function (resolve, reject) {
        let writeStream = fs.createWriteStream(path);
        let readStream = await request(src);
        await readStream.pipe(writeStream);
        readStream.on("end", function () {
            console.log("文件下载成功");
        });
        readStream.on("error", function () {
            console.log("错误信息:" + err);
        });
        writeStream.on("finish", function () {
            console.log("文件写入成功");
            writeStream.end();
            resolve();
        });
    });
}