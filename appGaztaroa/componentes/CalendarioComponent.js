// REACT
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed';

// REDUX
import { connect } from 'react-redux';

// FIREBASE
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Componentes
import IndicadorActividad from '../componentes/IndicadorActividadComponent';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones.excursiones,
        isLoading: state.excursiones.isLoading
    };
};

const Calendario = ({ excursiones, navigation, isLoading }) => {
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        const fetchImageUrls = async () => {
            const storage = getStorage();
            const firestore = getFirestore();
            const urls = {};

            for (const excursion of excursiones) {
                try {
                    const imageRef = ref(storage, `public/${excursion.imagen}`);
                    const url = await getDownloadURL(imageRef);
                    urls[excursion.id] = url;
                } catch (error) {
                    console.error('Error fetching image URL:', error);
                }
            }

            setImageUrls(urls);
        };

        fetchImageUrls();
    }, [excursiones]);

    const renderCalendarioItem = ({ item }) => {
        const imageUrl = imageUrls[item.id] || null;

        return (
            <ListItem
                onPress={() => navigation.navigate('DetalleExcursion', { excursionId: item.id })}
                bottomDivider
            >
                <Avatar source={{ uri: imageUrl }} />
                <ListItem.Content>
                    <ListItem.Title>{item.nombre}</ListItem.Title>
                    <ListItem.Subtitle>{item.descripcion}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    };

    return (
        <SafeAreaView>
            {isLoading ? <IndicadorActividad /> :
                <FlatList
                    data={excursiones}
                    renderItem={renderCalendarioItem}
                    keyExtractor={item => item.id.toString()}
                />
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 10,
    },
});

export default connect(mapStateToProps)(Calendario);