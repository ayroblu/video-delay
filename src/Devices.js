import React, { Component } from 'react'
import './Devices.css'
import FaTimes from 'react-icons/lib/fa/close'
import FaCheck from 'react-icons/lib/fa/check'

export default class Devices extends Component {
  static propTypes = {
    devices: React.PropTypes.object.isRequired
  , setDevices: React.PropTypes.func.isRequired
  , selectedDevices: React.PropTypes.array.isRequired
  , setSelectedDevices: React.PropTypes.func.isRequired
  }
  componentWillMount(){
    this._getDevices().catch(err=>{
      console.error('Error getting devices', err)
    })
  }
  async _getDevices(){
    const deviceInfos = await navigator.mediaDevices.enumerateDevices()
    const devices = await this._gotDevices(deviceInfos)
    this.props.setDevices(devices)
    this.props.setSelectedDevices(devices.videoInputs.map((d,i)=>i))
    return devices
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
  render(){
    const {videoInputs} = this.props.devices
    if (!videoInputs){
      return (
        <div>No video inputs</div>
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
    return (
      <div className='Devices-container'>
        <div className='Devices'>
          <h3 className='Devices-heading'>Video Cameras</h3>
          <ul>
            {videos}
          </ul>
        </div>
      </div>
    )
  }
}

