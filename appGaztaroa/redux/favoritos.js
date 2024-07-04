import * as ActionTypes from './ActionTypes';

export const favoritos = (state = { favoritos: [] }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITO:
            if (state.favoritos.includes(action.payload)) {
                return state; // Si ya está en favoritos, no hacemos cambios
            } else {
                return { ...state, favoritos: state.favoritos.concat(action.payload) }; // Agregamos la excursión a favoritos
            }
        case ActionTypes.DELETE_FAVORITO:
            return { ...state, favoritos: state.favoritos.filter(excursionId => excursionId !== action.payload) }; // Eliminamos la excursión de favoritos
        case ActionTypes.SET_FAVORITOS:
            return { ...state, favoritos: action.payload }; // Establecemos la lista completa de favoritos
        default:
            return state;
    }
};