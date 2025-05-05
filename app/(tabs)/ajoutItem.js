//Justin Lessard

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function AjoutItem() {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const isNullOrEmpty = (str) => { //https://stackoverflow.com/questions/3977988/is-there-any-function-like-string-isnullorempty-in-javascript
    return !str || str.trim().length === 0;
  };

  const ajouterItem = async () => {
    if (isNullOrEmpty(nom) || isNullOrEmpty(prix) || isNullOrEmpty(description) || isNullOrEmpty(image)) {
      Alert.alert('Erreur', 'Tout doit être rempli.');
      return;
    }

    try {
      const prixNumber = parseInt(prix);
      if (prixNumber <= 0) {
        Alert.alert('Erreur', 'Le prix doit être supérieur à 0.');
        return;
      }

      const itemsRef = collection(db, 'Items');
      await addDoc(itemsRef, {
        nom,
        prix: prixNumber,
        description,
        image,
      });

      Alert.alert('Succès', 'item ajouté');
      setNom('');
      setPrix('');
      setDescription('');
      setImage('');
    } catch (error) {
      Alert.alert('Erreur', 'Il a eu une erreur');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Item</Text>
      <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom}/>
      <TextInput style={styles.input} placeholder="Prix" value={prix} onChangeText={setPrix} keyboardType="numeric"/>
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription}/>
      <TextInput style={styles.input} placeholder="url image" value={image} onChangeText={setImage}/>
      <TouchableOpacity onPress={ajouterItem} style={styles.button}>
        <Text style={styles.buttonText}>Ajouter</Text>
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