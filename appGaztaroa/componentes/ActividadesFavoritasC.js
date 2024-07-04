import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Card, Image } from 'react-native-elements';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFavoritos } from '../redux/ActionCreators';

const mapStateToProps = state => ({
    excursiones: state.excursiones.excursiones,
    favoritos: state.favoritos.favoritos,
});

const mapDispatchToProps = dispatch => ({
    fetchFavoritos: (emailPrefix) => dispatch(fetchFavoritos(emailPrefix)),
});

function ActividadesFavoritasC({ excursiones, favoritos, fetchFavoritos }) {
    const [emailPrefix, setEmailPrefix] = useState('');
    const [excursionesFavoritas, setExcursionesFavoritas] = useState([]);

    useEffect(() => {
        const getEmailPrefix = async () => {
            try {
                const prefix = await AsyncStorage.getItem('emailPrefix');
                if (prefix) {
                    setEmailPrefix(prefix);
                    fetchFavoritos(prefix); // Obtener los favoritos al obtener el emailPrefix
                }
            } catch (error) {
                console.error('Error retrieving emailPrefix:', error);
            }
        };

        getEmailPrefix();
    }, []);

    useEffect(() => {
        // Filtrar las excursiones favoritas
        if (excursiones && favoritos) {
            const favoritas = excursiones.filter(excursion => favoritos.includes(excursion.id.toString()));
            setExcursionesFavoritas(favoritas);
        }
    }, [excursiones, favoritos]);

    const renderExcursionesFavoritas = () => {
        if (excursionesFavoritas.length === 0) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text>No hay actividades favoritas</Text>
                </View>
            );
        }

        return excursionesFavoritas.map(excursion => (
            <RenderExcursion key={excursion.id} excursion={excursion} />
        ));
    };

    return (
        <View>
            {renderExcursionesFavoritas()}
        </View>
    );
}

function RenderExcursion({ excursion }) {
    const [loadingImage, setLoadingImage] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        setLoadingImage(true);
        if (excursion && excursion.imagen) {
            const storage = getStorage();
            const imageRef = ref(storage, `public/${excursion.imagen}`);
            getDownloadURL(imageRef)
                .then(url => {
                    setImageUrl(url);
                })
                .catch(error => {
                    console.error('Error fetching image URL:', error);
                })
                .finally(() => {
                    setLoadingImage(false);
                });
        }
    }, [excursion]);

    if (!excursion) {
        return null;
    }

    return (
        <Card>
            {loadingImage ? (
                <View style={{ height: 200, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16 }}>Cargando imagen...</Text>
                </View>
            ) : imageUrl ? (
                <Card.Image source={{ uri: imageUrl }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>{excursion.nombre}</Text>
                    </View>
                </Card.Image>
            ) : (
                <View style={{ height: 200, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16 }}>Imagen no disponible</Text>
                </View>
            )}
            <Text style={{ margin: 20 }}>{excursion.descripcion}</Text>
        </Card>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActividadesFavoritasC);