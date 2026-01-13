const canvas = document.getElementById("timer") as HTMLCanvasElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
const stop_button = document.getElementById("stop_button") as HTMLButtonElement;
const reset_button = document.getElementById("reset_button") as HTMLButtonElement;

const ctx = canvas ? canvas.getContext("2d") : null;
const parentElement = canvas.parentElement;

const lineWidth = 20;
const outerRadius = Math.min((canvas.width) / 2, (canvas.height) / 2);
const color_scheme_bg ="rgb(255, 255, 255)";
const color_scheme_font = "rgb(32, 206, 250)";
const color_scheme_canvas = parentElement ? getComputedStyle(parentElement).backgroundColor : "white";

let requestId: number = -1;
let totalTime = 10000;

let pausedTime:number = 0;
let pausedStart: number | null = null;
let startTime: number | null = null;

let elasped_time = 0;

const formatTime = (time: number) => {

}

// 60000

const draw_background = () => {
    const time = new Date();

    if (!ctx) return;

    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    // Draw the background
    ctx.strokeStyle = color_scheme_bg;
    ctx.arc(
        outerRadius,
        outerRadius,
        outerRadius - lineWidth, 0, 2 * Math.PI);
    ctx.stroke();

    draw_time();

    ctx.save();
}


const start_timer = () => {
    if (!ctx) return;

    if (!startTime) {
        startTime = Date.now();
        draw_background();
    } else if (pausedStart) {
        pausedTime = Date.now() - pausedStart;
        pausedStart = 0;
    }

    const run_timer = () => {
        const now_time = Date.now();
        if (!startTime || (elasped_time) >= totalTime) return;

        const delta_time = (now_time - startTime - pausedTime);
        const fraction = (delta_time) / totalTime;

        ctx.fillStyle = color_scheme_canvas;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        draw_background();

        ctx.beginPath();

        ctx.strokeStyle = color_scheme_font;
        ctx.arc(
            outerRadius,
            outerRadius,
            outerRadius - lineWidth, -(Math.PI / 2), ((2 * Math.PI) * fraction) - (Math.PI / 2));
        ctx.stroke();

        elasped_time = now_time - startTime;
        
        if ((elasped_time) <= totalTime)
            draw_time();

        if (fraction >= 1) {
            window.requestAnimationFrame(run_timer);
            return;
        }

        requestId = window.requestAnimationFrame(run_timer);
    }

    requestId = window.requestAnimationFrame(run_timer);
}

const stop_timer = () => {
    if (!ctx || !startTime) return;

    pausedStart = Date.now();
    window.cancelAnimationFrame(requestId)
}

const reset_timer = () => {
    if (!ctx) return;

    startTime = null;
    pausedTime = 0;
    pausedStart = null;
    elasped_time = 0;

    ctx.fillStyle = color_scheme_canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_background();

    window.cancelAnimationFrame(requestId)
    requestId = -1;
}

const draw_time = () => {
    if (!ctx) return;

    ctx.font = "bold 5em serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillStyle = color_scheme_bg;

    const remainingTime = totalTime - elasped_time;

    const numSeconds = Math.floor((remainingTime / 1000) % 60);
    const numMinutes = Math.floor((remainingTime / 60000) % 60);
    const numHours =  Math.floor((remainingTime / 600000) % 99);

    ctx.fillText(`${numHours}:${numMinutes}:${numSeconds}`, canvas.width/2, canvas.height/2);
}


start_button.addEventListener("click", start_timer);
stop_button.addEventListener("click", stop_timer);
reset_button.addEventListener("click", reset_timer);

draw_background();