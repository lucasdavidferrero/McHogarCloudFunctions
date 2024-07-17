import axios from 'axios';
import { DtTablaArticulo, DtTablaPrecio, DtTablaArticuloNoHabilitado, DtTablaNombre, AIKON_API_BASE_URL } from '../entidades/AikonApiTypes';

export class AikonApiDtTablaService {
    private static API_URL = AIKON_API_BASE_URL + '/DtTabla';
    private static NRO_CUENTA = '230'

    static async fetchArticulos(token: string): Promise<DtTablaArticulo> {
        const response = await axios.post<DtTablaArticulo>(this.API_URL, 
            { 
                cuenta: this.NRO_CUENTA, 
                token, 
                tabla: DtTablaNombre.Articulos 
            });
        return response.data;
    }

    static async fetchPrecios(token: string): Promise<DtTablaPrecio> {
        const response = await axios.post<DtTablaPrecio>(this.API_URL, 
            { 
                cuenta: this.NRO_CUENTA, 
                token, 
                tabla: DtTablaNombre.Precios 
            });
        return response.data;
    }

    static async fetchArticulosNoHabilitados(token: string): Promise<DtTablaArticuloNoHabilitado> {
        const response = await axios.post<DtTablaArticuloNoHabilitado>(this.API_URL, 
            {   
                cuenta: this.NRO_CUENTA, 
                token, 
                tabla: DtTablaNombre.ArticulosNoHabilitados 
            }
        );
        return response.data;
    }
}