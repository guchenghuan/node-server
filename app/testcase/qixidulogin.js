// 清晰度切换

const puppeteer = require('puppeteer');

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
).then(async browser => {
    const page = await browser.newPage();
    // console.log(puppeteer.executablePath())
    try {
        // 设置 浏览器视窗
        // await page.setViewport({
        //     width: 1920,
        //     height: 960,
        // });
        await page.goto('https://www.bilibili.com/video/BV1154y1m7j1');

        await page
            .waitForSelector('.bilibili-player-video-btn-quality')
            .then(async () => {
                try {
                    const timer = await page.$('.bilibili-player-video-btn-quality');
                    await timer.hover({
                        delay: 1500
                    })
                } catch (e) {
                    console.log('执行失败 error: ', e)
                }
            });

        await page
            .waitForSelector('.bui-select-list')
            .then(async () => {
                try {
                    const timer = await page.$('.bui-select-list');
                    let box = await timer.boundingBox();
                    const x = box.x// + (box.width / 3);
                    const y = box.y + (box.height / 2) - 20;
                    await page.mouse.click(x, y, {
                        delay: 1500
                    });
                } catch (e) {
                    console.log('执行失败 error: ', e)
                }
            });

        await page
            .waitForSelector('.bili-mini')
            .then(async () => {
                try {
                    const timer = await page.$('.bili-mini');
                    if (timer) {
                        const owncase = `
                    获取页面元素 page.$('.bilibili-player-video-btn-quality'); 
                    执行 hover 事件
                    获取页面元素 page.$('.bui-select-list'); 
                    进行 boundingBox 块级元素坐标获取
                    执行 mouse.click(x, y) 事件 
                    waitfor login iframe 
                    断言取值：document.querySelector('.bili-mini')
                    ` + '结果为： true'
                        console.log(owncase)
                    } else {
                        console.log('实际值与预期值不符，登录框未弹出...')
                    }

                } catch (e) {
                    console.log('执行失败 error: ', e)
                }
            });
        await browser.close({
            delay: 3000
        });

        // await page.screenshot({ path: 'D:/bilibili/imt-server/uploads/screenshot.png' });
        // await browser.close();

    } catch (error) {
        console.log('error: ', error);
    }

});


