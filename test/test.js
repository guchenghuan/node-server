var fs = require('fs');
fs.readFile('./testhtml1.txt', 'utf-8', function (err, data) {
    if (err) {
        console.error(err);
    }
    else {
        const html = data
        // console.log(html)
        const din = require('./testtojson')
        const source = html
        const htmljson = din.toJSON(source, { skipScript: true, pureComment: true })
        // console.log(htmljson)

        fs.appendFile('./testfiles2.json', JSON.stringify(htmljson[0], null, 4), 'utf8', function (err, ret) {
            if (err) {
                throw err
            }
            console.log('success')
        })
    }
});
