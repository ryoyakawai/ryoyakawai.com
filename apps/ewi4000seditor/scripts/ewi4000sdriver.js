"use strict";

//import { listMIDIDevices } from './midiconnection.js';
import { sysex_cmd, sysex_cfg } from './ewi4000sconst.js';
import { patchSysExStructure, oscStructure, filterStructure } from './ewi4000ssysexstructure.js'

export class EWI4000sDriver {
  constructor(/*in_options = {sysex: false}*/) {
    this.patchSysExStructure = patchSysExStructure
    /*
     * cable: use 'input' and 'output'
     * ble: use 'output'
     */
    this.device = {
      input: {},
      output: {}
    }
    this.storedPatchList = new Array(sysex_cfg.EWI_NUM_PATCHES)
    this.editPatchList = new Array(sysex_cfg.EWI_NUM_PATCHES)
    this.arr_midiMsgToExclude = [0xe0, 0xd0, 0xcf, 0xb0]
  }
  _sleep(msec=0) {
    console.log(`[_sleep] msec=[${msec}]`)
    new Promise(resolve => setTimeout(resolve, Number(msec)))
  }

  setOneEditPatchFromStoredPatch(patchNo=-1) {
    if (patchNo < 0 || patchNo > sysex_cfg.EWI_NUM_PATCHES) {
      const msg = `[Patch No is out of limit] ${patchNo}`
      console.log(msg)
      throw new Error(msg)
    }
    if (typeof this.editPatchList[patchNo] == 'undefined') {
      this.editPatchList[patchNo] = { decoded: null }
    }
    this.editPatchList[patchNo]['decoded'] = this.storedPatchList[patchNo].decoded
    return this.editPatchList[patchNo]
  }

  getOneEditPatch(patchNo=-1) {
    return this.editPatchList[patchNo]
  }
  /**
   *
   * Type of newVal must be Uint8Array
   *
   **/
  updateOneEditPatch(patchNo=-1, paramName='', newVal=[]) {
    if (patchNo < 0 || patchNo > sysex_cfg.EWI_NUM_PATCHES
        || paramName==''
        || newVal.length < 1) {
      const msg = `[Param is wrong format] patchNo=[${patchNo}] paramName=[${paramName}] newVal=[${newVal}]`
      console.log(msg)
      throw new Error(msg)
    }
    if( !(newVal instanceof Uint8Array) ) {
      let tmp_newVal = null
      if (["string","number"].includes(typeof newVal)) {
        tmp_newVal = new Uint8Array(1)
        tmp_newVal[0] = typeof newVal == 'string' ? Number(newVal) : newVal
      } else {
        tmp_newVal = new Uint8Array(newVal.length)
        newVal.forEach( (oneHex, idx) => {
          tmp_newVal[idx] = typeof oneHex == 'string' ? Number(oneHex) : oneHex
        })
      }
      newVal = tmp_newVal
    }
    this.editPatchList[patchNo]['decoded'][paramName] = newVal
    return this.editPatchList[patchNo]
  }

  getMidiDevice() {
    return this.device
  }

  setOneStoredPatch(patchNo=-1, hexPatch={}, decodedPatch={}) {
    this.storedPatchList[patchNo] = {
      hex: hexPatch,
      decoded: decodedPatch
    }
    return this.storedPatchList[patchNo]
  }

  getSysExStructure() {
    return this.patchSysExStructure
  }

  generateEmptyPatch(patchNo=0) {
    const arr_msg = []
    const sysExstructure = this.getSysExStructure()
    Object.keys(sysExstructure.structure).forEach( idx => {
      const item = sysExstructure.structure[idx]
      for (let i=0; i<item.bytes; i++) {
        arr_msg.push(0)
      }
    })
    const decodedPatch = this.decodeOnePatch(patchNo, arr_msg)
    decodedPatch.patchNameDecoded=''
    decodedPatch.isSynced=false
    decodedPatch.link=0
    return decodedPatch
  }

  getOneStoredPatch(patchNo=-1) {
    return this.storedPatchList[patchNo]
  }

  setMidiDevice(type=null, device={}) {
    if (type != 'input' && type != 'output') {
      const msg = `[setMidiDevice] type=[${type}] device=[${device}]`
      console.error(msg)
      throw new Error(msg)
    }
    this.device[type] = device
  }

  midiOutputTimeout(scb = () => {}) {
    let timerId = null
    let resolve
    const start = () => new Promise((res) => {
      resolve = res
      timerId = setTimeout(async () => {
        // message was not recieved within sysex_cfg.MIDI_TIMEOUT_MS
        timerId = 0
        await scb()
        res(false)
      }, sysex_cfg.MIDI_TIMEOUT_MS)
    })
    return {
      start: start,
      cancel: async () => {
        if (timerId!=null) {
          clearTimeout(timerId)
          timerId = null
          resolve(true)
        }
      }
    }
  }

  // ewi 4000s specific //
  async requestDeviceId(callback = function(){}) {
    const reqMsg = []
    reqMsg.push(sysex_cmd.MIDI_SYSEX_HEADER)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_NONREALTIME)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_ALLCHANNELS)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_GEN_INFO)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_ID_REQ)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_TRAILER)

    // set recieve timeout
    const midiTimeoutCallback = () => {
      console.log('[MIDI OUTPUT TIMEOUT]')
      this.device.input.onmidimessage = () => {}
      callback.bind(this)({
        hex_message: new Uint8Array(),
        is_akai_ewi4ks: false
      })
      /*
      */
    }
    const midiTimeout = this.midiOutputTimeout(midiTimeoutCallback.bind(this))

    //this.device.input.onmidimessage = (event) => {
    // this is call back when sccessfully find EWI 4000s
    function checkIsAkaiEwi4ks(event) {
      midiTimeout.cancel()
      console.log('[MIDI OUTPUT TIMEOUT CANCELED]')
      let msg = []

      if (!this.arr_midiMsgToExclude.includes(event.data[0])) {
        event.data.forEach(data => {
          msg.push(`${('00' + data.toString(16)).substr(-2)}`)
        })
        console.log(`send=[${msg}]`)
        console.log(`isAkaiEwi4ks=[${this.isAkaiEwi4ks(event.data)}]`)
        callback({
          hex_message: msg,
          is_akai_ewi4ks: this.isAkaiEwi4ks(event.data)
        })
      }
      // unset own callbak by own
      this.device.input.onmidimessage = () => {}
    }
    if (!this.device.isBle) {
      this.device.input.onmidimessage = checkIsAkaiEwi4ks.bind(this)
    }

    console.log(reqMsg.join(' '))
    console.log(this.device.output)

    //this.device.output.send(reqMsg)
    const uint8arr = new Uint8Array(reqMsg)
    this.device.output.send(uint8arr)
    // true: message recieved message and timer is canceled
    // false: timeout
    await midiTimeout.start()
    await this._sleep(sysex_cfg.MIDI_TIMEOUT_MS)
  }

  isAkaiEwi4ks(message = []) {
    let isAkaiEwi4ks = false
    if (message[0] == sysex_cmd.MIDI_SYSEX_HEADER
        && message[1] == sysex_cmd.MIDI_SYSEX_NONREALTIME
        && message[5] == sysex_cmd.MIDI_SYSEX_AKAI_ID
        && message[6] == sysex_cmd.MIDI_SYSEX_AKAI_EWI4K
        && message.length == sysex_cfg.EWI_SYSEX_ID_RESPONSE_LEN ) {
      isAkaiEwi4ks = true
    }
    return isAkaiEwi4ks
  }

  /**
   * !!! WATCH !!!
   * Internal Patch No and No on display is differ.
   * User Display  Internal Number
   *   0              99
   *   1               0
   *   2               1
   *         ...
   *  98              97
   *  99              98
   *
   */
  convertPatchNumToInternal(patchNo = -1) {
    patchNo = parseInt(patchNo)
    if (patchNo < 0 || patchNo > sysex_cfg.EWI_NUM_PATCHES) {
      console.error(`[Patch No is out of limit] ${patchNo}`)
      return -1
    }
    let ret_internal = -1
    if (patchNo == 0) {
      ret_internal = 99
    } else {
      ret_internal = patchNo - 1
    }
    return Number(ret_internal)
  }

  // mode ={'store', 'edit'}
  async sendOnePatch(encodedPatch=[], onMidiMessage = () => {}) {
    const mode = 'store' // hard code /* not sure waht mode='edit' does */
    if (encodedPatch.length!=206 || !(encodedPatch instanceof Uint8Array)) {
      const msg = `[sendOnePatch] encodedPatch has wrong format. mode=[${mode}] encodedPatch=[${encodedPatch}]`
      console.log(msg)
      throw new Error(msg)
    }

    // set to CHANNEL to 0x00
    encodedPatch[3] = sysex_cfg.MIDI_SYSEX_CHANNEL

    // set mode
    const modeHex = mode == 'store' ? 0x00 : 0x20
    encodedPatch[4] = modeHex

    this.device.input.onmidimessage = onMidiMessage
    let uint8arr
    if (encodedPatch instanceof Uint8Array) {
      uint8arr = encodedPatch
    } else {
      uint8arr = new Uint8Array(encodedPatch)
    }

    const color = {
      red: '\u001b[31m',
      green: '\u001b[32m'
    }
    encodedPatch.forEach( (item, idx) => {
      console.log(`${color.green}idx=[${idx}] paramName=[${this.patchSysExStructure.getNameByByteIdx(idx)}] value=[${('00'+item.toString(16)).substr(-2)}]`)
    })
    console.log(`[sendOnePatch] encodedPatch instanceof Uint8Array=[${encodedPatch instanceof Uint8Array}]`)
    this.device.output.send(uint8arr)
    console.log(`[Patch sent] mode=[${mode}] patch=[${uint8arr}]`)
    await this._sleep(sysex_cfg.MIDI_TIMEOUT_MS)
  }

  async fetchOnePatch(patchNo = -1, onMidiMessage = () => {}) {
    patchNo=parseInt(patchNo)
    if (patchNo < 0 ) {
      const msg = `[fetchOnePatch] patchNo must be 0 or larger. patchNo=[${patchNo}]`
      console.log(msg)
      throw new Error(msg)
    }
    const reqMsg = []
    reqMsg.push(sysex_cmd.MIDI_SYSEX_HEADER)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_AKAI_ID)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_AKAI_EWI4K)
    reqMsg.push(sysex_cmd.MIDI_SYSEX_CHANNEL)
    reqMsg.push(sysex_cmd.MIDI_PRESET_DUMP_REQ)
    reqMsg.push(this.convertPatchNumToInternal(patchNo))
    reqMsg.push(sysex_cmd.MIDI_SYSEX_TRAILER)

    // set recieve timeout
    const midiTimeoutCallback = () => {
      console.log('[MIDI OUTPUT TIMEOUT]')
      this.device.input.onmidimessage = () => {}
    }
    const midiTimeout = this.midiOutputTimeout(midiTimeoutCallback)

    this.device.input.onmidimessage = (event) => {
      midiTimeout.cancel()
      console.log(`[nomidimessage:fetchOnePatch()]`)
      if (!this.arr_midiMsgToExclude.includes(event.data[0])) {
        const decodedPatch = this.decodeOnePatch(patchNo, event.data)
        this.setOneStoredPatch(patchNo, event.data, decodedPatch)
        const storedPatch = this.getOneStoredPatch(patchNo)
        onMidiMessage(event, patchNo, storedPatch)
      }
      this.device.input.onmidimessage = () => {}
    }

    console.log(reqMsg.join(' '))
    console.log(this.device.output)
    //this.device.output.send(reqMsg)
    const uint8arr = new Uint8Array(reqMsg)
    this.device.output.send(uint8arr)
    // true: message recieved message and timer is canceled
    // false: timeout
    await midiTimeout.start()
    await this._sleep(sysex_cfg.MIDI_TIMEOUT_MS)
  }

  decodeOnePatch(patchNo = null, patchHex = []) {
    console.log(`patchHexLength=[${patchHex.length}]`)
    // [TODO] to check length of HEX
    if (patchHex.length < 1 || patchNo==null) {
      const msg = `[Invalid PatchData] patchNo=[${patchNo}] patchHex=[${patchHex.join(' ')}]`
      console.log(msg)
      throw new Error(msg)
    }
    let decodedPatch = {}
    this.patchSysExStructure.structure.forEach( item => {
      decodedPatch[item.name] = patchHex.slice().slice(item.startIdx, Number(item.startIdx)+Number(item.bytes))
    })
    decodedPatch.patchNo = Number(patchNo)
    decodedPatch.patchNameDecoded = this.decodePatchName(decodedPatch.patchName).join('')
    decodedPatch.osc1Decoded = this.decodeOSC(decodedPatch.osc1)
    decodedPatch.osc2Decoded = this.decodeOSC(decodedPatch.osc2)
    decodedPatch.oscFilter1Decoded = this.decodeFilter(decodedPatch.oscFilter1)
    decodedPatch.oscFilter2Decoded = this.decodeFilter(decodedPatch.oscFilter2)
    decodedPatch.oscFilter1Decoded.link =
      decodedPatch.oscFilter2Decoded.link =
        this.checkFilterLink(decodedPatch.oscFilter1Decoded, decodedPatch.oscFilter2Decoded)
    decodedPatch.noiseFilter1Decoded = this.decodeFilter(decodedPatch.noiseFilter1)
    decodedPatch.noiseFilter2Decoded = this.decodeFilter(decodedPatch.noiseFilter2)
    decodedPatch.noiseFilter1Decoded.link =
      decodedPatch.noiseFilter2Decoded.link =
        this.checkFilterLink(decodedPatch.noiseFilter1Decoded, decodedPatch.noiseFilter2Decoded)
    decodedPatch.antiAliasNRPNDecoded = this.docodeNrpn(decodedPatch.antiAliasNRPN)
    decodedPatch.noiseNRPNDecoded = this.docodeNrpn(decodedPatch.noiseNRPN)
    decodedPatch.miscNRPNDecoded = this.docodeNrpn(decodedPatch.miscNRPN)
    decodedPatch.ampNRPNDecoded = this.docodeNrpn(decodedPatch.ampNRPN)
    decodedPatch.chorusNRPNDecoded = this.docodeNrpn(decodedPatch.chorusNRPN)
    decodedPatch.delayNRPNDecoded = this.docodeNrpn(decodedPatch.delayNRPN)
    decodedPatch.reverbNRPNDecoded = this.docodeNrpn(decodedPatch.reverbNRPN)

    return decodedPatch
  }

  encodePatchName(patchNameString='') {
    if (patchNameString=='') {
      const msg = `[Invalid PatchName] patchNameString=[${patchNameString}]`
      console.log(msg)
      throw new Error(msg)
    }
    let patchNameEncoded = new Uint8Array(sysex_cfg.EWI_PATCHNAME_LENGTH)
    for (let i=0; i<sysex_cfg.EWI_PATCHNAME_LENGTH; i++) {
      let codeIdx = patchNameString.charCodeAt(i)
      if (isNaN(codeIdx)) {
        codeIdx = " ".charCodeAt(0)
      }
      patchNameEncoded[i] = codeIdx
    }
    return patchNameEncoded
  }

  decodePatchName(patchNameHex=[]) {
    console.log(`>>> raw=${patchNameHex.join(' ')}, length=${patchNameHex.length}`)
    if (patchNameHex.length < 1) {
      const msg = `[Invalid PatchName] patchNameHex=[${patchNameHex.join(' ')}]`
      console.log(msg)
      throw new Error(msg)
    }
    let arr_str_patchName = []
    patchNameHex.forEach( charIdx => {
      arr_str_patchName.push(String.fromCharCode(charIdx))
    })
    return arr_str_patchName
  }

  docodeNrpn(nrpnHex=[]) {
    // [TODO] to check length of HEX
    if (nrpnHex.length < 1) {
      const msg = `[Invalid nrpnHex] nrpnHex=[${nrpnHex.join(' ')}]`
      console.log(msg)
      throw new Error(msg)
    }
    const nrpn = {lsb: nrpnHex[0], msb: nrpnHex[1], offset: nrpnHex[2]}
    return nrpn
  }

  // decodedNrpn: {lsb: nrpnHex[0], msb: nrpnHex[1], offset: nrpnHex[2]}
  encodeNrpn(decodedNrpn={}) {
    return [ decodedNrpn.lsb, decodedNrpn.msb, decodedNrpn.offset ]
  }

  // oscDecoded: {}
  encodeOsc(oscDecoded={}) {
    let tmp_encode = []
    oscStructure.forEach( item => {
      if (item.name == 'nrpn') {
        tmp_encode = tmp_encode.concat(this.encodeNrpn(oscDecoded[item.name]))
      } else {
        tmp_encode.push(oscDecoded[item.name])
      }
    })
    return new Uint8Array(tmp_encode)
  }

  // filterDecoded: {}
  encodeFilter(filterDecoded={}) {
    let tmp_encode = []
    filterStructure.forEach( item => {
      if (item.name == 'nrpn') {
        tmp_encode = tmp_encode.concat(this.encodeNrpn(filterDecoded[item.name]))
      } else {
        tmp_encode.push(filterDecoded[item.name])
      }
    })
    return new Uint8Array(tmp_encode)
  }

  decodeOSC(oscHex=[]) {
    // [TODO] to check length of HEX
    if (oscHex.length < 1) {
      const msg = `[Invalid oscHex] oscHex=[${oscHex.join(' ')}]`
      console.log(msg)
      throw new Error(msg)
    }
    console.log('>>>> ', oscHex, oscHex[18], oscHex[19])
    let decodedOsc = {}
    oscStructure.forEach( item => {
      let value = null
      if (item.name == 'nrpn') {
        value = this.docodeNrpn(oscHex.slice().slice(item.startIdx, item.bytes))
      } else {
        value = oscHex.slice().slice(item.startIdx, item.endIdx+1)[0]
      }
      decodedOsc[item.name] = value
    })

    /*
    const _decodedOsc = {
      nrpn: this.docodeNrpn(oscHex.slice().slice(0, 3)),
      //nrpn: {lsb: oscHex[0], msb: oscHex[1], offset: oscHex[2]},
      octave: oscHex[3],
      semitone: oscHex[4],
      fine: oscHex[5],
      beat: oscHex[6],
      filler1: oscHex[7],
      sawtooth: oscHex[8],
      triangle: oscHex[9],
      square: oscHex[10],
      pulseWidth: oscHex[11],
      pwmFreq: oscHex[12],
      pwmDepth: oscHex[13],
      sweepDepth: oscHex[14],
      sweepTime: oscHex[15],
      breathDepth: oscHex[16],
      breathAttain: oscHex[17],
      breathCurve: oscHex[18],
      breathThreshold: oscHex[19],
      level: oscHex[20],
    }
    console.log('!!!!!!!!!!!!!!!!', decodedOsc, _decodedOsc)
    */
    return decodedOsc
  }

  decodeFilter(filterHex=[]) {
    // [TODO] to check length of HEX
    if (filterHex.length < 1) {
      const msg = `[Invalid filterHex] filterHex=[${filterHex.join(' ')}]`
      console.log(msg)
      throw new Error(msg)
    }
    let decodedFilter = {}
    filterStructure.forEach( item => {
      let value = null
      if (item.name == 'nrpn') {
        value = this.docodeNrpn(filterHex.slice().slice(item.startIdx, item.bytes))
      } else {
        value = filterHex.slice().slice(item.startIdx, item.endIdx+1)[0]
      }
      decodedFilter[item.name] = value
    })
    /*
    const _decodedFilter = {
      //nrpn: {lsb: filterHex[0], msb: filterHex[1], offset: filterHex[2]},
      nrpn: this.docodeNrpn(filterHex.slice().slice(0, 3)),
      mode: filterHex[3],
      freq: filterHex[4],
      q: filterHex[5],
      keyFollow: filterHex[6],
      breathMod: filterHex[7],
      lfoFreq: filterHex[8],
      lfoDepth: filterHex[9],
      lfoBreath: filterHex[10],
      lfoThreshold: filterHex[11],
      sweepDepth: filterHex[12],
      sweepTime: filterHex[13],
      breathCurve: filterHex[14],
    }
    console.log('!!!!!!!!!!!!!!!!', decodedFilter, _decodedFilter)
    */
    return decodedFilter
  }

  checkFilterLink(param1={}, param2={}) {
    if (Object.keys(param1)==0 && Object.keys(param2)==0) {
      return false
    }
    const keys = Object.keys(param1)
    for (let i=0; i<keys.length; i++) {
      if (param1[keys[i]] == param2[keys[i]]) {
        return false
      }
    }
    return true
  }

  // [??] [TODO] NOT SURE what 'miscNRPN' stand for
  encodeOnePatch(decodedPatch={}) {
    const localDecodedPatch = {}
    const arr_excludeList = [
      'osc1', 'osc2',
      'oscFilter1', 'oscFilter2',
      'noiseFilter1','noiseFilter2',
      'patchName',
      'antiAliasNRPN','noiseNRPN', /*'miscNRPN',*/
      'ampNRPN','chorusNRPN','delayNRPN', 'reverbNRPN'
    ]
    this.patchSysExStructure.getStructureKeys().forEach( idxName => {
      if (!arr_excludeList.includes(idxName)) {
        localDecodedPatch[idxName] = decodedPatch[idxName]
      }
    })
    localDecodedPatch.osc1 = this.encodeOsc(decodedPatch.osc1Decoded)
    localDecodedPatch.osc2 = this.encodeOsc(decodedPatch.osc2Decoded)
    localDecodedPatch.oscFilter1 = this.encodeFilter(decodedPatch.oscFilter1Decoded)
    localDecodedPatch.oscFilter2 = this.encodeFilter(decodedPatch.oscFilter2Decoded)
    localDecodedPatch.noiseFilter1 = this.encodeFilter(decodedPatch.noiseFilter1Decoded)
    localDecodedPatch.noiseFilter2 = this.encodeFilter(decodedPatch.noiseFilter2Decoded)
    localDecodedPatch.antiAliasNRPN = this.encodeNrpn(decodedPatch.antiAliasNRPNDecoded)
    localDecodedPatch.noiseNRPN = this.encodeNrpn(decodedPatch.noiseNRPNDecoded)
    //localDecodedPatch.miscNRPN = this.encodeNrpn(decodedPatch.miscNRPN)
    localDecodedPatch.ampNRPN = this.encodeNrpn(decodedPatch.ampNRPNDecoded)
    localDecodedPatch.chorusNRPN = this.encodeNrpn(decodedPatch.chorusNRPNDecoded)
    localDecodedPatch.delayNRPN = this.encodeNrpn(decodedPatch.delayNRPNDecoded)
    localDecodedPatch.reverbNRPN = this.encodeNrpn(decodedPatch.reverbNRPNDecoded)
    localDecodedPatch.patchName = this.encodePatchName(decodedPatch.patchNameDecoded)

    if (Object.keys(localDecodedPatch).length < 1 ) {
      const msg = `[Invalid decodedPatch] decodedPatch=[${Object.keys(decodedPatch)}] length=[${Object.keys(decodedPatch).length}]`
      console.log(msg)
      throw new Error(msg)
    }
    let encodedPatch = new Uint8Array(206)

    // add concat function to each element
    let idx = 0
    encodedPatch.concat = (item) => {
      if (typeof item == 'number') {
        encodedPatch[idx] = item
        idx += 1
      } else {
        Object.keys(item).forEach( eachIdx => {
          encodedPatch[idx] = item[eachIdx]
          idx += 1
        })
      }
    }

    this.patchSysExStructure.getStructureKeys().forEach( idxName => {
      //encodedPatch.concat(decodedPatch[idxName])
      encodedPatch.concat(localDecodedPatch[idxName])
    })
    return encodedPatch
  }

}



