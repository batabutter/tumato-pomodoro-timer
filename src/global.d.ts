export { };

declare global {

    interface Window {
        versions: {
            node: () => string,
            chrome: () => string,
            electron: () => string
            ping: () => string
        }
    }


    interface TimerData {
        name: string,
        duration: number
    }

}