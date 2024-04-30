import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements'; // Importamos Icon de react-native-elements
import { EXCURSIONES } from '../comun/excursiones';
import { COMENTARIOS } from '../comun/comentarios';

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

class DetalleExcursion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excursiones: EXCURSIONES,
      comentarios: COMENTARIOS,
      favoritos: []
    };
  }

  marcarFavorito(excursionId) {
    this.setState({
      favoritos: this.state.favoritos.concat(excursionId)
    });
  }

  render() {
    const { excursionId } = this.props.route.params;
    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.state.excursiones[+excursionId]}
          favorita={this.state.favoritos.some(el => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={this.state.comentarios.filter((comentario) => comentario.excursionId === excursionId)}
        />
      </ScrollView>
    );
  }
}

function RenderExcursion(props) {
  const excursion = props.excursion;

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
          name={props.favorita ? 'heart' : 'heart-o'}
          type='font-awesome'
          color='#f50'
          onPress={() => props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : props.onPress()}
        />
      </Card>
    );
  } else {
    return (<View></View>);
  }
}

export default DetalleExcursion;