// EXPO
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Importar desde expo-image-picker

// REACT
import React, { useState, useEffect } from 'react';
import { Modal, View, ScrollView, Text, Alert } from 'react-native';
import { Input, Rating, Button, Card, Icon, Image } from 'react-native-elements';

// REDUX
import { connect } from 'react-redux';
import { postComentario, postFavorito, fetchComentarios } from '../redux/ActionCreators';

// FIREBASE
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

// ESTILOS
import { extendedStyles } from './styles';

// Función para obtener la fecha actual en formato ISO
const getCurrentISODate = () => {
  return new Date().toISOString();
};

const mapStateToProps = state => ({
  excursiones: state.excursiones.excursiones,
  comentarios: state.comentarios.comentarios,
  favoritos: state.favoritos && state.favoritos.favoritos ? state.favoritos.favoritos : []
});

const mapDispatchToProps = dispatch => ({
  postComentario: (excursionId, valoracion, autor, comentario, dia, imageUrl) =>
    dispatch(postComentario(excursionId, valoracion, autor, comentario, dia, imageUrl)),
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
  fetchComentarios: () => dispatch(fetchComentarios())
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
      {comentarios.map((comentario) => (
        <View key={comentario.id}>
          <Text>{comentario.comentario}</Text>
          <Text>{comentario.valoracion} Stars</Text>
          <Text>-- {comentario.autor}, {comentario.dia}</Text>
          {comentario.imageUrl && (
            <Image source={{ uri: comentario.imageUrl }} style={{ width: 200, height: 200, marginTop: 10 }} />
          )}
        </View>
      ))}
    </Card>
  );
}

function DetalleExcursion({ route, excursiones, comentarios, favoritos, postComentario, postFavorito, fetchComentarios }) {
  const [valoracion, setValoracion] = useState(5);
  const [autor, setAutor] = useState('');
  const [comentario, setComentario] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para almacenar la imagen seleccionada


  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const resetForm = () => {
    setValoracion(5);
    setAutor('');
    setComentario('');
    setSelectedImage(null); // Limpiar la imagen seleccionada al cerrar el modal
    setShowModal(false);
  };

  const gestionarComentario = async (excursionId) => {
    const dia = getCurrentISODate();
    console.log('Seleccionando imagen...');

    // Subir la imagen seleccionada, si existe
    let imageUrl = null;
    if (selectedImage) {
      try {
        console.log('Preparando para subir la imagen...');
        const storage = getStorage();
        const imageRef = ref(storage, `public/comentarios/${Date.now()}`);
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        console.log('Subiendo imagen...');
        await uploadBytes(imageRef, blob);
        console.log('Imagen subida, obteniendo URL...');
        const url = await getDownloadURL(imageRef);
        imageUrl = url;
        console.log('URL de imagen:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Hubo un problema al subir la imagen.');
        return;
      }
    } else {
      console.log('No hay imagen seleccionada.');
    }

    // Enviar el comentario junto con la URL de la imagen (si existe)
    console.log('Enviando comentario...');
    postComentario(excursionId, valoracion, autor, comentario, dia, imageUrl);
    resetForm();
  };


  const { excursionId } = route.params;
  const excursion = excursiones[excursionId];

  // Función para manejar la selección de una imagen desde la galería
  const handlePickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permisos requeridos', 'Se necesita permiso para acceder a la galería de fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.assets[0].canceled && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
      console.log('LOG URI de la imagen seleccionada:', result.assets[0].uri);
    } else {
      console.log('LOG Selección de imagen cancelada o URI inválida:', result);
    }
  };



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
          <Button
            title="Adjuntar Imagen"
            onPress={handlePickImage}
            buttonStyle={extendedStyles.buttonPrimary}
            titleStyle={extendedStyles.buttonText}
          />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginBottom: 10 }} />
          )}
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