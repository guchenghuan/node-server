
const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options()
    .setProfile('C:\\Users\\guchenghuan\\AppData\\Local\\Mozilla\\Firefox\\Profiles')
    .setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe')
// .addArguments('-headless')
let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

(async function run() {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        // await driver.sleep(2000)
        // 获取播放按钮
        let buttonstart = await driver.wait(until.elementLocated(By.className('bilibili-player-iconfont-start')), 2000);
        // 开始播放
        await buttonstart.click()
        // 播放进行两秒
        await driver.sleep(2000)
        // 再次获取播放内部暂停按钮
        let buttonstop = await driver.wait(until.elementLocated(By.className('bilibili-player-video-wrap')), 2000);
        // 暂停播放
        await buttonstop.click()
        // 等待一秒
        await driver.sleep(1000)
        // 获取当前播放时长
        const results = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            var result = window.player.getCurrentTime()
            return result
        })
        // 若时长大于2秒，则可继续
        if (results > 3) {
            var videoplaysuc = '视频播放执行成功'
        } else {
            // 播放功能执行失败，break
            var videoplayerror = '视频播放未能执行'
        }
        // 获取时间input元素
        let buttontimer = await driver.wait(until.elementLocated(By.className('bilibili-player-video-time')), 2000);
        // 点击输入
        const actions = driver.actions({ bridge: true });
        await driver.sleep(2000)
        await actions.click(buttontimer).sendKeys(Key.LEFT).sendKeys('4.').sendKeys(Key.ENTER).perform();
        // 暂停播放
        await driver.sleep(500)
        await buttonstop.click()
        // 获取当前播放时长
        const resulttime = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            var result = window.player.getCurrentTime()
            return result
        })
        if (resulttime > 3) {
            var videotimesuc = '视频播放time设置成功'
        } else {
            var videotimeerror = '视频播放time设置失败'
        }
        // 对清晰度进行操作 不换醒登录框
        let buttonqixidu = await driver.wait(until.elementLocated(By.className('bilibili-player-video-btn-quality')), 2000);
        actions.move({ origin: buttonqixidu }).perform();
        await driver.sleep(2000)
        const list = await driver.findElements({ className: 'bui-select-item' })
        await list[3].click()
        await driver.sleep(1000)
        const resultqixidu = await driver.executeScript(function () {
            //获取当前清晰度值
            const data1 = localStorage.getItem('bilibili_player_settings');
            var data = JSON.parse(data1);
            var result = data.setting_config.defquality;
            return result
        })
        console.log(resultqixidu)
        if (resultqixidu === 32) {
            var videodefqualitysuc = '视频清晰度切换成功'
        } else {
            var videodefqualityerror = '视频清晰度切换失败'
        }
    } catch (e) {
        console.log(e)
    }
})()

        // await driver.sleep(2000)
        // await driver.quit()