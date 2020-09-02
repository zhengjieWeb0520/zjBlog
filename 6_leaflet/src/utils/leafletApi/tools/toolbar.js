import React from 'react'
import { connect } from 'react-redux'

@connect(
  state => ({
    leafletBaseMap: state.leafletBaseMap
  }),
  {}
)
class Toolbar extends React.Component {
  // 缩放事件
  zoomControl = (v, type) => {
    const { leafletBaseMap } = this.props
    switch (type) {
      case 'zoomIn':
        leafletBaseMap.activeView.zoomControl('zoomIn')
        break
      case 'zoomOut':
        leafletBaseMap.activeView.zoomControl('zoomOut')
        break
      case 'zoomRecover':
        leafletBaseMap.activeView.zoomControl('zoomRecover')
        break
      default:
        break
    }
  }

  // 清除
  clearAllLayer = () => {
    const { leafletBaseMap } = this.props
    leafletBaseMap.activeView.removeAllLayers()
  }

  render () {
    return (
      <div className="toolbar">
        <ul className="toolbar-list">
          <li onClick={(v) => { this.zoomControl(v, 'zoomIn') }}>
            <i className="icon iconfont icon-fangda" />
            &nbsp;
            <span>放大</span>
          </li>
          <li onClick={(v) => { this.zoomControl(v, 'zoomOut') }}>
            <i className="icon iconfont icon-suoxiao" />
            &nbsp;
            <span>缩小</span>
          </li>
          <li onClick={(v) => { this.zoomControl(v, 'zoomRecover') }}>
            <i className="icon iconfont icon-huifutubiao" />
            &nbsp;
            <span>恢复</span>
          </li>
          <li onClick={(v) => { this.clearAllLayer(v, 'clearAll') }}>
            <i className="icon iconfont icon-huifutubiao" />
            &nbsp;
            <span>清除</span>
          </li>
        </ul>
      </div>
    )
  }
}

export default Toolbar
