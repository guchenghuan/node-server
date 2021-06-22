// 时间切换调整
const { Builder, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const edgedriver = require('msedgedriver');   //If this driver is already on your system, then no need to install using npm.

(async function () {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        let options = new edge.Options()
            .addArguments('-headless')
        let service = await new edge.ServiceBuilder(edgedriver.path);
        let driver = await new Builder()
            .forBrowser('MicrosoftEdge')
            .setEdgeOptions(options)
            .setEdgeService(service).build();

        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        await driver.sleep(5000)
        // 获取播放按钮
        let buttonstart = await driver.wait(until.elementLocated(By.className('bilibili-player-iconfont-start')), 5000);
        // console.log('buttonstart-click')
        // 开始播放
        await buttonstart.click()
        // 播放进行两秒
        await driver.sleep(2000)
        // 再次获取播放内部暂停按钮
        let buttonstop = await driver.wait(until.elementLocated(By.className('bilibili-player-video-wrap')), 5000);
        // console.log('buttonstop-click')
        // 暂停播放
        await buttonstop.click()
        let buttontimer = await driver.wait(until.elementLocated(By.className('bilibili-player-video-time')), 5000);
        // 点击输入
        const actions = driver.actions({ bridge: true });
        await driver.sleep(2000)
        await actions.click(buttontimer).sendKeys(Key.LEFT).sendKeys('4.').sendKeys(Key.ENTER).perform();
        // 暂停播放
        await driver.sleep(1000)
        await buttonstop.click()
        await driver.sleep(2000)
        // 获取当前播放时长
        const results = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            var result = window.player.getCurrentTime()
            return result
        })
        if (results > 1 && results < 7) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-video-state'); 
            执行 click 事件
            获取页面元素 page.$('.bilibili-player-video'); 
            执行 click 事件
            断言取值：player.getCurrentTime()
            ` + '结果为： ' + results
            console.log(owncase)
        } else {
            console.log('实际值与预期值不符，实际值为：', results, ' 请检查原因')
        }
        await driver.sleep(1000)
        await driver.quit();
    } catch (e) {
        await driver.quit();
        console.log('执行失败 error: ', e)
    }
})()