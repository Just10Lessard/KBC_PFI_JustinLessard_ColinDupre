import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Connection() {
  const [nomUser, setNomUser] = useState('');
  const [mdp, setMdp] = useState('');

  const verifierConnexion = async () => { //https://www.youtube.com/watch?v=-yrnWnN0g9o et https://stackoverflow.com/questions/73266511/how-to-query-in-a-specific-document-in-firebase
    try {
      const comptesRef = collection(db, 'Comptes'); //indique que tu fais reference a la collection comptes
      const q = query(comptesRef, where('nomUser', '==', nomUser), where('mdp', '==', mdp)); //requete pour verifier si nomUser et mdp sont corrects
      const compte = await getDocs(q); //doit mettre async sinon ca crash. execute la requete

      if (!querySnapshot.empty) { //https://stackoverflow.com/questions/69051871/flutter-firebase-check-if-collection-is-empty
        const user = compte.docs.data();
        if (user.admin) {
          Alert.alert('Connexion réussie', 'Bienvenue, administrateur!');
        } else {
          Alert.alert('Connexion réussie', 'Bienvenue, utilisateur!');
        }
      } else {
        Alert.alert('Erreur', 'Nom d’utilisateur ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={nomUser}
        onChangeText={setNomUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={mdp}
        onChangeText={setMdp}
        secureTextEntry
      />
      <TouchableOpacity onPress={verifierConnexion} style={styles.button}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});