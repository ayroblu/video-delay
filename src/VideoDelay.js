import React, { Component } from 'react'
import './VideoDelay.css'
import FaStepForward from 'react-icons/lib/fa/step-forward'
import FaStepBackward from 'react-icons/lib/fa/step-backward'

export default class VideoRecorder extends Component {
  static propTypes = {
    setVideoDelays: React.PropTypes.func.isRequired
  , videoDelays: React.PropTypes.array.isRequired
  , videoBlob: React.PropTypes.string
  , url: React.PropTypes.string
  , idx: React.PropTypes.number.isRequired
  , cols: React.PropTypes.number.isRequired
  , rows: React.PropTypes.number.isRequired
  }
  _getStyles(){
    const {idx, cols, rows} = this.props
    const width = document.documentElement.clientWidth/cols
    const height = document.documentElement.clientHeight/rows
    const videoStyle = {
      width: width + 'px'
    , height: height + 'px'
    , top: parseInt(idx/cols, 10) * height + 'px'
    , left: idx%cols * width + 'px'
    }
    const popupStyle = {
      width: width/5 + 'px'
    , top: parseInt(idx/cols, 10) * height + height/20 + 'px'
    , left: idx%cols * width + height/20 + 'px'
    }
    const leftStyle = {
      top: parseInt(idx/cols, 10) * height + height/2 + 'px'
    , left: idx%cols * width + 20 + 'px'
    }
    const rightStyle = {
      top: parseInt(idx/cols, 10) * height + height/2 + 'px'
    , right: (cols-1-idx%cols) * width + 20 + 'px'
    }
    const delayStyle = {
      top: parseInt(idx/cols, 10) * height + 20 + 'px'
    , left: idx%cols * width + width/2 + 'px'
    }
    return {videoStyle, popupStyle, leftStyle, rightStyle, delayStyle}
  }
  render(){
    const {idx} = this.props

    const {videoStyle, popupStyle, leftStyle, rightStyle, delayStyle} = this._getStyles()

    const setVideoDelaysInc = ()=>{
      const videoDelays = this.props.videoDelays.concat()
      videoDelays[idx] += 100
      this.props.setVideoDelays(videoDelays)
    }
    const setVideoDelaysDec = ()=>{
      const videoDelays = this.props.videoDelays.concat()
      videoDelays[idx] -= 100
      this.props.setVideoDelays(videoDelays)
    }
    return (
      <div>
        <video autoPlay src={this.props.videoBlob} style={videoStyle} className="VideoDelay-delayed"/>
        {this.props.url &&
        <video autoPlay src={this.props.url} style={popupStyle} className="VideoDelay-live"/>}
        <div
          className="VideoDelay-delay"
          style={delayStyle}>
          {this.props.videoDelays[idx]/1000}
        </div>
        <div
          onClick={()=>setVideoDelaysDec()}
          className="VideoDelay-delay-button"
          style={leftStyle}>
          <FaStepBackward/>
        </div>
        <div
          onClick={()=>setVideoDelaysInc()}
          className="VideoDelay-delay-button"
          style={rightStyle}>
          <FaStepForward/>
        </div>
      </div>
    )
  }
}
