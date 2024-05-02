import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import { baseUrl } from '../comun/comun';

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

const mapStateToProps = state => ({
  excursiones: state.excursiones.excursiones,
  comentarios: state.comentarios.comentarios,
  // Agrega las demás propiedades que necesites
});

class DetalleExcursion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritos: [], // Mantén el constructor con esta propiedad
    };
  }

  marcarFavorito(excursionId) {
    this.setState({
      favoritos: this.state.favoritos.concat(excursionId)
    });
  }

  render() {
    const { excursionId } = this.props.route.params;
    const { excursiones, comentarios } = this.props;
    const excursion = excursiones[excursionId];

    return (
      <ScrollView>
        <RenderExcursion
          excursion={excursion}
          favorita={this.state.favoritos.includes(excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={comentarios.filter((comentario) => comentario.excursionId === excursionId)}
        />
      </ScrollView>
    );
  }
}

function RenderExcursion(props) {
  const { excursion, favorita, onPress } = props;

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
          onPress={() => favorita ? console.log('La excursión ya se encuentra entre las favoritas') : onPress()}
        />
      </Card>
    );
  } else {
    return (<View></View>);
  }
}

export default connect(mapStateToProps)(DetalleExcursion);