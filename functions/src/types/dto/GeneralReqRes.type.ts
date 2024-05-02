export interface IGeneralResponseMcAPI<T> {
    estado: 'satisfactorio' | 'error'
    mensaje: string
    data?: T
}

export interface IQueryStringListadosPaginadosReqMcAPI {
    cursorId?:                  string
    cantidadItemsPagina?:       string
}

export interface Empty {}