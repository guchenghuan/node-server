const puppeteer = require('puppeteer'),
    BlinkDiff = require('blink-diff'),
    imgUrl = "./../blink-diff_img/";

var fs = require('fs');
// const formatDate = require("./app/utils/formatDate");
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
).then(
    async browser => {
        const page = await browser.newPage();
        try {
            // 设置 浏览器视窗
            await page.setViewport({
                width: 1920,
                height: 945,
            });
            await page.goto('https://www.bilibili.com/video/BV1zz4y1D7Zn/');
            await page
                .waitForSelector('.comment-list')
                .then(async () => {
                    try {
                        // await page.evaluate(`document.querySelector('.comment-list').scrollIntoView();`);  // window.window.scrollTo(100,20000);
                        await page.evaluate(`window.window.scrollTo(100,20000)`, {
                            delay: 3000
                        });
                        await page.screenshot({ path: imgUrl + 'Screenshots.png', fullPage: true });
                        const diff = new BlinkDiff({
                            imageAPath: imgUrl + 'example.png', // 设计图
                            imageBPath: imgUrl + 'Screenshots.png',//页面截图
                            threshold: 0.02, // 1% threshold
                            imageOutputPath: imgUrl + 'Diff.png'//Diff路径
                        });

                        diff.run(function (error, result) {
                            if (error) {
                                throw error;
                            } else {
                                // console.log('diff: ', diff);
                                // console.log(diff.hasPassed(result.code));
                                console.log(diff.hasPassed(result.code) ? '通过' : '失败');
                                // console.log('result: ', result);
                                console.log('总像素:' + result.dimension);
                                console.log('发现:' + result.differences + ' 差异.');
                            }
                        });
                        // // resolve img
                        // var filepath = './blink-diff_img/Screenshots.png';
                        // var bData = fs.readFileSync(filepath);
                        // var base64Str = bData.toString('base64');
                        // var datauri = 'data:image/png;base64,' + base64Str;
                        // // console.log(datauri);

                        await browser.close({
                            delay: 3000
                        });
                    } catch (e) {
                        console.log('执行失败 error: ', e)
                    }
                });
        } catch (e) {
            // return e
            console.log('out-error: ', e);
        }

    }
);
