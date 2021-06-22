// 弹幕设置 字体大小

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
            .waitForSelector('.bilibili-player-video-danmaku-setting')
            .then(async () => {
                try {
                    const setting = await page.$('.bilibili-player-video-danmaku-setting');
                    await setting.hover({
                        delay: 1500
                    })
                } catch (e) {
                    console.log('执行失败 error: ', e)
                }
            });


        await page
            .waitForSelector('.bilibili-player-video-danmaku-setting-left-fontsize')
            .then(async () => {
                try {
                    const playtype = await page.$('.bilibili-player-video-danmaku-setting-left-fontsize');
                    let box = await playtype.boundingBox();
                    // console.log(box)
                    const x = box.x + (box.width / 2);
                    // console.log(x)  // 295
                    const y = box.y + (box.height / 2);
                    // console.log(y)  // 255
                    await page.mouse.click(x, y, {
                        delay: 1500
                    });


                    const result = await page.evaluate(`
        const data1 = localStorage.getItem('bilibili_player_settings');
        var data = JSON.parse(data1);
        data.setting_config.fontsize;
    `);

                    if (result === 0.826) {
                        const owncase = `
        获取页面元素 page.$('.bilibili-player-video-danmaku-setting'); 
        执行 hover 事件
        获取页面元素 page.$('.bilibili-player-video-danmaku-setting-left-block-content'); 
        进行 boundingBox 块级元素坐标获取
        执行 mouse.click(x, y) 事件 
        断言取值：localStorage.bilibili_player_settings.setting_config.fontsize;
        ` + '结果为： ' + result
                        console.log(owncase)
                    } else {
                        console.log('实际值与预期值不符，实际值为：', result, ' 请检查原因')
                    }

                    // console.log(result)
                    // if (result > 0.5) {
                    //     console.log('success')
                    // }
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


