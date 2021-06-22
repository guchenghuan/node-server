/*
 * IMT-project
 */

const Router = require("koa-router");
// const pagexray = require("pagexray");
const router = new Router();
const user_controller = require("./../../app/controllers/user_controller");
const videoserver = require("./../../app/controllers/videoserver"); //
const getwebqualitydata = require("./../../app/controllers/getwebqualitydata");
const moredrivers = require("./../../app/controllers/moredrivers");
const domdiffserver = require("./../../app/controllers/domdiffserver");
const onlineproblem = require("./../../app/controllers/onlineproblem");
const videopageinfo = require("./../../app/controllers/videopageinfo");
const webqualityhistorydata = require("./../../app/controllers/webqualityhistorydata");
const diffinfo = require("./../../app/controllers/diffinfo");
const webactivity = require("./../../app/controllers/webactivity");
const webcoverage = require("./../../app/controllers/webcoverage");


// 性能
router.post("/getneedfile", user_controller.getneedfile);
router.post("/resoleautorun", user_controller.resoleautorun);
router.post("/checkdata", user_controller.checkdata);
router.post("/upload", user_controller.upload);

// video
router.post("/searchvideocase", videoserver.searchvideocase);
router.post("/videocasenewinsert", videoserver.videocasenewinsert);
router.post("/getcaseinfo", videoserver.getcaseinfo);
router.post("/editconform", videoserver.editconform);
router.post("/performcase", videoserver.performcase);
router.post("/getLoginfo", videoserver.getLoginfo);
router.post("/deleteconform", videoserver.deleteconform);

// 竞品
router.post("/getquailtydata", getwebqualitydata.getquailtydata);

// 获取视频信息
router.post('/getvideoinfodata', videopageinfo.getvideoinfodata);

// 竞品历史
router.post('/gethistorydata', webqualityhistorydata.gethistorydata);

// 线上问题
router.post("/insertproblemdata", onlineproblem.insertproblemdata);
router.post("/getproblemdata", onlineproblem.getproblemdata);
router.post("/delproblemdata", onlineproblem.delproblemdata);

// 兼容性
router.post("/drivercaserun", moredrivers.drivercaserun);
router.post("/getallcases", moredrivers.getallcases);
router.post("/getlogdatainfo", moredrivers.getlogdatainfo);
router.post("/getcodeinfo", moredrivers.getcodeinfo);
router.post("/resetmainvideo", moredrivers.resetmainvideo);

// domdiff
router.post("/neewinsert", domdiffserver.neewinsert);
router.post("/Fsearch", domdiffserver.Fsearch);
router.post("/Ssearch", domdiffserver.Ssearch);
router.post("/Tsearch", domdiffserver.Tsearch);
router.post("/handsrun", domdiffserver.handsrun);
router.post("/setautorun", domdiffserver.setautorun);
router.post("/delurlconform", domdiffserver.delurlconform);

// domdiff-info
router.post("/allinfo", diffinfo.allinfo);
router.post("/getuatpageinfo", diffinfo.getuatpageinfo);
router.post("/eachpageinfo", diffinfo.eachpageinfo);
router.post("/drawpiesdats", diffinfo.drawpiesdats);

// webactivity 
router.post("/runactivity", webactivity.runactivity);
router.post("/getallactivityinfo", webactivity.getallactivityinfo);
router.post("/geteachinfo", webactivity.geteachinfo);
router.post("/deleachinfo", webactivity.deleachinfo);


// webcoverage 
router.post("/insertcoverage", webcoverage.insertcoverage);
router.post("/editcoverage", webcoverage.editcoverage);
router.post("/getAllcoverage", webcoverage.getAllcoverage);
router.post("/searchcoverage", webcoverage.searchcoverage);
router.post("/tooglecoverage", webcoverage.tooglecoverage);
router.post("/getnewfile", webcoverage.getnewfile);

module.exports = router;

