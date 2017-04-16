import React, { Component } from 'react'
import './KeyboardShortcuts.css'
import {mouseTrap} from 'react-mousetrap'

const cn = function(){
  return Array.from(arguments).filter(a=>a).join(' ')
}
class KeyboardShortcuts extends Component {
  static propTypes = {
    state: React.PropTypes.object.isRequired
  , setState: React.PropTypes.func.isRequired
  }
  componentWillMount(){
    this._bindShortcuts()
    this.setState({
      visible: false
    })
  }
  componentWillUnmount(){
    this.props.unbindAllShortcuts()
  }
  _bindShortcuts(){
    this.props.bindShortcut('?', this._toggleShortcutsPanel)
    this.props.bindShortcut('enter', this._toggleShowVideo)
    this.props.bindShortcut('l', this._toggleLive)
    this.props.bindShortcut('b', this._toggleBackup)
    this.props.bindShortcut('d', this._downloadFull)
    this.props.bindShortcut(['command+enter', 'ctrl+enter'], ()=>location.reload())
  }
  _downloadFull = ()=>{
    const {videoRecorder, useBackupRecorder} = this.props.state
    if (useBackupRecorder && videoRecorder){
      videoRecorder.download()
    }
  }
  _toggleLive = ()=>{
    const {showLiveVideo, showLiveVideoActive, showVideoRecorder} = this.props.state
    if (!showVideoRecorder){
      this.props.setState({showLiveVideo: !showLiveVideo})
    } else {
      this.props.setState({showLiveVideoActive: !showLiveVideoActive})
    }
  }
  _toggleBackup = ()=>{
    const {useBackupRecorder, showVideoRecorder} = this.props.state
    if (!showVideoRecorder){
      this.props.setState({useBackupRecorder: !useBackupRecorder})
    }
  }
  _toggleShortcutsPanel = ()=>{
    this.setState({visible: !this.state.visible})
  }
  _toggleShowVideo = ()=>{
    const {showVideoRecorder, selectedDevices} = this.props.state
    if (!showVideoRecorder && selectedDevices.length === 0) return
    this.props.setState({showVideoRecorder:!showVideoRecorder})
  }
  render(){
    return (
      <article className={cn("KeyboardShortcuts", !this.state.visible && 'hidden')}>
        <section className='Panel'>
          <h2>Keyboard Shortcuts</h2>
          <table>
            <tbody>
              <tr><td>?</td><td>Show keyboard shortcuts</td></tr>
              <tr><td>enter</td><td>Toggle video</td></tr>
              <tr><td>l</td><td>Toggle live recording</td></tr>
              <tr><td>b</td><td>Toggle backup recorder</td></tr>
              <tr><td>d</td><td>Download full length video</td></tr>
              <tr><td>ctrl+enter</td><td>Reload Page</td></tr>
            </tbody>
          </table>
        </section>
      </article>
    )
  }
}

export default mouseTrap(KeyboardShortcuts)
