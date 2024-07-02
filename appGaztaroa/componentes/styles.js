import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  button: {
    margin: 10
  }
});

export const extendedStyles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 100,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonPrimary: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});