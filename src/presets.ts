import * as path from "path";
import * as fs from "fs";

const preset_list = document.getElementById("timer_preset_list") as HTMLDivElement;
const li = document.getElementsByTagName("li");
let listElements: HTMLElement[] = [];
let buttonElements: HTMLButtonElement[] = [];
let selected = -1;
let currentTarget: HTMLElement | null = null;
let filePath = "";

export const getFilePath = (): string => { return filePath; }

export const setFilePath = (): void => {
    if (!window.appState.isPackaged) {
        filePath = path.join(__dirname, "../customization", "timer-presets.json");
    } else {
        filePath = path.join(window.appState.dataPath, "timer-presets.json");

        if (!fs.existsSync(window.appState.dataPath)) {
            /*
            const tempPath = path.join(window.appState.appPath, "/customization/timer-presets.json");
            const data = fs.readFileSync(tempPath, "utf-8");
            const json = JSON.parse(data);
            */
            const json = {
                "presets": [
                ]
            }

            console.log(`Data path > ${filePath}`)
            console.log(json);

            fs.mkdirSync(window.appState.dataPath, { recursive: true });

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
            console.log(`wrote to file`);
        }
    }
}


export const renderPresetList = async () => {
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
    function (e: MouseEvent) {
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
        } else if (delete_target) {
            const index = buttonElements.indexOf(delete_target);
            console.log(`deleting ${index}`);

            if (selected === index) {
                selected = -1;
            }

            try {
                const data = fs.readFileSync(filePath, "utf-8");
                const json = JSON.parse(data);

                json.presets.splice(index, 1);

                fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
                console.log(json);

                renderPresetList();
            } catch (error) {
                console.log(error);
            }
        }
    })