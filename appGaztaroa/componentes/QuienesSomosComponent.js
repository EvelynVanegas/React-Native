// REACT
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, ListItem, Text, Avatar } from '@rneui/themed';

// REDUX
import { connect } from 'react-redux';

// FIREBASE
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Componentes
import IndicadorActividad from '../componentes/IndicadorActividadComponent';

const mapStateToProps = state => ({
  actividades: state.actividades.actividades,
  isLoading: state.actividades.isLoading
});

const QuienesSomos = ({ actividades, isLoading }) => {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      const storage = getStorage();
      const urls = {};

      try {
        for (const actividad of actividades) {
          const imageRef = ref(storage, `public/${actividad.imagen}`);
          try {
            const url = await getDownloadURL(imageRef);
            urls[actividad.id] = url;
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchImageUrls();
  }, [actividades]);

  const renderActividades = () => {
    return (
      <Card>
        <Card.Title>Actividades y recursos</Card.Title>
        <Card.Divider />
        {actividades.map((actividad, index) => (
          <ListItem key={index} bottomDivider>
            <Avatar source={{ uri: imageUrls[actividad.id] || null }} />
            <ListItem.Content>
              <ListItem.Title>{actividad.nombre}</ListItem.Title>
              <ListItem.Subtitle>{actividad.descripcion}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    );
  };

  return (
    <ScrollView>
      <Historia />
      {isLoading ? <IndicadorActividad /> : renderActividades()}
    </ScrollView>
  );
};

const Historia = () => {
  return (
    <Card>
      <Card.Title>Un poquito de historia</Card.Title>
      <Card.Divider />
      <Text style={styles.text}>
        El nacimiento del club de montaña Gaztaroa se remonta a la primavera de 1976 cuando jóvenes aficionados a la montaña y pertenecientes a un club juvenil decidieron crear la sección montañera de dicho club. Fueron unos comienzos duros debido sobre todo a la situación política de entonces. Gracias al esfuerzo económico de sus socios y socias se logró alquilar una bajera. Gaztaroa ya tenía su sede social.
      </Text>
      <Text style={styles.text}>
        Desde aquí queremos hacer llegar nuestro agradecimiento a todos los montañeros y montañeras que alguna vez habéis pasado por el club aportando vuestro granito de arena.
      </Text>
      <Text style={styles.text}>
        ¡Gracias!
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
});

export default connect(mapStateToProps)(QuienesSomos);