import * as ActionTypes from './ActionTypes';
import { getDatabase, ref, onValue, get, set, child } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Acción para iniciar sesión
export const loginUser = () => ({
    type: ActionTypes.LOGIN_USER,
});

// Acción para cerrar sesión
export const logoutUser = () => {
    return async (dispatch) => {
        try {
            // Limpiar AsyncStorage
            await AsyncStorage.removeItem('emailPrefix');
            dispatch({ type: ActionTypes.LOGOUT_USER });
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };
};

// Comentarios desde Firebase Realtime Database
export const fetchComentarios = () => (dispatch) => {
    const database = getDatabase();
    const comentariosRef = ref(database, 'comentarios');

    // Suscribirse a cambios en tiempo real
    onValue(comentariosRef, (snapshot) => {
        if (snapshot.exists()) {
            const comentarios = snapshot.val();
            const comentariosList = Object.keys(comentarios).map(key => comentarios[key]);
            dispatch(addComentarios(comentariosList));
        } else {
            dispatch(comentariosFailed('No data available'));
        }
    }, (error) => {
        dispatch(comentariosFailed(error.message));
    });
};

export const comentariosFailed = (errmess) => ({
    type: ActionTypes.COMENTARIOS_FAILED,
    payload: errmess
});

export const addComentarios = (comentarios) => ({
    type: ActionTypes.ADD_COMENTARIOS,
    payload: comentarios
});

// Obtener el último ID y sumar 1
const getNextComentarioId = async () => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, 'comentarios'));
    if (snapshot.exists()) {
        const comentarios = snapshot.val();
        const ids = Object.keys(comentarios).map(key => comentarios[key].id);
        const maxId = Math.max(...ids);
        return maxId + 1;
    } else {
        return 0; // Si no hay comentarios, el primer ID será 0
    }
};

// Agregar comentario a Firebase Realtime Database
export const postComentario = (excursionId, valoracion, autor, comentario, dia, imageUrl) => async (dispatch) => {
    const database = getDatabase();
    const nextId = await getNextComentarioId();
    const comentariosRef = ref(database, `comentarios/${nextId}`); // Usar el nextId como clave

    try {
        await set(comentariosRef, {
            id: nextId, // Utiliza el id secuencial
            autor: autor,
            comentario: comentario,
            dia: dia,
            excursionId: excursionId,
            valoracion: valoracion,
            imageUrl: imageUrl
        });

        console.log('Comentario agregado correctamente');
        // Puedes despachar una acción aquí si es necesario
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        // Manejo de errores, por ejemplo despachar una acción de error
    }
};

// Excursiones desde Firebase Realtime Database
export const fetchExcursiones = () => (dispatch) => {
    dispatch(excursionesLoading());

    const database = getDatabase();
    const excursionesRef = ref(database, 'excursiones');

    return get(excursionesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('No data available');
            }
        })
        .then(excursiones => dispatch(addExcursiones(excursiones)))
        .catch(error => dispatch(excursionesFailed(error.message)));
};

export const excursionesLoading = () => ({
    type: ActionTypes.EXCURSIONES_LOADING
});

export const excursionesFailed = (errmess) => ({
    type: ActionTypes.EXCURSIONES_FAILED,
    payload: errmess
});

export const addExcursiones = (excursiones) => ({
    type: ActionTypes.ADD_EXCURSIONES,
    payload: excursiones
});

// Cabeceras desde Firebase Realtime Database
export const fetchCabeceras = () => (dispatch) => {
    dispatch(cabecerasLoading());

    const database = getDatabase();
    const cabecerasRef = ref(database, 'cabeceras');

    return get(cabecerasRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('No data available');
            }
        })
        .then(cabeceras => dispatch(addCabeceras(cabeceras)))
        .catch(error => dispatch(cabecerasFailed(error.message)));
};

export const cabecerasLoading = () => ({
    type: ActionTypes.CABECERAS_LOADING
});

export const cabecerasFailed = (errmess) => ({
    type: ActionTypes.CABECERAS_FAILED,
    payload: errmess
});

export const addCabeceras = (cabeceras) => ({
    type: ActionTypes.ADD_CABECERAS,
    payload: cabeceras
});

// Actividades desde Firebase Realtime Database
export const fetchActividades = () => (dispatch) => {
    dispatch(actividadesLoading());

    const database = getDatabase();
    const actividadesRef = ref(database, 'actividades');

    return get(actividadesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                throw new Error('No data available');
            }
        })
        .then(actividades => dispatch(addActividades(actividades)))
        .catch(error => dispatch(actividadesFailed(error.message)));
};

export const actividadesLoading = () => ({
    type: ActionTypes.ACTIVIDADES_LOADING
});

export const actividadesFailed = (errmess) => ({
    type: ActionTypes.ACTIVIDADES_FAILED,
    payload: errmess
});

export const addActividades = (actividades) => ({
    type: ActionTypes.ADD_ACTIVIDADES,
    payload: actividades
});

export const fetchFavoritos = (emailPrefix) => async (dispatch) => {
    try {
        const database = getDatabase();
        const favoritosRef = ref(database, `favoritos/${emailPrefix}`);

        const snapshot = await get(favoritosRef);

        if (snapshot.exists()) {
            const favoritosData = snapshot.val();
            const favoritos = Object.keys(favoritosData).filter(key => favoritosData[key] === true);
            dispatch(setFavoritos(favoritos));
            return favoritos;
        } else {
            console.warn('No hay datos de favoritos disponibles');
            dispatch(setFavoritos([]));
            return [];
        }
    } catch (error) {
        console.error('Error al obtener favoritos:', error.message);
        dispatch(setFavoritos([]));
        throw error; // Propaga el error hacia arriba
    }
};

// Acción para agregar favorito
export const addFavorito = (emailPrefix, excursionId) => (dispatch) => {
    const database = getDatabase();
    const favoritosRef = ref(database, `favoritos/${emailPrefix}/${excursionId}`);

    set(favoritosRef, true)
        .then(() => {
            console.log('Excursión añadida a favoritos');
            dispatch(fetchFavoritos(emailPrefix)); // Actualizar la lista de favoritos después de añadir uno nuevo
        })
        .catch(error => {
            console.error('Error al añadir favorito:', error.message);
        });
};

// Acción para eliminar favorito
export const deleteFavorito = (emailPrefix, excursionId) => (dispatch) => {
    const database = getDatabase();
    const favoritosRef = ref(database, `favoritos/${emailPrefix}/${excursionId}`);

    set(favoritosRef, false)
        .then(() => {
            console.log('Excursión eliminada de favoritos');
            dispatch(fetchFavoritos(emailPrefix)); // Actualizar la lista de favoritos después de eliminar uno
        })
        .catch(error => {
            console.error('Error al eliminar favorito:', error.message);
        });
};

// Acción para establecer la lista completa de favoritos
export const setFavoritos = (favoritos) => ({
    type: ActionTypes.SET_FAVORITOS,
    payload: favoritos
});