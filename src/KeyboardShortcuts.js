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
          <p>?: Show keyboard shortcuts</p>
        </section>
      </article>
    )
  }
}

export default mouseTrap(KeyboardShortcuts)
