export class ProcesoInfoTipo {
    private _id: number
    private _nombre: string
    private _descripcion?: string
    constructor(id: number, nombre: string, descripcion?: string) {
        this._id = id
        this._nombre = nombre
        this._descripcion = descripcion
    }
    public get id() {
        return this._id
    }
    public get nombre() {
        return this._nombre
    }
    public get descripcion(){ 
        return this._descripcion
    }
}