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
  postComentario: (excursionId, valoracion, autor, comentario, dia) => dispatch(postComentario(excursionId, valoracion, autor, comentario, dia)),
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
        <View style={extendedStyles.circle}>
          <FontAwesome
            name="pencil"
            size={24}
            onPress={toggleModal}
            color="white"
          />
        </View>
      </View>
    </Card>
  );
}

function RenderComentario({ comentarios = [] }) {
  return (
    <Card>
      <Card.Title>Comentarios</Card.Title>
      <Card.Divider />
      {comentarios.map((comentario, index) => (
        <View key={index}>
          <Text>{comentario.comentario}</Text>
          <Text>{comentario.valoracion} Stars</Text>
          <Text>-- {comentario.autor}, {comentario.dia}</Text>
        </View>
      ))}
    </Card>
  );
}

function DetalleExcursion({ route, excursiones, comentarios, favoritos, postComentario, postFavorito }) {
  const [valoracion, setValoracion] = useState(5);
  const [autor, setAutor] = useState('');
  const [comentario, setComentario] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const resetForm = () => {
    setValoracion(5);
    setAutor('');
    setComentario('');
    setShowModal(false);
  };

  const gestionarComentario = (excursionId) => {
    const dia = new Date().toISOString();
    postComentario(excursionId, valoracion, autor, comentario, dia);
    resetForm();
  };

  const marcarFavorito = (excursionId) => {
    postFavorito(excursionId);
  };

  const { excursionId } = route.params;
  const excursion = excursiones[excursionId];

  return (
    <ScrollView>
      <RenderExcursion
        excursion={excursion}
        favorita={favoritos.some(el => el === excursionId)}
        onPress={() => marcarFavorito(excursionId)}
        toggleModal={toggleModal}
      />
      <RenderComentario
        comentarios={comentarios.filter((comentario) => comentario.excursionId === excursionId)}
      />
      <Modal visible={showModal} onRequestClose={toggleModal}>
        <View style={extendedStyles.modal}>
          <Rating
            showRating
            startingValue={valoracion}
            onFinishRating={(rating) => setValoracion(rating)}
          />
          <Input
            placeholder="Autor"
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={(value) => setAutor(value)}
          />
          <Input
            placeholder="Comentario"
            leftIcon={{ type: 'font-awesome', name: 'comment' }}
            onChangeText={(value) => setComentario(value)}
          />
          <View style={extendedStyles.buttonContainer}>
            <Button
              title="CANCELAR"
              onPress={resetForm}
              buttonStyle={extendedStyles.buttonPrimary}
              titleStyle={extendedStyles.buttonText}
            />
            <Button
              title="ENVIAR"
              onPress={() => gestionarComentario(excursionId)}
              buttonStyle={extendedStyles.buttonPrimary}
              titleStyle={extendedStyles.buttonText}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);