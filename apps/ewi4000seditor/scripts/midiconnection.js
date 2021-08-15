"use strict";

export class WebMIDI {
  constructor() {
    this.midi_access = {}
    this.midi_devices = {
      inputs: [],
      outputs: []
    }
    this.onStateChangeCallback = (event) => {
      console.log(event)
    }
  }

  setOnStateChangeCallback(func = () => {}) {
    this.onStateChangeCallback = func
  }

  getMidiDevices() {
    return this.midi_devices
  }

  async listMIDIDevices(options = {sysex: false}) {
    const ret_val = {
      success: false,
      error_msg: null,
      devices: {}
    }
    try {
      this.midi_access = await navigator.requestMIDIAccess(options)
      this.midi_access.onstatechange = this._onStateChange.bind(this)
      ret_val.success = true
      this.midi_devices.inputs = this._getArrayDevices(this.midi_access.inputs.values())
      this.midi_devices.outputs = this._getArrayDevices(this.midi_access.outputs.values())
      ret_val.devices = this.midi_devices
    } catch (error) {
      ret_val.success = false
      ret_val.error_msg = error
    }
    return ret_val
  }

  _onStateChange(event) {
    if (event.port instanceof MIDIInput || event.port instanceof MIDIOutput) {
      if (event.port.state == 'disconnected') {
        this.midi_devices[`${event.port.type}s`].forEach( (port, idx) => {
          if (port.id == event.port.id) {
            this.midi_devices[`${event.port.type}s`].splice(idx, 1)
          }
        })
      } else
      if (event.port.state == 'connected') {
        this.midi_devices[`${event.port.type}s`].push(event.port)
      }
    }
    this.onStateChangeCallback(this.midi_devices)
  }

  _getArrayDevices(iterator=null) {
    let ret = []
    if (typeof iterator[Symbol.iterator] !== 'function') {
      return ret
    }
    for (let i= iterator.next(); !i.done; i=iterator.next()) {
      ret.push(i.value);
    }
    return ret
  }

}

/*
export {
  listMIDIDevices
}

async function listMIDIDevices(options = {sysex: false}, onStateChange = () => {}) {
  const ret_val = {
    success: false,
    error_msg: null,
    devices: {
      inputs: {},
      outputs: {}
    }
  }
  try {
    let midi_devices = await navigator.requestMIDIAccess(options)
    midi_devices.onstatechange = onStateChange
    ret_val.success = true
    ret_val.devices.inputs = _getArrayDevices(midi_devices.inputs.values())
    ret_val.devices.outputs = _getArrayDevices(midi_devices.outputs.values())
  } catch (error) {
    ret_val.success = false
    ret_val.error_msg = error
  }
  return ret_val

  function _getArrayDevices(iterator=null) {
    let ret = []
    if (typeof iterator[Symbol.iterator] !== 'function') {
      return ret
    }
    for (let i= iterator.next(); !i.done; i=iterator.next()) {
      ret.push(i.value);
    }
    return ret
  }
}
*/

