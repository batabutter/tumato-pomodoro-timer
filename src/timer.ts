const canvas = document.getElementById("timer") as HTMLCanvasElement;
const start_button = document.getElementById("start_button") as HTMLButtonElement;
const start_icon = document.getElementById("start_icon") as HTMLButtonElement;
const switch_button = document.getElementById("switch_button") as HTMLButtonElement;
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
const color_scheme_work = "rgb(0, 255, 213)";
const color_scheme_break = "rgb(255, 99, 99)";
const color_scheme_canvas = parentElement ? getComputedStyle(parentElement).backgroundColor : "white";

let requestId: number = -1;

enum TimerType {
    Work,
    Break
}

class Timer {

    type: TimerType;
    startTime: number | null;
    pausedStart: number | null;
    pausedTime: number;
    elaspedTime: number;
    totalTime: number;
    isRunning: boolean;

    constructor(timerType: TimerType, totalTime: number) {
        this.type = timerType;
        this.startTime = null;
        this.pausedStart = null;
        this.pausedTime = 0;
        this.elaspedTime = 0;
        this.totalTime = totalTime;
        this.isRunning = false;
    }

    GetTimerType() { return this.type; }
    GetStartTime() { return this.startTime; }
    GetPausedStart() { return this.pausedStart; }
    GetPausedTime() { return this.pausedTime; }
    GetTotalTime() { return this.totalTime; }
    GetElaspedTime() { return this.elaspedTime; }
    GetIsRunning() { return this.isRunning; }

    SetStartTime(time: number) { this.startTime = time; }
    SetPausedStart(time: number) { this.pausedStart = time; }
    SetPausedTime(time: number) { this.pausedTime = time; }
    SetElaspsedTime(time: number) { this.elaspedTime = time; }
    SetIsRunning(running: boolean) { this.isRunning = running; }

    ResetAll() {
        this.startTime = null;
        this.pausedStart = null;
        this.pausedTime = 0;
        this.elaspedTime = 0;
    }

}

let totalWorkTime = 10000;
let totalBreakTime = 10000;
const WorkTimer = new Timer(TimerType.Work, totalWorkTime);
const BreakTimer = new Timer(TimerType.Break, totalBreakTime);

let FocusedTimer: Timer | null;
FocusedTimer = WorkTimer;

const formatTime = (remainingTime: number): string => {

    if (remainingTime < 0) remainingTime = 0;

    const numSeconds = `${Math.floor((remainingTime / 1000) % 60)}`.padStart(2, '0');
    const numMinutes = `${Math.floor((remainingTime / 60000) % 60)}`.padStart(2, '0');
    const numHours = `${Math.floor((remainingTime / 600000) % 99)}`.padStart(2, '0');

    return `${numHours}:${numMinutes}:${numSeconds}`

}

const draw_background = () => {
    const time = new Date();

    if (!ctx || !FocusedTimer) return;

    ctx.fillStyle = color_scheme_canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = lineWidth;

    // Draw the break timer
    ctx.beginPath();
    ctx.strokeStyle = color_scheme_bg;
    ctx.arc(
        breakTimerOuterRadius + (canvas.width - breakTimerSize),
        breakTimerOuterRadius,
        breakTimerOuterRadius - lineWidth / 2,
        0,
        2 * Math.PI);
    ctx.stroke();

    // Draw the work timer

    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.strokeStyle = color_scheme_bg;
    ctx.arc(
        workTimerOuterRadius,
        workTimerOuterRadius + (canvas.width - workTimerSize),
        workTimerOuterRadius - lineWidth / 2,
        0,
        2 * Math.PI);
    ctx.stroke();

    // Work Timer 
    drawTimer(
        (WorkTimer.GetElaspedTime() / WorkTimer.GetTotalTime()),
        workTimerOuterRadius,
        workTimerOuterRadius + (canvas.width - workTimerSize),
        workTimerOuterRadius - lineWidth / 2,
        color_scheme_work);

    // Break Timer
    drawTimer(
        (BreakTimer.GetElaspedTime() / BreakTimer.GetTotalTime()),
        breakTimerOuterRadius + (canvas.width - breakTimerSize),
        breakTimerOuterRadius,
        breakTimerOuterRadius - lineWidth / 2,
        color_scheme_break);

    /* Focused Timer must be initalized beforehand */
    draw_time();
    
    /* This should be optimized */
    if (FocusedTimer.GetIsRunning()) {
        start_icon.classList.remove("fa-play");
        start_icon.classList.add("fa-pause");
    } else {
        start_icon.classList.remove("fa-pause");
        start_icon.classList.add("fa-play");
    }

    ctx.save();
}

const drawTimer = (fraction: number, x: number, y: number, radius: number, color: string) => {
    if (!ctx) return

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(
        x,
        y,
        radius,
        -(Math.PI / 2),
        ((2 * Math.PI) * fraction) - (Math.PI / 2));
    ctx.stroke();
}

const start_timer = () => {
    if (!ctx || !FocusedTimer) return;

    if (FocusedTimer.GetIsRunning()) {
        stop_timer();
        draw_background();
        return;
    }

    const pausedStart = FocusedTimer.GetPausedStart();
    FocusedTimer.SetIsRunning(true);

    if (!FocusedTimer.GetStartTime()) {
        FocusedTimer.SetStartTime(Date.now());
        draw_background();
    } else if (pausedStart) {
        FocusedTimer.SetPausedTime(
            FocusedTimer.GetPausedTime() +
            Date.now() - pausedStart
        );
        FocusedTimer.SetPausedStart(0);
    }

    const startTime = FocusedTimer.GetStartTime();
    const pausedTime = FocusedTimer.GetPausedTime();

    const run_timer = () => {
        if (!startTime || !FocusedTimer) return;

        const now_time = Date.now();

        const delta_time = (now_time - startTime - pausedTime);
        const fraction = (delta_time) / FocusedTimer.GetTotalTime();

        FocusedTimer.SetElaspsedTime(now_time - startTime - pausedTime);
        draw_background();

        if (fraction >= 1) {
            window.cancelAnimationFrame(requestId)
            return;
        }

        requestId = window.requestAnimationFrame(run_timer);
    }

    requestId = window.requestAnimationFrame(run_timer);
}

const stop_timer = () => {
    if (!ctx || !FocusedTimer) return;

    FocusedTimer.SetIsRunning(false)
    FocusedTimer.SetPausedStart(Date.now());
    window.cancelAnimationFrame(requestId);
}

const reset_timer = () => {
    if (!ctx || !FocusedTimer) return;

    FocusedTimer.ResetAll();

    ctx.fillStyle = color_scheme_canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_background();

    window.cancelAnimationFrame(requestId)
    requestId = -1;
}

/* The fonts here are hard-coded, kinda lame */
/* Focused Timer must be initalized beforehand */
const draw_time = () => {
    if (!ctx || !FocusedTimer) return;

    ctx.font = "bold 5em serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    ctx.fillStyle = color_scheme_bg;

    const remainingWorkTime = WorkTimer.GetTotalTime() - WorkTimer.GetElaspedTime();
    const remainingBreakTime = BreakTimer.GetTotalTime() - BreakTimer.GetElaspedTime();

    const formattedWorkTime = formatTime(remainingWorkTime);
    const formattedBreakTime = formatTime(remainingBreakTime);

    if (FocusedTimer.GetTimerType() == TimerType.Work)
        ctx.fillStyle = "white";

    ctx.fillText(
        formattedWorkTime,
        workTimerSize / 2,
        workTimerOuterRadius + (canvas.width - workTimerSize));

    ctx.fillStyle = color_scheme_bg;

    if (FocusedTimer.GetTimerType() == TimerType.Break)
        ctx.fillStyle = "white";

    ctx.font = "bold 1.25em serif";
    ctx.fillText(
        formattedBreakTime,
        breakTimerOuterRadius + (canvas.width - breakTimerSize),
        breakTimerOuterRadius);
}

const switch_timer = () => {
    stop_timer();

    if (FocusedTimer == WorkTimer)
        FocusedTimer = BreakTimer;
    else
        FocusedTimer = WorkTimer;

    draw_background();
}

start_button.addEventListener("click", start_timer);
switch_button.addEventListener("click", switch_timer);
reset_button.addEventListener("click", reset_timer);

draw_background();