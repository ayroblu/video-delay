import React, { Component } from 'react'
import './Devices.css'
import FaTimes from 'react-icons/lib/fa/close'
import FaCheck from 'react-icons/lib/fa/check'
import FaRefresh from 'react-icons/lib/fa/refresh'

export default class Devices extends Component {
  static propTypes = {
    devices: React.PropTypes.object.isRequired
  , setDevices: React.PropTypes.func.isRequired
  , selectedDevices: React.PropTypes.array.isRequired
  , setSelectedDevices: React.PropTypes.func.isRequired
  }
  componentWillMount(){
    this.first = true
    this.setState({})
    this._getDevices().catch(err=>{
      console.error('Error getting devices', err)
    })
  }
  async _getDevices(){
    this.setState({loading: true})

    const deviceInfos = await navigator.mediaDevices.enumerateDevices()
    const devices = await this._gotDevices(deviceInfos)
    this.props.setDevices(devices)
    this.props.setSelectedDevices(devices.videoInputs.map((d,i)=>i))
    if (!devices.videoInputs.some(d=>d.label)){
      await this._requestPermissions()
    }

    this.setState({loading: false})
    return devices
  }
  _requestPermissions(){
    if (!this.first){
      return
    }
    this.first = false
    return navigator.mediaDevices.getUserMedia({video: true})
      .then(stream=>{
        stream.getVideoTracks().forEach(v=>v.stop())
        stream.getAudioTracks().forEach(a=>a.stop())
        this._getDevices()
      }).catch(err=>{
        console.error('Error gum:', err)
      })
  }
  _gotDevices(deviceInfos) {
    const audioInputs = deviceInfos.filter(d=>d.kind === 'audioinput').map(d=>Object.assign(d))
    const audioOutputs = deviceInfos.filter(d=>d.kind === 'audiooutput').map(d=>Object.assign(d))
    const videoInputs = deviceInfos.filter(d=>d.kind === 'videoinput').map(d=>Object.assign(d))

    const devices = {audioInputs, audioOutputs, videoInputs}
    return devices
    // {deviceId, label, kind}
  }
  _setSelected(i){
    let selectedDevices = this.props.selectedDevices
    const index = selectedDevices.indexOf(i)
    if (index > -1){
      // exists so remove it
      selectedDevices = selectedDevices.filter((s, idx)=>idx !== index)
    } else {
      // doesn't exist so add it
      selectedDevices = selectedDevices.concat(i)
    }
    this.props.setSelectedDevices(selectedDevices)
  }
  _refresh = ()=>{
    this._getDevices().catch(err=>{
      console.error('Error getting devices', err)
    })
  }
  _renderVideosList(){
    if (this.state.loading){
      return <li>Loading...</li>
    }
    const {videoInputs} = this.props.devices
    if (!videoInputs || videoInputs.length < 1){
      return (
        <li>No video inputs</li>
      )
    }
    const videos = videoInputs.map((v,i)=>{
      const props = {}
      let icon = <FaTimes style={{color: 'red'}}/>
      if (this.props.selectedDevices.includes(i)){
        props.className = 'Devices-selected'
        icon = <FaCheck style={{color: '#891'}}/>
      }
      return (
        <li key={'videoInput-' + i} {...props} onClick={()=>this._setSelected(i)} >
          {icon}
          <span style={{marginLeft: '10px', fontSize: '1.1em'}}>{v.label}</span>
        </li>
      )
    })
    return videos
  }
  render(){
    const videos = this._renderVideosList()
    return (
      <div className='Devices-container'>
        <section className='Devices'>
          <button className='Devices-refresh' onClick={this._refresh}>
            <FaRefresh />
          </button>
          <h3 className='Devices-heading'>Video Cameras</h3>
          <ul>
            {videos}
          </ul>
        </section>
      </div>
    )
  }
}

