const information = document.getElementById('info')

console.log(information)
console.log(window.versions)

if (information && window.versions)
    information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`
else if (information)
    information.innerText = `Renderer Error`

const func = async () => {
    const response = await window.versions.ping();
    console.log(response);
}

func();