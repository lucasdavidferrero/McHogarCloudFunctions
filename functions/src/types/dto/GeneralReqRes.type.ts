export interface IGeneralResponseMcAPI<T> {
    estado: 'satisfactorio' | 'error'
    mensaje: string
    data: T
}

export interface IQueryStringReqMcAPI {
    cursorId?:                  string
    cantidadItemsPagina?:       string
}