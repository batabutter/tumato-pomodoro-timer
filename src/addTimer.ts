import * as fs from "fs";
import * as path from "path";
import { renderPresetList } from "./presets";


const createTimerPopup = document.getElementById("create_timer_container") as HTMLDivElement;
const plusButton = document.getElementById("plus_button") as HTMLButtonElement;
const saveButton = document.getElementById("save_button") as HTMLButtonElement;
const cancelButton = document.getElementById("cancel_button") as HTMLButtonElement;

const workTimer = document.getElementById("create_work_timer") as HTMLDivElement;
const breakTimer = document.getElementById("create_break_timer") as HTMLDivElement;

const timerName = document.getElementById("create_timer_name") as HTMLInputElement;

const filePath = path.join(__dirname, "../customization/timer-presets.json");

let timerElements: HTMLParagraphElement[] = [];
let selected = -1;
let currentTarget: HTMLElement | null = null;

const numSegments = 3;
const maxTimeHrMin = 60;
const msInHour = 3600000;

export const loadTimerElements = () => {
    timerElements = Array.from(workTimer.querySelectorAll("p"));
    timerElements = timerElements.concat(Array.from(breakTimer.querySelectorAll("p")))
    let index = 0;

    for (let i of timerElements) {
        i.tabIndex = 0;
        i.addEventListener("keydown",
            (key: KeyboardEvent) => {
                const index = timerElements.indexOf(i);

                console.log(`Inner text > ${i.innerText}`)

                const charCode = key.key;
                const innerText = i.innerText;
                if (charCode >= "0" && charCode <= "9") {
                    console.log("Key pressed > " + key.key);

                    let temp = innerText + charCode;
                    let altered = temp.substring(1);

                    if (parseInt(altered, 10) >= maxTimeHrMin
                        && (index % numSegments) !== 0)
                        altered = "0" + altered.substring(1);
                    i.innerText = altered;
                }
            })
    }
    console.log(`Loading timer elements > ${timerElements}`)
}

const openTimerPopup = () => {
    createTimerPopup.classList.remove("fade_out");
    createTimerPopup.classList.add("fade_in");

    const parentElement = createTimerPopup.parentElement;

    if (parentElement)
        parentElement.classList.add("backdrop");
}

const saveTimer = async () => {

    try {
        const data = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(data);
        let count = 0;
        let name = timerName.value;

        if (name === "") 
            name = "Timer"

        let workDuration = 0;
        let breakDuration = 0;
        let offset = msInHour;

        /* Create work */
        for (let i = 0; i < numSegments; i++) {
            const pElt = timerElements[i];
            window.messaging.log(`What the fuck > ${workDuration}`)
            workDuration += parseInt(pElt.innerText) * offset;
            window.messaging.log(`What the fuck>>>>>>>>>>>> > ${workDuration}`)
            offset /= 60;
        }

        offset = msInHour;

        /* Create Break */

        for (let i = numSegments; i < timerElements.length; i++) {
            const pElt = timerElements[i];
            breakDuration += parseInt(pElt.innerText) * offset;
            offset /= 60;
        }

        window.messaging.log(`Name: ${name} Work Duration: ${workDuration} Break Duration${breakDuration}`)

        const newPreset = {
            "name": name,
            "workDuration": workDuration,
            "breakDuration": breakDuration,
            "id": json.presets.length
        }

        json.presets.push(newPreset);

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");
        
        closeTimerPopup();
        renderPresetList();

    } catch (error) {
        console.log(`Couldn't save Timer ${error}`)
        closeTimerPopup();
    }
}

const closeTimerPopup = () => {
    createTimerPopup.classList.remove("fade_in");
    createTimerPopup.classList.add("fade_out");

    const parentElement = createTimerPopup.parentElement;

    if (parentElement)
        parentElement.classList.remove("backdrop");
}

/* Should probably have a flag in case this gets clicked again */
plusButton.addEventListener("click", openTimerPopup);
saveButton.addEventListener("click", saveTimer);
cancelButton.addEventListener("click", closeTimerPopup);

const handleSelection = (target: HTMLParagraphElement) => {
    const index = timerElements.indexOf(target);
    console.log(`Index > ${index}`)
    target.focus();

    if (selected !== index) {

        if (currentTarget)
            currentTarget.classList.remove("timer_segment_selection")

        currentTarget = target;
        selected = index;
        console.log(`Selected: ${index}`);

        currentTarget.classList.add("timer_segment_selection")
    }
}

workTimer.addEventListener("click",
    function (e: PointerEvent) {
        const target = (e.target as HTMLElement).closest('p');
        console.log(`Made it inside work timer create${target}`);

        if (target) {
            handleSelection(target);
        }
    }
)

breakTimer.addEventListener("click",
    function (e: PointerEvent) {
        const target = (e.target as HTMLElement).closest('p');
        console.log(`Made it inside break timer create${target}`);

        if (target) {
            handleSelection(target);
        }
    }
)