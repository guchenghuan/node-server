var fs = require('fs');
const difflib = require("./difflib");
const diffview = require("./diffview");
var jsdom = require("jsdom");

var JSDOM = jsdom.JSDOM;
var document = new JSDOM().window.document;
// var AdchinaJson = {};

var data = fs.readFileSync('./testfile01.json', 'utf8');
// console.log(data)
var data1 = fs.readFileSync('./testfile02.json', 'utf8');
var datsparse1 = JSON.parse(data)
var datsparse2 = JSON.parse(data1)
// console.log(datsparse)

// base = difflib.stringAsLines(data)
// console.log(base)
// const newdddd = datsparse1.children[0].children[0].children[0].children[0].children
// console.log(newdddd.length)
// console.log(newdddd)
// console.log(data1.length)
// console.log(data1.length < data.length ? ((data.length - data1.length) / data.length * 100).toFixed(2) + '%' : Math.abs((data.length - data1.length) / data.length))

let num = 0
function getnums(data) {
    const firstdats = data.children
    const len = firstdats.length
    if (len >= 1) {
        num = num + 1
        firstdats.forEach(element => {
            if (element.hasOwnProperty('children')) {
                getnums(element)
            }
        });
    } else {
        num = num + 1
    }
}
getnums(datsparse1)

let nums = 0
function getnumss(data) {
    const firstdats = data.children
    const len = firstdats.length
    if (len >= 1) {
        nums = nums + 1
        firstdats.forEach(element => {
            if (element.hasOwnProperty('children')) {
                getnumss(element)
            }
        });
    } else {
        nums = nums + 1
    }
}
getnumss(datsparse2)
console.log(data.length)
console.log(data1.length)
console.log(data1.length < data.length ? ((data.length - data1.length) / data.length) : (data1.length - data.length) / data1.length)
console.log(nums < num ? ((num - nums) / num) : (nums - num) / nums)

function diffUsingJS(viewType) {
    var base = difflib.stringAsLines(datsparse),
        newtxt = difflib.stringAsLines(datsparse1),
        sm = new difflib.SequenceMatcher(base, newtxt),
        opcodes = sm.get_opcodes()

    var result = diffview.buildView({
        baseTextLines: base,
        newTextLines: newtxt,
        opcodes: opcodes,
        baseTextName: "Base Text",
        newTextName: "New Text",
        viewType: viewType
    });
    var tdata = document.createElement("div");
    tdata.appendChild(result);
    console.log(tdata.innerHTML)
    // console.log(result.toString())
    // console.log(typeof (result))
}
// diffUsingJS(1)
