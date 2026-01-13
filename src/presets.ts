const preset_list = document.getElementById("timer_presets") as HTMLDivElement

const renderPresetList = async () => {
    
    try {
        const res = await fetch("../customization/timer-presets.json");
        const json = await res.json();

        console.log(`Made it here before > ${preset_list}`);
        preset_list.innerHTML += 
        `<ul> ${json.presets.map(
                    (timer:TimerData) => (`<li><p>${timer.name}</p><p>${timer.duration}</p></li>`)).join('')}
        </ul>`;
            
        console.log("Made it here");


    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`)
    }
}

const savePreset = () => {

}

renderPresetList();