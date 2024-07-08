import datosEjemplo from './datosEjemplo.json' assert { type: 'json' }

function convertDateString(dateString: string) {
    if (!dateString) {
      return null;
    }
  
    const match = /\/Date\((\d+)(?:-\d+)?\)\//.exec(dateString);
    if (match) {
      return Number(match[1]);
    }
    
    return null;
}

const updatedData = datosEjemplo.map((dato) => ({
    ...dato,
    AR_FECHAMODIF: convertDateString(dato.AR_FECHAMODIF)
}))

export const logData = () => console.log(updatedData)