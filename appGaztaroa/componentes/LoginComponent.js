import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@rneui/themed';
import { extendedStyles } from './styles';

const LoginComponent = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                Alert.alert('Inicio de sesión correcto', `Bienvenido, ${user.email}`);
                navigation.navigate('Home');
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
                // Registered
                const user = userCredential.user;
                Alert.alert('Usuario registrado con éxito', `Bienvenido, ${user.email}`);
                navigation.navigate('Home');
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

export default LoginComponent;