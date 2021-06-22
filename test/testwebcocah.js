const api = require('webcoach');

// const options = {
//     screenshot: 'test.png'
// }
// start coach 
const asyncusewebcoach = async (url) => {
    console.log('start coach: ', api)
    const result = api.run(url);
    return result;

};

// reslove requests
const getneedfile = async () => {
    try {

        const prewebcoach = await asyncusewebcoach('https://www.bilibili.com/video/BV1oV411673W')

        // console.log('performance:  ', prewebcoach.advice.performance)
        // console.log('privacy:  ', prewebcoach.advice.privacy)
        // console.log('timings:  ', prewebcoach.advice.timings)
        // console.log('userTimings::  ', prewebcoach.advice.timings.userTimings)
    } catch (e) {
        console.log(e + '//////////')
    }
};

getneedfile()

// firstPaint: 1067,   网页的第一个像素渲染到屏幕上所用的时间；
//   fullyLoaded: 6770.805000094697,
//   navigationTimings: {
//     connectEnd: 253,    网络链接建立的时间节点
//     connectStart: 88,   请求连接被发送到网络之时的Unix毫秒时间戳
//     domComplete: 1642,   主文档的解析器结束工作，相当于 readystatechange 事件被触发时的 Unix毫秒时间戳。
//     domContentLoadedEventEnd: 1156,  这个时刻为所有需要尽早执行的脚本不管是否按顺序，都已经执行完毕。（译注：即DOM Ready）
//     domContentLoadedEventStart: 1156,  为解析器发出 DOMContentLoaded 事件之前，即所有的需要被运行的脚本已经被解析之时的 Unix毫秒时间戳。
//     domInteractive: 1155,   这个属性被用于测量用户感受的加载网页的速度  在主文档的解析器结束工作，即 Document.readyState 改变为 'interactive' 并且相当于 readystatechange 事件被触发之时的 Unix毫秒时间戳。
//     domLoading: 398,    为解析器开始工作，即 Document.readyState 改变为 'loading' 并且 readystatechange 事件被触发之时的 Unix毫秒时间戳。
//     domainLookupEnd: 88,   解析域名结束时的 Unix毫秒时间戳
//     domainLookupStart: 68,  域名开始解析之时的 Unix毫秒时间戳
//     fetchStart: 2,    浏览器已经准备好去使用HTTP请求抓取文档之时的 Unix毫秒时间戳。这一时刻在检查应用的缓存之前。
//     loadEventEnd: 1642,     为 load 事件处理程序被终止，加载事件已经完成之时的 Unix毫秒时间戳
//     loadEventStart: 1642,    为 load 事件被现在的文档触发之时的 Unix时间戳
//     navigationStart: 0,    为紧接着在相同的浏览环境下卸载前一个文档结束之时的 Unix毫秒时间戳
//     requestStart: 253,    浏览器发送从服务器或者缓存获取实际文档的请求之时的 Unix毫秒时间戳
//     responseEnd: 420,     浏览器从服务器、缓存或者本地资源接收响应的最后一个字节或者连接被关闭之时的 Unix毫秒时间戳
//     responseStart: 394,   浏览器从服务器、缓存或者本地资源接收到响应的第一个字节之时的 Unix毫秒时间戳
//     secureConnectionStart: 100    安全连接握手开始的时刻的 Unix毫秒时间戳
//   },
//   rumSpeedIndex: 2891,
//   timings: {
//     backEndTime: 394,     t.responseStart - t.navigationStart
//     domContentLoadedTime: 1156, t.domContentLoadedEventStart - t.navigationStart,
//     domInteractiveTime: 1155,  t.domInteractive - t.navigationStart,
//     domainLookupTime: 20,    t.domainLookupEnd - t.domainLookupStart,
//     frontEndTime: 1222,  t.loadEventStart - t.responseEnd,
//     pageDownloadTime: 26,  t.responseEnd - t.responseStart,
//     pageLoadTime: 1642,   t.loadEventStart - t.navigationStart,
//     redirectionTime: 2,  t.fetchStart - t.navigationStart,
//     serverConnectionTime: 165,  t.connectEnd - t.connectStart,
//     serverResponseTime: 167    t.responseEnd - t.requestStart,


// ---------------------------------------------------//

// domainLookupTime: t.domainLookupEnd - t.domainLookupStart,
//     redirectionTime: t.fetchStart - t.navigationStart,
//     serverConnectionTime: t.connectEnd - t.connectStart,
//     serverResponseTime: t.responseEnd - t.requestStart,
//     pageDownloadTime: t.responseEnd - t.responseStart,
//     domInteractiveTime: t.domInteractive - t.navigationStart,
//     domContentLoadedTime: t.domContentLoadedEventStart - t.navigationStart,
//     pageLoadTime: t.loadEventStart - t.navigationStart,
//     frontEndTime: t.loadEventStart - t.responseEnd,
//     backEndTime: t.responseStart - t.navigationStart
//   }
var