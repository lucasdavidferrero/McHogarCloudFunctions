import { Router } from "express"
import { obtenerJerarquiasCompleto } from "../controllers/jerarquiaController"

const router = Router()

router.get('/', obtenerJerarquiasCompleto)

export default router