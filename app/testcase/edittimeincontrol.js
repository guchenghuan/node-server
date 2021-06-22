// 时间切换调整

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
            .waitForSelector('.bilibili-player-video-time')
            .then(async () => {
                try {
                    const playbtn = await page.$('.bilibili-player-video-state');
                    await playbtn.click({
                        delay: 2000
                    });
                    const foo = await page.$('.bilibili-player-video');
                    await foo.click({
                        delay: 1000
                    });
                    const timer = await page.$('.bilibili-player-video-time');
                    await timer.click({
                        delay: 1500
                    })
                    await timer.type('.5', {
                        delay: 1000
                    })
                    await timer.press('Enter', {
                        delay: 1000
                    });

                    const result = await page.evaluate('player.getCurrentTime()');
                    if (result > 1 && result < 7) {
                        const owncase = `
                        获取页面元素 page.$('.bilibili-player-video-state'); 
                        执行 click 事件
                        获取页面元素 page.$('.bilibili-player-video'); 
                        执行 click 事件
                        获取页面元素 page.$('.bilibili-player-video-time'); 
                        执行 click -> type .5 -> Enter 事件
                        断言取值：player.getCurrentTime()
                        ` + '结果为： ' + result
                        console.log(owncase)
                    } else {
                        console.log('实际值与预期值不符，实际值为：', result, ' 请检查原因')
                    }


                    // console.log(result)
                    // if (result) {
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


