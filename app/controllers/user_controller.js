/*
 * IMT project
 */

const config = require("./../../config");
const passport = require("./../utils/passport");
const User_col = require("./../models/user");
const uuidv1 = require("uuid/v1");
const pagexray = require("pagexray");
const api = require('webcoach');
const { run } = require('sitespeed.io');
const coach = require('coach-core');
const fss = require('fs-extra');
var exec = require("child_process").exec;
var nodeCmd = require("node-cmd");
const path = require("path");
const fs = require("fs");
const { promise } = require("selenium-webdriver");
const { resolve } = require("path");
const formatDate = require("./../utils/formatDate");
var MongoClient = require('mongodb').MongoClient;


// 读取文件
// const readFile = async (fileName) => {
//   return new Promise(function (resolve, reject) {
//     fs.readFile(fileName, function (error, data) {
//       if (error) return reject(error);
//       resolve(data);
//     });
//   });
// };

// const asyncReadFile = async () => {
//   // const dir = await asynccmd(url);
//   const f1 = await readFile('D:\\bilibili\\imt-server\\browsertime.har');
//   return f1.toString().replace(/\n/g, "");
// };

// reslove pagexray data
const pagexraydata = async (lastData) => {
  const pages = pagexray.convert(lastData, { includeAssets: true });
  // pagexray.convert(har, {includeAssets: true})
  return pages;
};

// resolve data for pagexrayasserts
const pagexrayeachdata = async (pagexraydatas) => {
  const arr = []
  const newarr = []
  const Larr = []
  pagexraydatas.forEach(item => {
    const assets = item.assets.sort(compare('transferSize'))
    const Ldata = assets.slice(0, 19);
    arr.push(Ldata)
  })
  arr.forEach(item => {
    item.forEach(k => {
      let shortUrl = k.url.replace(/\?.*/, "");
      url = shortUrl.substr(8, 20) + "..." + shortUrl.substr(-17);
      let consize
      let transize
      consize = (k.contentSize / 1024).toFixed(2)
      transize = (k.transferSize / 1024).toFixed(2)
      consize < 1024 ? consize = consize + ' kb' : consize = (consize / 1024).toFixed(2) + ' m',
        transize < 1024 ? transize = transize + ' kb' : transize = (transize / 1024).toFixed(2) + ' m'
      const obj = {
        url: url,
        consize: consize,
        transize: transize,
        type: k.type
      }
      newarr.push(obj)
    })
    Larr.push(newarr)
  })
  return Larr;
};

// domainData
const asyncuseDomain = async (lastData) => {
  var arr = [];
  lastData.log.entries.forEach((item) => {
    if (item.request.url && item.pageref === "page_1") {
      var url = item.request.url;
      var domain = url.split("/"); //以“/”进行分割
      var domainurl;
      if (domain[2]) {
        domainurl = domain[2];
      } else {
        domainurl = ""; //如果url不正确就取空
      }
    } else {
      return;
    }
    const obj = {
      domain: domainurl,
      blocked: item.timings.blocked,
      dns: item.timings.dns,
      connect: item.timings.connect,
      send: item.timings.send,
      wait: item.timings.wait,
      receive: item.timings.receive,
      ssl: item.timings.ssl,
      _queued: item.timings._queued,
      Totaltime: item.time,
      pageref: item.pageref,
    };
    arr.push(obj);
  });
  return arr;
};

// domaineach
const asyncusedomaineach = async (Deachdata) => {
  var domainobj = {};
  // var domainNum = 0
  var domainList = [];
  Deachdata.forEach((item) => {
    var dome = item.domain;
    if (domainobj.hasOwnProperty(dome)) {
      domainobj[dome].push(item);
    } else {
      domainobj[dome] = [];
      domainobj[dome].push(item);
    }
  });
  for (var i in domainobj) {
    var domain = domainobj[i].sort(compare("blocked"))[0].domain;
    var blocked = domainobj[i].sort(compare("blocked"))[0].blocked;
    var dns = domainobj[i].sort(compare("dns"))[0].dns;
    var connect = domainobj[i].sort(compare("connect"))[0].connect;
    var send = domainobj[i].sort(compare("send"))[0].send;
    var wait = domainobj[i].sort(compare("wait"))[0].wait;
    var ssl = domainobj[i].sort(compare("ssl"))[0].ssl;
    var receive = domainobj[i].sort(compare("receive"))[0].receive;
    var Totaltime = domainobj[i].sort(compare("Totaltime"))[0].Totaltime;
    var Requests = domainobj[i].length;
    const obj = {
      domain: domain,
      blocked: blocked,
      dns: dns,
      connect: connect,
      send: send,
      wait: wait,
      ssl: ssl,
      receive: receive,
      Totaltime: Totaltime,
      Requests: Requests,
    };
    domainList.push(obj);
    // domainNum++;
  }
  // domainobj['domainNums'] = domainNum
  return domainList;
};

// 比较函数
function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  };
}

// 处理Toplist
const asyncuseToplist = async (lastData) => { // 2次处理 非直接调用，取到返回处执行
  const Toplistarr = [];
  lastData.log.entries.forEach((item) => {
    if (
      item.request.url &&
      item.pageref === "page_1" &&
      item.request.url.length > 40
    ) {
      let shortUrl = item.request.url.replace(/\?.*/, "");
      url = shortUrl.substr(8, 20) + "..." + shortUrl.substr(-17);
      var Type = item.response.content.mimeType;
      var types = Type.split("/"); //以“/”进行分割
      var stype;
      if (types[1]) {
        var typesJs = types[1].split("-"); //以“/”进行分割
        if (typesJs[1]) {
          stype = typesJs[1];
        } else {
          stype = types[1];
        }
      } else {
        stype = ""; //如果url不正确就取空
      }
      var endtime, time, date;
      const newobj = { time: 0, date: "" };
      const arr = item.response.headers;
      arr.forEach((ele) => {
        if (ele.name.toLowerCase() === "last-modified") {
          date = ele.value || "";
          newobj["date"] = formatDate(new Date());
        }
        if (ele.name.toLowerCase() === "x-swift-cachetime") {
          time = ele.value || 0;
          switch (true) {
            case time > 86400 && time <= 2590000:
              endtime = (time / 1440).toFixed(2) + " days";
              break;
            case time >= 3600 && time < 86400:
              endtime = (time / 3600).toFixed(2) + " hours";
              break;
            case time < 3600:
              endtime = (time / 60).toFixed(2) + " seconds" || 0;
              break;
            default:
              endtime = "> 1 month";
              break;
          }
          // newobj["date"] = '';
          newobj["time"] = endtime;
        }
      });
      newobj["url"] = url;
      newobj["size"] = (item.response.content.size / 1024).toFixed(2);
      newobj["transfer"] = (item.response.bodySize / 1024).toFixed(2);
      newobj["pageref"] = item.pageref;
      newobj["mimeType"] = stype;
      newobj["timing"] = item.time.toFixed(2);
      Toplistarr.push(newobj);
    }
  });
  return Toplistarr;
};

// Toplisteach
const asyncuseToplisteach = async (Toplistdata) => {
  var Toplistobj = {};
  // var domainNum = 0
  Toplistdata.forEach((item) => {
    var dome = item.mimeType;
    if (Toplistobj.hasOwnProperty(dome)) {
      Toplistobj[dome].push(item);
    } else {
      Toplistobj[dome] = [];
      Toplistobj[dome].push(item);
    }
  });
  Toplistobj["img"] = Toplistobj["png"].concat(
    Toplistobj["webp"],
    Toplistobj["jpeg"],
    Toplistobj["jpeg"]
  );

  const arr = ["gif", "png", "webp", "jpeg"];
  arr.forEach((item) => {
    delete Toplistobj[item];
  });

  for (var i in Toplistobj) {
    Toplistobj[i].sort(compare("transfer"));
  }
  // Toplistobj['domainNums'] = domainNum
  return Toplistobj;
};

// get first 15 data
const asyncuseToplistpredata = async (Toplistdata) => {
  if (Toplistdata.length > 20) {
    const Fdata = Toplistdata.sort(compare("timing"));
    const Ldata = Fdata.slice(0, 17);
    return Ldata;
  } else {
    const Fdata = Toplistdata.sort(compare("timing"));
    return Fdata;
  }
};

// Asserts sort
const asyncuseAssertspredata = async (newAssertsdata) => {
  if (newAssertsdata.length > 35) {
    const Fdata = newAssertsdata.sort(compare("size"));
    const Ldata = Fdata.slice(0, 29);
    return Ldata;
  } else {
    const Fdata = newAssertsdata.sort(compare("size"));
    return Fdata;
  }
};

// reslove Asserts
const asyncuseAsserts = async (Assertsdatas) => { // 三次处理
  var Assertsobj = {};
  // var domainNum = 0
  const AssertsList = [];
  Assertsdatas.forEach((item) => {
    var dome = item.url;
    if (Assertsobj.hasOwnProperty(dome)) {
      Assertsobj[dome].push(item);
    } else {
      Assertsobj[dome] = [];
      Assertsobj[dome].push(item);
    }
  });
  for (var i in Assertsobj) {
    var url = Assertsobj[i].sort(compare("size"))[0].url;
    var size = Assertsobj[i].sort(compare("size"))[0].size;
    var mimeType = Assertsobj[i].sort(compare("size"))[0].mimeType;
    var date = Assertsobj[i].sort(compare("size"))[0].date;
    var time = Assertsobj[i].sort(compare("size"))[0].time;
    var Requests = Assertsobj[i].length;
    const obj = {
      url: url,
      size: size,
      mimeType: mimeType,
      date: date,
      Requests: Requests,
      time: time,
    };
    AssertsList.push(obj);
  }
  return AssertsList;
};

// Asserts data
const asyncuseAssertsData = async (lastData) => { // 2次处理
  const Assertsdataarr = [];
  lastData.log.entries.forEach((item) => {
    if (item.request.url && item.request.url.length > 40) {
      let shortUrl = item.request.url.replace(/\?.*/, "");
      url = shortUrl.substr(8, 20) + "..." + shortUrl.substr(-17);
      var Type = item.response.content.mimeType;
      var types = Type.split("/"); //以“/”进行分割
      var stype;
      if (types[1]) {
        var typesJs = types[1].split("-"); //以“/”进行分割
        if (typesJs[1]) {
          stype = typesJs[1];
        } else {
          stype = types[1];
        }
      } else {
        stype = ""; //如果url不正确就取空
      }
      var endtime, time, date;
      const newobj = { time: 0, date: "" };
      const arr = item.response.headers;
      arr.forEach((ele) => {
        if (ele.name.toLowerCase() === "last-modified") {
          date = ele.value || "";
          newobj["date"] = formatDate(new Date());
        }
        if (ele.name.toLowerCase() === "x-swift-cachetime") {
          time = ele.value || 0;
          switch (true) {
            case time > 86400 && time <= 2590000:
              endtime = (time / 1440).toFixed(2) + " days";
              break;
            case time >= 3600 && time < 86400:
              endtime = (time / 3600).toFixed(2) + " hours";
              break;
            case time < 3600:
              endtime = (time / 60).toFixed(2) + " seconds" || 0;
              break;
            default:
              endtime = "> 1 month";
              break;
          }
          // newobj["date"] = '';
          newobj["time"] = endtime;
        }
      });
      newobj["url"] = url;
      newobj["size"] = (item.response.content.size / 1024).toFixed(2);
      newobj["pageref"] = item.pageref;
      newobj["mimeType"] = stype;
      Assertsdataarr.push(newobj);
    }
  });
  return Assertsdataarr;
};

// resolve pagesdata
const asyncusepagesdata = async (pagexraydatas) => {
  const pagesarr = [];
  if (pagexraydatas) {
    var url = pagexraydatas[0].url;
    var Fchange = pagexraydatas[0].visualMetrics.FirstVisualChange;
    var Lchange = pagexraydatas[0].visualMetrics.LastVisualChange;
    var jsSize = (pagexraydatas[0].contentTypes.javascript.transferSize / 1024).toFixed(
      2
    );
    var cssSize = (pagexraydatas[0].contentTypes.css.transferSize / 1024).toFixed(2);
    var imgSize = (pagexraydatas[0].contentTypes.image.transferSize / 1024).toFixed(2);
    var totalrequests = pagexraydatas[0].requests;
    var thirdrequests = pagexraydatas[0].thirdParty.requests;
    var totalSize = (pagexraydatas[0].transferSize / 1024).toFixed(2);

    const newobj = {
      url: url,
      Fchange: Fchange,
      Lchange: Lchange,
      totalSize: totalSize,
      totalrequests: totalrequests,
      thirdrequests: thirdrequests,
      jsSize: jsSize,
      cssSize: cssSize,
      imgSize: imgSize,
    };
    pagesarr.push(newobj);
  }
  return pagesarr;
};

// get coach Scores
const asyncusewebcoach = async (url) => {
  // console.log(run)
  // var options = fss.readJsonSync("D:\\allroot\\daike-server\\app\\controllers\\options.json");
  // throttle.start({ up: 768, down: 1600, rtt: 150 }).then(() => {
  console.log('start coach')
  const result = api.run(url);
  return result;
  // })

};

// get infoData
const asyncinfoData = async (pagexraydatas, prewebcoach) => {
  var accessibilityscore
  var bestpracticescore
  var performancescore
  var privacyscore
  var firstPaint
  var fullyLoaded
  var pageLoadTime
  var rumSpeedIndex
  var score
  var Fchange
  var Lchange
  var jsSize
  var cssSize
  var imgSize
  var jsconSize
  var cssconSize
  var imgconSize
  var totalrequests
  var thirdrequests
  var thirdsize
  var jsrequests
  var imgrequests
  var cssrequests
  var totalSize
  if (prewebcoach && prewebcoach.advice) {
    accessibilityscore = prewebcoach.advice.accessibility.score
    bestpracticescore = prewebcoach.advice.bestpractice.score
    performancescore = prewebcoach.advice.performance.score
    privacyscore = prewebcoach.advice.privacy.score
    score = prewebcoach.advice.score
    firstPaint = prewebcoach.advice.timings.firstPaint >= 1000 ? (prewebcoach.advice.timings.firstPaint / 1000).toFixed(2) + 's' : prewebcoach.advice.timings.firstPaint + 'ms'
    rumSpeedIndex = prewebcoach.advice.timings.rumSpeedIndex >= 1000 ? (prewebcoach.advice.timings.rumSpeedIndex / 1000).toFixed(2) + 's' : prewebcoach.advice.timings.rumSpeedIndex + 'ms'
    pageLoadTime = prewebcoach.advice.timings.timings.pageLoadTime >= 1000 ? (prewebcoach.advice.timings.timings.pageLoadTime / 1000).toFixed(2) + 's' : prewebcoach.advice.timings.timings.pageLoadTime + 'ms'
  }

  if (pagexraydatas) {
    fullyLoaded = pagexraydatas[0].fullyLoaded >= 1000 ? (pagexraydatas[0].fullyLoaded / 1000).toFixed(2) + 's' : pagexraydatas[0].fullyLoaded + 'ms'
    Fchange = pagexraydatas[0].visualMetrics.FirstVisualChange >= 1000 ? (pagexraydatas[0].visualMetrics.FirstVisualChange / 1000).toFixed(2) + 's' : pagexraydatas[0].visualMetrics.FirstVisualChange + 'ms';
    Lchange = pagexraydatas[0].visualMetrics.LastVisualChange >= 1000 ? (pagexraydatas[0].visualMetrics.LastVisualChange / 1000).toFixed(2) + 's' : pagexraydatas[0].visualMetrics.LastVisualChange + 'ms';
    jsSize = (pagexraydatas[0].contentTypes.javascript.transferSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.javascript.transferSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.javascript.transferSize / 1024).toFixed(2) + 'KB';
    cssSize = (pagexraydatas[0].contentTypes.css.transferSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.css.transferSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.css.transferSize / 1024).toFixed(2) + 'KB';
    imgSize = (pagexraydatas[0].contentTypes.image.transferSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.image.transferSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.image.transferSize / 1024).toFixed(2) + 'KB';
    cssconSize = (pagexraydatas[0].contentTypes.css.contentSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.css.contentSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.css.contentSize / 1024).toFixed(2) + 'KB';
    imgconSize = (pagexraydatas[0].contentTypes.image.contentSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.image.contentSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.image.contentSize / 1024).toFixed(2) + 'KB';
    jsconSize = (pagexraydatas[0].contentTypes.javascript.contentSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].contentTypes.javascript.contentSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].contentTypes.javascript.contentSize / 1024).toFixed(2) + 'KB';
    totalrequests = pagexraydatas[0].requests || 0;
    thirdrequests = pagexraydatas[0].thirdParty.requests || 0;
    thirdsize = (pagexraydatas[0].thirdParty.transferSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].thirdParty.transferSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].thirdParty.transferSize / 1024).toFixed(2) + 'KB';
    totalSize = (pagexraydatas[0].transferSize / 1024).toFixed(2) >= 1024 ? (pagexraydatas[0].transferSize / 1048576).toFixed(2) + 'MB' : (pagexraydatas[0].transferSize / 1024).toFixed(2) + 'KB';
    jsrequests = pagexraydatas[0].contentTypes.javascript.requests
    imgrequests = pagexraydatas[0].contentTypes.image.requests
    cssrequests = pagexraydatas[0].contentTypes.css.requests
  }

  const obj = {
    accessibilityscore: accessibilityscore,
    bestpracticescore: bestpracticescore,
    performancescore: performancescore,
    privacyscore: privacyscore,
    firstPaint: firstPaint,
    fullyLoaded: fullyLoaded,
    pageLoadTime: pageLoadTime,
    rumSpeedIndex: rumSpeedIndex,
    score: score,
    Fchange: Fchange,
    Lchange: Lchange,
    jsSize: jsSize,
    cssSize: cssSize,
    imgSize: imgSize,
    jsconSize: jsconSize,
    cssconSize: cssconSize,
    imgconSize: imgconSize,
    totalrequests: totalrequests,
    thirdrequests: thirdrequests,
    thirdsize: thirdsize,
    jsrequests: jsrequests,
    imgrequests: imgrequests,
    cssrequests: cssrequests,
    totalSize: totalSize
  }
  return obj
};

// domainData  no pro
const asynceachpage = async (lastData) => {
  const pageid = []
  lastData.log.pages.forEach((item) => {
    const obj = {
      id: item.id
    }
    pageid.push(obj)
  });
  const eachpagedesc = []
  lastData.log.entries.forEach((item) => {
    let shortUrl = item.request.url.replace(/\?.*/, "");
    url = shortUrl.substr(8, 20) + "..." + shortUrl.substr(-17);
    const timingobj = item.timings
    const obj = {
      id: item.pageref,
      URl: url,
      URlt: item.request.url,
      totaltime: item.time,
      timings: timingobj,
      RawData: item
    }
    eachpagedesc.push(obj)
  });
  const FpageData = []
  const MpageData = []
  const LpageData = []
  eachpagedesc.forEach((item) => {
    if (item.id === pageid[0].id) {
      FpageData.push(item)
    } else if (item.id === pageid[1].id) {
      MpageData.push(item)
    } else if (item.id === pageid[2].id) {
      LpageData.push(item)
    }
  });
  const newObj = {
    FpageData: FpageData,
    MpageData: MpageData,
    LpageData: LpageData
  }
  return newObj
};

// cmd 命令执行
const asynccmd = (url, option) => {
  // 模拟弱网：3g / cable / 3gfast / 3gslow
  // 参数：docker run --shm-size=1g --network=3g --rm -v "%cd%":/browsertime sitespeedio/browsertime:8.13.1 -c 3g https://www.bilibili.com
  // docker run --shm-size=1g --network=3gfast --rm -v "%cd%":/browsertime sitespeedio/browsertime:8.13.1 -c 3gfast https://www.bilibili.com
  // docker 中添加网络：docker network create --driver bridge --subnet=192.168.36.0/24 --gateway=192.168.36.10 --opt "com.docker.network.bridge.name"="docker4" 3gslow
  // docker 中移除网络设置：docker network rm 3g
  return new Promise((res, rej) => {
    if (url && option) {
      // var cmdStr = 'docker run --rm -v "%cd%":/sitespeed.io sitespeedio/sitespeed.io ' + url + ' -b chrome '; "$(pwd)"  "%cd%"
      var cmdStr = 'docker run --shm-size=1g --network=' + option + ' --rm -v "%cd%":/browsertime sitespeedio/browsertime:8.13.1 -c -n 1 ' + option + ' ' + url
      // return new Promise((res, rej) => {
      // console.log(cmdStr + '-------------')
      console.log('start run url and network')
      exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
          console.log('get weather api error:' + stderr);
        } else {
          var filesList = [];
          const dirarr = readFileList('../../browsertime-results', filesList);  // D:\bilibili\imt-server\browsertime-results D:\\bilibili\\imt-server\\sitespeed-result
          let includeurl = url.split("/");
          // console.log('includeurl ' + includeurl)
          let exacturl = includeurl[2]
          // console.log('exacturl ' + exacturl)
          let nowsearchdatas = []
          dirarr.forEach((item) => {
            let bool = item.indexOf(exacturl) != -1
            console.log('bool ' + bool)
            if (bool) {
              nowsearchdatas.push(item)
            }
          })
          // console.log(nowsearchdatas + 'nowsearchdatas')
          var len = nowsearchdatas.length - 1
          let newdir = nowsearchdatas[len];
          // console.log('newdir ' + newdir)
          const Dirdata = readFilerew(newdir)
          // const data = JSON.stringify(Dirdata)
          // const cmdresult = JSON.parse(data)
          insertdatadb(url, Dirdata)
          if (dirarr.length > 10) {
            console.log('filesList length is > 10')
            deleteFolder('../../browsertime-results')
            deleteFolder('../../pages')
          } else {
            console.log('do not have 10 nums')
          }
          console.log('success');
          // return data
          res(Dirdata)
        }
      });
      // })
    } else if (url) {
      var cmdStr = 'docker run --rm -v "%cd%":/browsertime sitespeedio/browsertime:8.13.1 -n 1 ' + url
      // return new Promise((res, rej) => {
      // console.log(cmdStr + '-------------')
      console.log('start run only url')
      exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
          console.log('get weather api error:' + stderr);
        } else {
          var filesList = [];
          const dirarr = readFileList('../../browsertime-results', filesList);  // D:\bilibili\imt-server\browsertime-results D:\\bilibili\\imt-server\\sitespeed-result
          let includeurl = url.split("/");
          let exacturl = includeurl[2]
          let nowsearchdatas = []
          dirarr.forEach((item) => {
            let bool = item.indexOf(exacturl) != -1
            if (bool) {
              nowsearchdatas.push(item)
            }
          })
          // console.log(nowsearchdatas + 'nowsearchdatas')
          var len = nowsearchdatas.length - 1
          let newdir = nowsearchdatas[len];
          const Dirdata = readFilerew(newdir)
          // const data = JSON.stringify(Dirdata)
          // const cmdresult = JSON.parse(data)
          insertdatadb(url, Dirdata)
          if (dirarr.length > 10) {
            console.log('filesList length is > 10')
            deleteFolder('../../browsertime-results')
            deleteFolder('../../pages')
          } else {
            console.log('do not have 10 nums')
          }
          console.log('success');
          // return data
          res(Dirdata)
        }
      });
    }
  })
}
// read file
function readFileList(dir, filesList = []) {
  delPath = path.join(__dirname, dir)
  // console.log(delPath)
  function traverse(delPath) {
    // console.log(fs.readdirSync(delPath))
    fs.readdirSync(delPath).forEach((file) => {
      // console.log(file)
      const pathname = path.join(delPath, file)
      // console.log(pathname)
      if (fs.statSync(pathname).isDirectory()) {
        traverse(pathname)
      } else {
        if (path.extname(pathname) === '.har') {
          filesList.push(pathname)
        }
      }
    })
  }
  traverse(delPath)
  // if (filesList.length > 10) {
  //   console.log('filesList length is > 10')
  //   deleteFolder('../../browsertime-results')
  //   deleteFolder('../../pages')
  // } else {
  //   console.log('do not have 10 nums')
  // }
  return filesList;
  // const files = fs.readdirSync(dir);
  // // console.log(files.length);
  // files.forEach((item) => {
  //   var fullPath = path.join(dir, item);
  //   const stat = fs.statSync(fullPath);
  //   if (stat.isDirectory()) {
  //     readFileList(path.join(dir, item), filesList); //递归读取文件
  //   } else {
  //     if (path.extname(fullPath) === '.har') {
  //       filesList.push(fullPath);
  //     }
  //   }
  // });
  // return filesList;
}

function readFilerew(fileName) {
  fs.readFileSync(fileName);
  const f1 = fs.readFileSync(fileName);
  return f1.toString().replace(/\n/g, "");
}
// del file
function deleteFolder(delPath) {
  delPath = path.join(__dirname, delPath)
  try {
    if (fs.existsSync(delPath)) {
      const delFn = function (address) {
        const files = fs.readdirSync(address)
        for (let i = 0; i < files.length; i++) {
          const dirPath = path.join(address, files[i])
          if (fs.statSync(dirPath).isDirectory()) {
            delFn(dirPath)
          } else {
            deleteFile(dirPath, true)
          }
        }
        /**
        * @des 只能删空文件夹
        */
        fs.rmdirSync(address);
      }
      delFn(delPath);
    } else {
      console.log('do not exist: ', delPath);
    }
  } catch (error) {
    console.log('del folder error', error);
  }
}
function deleteFile(delPath, direct) {
  delPath = direct ? delPath : path.join(__dirname, delPath)
  try {
    /**
     * @des 判断文件或文件夹是否存在
     */
    if (fs.existsSync(delPath)) {
      fs.unlinkSync(delPath);
    } else {
      console.log('inexistence path：', delPath);
    }
  } catch (error) {
    console.log('del error', error);
  }
}

// search data from mango
const searchfromdb = (searchurl) => {
  return new Promise((res, rej) => {
    if (searchurl) {
      console.log('start search')
      MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("performdb");
        var whereStr = { "url": searchurl };  // 查询条件
        dbo.collection("har").find(whereStr).toArray(function (err, result) {
          if (err) {
            return err;
          } else {
            const len = result.length
            // console.log(len);
            // var wantdata = result[0]
            if (len > 0) {
              db.close();
              // console.log(result[0].url);
              // console.log(result.length);
              res(result[len - 1].har)
              console.log('End search')
            } else {
              res('no data')
            }
          }
        });
      });
    }
  })
}
// data insert into db
function insertdatadb(inserturl, cmdresult) {
  MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
    if (err) throw err
    var dbo = db.db("performdb")
    var myobj = { url: inserturl, har: cmdresult, data: formatDate(new Date()) }
    dbo.collection("har").insertOne(myobj, function (err, res) {
      if (err) throw err
      console.log("数据插入成功")
      db.close()
    })
  })
}

// search data from mangodb
const checkdata = async (ctx, next) => {
  try {
    const req = ctx.request.body
    const resultdata = await searchfromdb(req.url).then(
      (data) => {
        return data
      }
    )
    const resdata = JSON.stringify(resultdata)
    const resultdbdata = JSON.parse(resdata)
    // console.log(resultdata);
    if (resultdbdata) {
      if (resultdbdata === 'no data') {
        var finalobj = {
          code: "200",
          msg: "此URL还没有历史数据哦~"
        }
      } else {
        var finalobj = {
          code: "200",
          msg: "success",
          har: resultdbdata
        }
      }
    } else {
      var finalobj = {
        code: 404,
        msg: "自动化运行失败，尝试联系管理员吧",
      };
    }
    if (req.url && finalobj) {
      ctx.status = 200;
      ctx.body = finalobj;
    } else {
      ctx.body = {
        code: 400,
        msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
      };
    }
  } catch (e) {
    console.log(e + '//////////')
    ctx.body = {
      code: 404,
      msg: "服务解析失败，请联系管理员检查服务且稍后再试",
    };
  }
};

// reslove requests
const resoleautorun = async (ctx, next) => {
  try {
    const req = ctx.request.body
    const cmdresult = await asynccmd(req.url, req.option).then(
      (data) => {
        return data
      }
    )
    if (cmdresult) {
      var finalobj = {
        code: "200",
        msg: "success",
      }
    } else {
      var finalobj = {
        code: 404,
        msg: "自动化运行失败，尝试联系管理员吧",
      };
    }
    if (req.url && finalobj) {
      ctx.status = 200;
      ctx.body = finalobj;
    } else {
      ctx.body = {
        code: 400,
        msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
      };
    }
  } catch (e) {
    console.log(e + '//////////')
    ctx.body = {
      code: 404,
      msg: "服务解析失败，请联系管理员检查服务且稍后再试",
    };
  }
};

// reslove requests
const getneedfile = async (ctx, next) => {
  try {
    const req = ctx.request.body
    const prewebcoach = await asyncusewebcoach(req.url)
    // var filesList = [];
    // const dirarr = readFileList('D:\\bilibili\\imt-server\\browsertime-results', filesList);  // D:\bilibili\imt-server\browsertime-results D:\\bilibili\\imt-server\\sitespeed-result
    // let newdir = dirarr[0];
    // const Dirdata = readFilerew(newdir)
    // const data = JSON.stringify(Dirdata)
    // const cmdresult = JSON.parse(data)
    const resultdata = await searchfromdb(req.url).then(
      (data) => {
        return data
      }
    )
    const resdata = JSON.stringify(resultdata)
    const cmdresult = JSON.parse(resdata)

    if (prewebcoach && cmdresult) {
      const lastData = JSON.parse(cmdresult)
      const Toplistdata = await asyncuseToplist(lastData)
      const Deachdata = await asyncuseDomain(lastData);
      const Assertsdatas = await asyncuseAssertsData(lastData)
      const newAssertsdata = await asyncuseAsserts(Assertsdatas)
      const pagexraydatas = await pagexraydata(lastData)
      var finalobj = {
        code: "200",
        msg: "success",
        // log: lastData.log,
        // Domain: Deachdata, // 2 no
        Deach: await asyncusedomaineach(Deachdata),
        Toplist: await asyncuseToplisteach(Toplistdata), // 21 no
        Slowestresponses: await asyncuseToplistpredata(Toplistdata), //22 no 
        // // headersdata: await asyncuseheraderdata(),
        Assertsdata: await asyncuseAssertspredata(newAssertsdata),
        pagexraydata: pagexraydatas, // 1 no 
        pagesdata: await asyncusepagesdata(pagexraydatas), //no
        webcoach: prewebcoach,
        // cmdresult: lastData, // no 
        infoData: await asyncinfoData(pagexraydatas, prewebcoach),
        eachpage: await asynceachpage(lastData), // 3 no
        PageXrayasserts: await pagexrayeachdata(pagexraydatas), // no
      }
    } else {
      var finalobj = {
        code: 404,
        msg: "服务解析失败，请联系管理员检查服务且稍后再试",
      };
    }
    if (req.url && finalobj) {
      ctx.status = 200;
      ctx.body = finalobj;
    } else {
      ctx.body = {
        code: 400,
        msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
      };
    }
    // insertdatadb(req.url, finalobj)
    // deleteFolder('../../browsertime-results')
    // deleteFolder('../../pages')
  } catch (e) {
    console.log(e + '//////////')
    ctx.body = {
      code: 404,
      msg: "服务解析失败，请联系管理员检查服务且稍后再试",
    };
  }
};


// insert UI scripts
const upload = async (ctx, next) => {
  try {
    console.log('ctx: ', ctx)
    if (file) {
      var finalobj = {
        code: "200",
        msg: "success",
      }
    } else {
      var finalobj = {
        code: 404,
        msg: "上传失败",
      };
    }
    if (file && finalobj) {
      ctx.status = 200;
      ctx.body = finalobj;
    } else {
      ctx.body = {
        code: 400,
        msg: "哦哦~服务好像开小差了...尝试联系管理员吧",
      };
    }
  } catch (e) {
    console.log(e + '//////////')
    ctx.body = {
      code: 404,
      msg: "上传好像有点问题，请稍后重试",
    };
  }
};

module.exports = {
  getneedfile,
  resoleautorun,
  checkdata,
  upload
};
