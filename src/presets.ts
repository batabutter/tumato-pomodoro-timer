import * as path from "path";
import * as fs from "fs";

const preset_list = document.getElementById("timer_preset_list") as HTMLDivElement;
const li = document.getElementsByTagName("li");
let listElements:HTMLElement[] = [];
let buttonElements:HTMLButtonElement[] = [];
let selected = -1;
let currentTarget:HTMLElement | null = null;

const filePath = path.join(__dirname, "../customization/timer-presets.json");

export const renderPresetList = async () => {

    window.messaging.log("rendering preset list");

    try {
        const data = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(data);

        preset_list.innerHTML =
            `<ul> ${json.presets.map(
                (timer: TimerData) =>
                    (`
                        <div class="inner">
                            <li>
                                <div class="inner"> </div>
                                <p>${timer.name}</p>
                                <p>Work: ${window.timer.formatTime(timer.workDuration)}</p>
                                <p>Break: ${window.timer.formatTime(timer.breakDuration)}</p>
                            </li>
                            <button id="${timer.id}"><i class="fa-solid fa-trash"></i></button>
                        </div>`)
                ).join('')}
            </ul>`;

        listElements = Array.from(preset_list.querySelectorAll("li"));
        buttonElements = Array.from(preset_list.querySelectorAll("button"));

    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`)
    }
}

const loadPreset = async (index: number) => {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(data);

        console.log(json.presets)

        let preset = json.presets[index];

        window.timer.updateTimer(preset.name, preset.workDuration, preset.breakDuration);
    } catch (error) {
        console.log(`Couldn't load timer preset data :${error}`);
    }
}

preset_list.addEventListener("click",
    function (e: PointerEvent) {
        const target = (e.target as HTMLElement).closest('li');
        const delete_target = (e.target as HTMLElement).closest('button');

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
        } else if (delete_target){
            const index = buttonElements.indexOf(delete_target);
            window.messaging.log(`deleting ${index}`);

            if (selected === index) {
                selected = -1;
            }

            try {
                const data = fs.readFileSync(filePath, "utf-8");
                const json = JSON.parse(data);

                json.presets.splice(index, 1);
                
                fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");

                renderPresetList();
            } catch (error) {
                window.messaging.log(error);
            }
        }
})