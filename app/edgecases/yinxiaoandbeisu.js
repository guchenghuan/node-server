// 右键-音效调节 2级 选择音效 + 倍速
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
        let buttonspeed = await driver.wait(until.elementLocated(By.className('bilibili-player-video-btn-speed-name')), 5000);
        const actions = driver.actions({ bridge: true });
        actions.move({ origin: buttonspeed }).perform();
        await driver.sleep(1000)
        const listspeed = await driver.findElements({ className: 'bilibili-player-video-btn-speed-menu-list' })
        await listspeed[2].click()
        await driver.sleep(1000)
        // const actions = driver.actions({ bridge: true });
        await driver.sleep(1000)
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-video-top')), 2000);
        actions.contextClick(button).perform();
        await driver.sleep(1000)
        const list = await driver.findElements({ className: 'context-line' })
        await list[1].click()
        let buttonsecai1 = await driver.findElements({ className: 'bl-audio-panel-preset-btn' })
        await buttonsecai1[4].click()
        await driver.sleep(1000)
        const results = await driver.executeScript(function () {
            var result = window.player.getPlayerState().videoInfo
            return result
        })
        if (results !== 0) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-context-menu-origin'); 
            执行 hover 事件
            获取页面元素 page.$('.bl-audio-panel-left'); 
            执行 click 事件
            断言取值：player.getPlayerState().audioEffect.gain
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