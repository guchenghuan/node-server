const din = require('./testtojson')
var fs = require('fs');
const source = fs.readFileSync('./testhtml1.txt', 'utf8');
const htmljson = din.toJSON(source, { skipScript: true, skipStyle: true, pureClass: true, pureComment: true })
const jsonhtml = din.toHTML(htmljson)

fs.appendFile('./testfile02.json', JSON.stringify(htmljson[0], null, 4), 'utf8', function (err, ret) {
    if (err) {
        throw err
    }
    console.log('success')
})
// console.log('htmljson: ', htmljson)
// console.log('jsonhtml: ', jsonhtml)