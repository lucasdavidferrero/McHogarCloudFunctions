import { Router } from "express"
import { obtenerArticulosPaginado, obtenerArticulosPaginadoGrillaModificarImagenes } from '../controllers/articuloController'

const router = Router()

router
    .get('/', obtenerArticulosPaginado)
    .get('/grilla-imagenes/', obtenerArticulosPaginadoGrillaModificarImagenes)

export default router


// https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
// https://blog.logrocket.com/write-scalable-openapi-specification-node-js/