// 播放暂停

const puppeteer = require('puppeteer');
var fs = require('fs');

puppeteer.launch(
    {
        headless: false, // 开启界面,
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
).then(async browser => {
    const page = await browser.newPage();
    // console.log(puppeteer.executablePath())
    try {

        // 在解析DOM并准备就绪时发出(无需等待资源)
        // await page.once('domcontentloaded', () => console.info('√ DOM is ready'));

        // // 当页面完全加载时发出
        // await page.once('load', () => console.info('√ Page is loaded'));

        // // 当页面附加一个frame时发出
        // await page.on('frameattached', () => console.info('√ Frame is attached'));

        // // 当页面内的frame导航到新URL时发出
        // await page.on('framenavigated', () => console.info('➞ Frame is navigated'));

        // // 当页面中的脚本使用“console.timeStamp”时发出
        // await page.on('metrics', data => console.info(`➞ Timestamp added at ${data.metrics.Timestamp}`));

        // // 当页面中的脚本使用“console”时发出
        // await page.on('console', message => console[message.type()](`➞ ${message.text()}`));

        // // 当页面发生错误事件时发出(例如，页面崩溃)
        // await page.on('error', error => console.error(`✖ ${error}`));

        // // 当页面中的脚本有未捕获异常时发出
        // await page.on('pageerror', error => console.error(`✖ ${error}`));

        // // 当页面中的脚本使用“alert”、“prompt”、“confirm”或“beforeunload”时发出
        // await page.on('dialog', async dialog => {
        //     console.info(`➞ ${dialog.message()}`);
        //     await dialog.dismiss();
        // });

        // // 当打开属于浏览器环境/上下文的新页面时发出
        // await page.on('popup', () => console.info('➞ New await page is opened'));

        // // 当页面产生请求时发出
        // await page.on('request', request => console.info(`➞ Request: ${request.url()}`));

        // // 当页面生成的请求失败时发出
        // await page.on('requestfailed', request => console.info(`✖ Failed request: ${request.url()}`));

        // // 当页面生成的请求成功完成时发出
        // await page.on('requestfinished', request => console.info(`➞ Finished request: ${request.url()}`));

        // // 当接收到响应时发出
        // await page.on('response', response => console.info(`➞ Response: ${response.url()}`));

        // // 当页面创建专用的网络工作者时发出
        // await page.on('workercreated', worker => console.info(`➞ Worker: ${worker.url()}`));

        // // 当页面销毁专用的网络工作者时发出
        // await page.on('workerdestroyed', worker => console.info(`➞ Destroyed worker: ${worker.url()}`));

        // // 当页面分离frame时发出
        // await page.on('framedetached', () => console.info('√ Frame is detached'));

        // // 关闭页面后发出
        // await page.once('close', () => console.info('√ Page is closed'));

        // await page.goto('http://172.16.39.188:9527/#/webquality/webquailtyinfo');

        // await page
        //     .waitForSelector('.loginbtn')
        //     .then(async () => {
        //         const timer = await page.$('.loginbtn');
        //         await timer.click({
        //             delay: 1500
        //         });
        //     });


        // await page
        //     .waitForSelector('.app-wrapper')
        //     .then(async () => {
        //         try {
        //             // console.log("newfilepath.. ", newfilepath);
        //             // console.log("进来了.. ", newfilepath);
        //             // await page.evaluate(`document.querySelector('.comment-list').scrollIntoView();`);  // window.window.scrollTo(100,20000);
        //             await page.evaluate(`window.window.scrollTo(100,20000)`, {
        //                 delay: 20000
        //             });
        //             await page.screenshot({ path: 'D:/bilibili/imt-server/blink-diff_img/' + 'Screenshots22.png', fullPage: true }, {
        //                 delay: 5000
        //             });
        //         } catch (e) {
        //             console.log('执行失败 error: ', e)
        //             res(e)
        //         }
        // });
        await page.goto('https://www.bilibili.com/video/BV1154y1m7j1');
        // await delay(4000);
        // await page.evaluate(`window.window.scrollTo(100,2000)`);
        // await delay(4000);
        // await page.screenshot({ path: './Screenshots.png', fullPage: true });
        // document.body.clientWidth
        // document.body.clientHeight
        // await delay(5000);
        await page.evaluate(`javascript: (function() {
            function callback() {
                gremlins.createHorde({
                    species: [gremlins.species.clicker(),gremlins.species.toucher(),gremlins.species.formFiller(),gremlins.species.scroller(),gremlins.species.typer()],
                    mogwais: [gremlins.mogwais.alert(),gremlins.mogwais.fps(),gremlins.mogwais.gizmo()],
                    strategies: [gremlins.strategies.distribution(),gremlins.strategies.allTogether(),gremlins.strategies.bySpecies()]
                }).unleash();
            }
            var s = document.createElement("script");
            s.src = "https://unpkg.com/gremlins.js";
            if (s.addEventListener) {
                s.addEventListener("load", callback, false);
            } else if (s.readyState) {
                s.onreadystatechange = callback;
            }
            document.body.appendChild(s);
            })()`);
        // await delay(5000);
        // const playtype = await page.$('#app');
        // let box = await playtype.boundingBox();
        // console.log(box)
        // await delay(5000);
        // await page.screenshot({ path: './Screenshots.png', clip: { x: 0, y: -500, width: 1903, height: 2000 } });

        // await page.evaluate(`window.window.scrollTo(100,2000)`);
        // await delay(4000);
        // const html = await page.$eval('#app', e => e.outerHTML);
        // fs.appendFile('./testhtml1.txt', html, 'utf8', function (err, ret) {
        //     if (err) {
        //         throw err
        //     }
        //     console.log('success')
        // })
        // const din = require('./testtojson')
        // const source = html
        // const htmljson = din.toJSON(source, { skipScript: true, pureComment: true })
        // console.log(htmljson)

        // fs.appendFile('./testfilestringify.json', JSON.stringify(htmljson[0], null, 4), 'utf8', function (err, ret) {
        //     if (err) {
        //         throw err
        //     }
        //     console.log('success')
        // })

        // await page
        //     .waitForSelector('.bilibili-player-iconfont-pip-on')
        //     .then(async () => {
        //         const timer = await page.$('.bilibili-player-iconfont-pip-on');
        //         await timer.click({
        //             delay: 1500
        //         });
        //     });

        // const result = await page.evaluate(`
        //     const data1 = localStorage.getItem('bilibili_player_settings');
        //     var data = JSON.parse(data1);
        //     data.video_status.autoplay;
        // `);

        // const owncase = `
        //         获取页面元素 page.$('.bilibili-player-iconfont-pip-on');
        //         执行 click 事件
        //         断言：localStorage.bilibili_player_settings.video_status.autoplay
        // ` + '结果为： ' + result
        // console.log(owncase)

        // console.log(result)
        // if (result) {
        //     console.log('success')
        // }
        await delay(5000);
        await browser.close();

    } catch (error) {
        console.log(error, '----------请求页面超时，尝试重新连接');
    }

});

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

