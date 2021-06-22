// 更多播放设置-视频比例

const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options()
    .setProfile('C:\\Users\\guchenghuan\\AppData\\Local\\Mozilla\\Firefox\\Profiles')
    .setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe')
    .addArguments('-headless')
let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

(async function () {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        await driver.sleep(5000)
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-iconfont-setting')), 2000);
        const actions = driver.actions({ bridge: true });
        actions.move({ origin: button }).perform();
        await driver.sleep(2000)
        let buttonstart = await driver.wait(until.elementLocated(By.className('bilibili-player-video-btn-setting-left-more')), 5000);
        await buttonstart.click()
        await driver.sleep(2000)
        let buttonlightoff = await driver.wait(until.elementLocated(By.xpath("//span[text()='4:3']")), 5000); // 'Flash播放器'
        actions.move({ origin: buttonlightoff }).click().perform();
        await driver.sleep(2000)
        const results = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            const data1 = sessionStorage.getItem('bilibili_player_settings')
            var data = JSON.parse(data1);
            var result = data.video_status.videosize;
            return result
        })
        if (results === "video-size-4-3") {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-iconfont-setting'); 
            执行 hover 事件
            获取页面元素 page.$('.bilibili-player-video-btn-setting-left-more'); 
            执行 click 事件
            获取页面元素 "//span[text()='Flash播放器']"; 
            执行 move -> click -> perform 事件
            断言取值：sessionStorage.bilibili_player_settings.video_status.videosize
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