const puppeteer = require('puppeteer');

puppeteer.launch(
    {
        headless: false, // 开启界面,
        timeout: 30 * 1000,
        devtools: true,  // 开启开发者控制台  
        //设置每个步骤放慢200毫秒
        slowMo: 200,
        //设置打开页面在浏览器中的宽高
        defaultViewport: null,
        args: ['--start-maximized'],
        ignoreDefaultArgs: ['--enable-automation'],
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // userDataDir: `C:/Users/guchenghuan/AppData/Local/Google/Chrome/UserData/Profile1`,
        // executablePath: '--user-data-dir=C:/Users/guchenghuan/AppData/Local/Google/Chrome/User Data/Profile 1',
    }
).then(async browser => {
    const page = await browser.newPage();
    // console.log(puppeteer.executablePath())
    try {
        // 设置 浏览器视窗
        await page.setViewport({
            width: 1920,
            height: 960,
        });
        await page.goto('https://www.bilibili.com/video/BV1154y1m7j1');
        const foo = await page.$('.bilibili-player-video');
        await foo.click({
            delay: 3000
        });
        await foo.click({
            delay: 3000
        });
        const result = await page.evaluate('player.getCurrentTime()');
        console.log(result)
        if (result > 3 && result < 4) {
            console.log('success')
        }

        // await page.waitFor('.bilibili-player-video-danmaku-root');//等待滑块元素加载出来  bilibili-player-video-danmaku-root
        // const element = await page.$('.bar1>div:nth-child(2)');//得到元素
        // const size = await element.boundingBox();//使用boundingBox函数得到元素的尺寸信息
        // await page.mouse.move(size.x, size.y);//移动到滑块的的位置上方
        // await page.mouse.down();//按下鼠标
        // await page.mouse.move(1000, size.y, {steps:1000});//向右移动滑块，y坐标不变，x坐标取值1000
        // await page.mouse.up();//松开鼠标
        // //等待3秒，退出浏览器
        // await page.waitFor(3000);
        await browser.close({
            delay: 3000
        });

        // await page.screenshot({ path: 'D:/bilibili/imt-server/uploads/screenshot.png' });
        // await browser.close();

    } catch (error) {
        console.log('请求页面超时，尝试重新连接');
    }

});


