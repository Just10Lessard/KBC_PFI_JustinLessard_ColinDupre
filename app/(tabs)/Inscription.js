//Justin Lessard

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default function AppInscription() {
  const [nomUser, setNomUser] = useState('');
  const [mdp, setMdp] = useState('');

  const isNullOrEmpty = (str) => { //https://stackoverflow.com/questions/3977988/is-there-any-function-like-string-isnullorempty-in-javascript
    return !str || str.trim().length === 0;
  };

  const creerCompte = async () => {
    if (isNullOrEmpty(nomUser) || isNullOrEmpty(mdp)) {
        Alert.alert('Erreur', 'Le nom et/ou le mot de passe ne peuvent pas être vides.');
        return;
    }

    try {
      const comptesRef = collection(db, 'Comptes');
      const q = query(comptesRef, where('nomUser', '==', nomUser));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Erreur', 'Ce nom existe déjà');
        return;
      }

      await addDoc(comptesRef, {
        nomUser,
        mdp,
        admin: false, // Pas admin par défaut
      });

      Alert.alert('Succès', 'Compte créé');
      setNomUser('');
      setMdp('');
    } catch (error) {
      Alert.alert('Erreur', 'Il a eu un problème');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
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
      <TouchableOpacity onPress={creerCompte} style={styles.button}>
        <Text style={styles.buttonText}>Créer un compte</Text>
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