const information = document.getElementById('info')
import { loadTimerElements } from './addTimer.js';
import { renderPresetList } from './presets.js';
import { formatTime, initTimer, updateTimer } from './timer.js';

console.log(information)
console.log(window.versions)

if (information && window.versions)
    information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`
else if (information)
    information.innerText = `Renderer Error`

const func = async () => {
    console.log("Alive > ");
}

window.timer = {
    updateTimer: updateTimer,
    formatTime: formatTime
}

func();
initTimer();
renderPresetList();
loadTimerElements();