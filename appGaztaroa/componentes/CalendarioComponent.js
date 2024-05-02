import React from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed';
import { connect } from 'react-redux';
import IndicadorActividad from '../componentes/IndicadorActividadComponent';
import { baseUrl } from '../comun/comun';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones.excursiones,
        isLoading: state.excursiones.isLoading
    };
};

const Calendario = ({ excursiones, navigation, isLoading }) => {

    const renderCalendarioItem = ({ item, index }) => {
        return (
            <ListItem
                key={index}
                onPress={() => navigation.navigate('DetalleExcursion', { excursionId: item.id })}
                bottomDivider
            >
                <Avatar source={{ uri: baseUrl + item.imagen }} />
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