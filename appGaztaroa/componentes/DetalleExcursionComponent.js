import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { postFavorito } from '../redux/ActionCreators';

import { baseUrl } from '../comun/comun';

const mapStateToProps = state => ({
  excursiones: state.excursiones.excursiones,
  comentarios: state.comentarios.comentarios,
  favoritos: state.favoritos && state.favoritos.favoritos ? state.favoritos.favoritos : []
});

const mapDispatchToProps = dispatch => ({
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId))
});

function RenderExcursion(props) {
  const { excursion, onPress, favorita } = props;

  if (excursion != null) {
    return (
      <Card>
        <Card.Image source={{ uri: baseUrl + excursion.imagen }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>{excursion.nombre}</Text>
          </View>
        </Card.Image>
        <Text style={{ margin: 20 }}>
          {excursion.descripcion}
        </Text>
        <Icon
          raised
          reverse
          name={favorita ? 'heart' : 'heart-o'}
          type='font-awesome'
          color='#f50'
          onPress={onPress}
        />
      </Card>
    );
  } else {
    return (<View></View>);
  }
}

function RenderComentario(props) {

  const comentarios = props.comentarios;

  return (
    <Card>
      <Card.Title>Comentarios</Card.Title>
      <Card.Divider />
      {comentarios.map((comentario, index) => (
        <View key={index}>
          <Text>{comentario.comentario}</Text>
          <Text>{comentario.valoracion} Stars</Text>
          <Text>-- {comentario.autor}, {comentario.dia}</Text>
          <Text></Text>
        </View>
      ))}
    </Card>
  );
}

class DetalleExcursion extends Component {

  marcarFavorito(excursionId) {
    this.props.postFavorito(excursionId);
  }

  render() {
    const { excursionId } = this.props.route.params;
    const { excursiones, comentarios, favoritos } = this.props;
    const excursion = excursiones[excursionId];

    return (
      <ScrollView>
        <RenderExcursion
          excursion={excursion}
          favorita={favoritos.some(el => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={comentarios.filter((comentario) => comentario.excursionId === excursionId)}
        />
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);