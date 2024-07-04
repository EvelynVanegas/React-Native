import { configureStore } from '@reduxjs/toolkit'
import { excursiones } from './excursiones';
import { comentarios } from './comentarios';
import { cabeceras } from './cabeceras';
import { actividades } from './actividades';
import { favoritos } from './favoritos';
import { loggedIn } from './loggedIn';

export const ConfigureStore = () => {
    const store = configureStore({
        reducer: {
            excursiones: excursiones,
            comentarios: comentarios,
            cabeceras: cabeceras,
            actividades: actividades,
            favoritos: favoritos,
            loggedIn: loggedIn,
        },
    });

    return store;
};