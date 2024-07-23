import axios from 'axios';
import { DtTablaArticulo, DtTablaPrecio, DtTablaArticuloNoHabilitado, DtTablaNombre, DtTablaMarca, AIKON_API_ENDPOINT, AIKON_API_NRO_CUENTA, DtTablaReferencia01, DtTablaReferencia02, DtTablaFamilia } from '../entidades/AikonApiTypes';

export class AikonApiDtTablaService {
    private static API_URL = AIKON_API_ENDPOINT.DT_TABLA
    private static NRO_CUENTA = AIKON_API_NRO_CUENTA

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

    static async fetchMarcas (token: string): Promise<DtTablaMarca> {
        const response = await axios.post<DtTablaMarca>(this.API_URL, {
            cuenta: this.NRO_CUENTA,
            token,
            tabla: DtTablaNombre.Marcas
        })
        return response.data
    }

    static async fetchReferencia01 (token: string): Promise<DtTablaReferencia01> {
        const response = await axios.post<DtTablaReferencia01>(this.API_URL, {
            cuenta: this.NRO_CUENTA,
            token,
            tabla: DtTablaNombre.Referencia01
        })
        return response.data
    }

    static async fetchReferencia02(token: string): Promise<DtTablaReferencia02> {
        const response = await axios.post<DtTablaReferencia02>(this.API_URL, {
            cuenta: this.NRO_CUENTA,
            token,
            tabla: DtTablaNombre.Referencia02
        })
        return response.data
    }

    static async fetchFamilia (token: string): Promise<DtTablaFamilia> {
        const response = await axios.post<DtTablaFamilia>(this.API_URL, {
            cuenta: this.NRO_CUENTA,
            token,
            tabla: DtTablaNombre.Familia
        })
        return response.data
    }
}