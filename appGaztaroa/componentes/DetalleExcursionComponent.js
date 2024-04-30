import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { EXCURSIONES } from '../comun/excursiones';
import { COMENTARIOS } from '../comun/comentarios';

function RenderComentario(props) {
  const comentarios = props.comentarios;

  return (
    <Card>
      <Card.Title>Comentarios</Card.Title>
      <Card.Divider />
      <Text>{comentarios.comentario}</Text>
      <Text>{comentarios.valoracion} Stars</Text>
      <Text>-- {comentarios.autor}, {comentarios.dia}</Text>
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
    const comentarioExcursion = this.state.comentarios.find((comentario) => comentario.excursionId === excursionId);

    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.state.excursiones[+excursionId]}
          favorita={this.state.favoritos.some(el => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={comentarioExcursion} // Pasar solo el comentario de la excursión actual
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
        <Card.Image source={require('./imagenes/40Años.png')}>
          <Text style={{ color: 'chocolate', fontSize: 30, textAlign: 'center', marginTop: 20 }}>{excursion.nombre}</Text>
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