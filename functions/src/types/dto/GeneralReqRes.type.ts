export interface IGeneralResponseMcAPI<T> {
    estado: 'satisfactorio' | 'error'
    mensaje: string
    data: T
}