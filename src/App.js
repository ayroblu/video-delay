import React, { Component } from 'react';
import './App.css';
import VideoRecorder from './VideoRecorder'
import Devices from './Devices'

class App extends Component {
  state = {
    showVideoRecorder: false
  , devices: {}
  , selectedDevices: []
  }
  _setVideo = show=>{
    if (show === true && this.state.selectedDevices.length === 0) return
    this.setState({...this.state, showVideoRecorder: show})
  }
  _setDevices = devices=>{
    this.setState({...this.state, devices})
  }
  _setSelectedDevices = selectedDevices=>{
    this.setState({...this.state, selectedDevices})
  }
  render() {
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
        <div className="App-start-button" onClick={()=>this._setVideo(true)}>Start</div>
        <VideoRecorder 
          visible={this.state.showVideoRecorder}
          delay={8000}
          setVideo={this._setVideo}
          devices={this.state.devices}
          selectedDevices={this.state.selectedDevices}
        />
      </div>
    );
  }
}

export default App;
