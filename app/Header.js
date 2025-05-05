//Justin Lessard
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../contexte';

const Header = (props) => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const Connection = () => {
    router.push('/Connection');
  };

  const Deconnection = () => {
    setUser(null);
  };

  return (
    <View style={[styles.header, { backgroundColor: props.couleurFond }]}>
      <Text style={styles.title}>{props.titre}</Text>
      <View style={styles.userContainer}>
        {user ? (
          <View>
            <Text style={styles.userText}>Bonjour, {user.nomUser}!</Text>
            <TouchableOpacity onPress={Deconnection} style={styles.button}>
              <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={Connection} style={styles.button}>
              <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
          </View>
        )}
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
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