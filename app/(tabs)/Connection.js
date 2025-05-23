//Justin Lessard
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';
import { useUser } from '../contexte';
import { usePanier } from '../panierContext';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function AppConnection() {
  const [nomUser, setNomUser] = useState('');
  const [mdp, setMdp] = useState('');
  //Colin Dupre pour la partie setUser et viderPanier
  const { setUser } = useUser();
  const { viderPanier } = usePanier();

  const verifierConnexion = async () => {
    try {
      const comptesRef = collection(db, 'Comptes'); // Ramasse la collection Comptes
      const q = query(comptesRef, where('nomUser', '==', nomUser), where('mdp', '==', mdp)); //https://www.youtube.com/watch?v=-yrnWnN0g9o
      const compte = await getDocs(q); //Ramasse le user qui le meme nom et mdp
  
      if (!compte.empty) { // Vérifie si un document a été trouvé
        const user = { ...compte.docs[0].data(), id: compte.docs[0].id }; // Doit mettre [0] pour prendre seulement 1 compte sinon erreur
        setUser(user);
        viderPanier();
        Alert.alert('Connexion réussie');
      } else {
        Alert.alert('Erreur', 'Mauvais nom ou mot de passe.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Il a eu une erreur');
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