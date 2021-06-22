const fs = require('fs');
const path = require('path');
/**
 * 遍历指定目录下的所有文件
 * @param {*} dir 
 */
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
    if (filesList.length > 3) {
        console.log('> 3')
    } else {
        console.log('go on')
    }
    return filesList;
}

readFileList('../../browsertime-results', filesList = [])