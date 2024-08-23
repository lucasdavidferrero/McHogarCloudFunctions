import { CURRENT_ENVIROMENT } from './../env';

export const MC_HOGAR_ENVIROMENT_BUCKET_NAME =  CURRENT_ENVIROMENT === 'development' ? 'mc-hogar-articulos' : 
                                                (CURRENT_ENVIROMENT === 'preview' ? 'mc-hogar-articulos-preview' : 
                                                (CURRENT_ENVIROMENT === 'production') ? 'mc-hogar-articulos-production' : 'env_error')