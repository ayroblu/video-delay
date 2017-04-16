import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import './App.css'
import VideoRecorder from './VideoRecorder'
import Devices from './Devices'
import KeyboardShortcuts from './KeyboardShortcuts'

class App extends Component {
  state = {
    showVideoRecorder: false
  , devices: {}
  , selectedDevices: []
  , videoDelays: []
  , videoPaused: false
  , delay: 5
  , showLiveVideo: false
  , showLiveVideoActive: false
  , useBackupRecorder: false
  , mimeType: 'video/webm;codecs=vp9'
  }
  _setVideo = show=>{
    if (show === true && this.state.selectedDevices.length === 0) return
    this.setState({showVideoRecorder: show})
  }
  _setDevices = devices=>{
    this.setState({devices})
  }
  _setSelectedDevices = selectedDevices=>{
    this.setState({selectedDevices})
  }
  _setDelay = (e, delay)=>{
    this.setState({delay})
  }
  _setVideoDelays = videoDelays=>{
    this.setState({videoDelays})
  }
  _toggleState(key){
    const val = this.state[key]
    this.setState({[key]: !val})
  }
  componentWillMount(){
    if (window.localStorage.state) {
      this.setState(JSON.parse(window.localStorage.state))
    }
  }
  _updateOnResize = ()=>{
    this.forceUpdate()
  }
  componentDidMount(){
    window.addEventListener('resize', this._updateOnResize)
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this._updateOnResize)
  }
  componentDidUpdate(){
    const { delay, showLiveVideo, useBackupRecorder, mimeType } = this.state
    const state = {delay, showLiveVideo, useBackupRecorder, mimeType}
    window.localStorage.setItem('state', JSON.stringify(state))
  }
  render() {
    this.delayErrorText = !isNaN(this.state.delay) && this.state.delay > 0 ? null : 'This must be a number greater than 0'
    return (
      <div className="App">
        <div className="App-header">
          <h2 className="App-header-h2">Web Recorder</h2>
        </div>
        <div className="App-intro">
          <p>Hi! Have a play! Its pretty simple just press the start button below</p>
          <p>You need to have a camera attached!</p>
        </div>
        <Devices 
          setDevices={this._setDevices}
          devices={this.state.devices}
          setSelectedDevices={this._setSelectedDevices}
          selectedDevices={this.state.selectedDevices}
        />
        <TextField
          hintText="Delay for video"
          errorText={this.delayErrorText}
          floatingLabelText="Delay"
          value={this.state.delay}
          onChange={this._setDelay}
          className='App-delay'
        />
        <div className="App-toggles">
          <Toggle
            label="Show Live Video"
            toggled={this.state.showLiveVideo}
            onToggle={()=>this._toggleState('showLiveVideo')}
          />
          <Toggle
            label="Maintain full length recording"
            toggled={this.state.useBackupRecorder}
            onToggle={()=>this._toggleState('useBackupRecorder')}
          />
          <SelectField
            floatingLabelText="Video Codec"
            value={this.state.mimeType}
            onChange={(e, i, mimeType)=>this.setState({mimeType})}
            style={{textAlign: 'left'}}
          >
            <MenuItem value='video/webm;codecs=h264' primaryText="h.264" />
            <MenuItem value='video/webm;codecs=vp9' primaryText="VP9" />
          </SelectField>
        </div>
        <button className="App-start-button" onClick={()=>this._setVideo(true)}>Start</button>
        <VideoRecorder
          ref={r=>!this.state.videoRecorder && this.setState({videoRecorder: r})}
          visible={this.state.showVideoRecorder}
          delay={this.state.delay*1000}
          setVideo={this._setVideo}
          devices={this.state.devices}
          selectedDevices={this.state.selectedDevices}
          setVideoDelays={this._setVideoDelays}
          videoDelays={this.state.videoDelays}
          videoPaused={this.state.videoPaused}
          showLiveVideo={this.state.showLiveVideo}
          showLiveVideoActive={this.state.showLiveVideoActive}
          useBackupRecorder={this.state.useBackupRecorder}
          mimeType={this.state.mimeType}
        />
        <KeyboardShortcuts state={this.state} setState={params=>this.setState(params)} />
      </div>
    )
  }
}

export default App
