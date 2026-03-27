import {NavigateFunction} from "react-router-dom";

const navigateToConfigUrl = (path: string, navigate?: NavigateFunction) => {
    const regex = /{{(.*?)}}/;
    const match = path.match(regex);
debugger
    if (match) {
        const variableName = match[1];
        if (window[variableName]) {
            window.open(window[variableName])
            return;
        }
    }

    // Si llego aca es que no Matche o no se encontro la entrada dentro de 'window'
    if (path && navigate) navigate(path);
}

export { navigateToConfigUrl };