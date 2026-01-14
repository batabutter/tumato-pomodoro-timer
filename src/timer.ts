const canvas = document.getElementById("timer") as HTMLCanvasElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
const stop_button = document.getElementById("stop_button") as HTMLButtonElement;
const reset_button = document.getElementById("reset_button") as HTMLButtonElement;

const ctx = canvas ? canvas.getContext("2d") : null;
const parentElement = canvas.parentElement;

const ratio = 0.75
const workTimerSize = ratio * canvas.width
const breakTimerSize = (1 - ratio) * canvas.width

const lineWidth = 15;
const workTimerOuterRadius = Math.min((workTimerSize) / 2, (workTimerSize) / 2);
const breakTimerOuterRadius = (breakTimerSize) / 2;
const color_scheme_bg = "rgb(80, 80, 80)";
const color_scheme_font = "rgb(0, 255, 213)";
const color_scheme_canvas = parentElement ? getComputedStyle(parentElement).backgroundColor : "white";

let requestId: number = -1;
let totalWorkTime = 10000;
let totalBreakTime = 10000;

let pausedTime: number = 0;
let pausedStart: number | null = null;
let startTime: number | null = null;

let elaspedWorkTime = 0;
let elaspedBreakTime = 0;

const formatTime = (remainingTime: number): string => {

    if (remainingTime < 0) remainingTime = 0;

    const numSeconds = `${Math.floor((remainingTime / 1000) % 60)}`.padStart(2, '0');
    const numMinutes = `${Math.floor((remainingTime / 60000) % 60)}`.padStart(2, '0');
    const numHours = `${Math.floor((remainingTime / 600000) % 99)}`.padStart(2, '0');

    return `${numHours}:${numMinutes}:${numSeconds}`

}

const draw_background = () => {
    const time = new Date();

    if (!ctx) return;

    ctx.fillStyle = color_scheme_canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = lineWidth;

    // Draw the break timer
    ctx.beginPath();
    ctx.strokeStyle = color_scheme_bg;
    ctx.arc(
        breakTimerOuterRadius + (canvas.width - breakTimerSize),
        breakTimerOuterRadius,
        breakTimerOuterRadius - lineWidth / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw the work timer

    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.strokeStyle = color_scheme_bg;
    ctx.arc(
        workTimerOuterRadius,
        workTimerOuterRadius + (canvas.width - workTimerSize),
        workTimerOuterRadius - lineWidth / 2, 0, 2 * Math.PI);
    ctx.stroke();

    draw_time();

    ctx.save();
}

const drawWorkTimer = (fraction: number) => {
    if (!ctx) return

    ctx.beginPath();

    ctx.strokeStyle = color_scheme_font;
    ctx.arc(
        workTimerOuterRadius,
        workTimerOuterRadius + (canvas.width - workTimerSize),
        workTimerOuterRadius - lineWidth / 2, -(Math.PI / 2), ((2 * Math.PI) * fraction) - (Math.PI / 2));
    ctx.stroke();
}

const drawBreakTimer = () => {

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
        if (!startTime || (elaspedWorkTime) >= totalWorkTime) return;

        const delta_time = (now_time - startTime - pausedTime);
        const fraction = (delta_time) / totalWorkTime;

        elaspedWorkTime = now_time - startTime;
        draw_background();

        drawWorkTimer(fraction);
        drawBreakTimer();

        elaspedWorkTime = now_time - startTime;

        if (fraction >= 1) {
            window.cancelAnimationFrame(requestId)
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
    elaspedWorkTime = 0;

    ctx.fillStyle = color_scheme_canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_background();

    window.cancelAnimationFrame(requestId)
    requestId = -1;
}

/* The fonts here are hard-coded, kinda lame */
const draw_time = () => {
    if (!ctx) return;

    ctx.font = "bold 5em serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillStyle = color_scheme_bg;

    const remainingWorkTime = totalWorkTime - elaspedWorkTime;

    const formattedTime = formatTime(remainingWorkTime);

    ctx.fillText(
        formattedTime,
        workTimerSize / 2,
        workTimerOuterRadius + (canvas.width - workTimerSize));

    ctx.font = "bold 1.25em serif";
    ctx.fillText(
        formattedTime,
        breakTimerOuterRadius + (canvas.width - breakTimerSize),
        breakTimerOuterRadius);
}


start_button.addEventListener("click", start_timer);
stop_button.addEventListener("click", stop_timer);
reset_button.addEventListener("click", reset_timer);

draw_background();