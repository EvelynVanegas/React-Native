import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, ListItem, Text, Avatar } from '@rneui/themed';
import { ACTIVIDADES } from '../comun/actividades';

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
        Gracias!
      </Text>

    </Card>
  );
};

const QuienesSomos = () => {
  return (
    <ScrollView>
      <Historia />
      <Card>
        <Card.Title>"Actividades y recursos"</Card.Title>
        <Card.Divider />
        {ACTIVIDADES.map((actividad, index) => (
          <ListItem key={index} bottomDivider>
            <Avatar source={require('./imagenes/40Años.png')} />
            <ListItem.Content>
              <ListItem.Title>{actividad.nombre}</ListItem.Title>
              <ListItem.Subtitle>{actividad.descripcion}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
});

export default QuienesSomos;