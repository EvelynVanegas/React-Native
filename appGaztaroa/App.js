import { StatusBar } from 'expo-status-bar';

// REACT
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

// CAMPOBASE
import Campobase from './componentes/CampobaseComponent';

// REDUX
import { ConfigureStore } from './redux/configureStore';

// FIREBASE
import { getDatabase, ref, set, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArM7FijgkkOcKCm77w30sfBet1a1UpjfY",
  authDomain: "react-native-f84ac.firebaseapp.com",
  databaseURL: "https://react-native-f84ac-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-native-f84ac",
  storageBucket: "react-native-f84ac.appspot.com",
  messagingSenderId: "156819458424",
  appId: "1:156819458424:web:76429bccf438c4ec7aa08d",
  measurementId: "G-PL7QGVBRHT"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const store = ConfigureStore();

export default function App() {
  useEffect(() => {
    // Prueba de escritura y lectura en Firebase
    const testFirebaseConnection = async () => {
      const testRef = ref(database, 'test');
      await set(testRef, { connected: true });
      const snapshot = await get(testRef);
      if (snapshot.exists()) {
        console.log('Firebase connection successful:', snapshot.val());
      } else {
        console.log('No data available');
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <View style={styles.container}>
            <Campobase />
            <StatusBar style="auto" />
          </View>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});