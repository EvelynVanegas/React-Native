import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { extendedStyles } from './styles';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { connect } from 'react-redux';
import { loginUser } from '../redux/ActionCreators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set } from 'firebase/database';

const LoginComponent = ({ navigation, loginUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const saveEmailToStorage = async (emailPrefix) => {
        try {
            await AsyncStorage.setItem('emailPrefix', emailPrefix);
        } catch (error) {
            console.error('Error saving email prefix to storage', error);
        }
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                Alert.alert('Inicio de sesión correcto', `Bienvenido, ${user.email}`);
                emailPrefix = user.email.split('@')[0];
                loginUser();
                saveEmailToStorage(emailPrefix);
                navigation.navigate('Campo base');
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Fallo en el inicio de sesión', errorMessage);
            });
    };

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                Alert.alert('Usuario registrado con éxito', `Bienvenido, ${user.email}`);
                const emailPrefix = user.email.split('@')[0];
                loginUser();
                saveEmailToStorage(emailPrefix);
                navigation.navigate('Campo base');

                // Agregar entrada en la tabla de favoritos
                const database = getDatabase();
                const favoritosRef = ref(database, `favoritos/${emailPrefix}`);
                const initialFavoritos = {
                    0: false,
                    1: false,
                    2: false,
                    3: false
                };
                set(favoritosRef, initialFavoritos);
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert('Registro fallido', errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Inicio de sesión' : 'Registro'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={extendedStyles.buttonContainer}>
                <Button
                    title={isLogin ? 'Inicio de sesión' : 'Registrar'}
                    onPress={isLogin ? handleLogin : handleRegister}
                    buttonStyle={extendedStyles.buttonPrimary}
                    titleStyle={extendedStyles.buttonText}
                />
                <Button
                    title={isLogin ? 'Cambiar a Registro' : 'Cambiar a Inicio de Sesión'}
                    onPress={() => setIsLogin(!isLogin)}
                    buttonStyle={extendedStyles.buttonPrimary}
                    titleStyle={extendedStyles.buttonText}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

// Conectar el componente al store de Redux
const mapDispatchToProps = (dispatch) => ({
    loginUser: () => dispatch(loginUser())
});

export default connect(null, mapDispatchToProps)(LoginComponent);