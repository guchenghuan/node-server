const { Parser } = require("htmlparser2")

const numberValueRegexp = /^\d+$/
const zeroValueRegexp = /^0[^0\s].*$/
const scriptRegexp = /^script$/i
const styleRegexp = /^style$/i
const selfCloseTagRegexp = /^(meta|base|br|img|input|col|frame|link|area|param|embed|keygen|source)$/i

const TAG = 'tag'
const TEXT = 'text'
const COMMENT = 'comment'

/**
 * 去除前后空格
 */
const trim = val => {
    return (val || '').replace(/^\s+/, '').replace(/\s+$/, '')
}
/**
 * 首字母大写
 */
const capitalize = word => {
    return (word || '').replace(/( |^)[a-z]/, c => c.toUpperCase())
}
/**
 * 驼峰命名法/小驼峰命名法, 首字母小写
 */
const camelCase = key => {
    return (key || '').split(/[_-]/).map((item, i) => i === 0 ? item : capitalize(item)).join('')
}
/**
 * 大驼峰命名法，首字母大写
 */
const pascalCase = key => {
    return (key || '').split(/[_-]/).map(capitalize).join('')
}
const isPlainObject = obj => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
/**
 * 行内样式转Object
 */
const style2Object = (style) => {
    if (!style || typeof style !== 'string') {
        return {}
    }
    const styleObject = {}
    const styles = style.split(/;/)
    styles.forEach(item => {
        const [prop, value] = item.split(/:/)
        if (prop && value && trim(value)) {
            const val = trim(value)
            styleObject[camelCase(trim(prop))] = zeroValueRegexp.test(val) ? 0 : numberValueRegexp.test(val) ? Number(val) : val
        }
    })
    return styleObject
}

const toJSON = (html, options) => {
    options = Object.assign({ skipStyle: false, skipScript: false, pureClass: false, pureComment: false }, options)
    const json = []
    let levelNodes = []
    const parser = new Parser({
        onopentag: (name, { style, class: classNames, ...attrs } = {}) => {
            let node = {}
            if ((scriptRegexp.test(name) && options.skipScript === true) ||
                (styleRegexp.test(name) && options.skipStyle === true)) {
                node = false
            } else {
                if (options.pureClass === true) {
                    classNames = ''
                }
                node = {
                    type: TAG,
                    tagName: name,
                    style: style2Object(style),
                    inlineStyle: style || '',
                    attrs: { ...attrs },
                    classNames: classNames || '',
                    classList: options.pureClass ? [] : (classNames || '').split(/\s+/).map(trim).filter(Boolean),
                    children: []

                }
            }
            if (levelNodes[0]) {
                if (node !== false) {
                    const parent = levelNodes[0]
                    parent.children.push(node)
                }
                levelNodes.unshift(node)
            } else {
                if (node !== false) {
                    json.push(node)
                }
                levelNodes.push(node)
            }
        },
        ontext(text) {
            const parent = levelNodes[0]
            if (parent === false) {
                return
            }
            const node = {
                type: TEXT,
                content: text
            }
            if (!parent) {
                json.push(node)
            } else {
                if (!parent.children) {
                    parent.children = []
                }
                parent.children.push(node)
            }
        },
        oncomment(comments) {
            if (options.pureComment) {
                return
            }
            const parent = levelNodes[0]
            if (parent === false) {
                return
            }
            const node = {
                type: COMMENT,
                content: comments
            }
            if (!parent) {
                json.push(node)
            } else {
                if (!parent.children) {
                    parent.children = []
                }
                parent.children.push(node)
            }
        },
        onclosetag() {
            levelNodes.shift()
        },
        onend() {
            levelNodes = null
        }
    })
    parser.done(html)
    return json
}
const setAttrs = (attrs, results) => {
    Object.keys(attrs || {}).forEach(k => {
        if (!attrs[k]) {
            results.push(k)
        } else {
            results.push(' ', k, '=', '"', attrs[k], '"')
        }
    })
}
const toElement = (elementInfo, results) => {

    switch (elementInfo.type) {
        case TAG:
            const tagName = elementInfo.tagName
            results.push('<', tagName)
            if (elementInfo.inlineStyle) {
                results.push(' style="', elementInfo.inlineStyle, '"')
            }
            if (elementInfo.classNames) {
                results.push(' class="', elementInfo.classNames, '"')
            }
            setAttrs(elementInfo.attrs, results)
            if (selfCloseTagRegexp.test(tagName)) {
                results.push(' />')
            } else {
                results.push('>')
                if (Array.isArray(elementInfo.children)) {
                    elementInfo.children.forEach(item => toElement(item, results))
                }
                results.push('</', tagName, '>')
            }
            break;
        case TEXT:
            results.push(elementInfo.content)
            break;
        case COMMENT:
            results.push("<!-- ", elementInfo.content, " -->")
            break;
        default:
        // ignore
    }
}
const toHTML = json => {
    json = json || []
    if (isPlainObject(json)) {
        json = [json]
    }
    const results = []
    json.forEach(item => toElement(item, results))
    return results.join('')
}

module.exports = {
    trim,
    capitalize,
    camelCase,
    pascalCase,
    isPlainObject,
    style2Object,
    toJSON,
    setAttrs,
    toElement,
    toHTML,
};
