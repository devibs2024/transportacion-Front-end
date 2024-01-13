const obtenerPrimerosNElementos = (array, n) => array.slice(0, n);

const obtenerMensajesDeError = (errorObj) => errorObj.errors;

const concatenarMensajesDeError = (mensajes) => mensajes.join('');

const procesarErrorIndividual = (errorObj, maxMensajes) => {

    const mensajes = obtenerMensajesDeError(errorObj);
    const primerosMensajes = obtenerPrimerosNElementos(mensajes, maxMensajes);

    return concatenarMensajesDeError(primerosMensajes);
};

export const procesarErrores = (errores, maxErrores = 3, maxMensajesPorError = 2) => {

    let mensajeFinal = "";

    if (!Array.isArray(errores)) {
        errores = [errores];
    }

    const primerosErrores = obtenerPrimerosNElementos(errores, maxErrores);

    primerosErrores.forEach((errorObj) => {

        mensajeFinal += procesarErrorIndividual(errorObj, maxMensajesPorError);

    });

    return mensajeFinal;
};

