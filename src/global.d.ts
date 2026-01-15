export { };

declare global {

    interface Window {
        versions: {
            node: () => string,
            chrome: () => string,
            electron: () => string
        },
        timer: {
            updateTimer: (name: string, workDur: number, breakDur:number) => void,
            formatTime: (time: number) => string
        },
        indexBridge: {
            openPresets: () => void,
            writePresets: () => void
        }
    }

    interface TimerData {
        name: string,
        workDuration: number,
        breakDuration: number
    }

}