import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

// CAMPOBASE
import Campobase from './componentes/CampobaseComponent';

// REDUX
import { ConfigureStore } from './redux/configureStore';

// FIREBASE CONFIG
import { database } from './firebaseConfig';
import { ref, set, get } from 'firebase/database';

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