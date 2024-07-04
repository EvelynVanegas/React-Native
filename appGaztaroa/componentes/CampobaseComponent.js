import Constants from 'expo-constants';

// REACT
import React, { Component } from 'react';
import { View, Platform, StyleSheet, Image, Text, Button, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

// REDUX
import { connect, useDispatch } from 'react-redux';
import { fetchExcursiones, fetchComentarios, fetchCabeceras, fetchActividades, logoutUser } from '../redux/ActionCreators';

// COMPONENTES
import Home from './HomeComponent';
import QuienesSomos from './QuienesSomosComponent';
import Calendario from './CalendarioComponent';
import DetalleExcursion from './DetalleExcursionComponent';
import Contacto from './ContactoComponent';
import Login from './LoginComponent';
import ActividadesFavoritasC from './LoginComponent';

// ICON
import { Icon } from '@rneui/themed';

// COMUN
import { colorGaztaroaClaro, colorGaztaroaOscuro } from '../comun/comun';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const mapStateToProps = state => {
  return {
    excursiones: state.excursiones,
    comentarios: state.comentarios,
    cabeceras: state.cabeceras,
    actividades: state.actividades,
    loggedIn: state.loggedIn,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchExcursiones: () => dispatch(fetchExcursiones()),
  fetchComentarios: () => dispatch(fetchComentarios()),
  fetchCabeceras: () => dispatch(fetchCabeceras()),
  fetchActividades: () => dispatch(fetchActividades()),
  logoutUser: () => dispatch(logoutUser()),
})

function HomeNavegador({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Campo Base',
        }}
      />
    </Stack.Navigator>
  );
}

function CalendarioNavegador({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Calendar"
      headerMode="float"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Calendar"
        component={Calendario}
        options={{
          title: 'Calendario Gaztaroa',
        }}
      />
      <Stack.Screen
        name="DetalleExcursion"
        component={DetalleExcursion}
        options={{
          title: 'Detalle Excursión',
        }}
      />
    </Stack.Navigator>
  );
}

function QuienesSomosNavegador({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="QuienesSomos"
      headerMode="float"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="QuienesSomos"
        component={QuienesSomos}
        options={{
          title: 'Quiénes somos',
        }}
      />
    </Stack.Navigator>
  );
}


function ContactoNavegador({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Contacto"
      headerMode="float"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Contacto_2"
        component={Contacto}
        options={{
          title: 'Contacto',
        }}
      />
    </Stack.Navigator>
  );
}

function LoginNavegador({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Iniciar sesión"
      headerMode="float"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Login_2"
        component={Login}
        options={{
          title: 'Iniciar sesión',
        }}
      />
    </Stack.Navigator>
  );
}

function ActividadesFavoritas({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Actividades favoritas"
      headerMode="float"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: colorGaztaroaOscuro },
        headerTitleStyle: { color: '#fff' },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
    >
      <Stack.Screen
        name="ActividadesFavortias_2"
        component={ActividadesFavoritasC}
        options={{
          title: 'Actividades Favoritas',
        }}
      />
    </Stack.Navigator>
  );
}

function DrawerNavegador({ loggedIn }) {
  return (
    <Drawer.Navigator
      initialRouteName={ "Campo base" }
      drawerContent={props => <CustomDrawerContent {...props} loggedIn={loggedIn} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colorGaztaroaClaro,
        },
      }}
    >
      <Drawer.Screen
        name="Campo base"
        component={HomeNavegador}
        options={{
          drawerIcon: ({ color }) => (
            <Icon
              name='home'
              type='font-awesome'
              size={24}
              color={color}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Quiénes somos"
        component={QuienesSomosNavegador}
        options={{
          drawerIcon: ({ color }) => (
            <Icon
              name='info-circle'
              type='font-awesome'
              size={24}
              color={color}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Calendario"
        component={CalendarioNavegador}
        options={{
          drawerIcon: ({ color }) => (
            <Icon
              name='calendar'
              type='font-awesome'
              size={24}
              color={color}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Contacto"
        component={ContactoNavegador}
        options={{
          drawerIcon: ({ color }) => (
            <Icon
              name='address-card'
              type='font-awesome'
              size={24}
              color={color}
            />
          )
        }}
      />
      {!loggedIn ? (
        <Drawer.Screen
          name="Iniciar sesión"
          component={LoginNavegador}
          options={{
            drawerIcon: ({ color }) => (
              <Icon
                name='user'
                type='font-awesome'
                size={24}
                color={color}
              />
            )
          }}
        />
      ) : (
        <Drawer.Screen
          name="Actividades Favoritas"
          component={ActividadesFavoritas}
          options={{
            drawerIcon: ({ color }) => (
              <Icon
                name='tree'
                type='font-awesome'
                size={24}
                color={color}
              />
            )
          }}
        />
      )}
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    Alert.alert('Se ha cerrado sesión correctamente', 'Hasta pronto');
  }

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={styles.drawerHeader}>
          <View style={{ flex: 1 }}>
            <Image source={require('./imagenes/logo.png')} style={styles.drawerImage} />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.drawerHeaderText}> Gaztaroa</Text>
          </View>
        </View>
        <DrawerItemList {...props} />
        {props.loggedIn && (
          <Button
            title="Cerrar sesión"
            onPress={handleLogout}
            buttonStyle={styles.buttonPrimary}
            titleStyle={styles.buttonText}
          />
        )}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

class Campobase extends Component {

  componentDidMount() {
    this.props.fetchExcursiones();
    this.props.fetchComentarios();
    this.props.fetchCabeceras();
    this.props.fetchActividades();
  }

  render() {
    const { loggedIn } = this.props;
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
        <DrawerNavegador loggedIn={loggedIn} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: colorGaztaroaOscuro,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  },
  buttonPrimary: {
    backgroundColor: colorGaztaroaOscuro,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Campobase);