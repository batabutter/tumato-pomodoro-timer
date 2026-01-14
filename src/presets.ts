const preset_list = document.getElementById("timer_preset_list") as HTMLDivElement

const renderPresetList = async () => {
    
    try {
        const res = await fetch("../customization/timer-presets.json");
        const json = await res.json();

        preset_list.innerHTML += 
            `<ul> ${json.presets.map(
                        (timer:TimerData) => 
                            (`<li><p>${timer.name}</p><p>Work: ${timer.workDuration}</p><p>Break: ${timer.breakDuration}</p></li>`)).join('')}
            </ul>`;
            
        console.log("Made it here");


    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`)
    }
}

const savePreset = () => {

}

renderPresetList();