import React, { Component } from 'react'
import './VideoRecorder.css'
import FaClose from 'react-icons/lib/fa/close'

export default class VideoRecorder extends Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired
  , delay: React.PropTypes.number.isRequired
  , setVideo: React.PropTypes.func.isRequired
  , devices: React.PropTypes.object.isRequired
  , selectedDevices: React.PropTypes.array.isRequired
  }
  constructor(props){
    super(props)
    this.state = {
      videoBlobs: []
    , videoStreams: []
    , videoStreamUrls: []
    }
    this._primaryRecorders = []
    this._backupRecorders = []
    this._recordings = []
    this._timeouts = []
  }
  _getMediaRecorder(stream, chunksArr){
    const options = {mimeType: 'video/webm;codecs=vp9'}
    const mediaRecorder = new window.MediaRecorder(stream, options)
    mediaRecorder.ondataavailable = event=>{
      if (event.data.size > 0) {
        chunksArr.push(event.data)
      }
    }
    mediaRecorder.start()
    return mediaRecorder
  }
  _getStream(videoSource, audioSource) {
    const constraints = {
      //audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    }
    return navigator.mediaDevices.getUserMedia(constraints)
      .catch(err=>{
        console.error('Error gum:', err)
      })
  }
  _play(stream, index){
    this._recordings[index] = []
    // recordings use a lot of CPU...
    //this._backupRecorders[index] = this._getMediaRecorder(stream, this._recordings[index])
    this._runRecursiveRecorder(stream, index)
  }
  _runRecursiveRecorder(stream, index){
    let recordedChunks = []
    this._primaryRecorders[index] = this._getMediaRecorder(stream, recordedChunks)

    this._timeouts[index] = setTimeout(()=>{
      const superBuffer = new Blob(recordedChunks)
      const url = window.URL.createObjectURL(superBuffer)
      const videoBlobs = this.state.videoBlobs.concat()
      videoBlobs[index] = url
      this.setState({...this.state, videoBlobs})
      this._primaryRecorders[index].stop()
      setTimeout(()=>{
        this._runRecursiveRecorder(stream, index)
      })
    }, this.props.delay)
  }
  _stop(){
    this._primaryRecorders.map(r=>r.stop())
    //this._backupRecorders.map(r=>r.stop())
    this._primaryRecorders = []
    //this._backupRecorders = []
    this._timeouts.map(t=>clearTimeout(t))
    this.state.videoStreams.forEach(s=>{
      s.getVideoTracks().forEach(v=>v.stop())
      s.getAudioTracks().forEach(a=>a.stop())
    })
    this.setState({videoStreams:[], videoStreamUrls:[], videoBlobs: []})
  }
  download(){
    this._recordings.forEach((r, idx)=>{
      const d = new Date()
      const n = d.toISOString().slice(0,19)
      const filename = "r_"+n+"_"+idx+".webm"

      const blob = new Blob(r, {
        type: 'video/webm'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }
  async _run(){
    const devices= this.props.devices
    //const videoInput = devices.videoInputs.slice(-1)[0]
    const audioInput = devices.audioInputs.slice(-1)[0]
    const streams = await Promise.all(devices.videoInputs.filter((v,i)=>{
      return this.props.selectedDevices.includes(i)
    }).map(v=>{
      return this._getStream(v.deviceId, audioInput.deviceId)
    }))
    streams.forEach((s, i)=>this._play(s, i))
    this.setState({...this.state
    , videoStreams: streams
    , videoStreamUrls: streams.map(s=>window.URL.createObjectURL(s))
    })
  }
  componentWillReceiveProps(newProps){
    if (!this.props.visible && newProps.visible){
      this._run()
    }
    if (!newProps.visible && this._primaryRecorders.length) {
      this._stop()
    }
  }
  render() {
    const divStyle = this.props.visible ? {display: 'block'} : {display: 'none'}
    const numVideos = this.state.videoStreams.length
    const cols = Math.ceil(Math.sqrt(numVideos))
    const rows = Math.ceil(numVideos/cols)
    const videos = this.state.videoStreamUrls.map((url, idx)=>{
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
      return (
        <div key={'video-'+idx}>
          <video autoPlay src={this.state.videoBlobs[idx]} style={videoStyle} className="VideoRecorder-delayed"/>
          <video autoPlay src={url} style={popupStyle} className="VideoRecorder-live"/>
        </div>
      )
    })
    return (
      <div className="VideoRecorder" style={divStyle}>
        {videos}
        <div onClick={()=>this.props.setVideo(false)} className="VideoRecorder-close">
          <FaClose/>
        </div>
      </div>
    )
  }
}

//https://developers.google.com/web/updates/2015/10/media-devices
//https://webrtc.github.io/samples/src/content/devices/input-output/
