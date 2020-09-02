/*
 * @Author: 郑杰14
 * @Date: 2020-06-08 22:15:44
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-06-08 22:17:27
 * @Description:
 */
const uObject = {
  /**
   * 深度拷贝
   * @param { Object/Array } obj
   */
  deepCloneObject (obj) {
    let objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = this.deepCloneObject(obj[key])
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  },

  /**
   * stringify深拷贝
   * @param { Object/Array } obj 
   */
  deepCloneObjectExpand (obj) {
    const temp = JSON.stringify(obj)
    const result = JSON.parse(temp)
    // let objType = Array.isArray(obj) ? 'array' : 'object'
    // let deepCloneResult = objType === 'object'
    //   ? { __proto__: Object.getPrototypeOf(obj), ...obj }
    //   : Object.values({ __proto__: Object.getPrototypeOf(obj), ...obj })
    return result
  },

  /**
   * 判断两个对象是否相等
   * @param { Object } object1
   * @param { Object } object2
   * @return {boolean}
   */
  ObjectEquals (object1, object2) {
    for (let propName in object1) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
    }
    for (let propName in object2) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
      if (!object1.hasOwnProperty(propName)) continue

      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
        if (!this.ObjectEquals(object1[propName], object2[propName])) return false
      } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        if (!this.ObjectEquals(object1[propName], object2[propName])) return false
      } else if (object1[propName] !== object2[propName]) {
        return false
      }
    }
    return true
  }
}

const uDom = {
  /**
  * 获取元素父级元素
  * @param { Object } el // 当前对象
  * @param { String } parentSelector // 父级对象className
  * @return {*}
  */
  getParents (el, parentSelector /* optional */) {
    if (parentSelector === undefined) {
      parentSelector = ''
    }

    var p = el.parentNode
    while (p.className.indexOf(parentSelector) === -1) {
      p = p.parentNode
      if (p.tagName === 'HTML') return
    }
    return p
  },

  /**
   * 获取相邻元素
   * @param { Object } ele 参考物元素
   * @param { Number } type 类型，上一个(1)or下一个(0)
   * @return 返回查找到的元素Dom对象，无则返回null
   */
  getNearEle (ele, type) {
    type = type === 1 ? 'previousSibling' : 'nextSibling'
    var nearEle = ele[type]
    while (nearEle) {
      if (nearEle.nodeType === 1) {
        return nearEle
      }
      nearEle = nearEle[type]
      if (!nearEle) {
        break
      }
    }
    return null
  },

  /**
   * 获取所有兄弟元素
   * @param { Object } ele 参考物元素
   * @return 所有兄弟元素
   */
  siblings (elm) {
    var a = [] // 保存所有兄弟节点
    var p = elm.parentNode.children // 获取父级的所有子节点
    for (var i = 0; i < p.length; i++) {
      // 循环
      if (p[i].nodeType === 1 && p[i] !== elm) {
        // 如果该节点是元素节点与不是这个节点本身
        a.push(p[i]) // 添加到兄弟节点里
      }
    }

    return a
  },

  /**
   * 获取节点子元素
   * @param { Object } dom 
   */
  getChildNode (dom) {
    let nodes = []
    let childrens = dom.childNodes
    for (let i = 0; i < childrens.length; i++) {
      if (childrens[i].nodeType === 1) {
        nodes.push(childrens[i])
      }
    }
    return nodes
  },

  /**
   * 获取元素样式兼容性写法
   * @param { Object } dom // dom对象
   * @param style // 获取的样式
   * @return {*}
   */
  getStyle (dom, style) {
    return dom.currentStyle ? dom.currentStyle[style] : getComputedStyle(dom, false)[style]
  },

  /**
   * 清除同级其他元素高亮，当前元素设置高亮
   * @param { Array } lists 统计元素数组
   * @param { Object } current 高亮元素
   */
  setActive (lists, current, className) {
    // 清除高亮
    Array.from(lists).forEach(item => {
      item.classList.remove(className)
    })
    // 当前增加高亮
    current.classList.add(className)
  },

  /**
   * 默认点击dom事件
   * @param {*} dom 需要点击的节点
   */
  imitateClick (dom) {
    if (dom) {
      let e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      dom.dispatchEvent(e)
    }
  },

  /**
   * 平滑滚动到页面顶部
   */
  scrollToTop () {
    const c = document.documentElement.scrollTop || document.body.scrollTop
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0, c - c / 8)
    }
  }
}

export { uObject, uDom }