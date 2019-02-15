"use strict";

import { MIDIUtils } from "./midiutils.js";
import { clearToDefault, dispParsedMIDI, dispParsedMIDIExp, addToHistory } from "./screenhandler.js";

clearToDefault();
let dispState = "remove"; // leave/remove
let timerId = 0;

document.querySelector("#clear-button").addEventListener("mousedown", clearToDefault, false);

// for MIDI over Web Bluetooth
let mdUtls = new MIDIUtils();    
mdUtls.setnMidiEventHandleCallback( event => {
  dispParsedMIDI(event);
  dispParsedMIDIExp(event);
  window.clearTimeout(timerId);
  timerId = window.setTimeout(() => {
    timerId = timerId;
    if(dispState == "remove") {
      clearToDefault();
      document.querySelector("#disp-input-port").innerText="";
    }
  }, 3000);
});
mdUtls.setStartBleCallabck( event => {
  document.getElementById("start-ble").innerText = "Disconnect BLE MIDI";
});
mdUtls.setEndBleCallabck( event => {
  document.getElementById("start-ble").innerText = "Connect BLE MIDI";
});
document.querySelector("#start-ble").addEventListener("mousedown", event => {
  let name = document.getElementById("start-ble").innerText;
  if(name == "Connect BLE MIDI") {
    mdUtls.startBle.bind(mdUtls)(event);
  } else {
    mdUtls.endBle.bind(mdUtls)(event);
  }
}, false);


// for legacy wired MIDI
window.addEventListener('midiin-event:input-port', event => {
  // send msg to output
  let output=document.getElementById("output-port");
  if(output.checkOutputIdx!="false") {
    output.sendRawMessage(event.detail.data);
  }
  
  // handle input msg
  let out = [], disp = true;
  if(event.detail.data[0]==0xfe || event.detail.data[0]==0xf8) {
    disp = false;
  } else {
    dispParsedMIDI(event);
    dispParsedMIDIExp(event);

    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      timerId = timerId;
      if(dispState == "remove") {
        clearToDefault();
        document.querySelector("#disp-input-port").innerText="";
      }
    }, 3000);
  }
});

document.querySelector("#disp-state").addEventListener("mousedown", event => {
  let outVal=0;
  if(dispState=="leave") {
    dispState="remove";
    event.target.innerHTML="pause_circle_outline";
    outVal=0x00;
  } else {
    dispState="leave";
    event.target.innerHTML="play_circle_outline";
    outVal=0x40;
  }
  // search output port which has same name with input port
  let midi = document.getElementById("x-webmidi").midi;
  let outputs = midi.outputs, inputs = midi.inputs;
  let inputIdx=document.getElementById("input-port").inputIdx;
  for(let i=0; i<outputs.length; i++) {
    if(outputs[i].name == inputs[inputIdx].name) {
      outputs[i].send([0xb0, 0x11, outVal]);
      break;
    }
  }
});

