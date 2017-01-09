//https://developers.google.com/web/updates/2015/10/media-devices
//https://webrtc.github.io/samples/src/content/devices/input-output/
class Devices {
  getDevices(){
    return navigator.mediaDevices.enumerateDevices()
    .then(this._gotDevices.bind(this))
    .catch(err=>{
      console.error('Error getting devices', err)
    })
  }
  _gotDevices(deviceInfos) {
    const audioInputs = deviceInfos.filter(d=>d.kind === 'audioinput').map(d=>Object.assign(d))
    const audioOutputs = deviceInfos.filter(d=>d.kind === 'audiooutput').map(d=>Object.assign(d))
    const videoInputs = deviceInfos.filter(d=>d.kind === 'videoinput').map(d=>Object.assign(d))

    //audioInputs.forEach((ai, i)=>{
    //  ai.label = ai.label || 'Microphone: ' + i
    //})
    //audioOutputs.forEach((ao, i)=>{
    //  ao.label = ao.label || 'Speaker: ' + i
    //})
    //videoInputs.forEach((vi, i)=>{
    //  vi.label = vi.label || 'Camera: ' + i
    //})
    const devices = {audioInputs, audioOutputs, videoInputs}
    this.devices = devices
    return devices
    // {deviceId, label, kind}
  }
}
class Streamer {
  start(videoSource, audioSource) {
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    }
    return navigator.mediaDevices.getUserMedia(constraints)
      .catch(err=>{
        console.error('Error gum:', err)
      })
  }
}

//https://developers.google.com/web/updates/2016/01/mediarecorder
class Recorder {
  constructor(videoElement){
    this.videoElement = videoElement
    this.recording = []
    this.recordedChunks = []
  }
  start(stream, delay){
    const options = {mimeType: 'video/webm;codecs=vp9'}
    if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      throw new Error('TypeError: codec is not supported')
      return
    }
    const mediaRecorder = new MediaRecorder(stream, options)
    mediaRecorder.ondataavailable = event=>{
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data)
      } else {
        // ...
      }
    }
    mediaRecorder.start(100)
    this.mediaRecorder = mediaRecorder
    this.play(stream, delay)
  }
  stop(){
    if (!this.mediaRecorder) {
      return
    }
    this.mediaRecorder.stop()
  }
  play(stream, delay){
    setTimeout(()=>{
      const superBuffer = new Blob(this.recordedChunks)
      console.log('Buffer:', superBuffer)
      const url = window.URL.createObjectURL(superBuffer)
      this.videoElement.src = url
      this.stop()
      setTimeout(()=>{
        this.nextTrack()
        this.start(stream, delay)
      })
    }, delay)
  }
  download(){
    const blob = new Blob(this.recording, {
      type: 'video/webm'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = 'test.webm'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  nextTrack(){
    this.recording = this.recording.concat(this.recordedChunks)
    this.recordedChunks = []
  }
}
async function run(){
  const videoElement = document.querySelector('video.first')
  if (!videoElement) return
  const width = document.documentElement.clientWidth + 'px'
  const height = document.documentElement.clientHeight - 100 + 'px'
  Object.assign(videoElement.style, { height, width })

  const devices = new Devices()
  const streamer = new Streamer()
  const recorder = new Recorder(videoElement)

  const devicesList = await devices.getDevices()
  const videoInput = devicesList.videoInputs.slice(-1)[0]
  const audioInput = devicesList.audioInputs.slice(-1)[0]
  const stream = await streamer.start(videoInput.deviceId, audioInput.deviceId)
  recorder.start(stream, 6000)
}

const button = document.querySelector('button.startButton')
button.onclick = e=>{
  run()
}
