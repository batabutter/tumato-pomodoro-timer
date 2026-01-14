import { updateTimer, formatTime }from "./timer.js";

const preset_list = document.getElementById("timer_preset_list") as HTMLDivElement;
const li = document.getElementsByTagName("li");
let listElements:HTMLElement[] = [];
let selected = -1;
let currentTarget:HTMLElement | null = null;

const renderPresetList = async () => {

    try {
        const res = await fetch("../customization/timer-presets.json");
        const json = await res.json();

        preset_list.innerHTML +=
            `<ul> ${json.presets.map(
                (timer: TimerData) =>
                    (`<li>
                        <p>${timer.name}</p>
                        <p>Work: ${formatTime(timer.workDuration)}</p>
                        <p>Break: ${formatTime(timer.breakDuration)}</p>
                        </li>`)).join('')}
            </ul>`;

        listElements = Array.from(preset_list.querySelectorAll("li"));


    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`)
    }
}

const savePreset = () => {

}

const loadPreset = async (index: number) => {
    try {
        const res = await fetch("../customization/timer-presets.json");
        const json = await res.json();

        console.log(json.presets)

        let preset = json.presets[index];

        updateTimer(preset.name, preset.workDuration, preset.breakDuration);
    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`);
    }
}

preset_list.addEventListener("click",
    function (e: PointerEvent) {
        const target = (e.target as HTMLElement).closest('li');

        if (target) {
            const index = listElements.indexOf(target);

            if (selected !== index) {

                if (currentTarget)
                    currentTarget.classList.remove("list_selection_border")

                currentTarget = target;
                selected = index;
                console.log(`Selected: ${index}`);
                loadPreset(selected);
                
                currentTarget.classList.add("list_selection_border")
            }
        }
    })

renderPresetList();