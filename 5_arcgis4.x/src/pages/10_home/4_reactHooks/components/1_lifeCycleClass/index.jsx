import React, { Component } from 'react'

/* 类组建生命周期 */
export default class App extends Component {
  state = {
    count: 0
  }

  componentDidMount () {
    const { count } = this.state
    document.title = 'componentDidMount' + count
    this.timer = setInterval(() => {
      this.setState(({ count }) => ({
        count: count + 1
      }))
    }, 1000)
  }

  componentDidUpdate () {
    const { count } = this.state
    document.title = 'componentDidUpdate' + count
  }

  componentWillUnmount () {
    document.title = 'componentWillUnmount'
    clearInterval(this.timer)
  }

  handleCancle = () => {
    clearInterval(this.timer)
    this.setState({
      count: 0
    })
  }
  render () {
    const { count } = this.state
    return (
      <div>
        <h2>类组件生命周期</h2>
        {count}
        <button onClick={() => this.handleCancle()}>取消定时器</button>
      </div>
    )
  }
}

