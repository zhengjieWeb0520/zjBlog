/* eslint-disable */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Highlight from '../highlight'
import Clipboard from '../clipBoard'
import './index.scss'

/* 源码按钮 */
export default function CodeSource (props) {
  const width = useSelector(state => state.main.width)
  const codeVisible = useSelector(state => state.main.codeVisible)

  useEffect(() => {
    var theobject = null // This gets a value as soon as a resize start
    let dir
    function resizeObject () {
      this.el = null // pointer to the object
      this.dir = ''  // type of current resize (n, s, e, w, ne, nw, se, sw)
      this.grabx = null // Some useful values
      this.graby = null
      this.width = null
      this.height = null
      this.left = null
      this.top = null
    }

    // Find out what kind of resize! Return a string inlcluding the directions
    function getDirection (el) {
      var xPos, yPos, offset, dir
      dir = ''

      xPos = window.event.offsetX
      yPos = window.event.offsetY

      offset = 8 // The distance from the edge in pixels

      if (yPos < offset) dir += 'n'
      else if (yPos > el.offsetHeight - offset) dir += 's'
      if (xPos < offset) dir += 'w'
      else if (xPos > el.offsetWidth - offset) dir += 'e'

      return dir
    }

    function doDown () {
      var el = getReal(event.srcElement, 'className', 'code-box')

      if (el == null) {
        theobject = null
        return
      }

      dir = getDirection(el)
      if (dir == '') return

      theobject = new resizeObject()

      theobject.el = el
      theobject.dir = dir

      theobject.grabx = window.event.clientX
      theobject.graby = window.event.clientY
      theobject.width = el.offsetWidth
      theobject.height = el.offsetHeight
      theobject.left = el.offsetLeft
      theobject.top = el.offsetTop

      window.event.returnValue = false
      window.event.cancelBubble = true
    }

    function doUp () {
      if (theobject != null) {
        theobject = null
      }
    }

    function doMove () {
      var el, xPos, yPos, str, xMin, yMin
      xMin = 8 // The smallest width possible
      yMin = 8 //             height

      el = getReal(event.srcElement, 'className', 'code-box')

      if (el.className == 'code-box') {
        str = getDirection(el)
        if (str == '') str = 'default'
        else str += '-resize'
        el.style.cursor = str
      }

      if (theobject != null) {
        if (dir.indexOf('e') != -1)
          theobject.el.style.width = Math.max(xMin, theobject.width +

            window.event.clientX - theobject.grabx) + 'px'

        if (dir.indexOf('s') != -1)
          theobject.el.style.height = Math.max(yMin, theobject.height +

            window.event.clientY - theobject.graby) + 'px'

        if (dir.indexOf('w') != -1) {
          theobject.el.style.left = Math.min(theobject.left +

            window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin) +

            'px'
          theobject.el.style.width = Math.max(xMin, theobject.width -

            window.event.clientX + theobject.grabx) + 'px'
        }
        if (dir.indexOf('n') != -1) {
          theobject.el.style.top = Math.min(theobject.top +

            window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin) +

            'px'
          theobject.el.style.height = Math.max(yMin, theobject.height -

            window.event.clientY + theobject.graby) + 'px'
        }

        window.event.returnValue = false
        window.event.cancelBubble = true
      }
    }


    function getReal (el, type, value) {
      var temp = el
      while ((temp != null) && (temp.tagName != 'BODY')) {
        if (eval('temp.' + type) == value) {
          el = temp
          return el
        }
        temp = temp.parentElement
      }
      return el
    }

    document.onmousedown = doDown
    document.onmouseup = doUp
    document.onmousemove = doMove
  }, [])
  const style = {
    position: 'absolute',
    left: 0,
    width: '5rem',
    height: '98.5%',
    marginTop: '0.05rem',
    marginBottom: '0.05rem',
    backgroundColor: '#1D2542',
    color: 'white',
    overflow: 'hidden',
    zIndex: 999,
    backgroundAttachment: 'scroll'
  }
  const style2 = {
    width: '99%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
  return (
    <div>
      {
        codeVisible
          ? <div className='code-box' style={style}>
            <div style={style2}>
              <Clipboard codes={props.codes[0]} />
              <Highlight className='javascript,js,jsx'>{props.codes[0]}</Highlight>
            </div>
          </div>
          : null
      }
    </div>
  )
}
