"use strict";

import { listMIDIDevices } from './midiconnection.js';
import { EWI4000sDriver } from './ewi4000sdriver.js';

( async () => {
  const requestMIDIAccessOption = {sysex: true}
  const ewi4ks = new EWI4000sDriver()
  let targetPatch = {}

  document.querySelector('button#listMIDIDevices01').addEventListener('mousedown', async (event) => {
    const options = { sysex: true }
    const ret_midi = await listMIDIDevices(requestMIDIAccessOption)

    if (ret_midi.success) {
      console.log(ret_midi.devices)
      ewi4ks.setMidiDevice('input', ret_midi.devices.inputs[0])
      ewi4ks.setMidiDevice('output', ret_midi.devices.outputs[0])
      console.log(ewi4ks.getMidiDevice())
    } else {
      console.error(ewi4ks.error_msg)
    }
  })

  document.querySelector('button#reqDeviceId01').addEventListener('mousedown', async (event) => {
    ewi4ks.requestDeviceId()
  })

  document.querySelector('button#reqPatch01').addEventListener('mousedown', async (event) => {
    const patchNo = Number(event.target.previousSibling.value)
    const patchNameArea =  document.querySelector('input#patchName01')

    function onMidiMessage(event) {
      const patch = this.getOneStoredPatch(patchNo)
      patchNameArea.setAttribute('value', patch.decoded.patchNameDecoded.replace(/ /g, ''))
    }

    ewi4ks.fetchOnePatch(patchNo, onMidiMessage.bind(ewi4ks))

    const patchName = "TAKARAJIMA                   "
    const patchNameEncoded = ewi4ks.encodePatchName(patchName)
    console.log('[ENCODED PATCHNAME]', ewi4ks.encodePatchName(patchName), patchNameEncoded.length)
  })

  document.querySelector('button#sendPatch01').addEventListener('mousedown', async (event) => {
    const newPatchName =  document.querySelector('input#patchName01').value
    const patchNo = Number(document.querySelector('input#patchNumber01').value)
    try {
      ewi4ks.setOneEditPatchFromStoredPatch(patchNo)
      console.log(ewi4ks.getOneEditPatch(patchNo))
      const encodedPatchName = ewi4ks.encodePatchName(newPatchName)
      const newDecodedPatch = ewi4ks.updateOneEditPatch(patchNo, 'patchName', encodedPatchName)
      const newEncodedPatch = ewi4ks.encodeOnePatch(newDecodedPatch.decoded)
      function onMidiMessage(event) {
        let msg = []
        if (event.data[0]!=0xe0) {
          console.log(event.data)
        }
      }
      ewi4ks.sendOnePatch(newEncodedPatch, onMidiMessage)
    } catch (err) {
      console.error(err)
    }
  })


  function compareEncodedDecoded(event_data=[]) {
    const decodedPatch = this.decodeOnePatch(event_data)
    console.log('[DOCODED] ', decodedPatch)
    const encodedPatch = this.encodeOnePatch(decodedPatch)
    console.log('[ENCODED] ', encodedPatch)

    let msg = []
    event_data.forEach(data => {
      msg.push(`${('00' + data.toString(16)).substr(-2)}`)
    })

    let ret_out = []
    msg.forEach( digit => {
      ret_out.push(parseInt(digit, 16))
    })
    for(let i=0; i<ret_out.length; i++) {
      console.log(`[${i}] [${ret_out[i] == encodedPatch[i]}] Hex: ${ret_out[i]} ${encodedPatch[i]}` )
    }
  }
})()
