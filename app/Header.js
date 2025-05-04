import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Header = (props) => {
  const router = useRouter();

  const allerConnexion = () => {
    router.push('/Connection');
  };

  const allerInscription = () => {
    router.push('/Inscription'); // Redirige vers la page d'inscription
  };

  return (
    <View style={[styles.header, { backgroundColor: props.couleurFond }]}>
      <Text style={styles.title}>{props.titre}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={allerConnexion} style={styles.button}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={allerInscription} style={styles.button}>
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;