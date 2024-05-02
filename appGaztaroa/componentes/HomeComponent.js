import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { Card } from '@rneui/themed';

import { connect } from 'react-redux';

import { baseUrl } from '../comun/comun';

function RenderItem(props) {
    const item = props.item;

    if (item != null) {
        return (
            <Card>
                <Card.Image source={{ uri: baseUrl + item.imagen }}>
                    <Text style={{ color: 'chocolate', fontSize: 30, textAlign: 'center', marginTop: 20 }}>{item.nombre}</Text>
                </Card.Image>
                <Card.Divider />
                <Text style={{ margin: 20 }}>
                    {item.descripcion}
                </Text>
            </Card>
        );
    }
    else {
        return (<View></View>);
    }
}

class Home extends Component {
    render() {
        const { cabeceras, excursiones, actividades } = this.props;

        return (
            <ScrollView>
                <RenderItem item={cabeceras.filter((cabecera) => cabecera.destacado)[0]} />
                <RenderItem item={excursiones.filter((excursion) => excursion.destacado)[0]} />
                <RenderItem item={actividades.filter((actividad) => actividad.destacado)[0]} />
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones.excursiones,
        cabeceras: state.cabeceras.cabeceras,
        actividades: state.actividades.actividades
    };
};

export default connect(mapStateToProps)(Home);