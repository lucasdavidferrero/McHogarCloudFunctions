import { convertDateString } from "../../utils/ejemploProcesoDiarioCompleto";

describe('Probando JEST', () => {
    it('Debe convertir string Date de API a un Integer Unix Timestamp', () => {
        expect(convertDateString('\/Date(1720407600000-0300)\/')).toBe(1720407600000)
    })
})