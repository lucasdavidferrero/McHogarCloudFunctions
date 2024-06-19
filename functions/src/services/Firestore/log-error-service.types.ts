export interface LogErrorOptions {
    errorCode?: string;
    stack?: string;
    context?: StorageContext
    additionalInfo?: string
    message: string;
}
export interface StorageContext {
    filePath: string
    bucket: string
}

export enum ErrorTypeDocumentNames {
    ProcesoRedimencionarOptimizarImagenArticulo = 'ProcesoRedimencionarOptimizarImagenArticulo',
    ProcesoLimpiezaInformacionEnEliminacionImagenArticulo = 'ProcesoLimpiezaInformacionEnEliminacionImagenArticulo'
}
