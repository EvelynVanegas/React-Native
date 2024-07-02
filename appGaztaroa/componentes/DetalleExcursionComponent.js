// EXPO
import { FontAwesome } from '@expo/vector-icons';

// REACT
import React, { useState, useEffect } from 'react';
import { Modal, View, ScrollView, Text } from 'react-native';
import { Input, Rating, Button, Card, Icon } from 'react-native-elements';

// REDUX
import { connect } from 'react-redux';
import { postComentario, postFavorito } from '../redux/ActionCreators';

// FIREBASE
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// ESTILOS
import { extendedStyles } from './styles';

const mapStateToProps = state => ({
  excursiones: state.excursiones.excursiones,
  comentarios: state.comentarios.comentarios,
  favoritos: state.favoritos && state.favoritos.favoritos ? state.favoritos.favoritos : []
});

const mapDispatchToProps = dispatch => ({
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId))
});

function RenderExcursion({ excursion, onPress, favorita, toggleModal }) {
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
      <View style={extendedStyles.iconContainer}>
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