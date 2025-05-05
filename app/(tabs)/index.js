//Justin Lessard

import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig';
import Header from '../Header';
import { useUser } from '../contexte';
import { usePanier } from '../panierContext';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AfficheItem = ({ item }) => {	
  const router = useRouter();
  const { user } = useUser(); 
  const { ajouterAuPanier } = usePanier(); 

  const allerADetail = () => {
    router.push({
      pathname: '/details',
      params: {
        nom: item.nom,
        description: item.description,
        prix: item.prix,
        image: item.image,
      },
    });
  };

  const supprimerItem = async () => {
    try {
      await deleteDoc(doc(db, "Items", item.id)); // Supprime l'item de Firestore
      Alert.alert("Succès", "L'item a été supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      Alert.alert("Erreur", "Impossible de supprimer l'item.");
    }
  };

  return (
    <TouchableOpacity onPress={allerADetail}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.nom}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.prix}</Text>
        {user && user.admin ? (
          <TouchableOpacity onPress={supprimerItem} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => ajouterAuPanier(item)} style={styles.addToCartButton} disabled={!user}>
            <Text style={styles.addButtonText}>Ajouter au panier</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
// Fonction pour aller chercher les items
const rafraichirItems = (setItems) => {
  try {
    getDocs(collection(db, "Items"))
      .then(result =>
        result.docs.map(doc => ({
          id: doc.id,
          nom: doc.data().nom,
          description: doc.data().description,
          prix: doc.data().prix,
          image: doc.data().image,
        }))
      )
      .then((nouvellesItems) => {
        setItems(nouvellesItems); // Met à jour les items avec les nouvelles données
      });
  } catch (e) {
    console.log("Erreur", e);
    Alert.alert("Erreur", "Impossible de récupérer les items.");
  }
};

export default function AppItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    rafraichirItems(setItems);
  }, []);

  return (
    <View style={styles.container}>
      <Header titre = "Liste des items" couleurFond= "blue"></Header>

        <FlatList
          data={items}
          renderItem={({ item }) => <AfficheItem item={item} />}
          keyExtractor={item => item.id}
          numColumns={2} //2 par ligne
        />

      <StatusBar style="auto" />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'beige',
    paddingHorizontal: 10,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333', // Couleur du texte plus neutre
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    padding: 12,
    backgroundColor: 'white',
  },
  itemImage: {
    width: '100%',
    height: 150, // Taille de l'image
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333', // Couleur du texte plus neutre
  },
  itemDescription: {
    fontSize: 13, // Taille légèrement augmentée pour une meilleure lisibilité
    color: '#777', // Couleur plus douce pour le texte secondaire
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15, // Taille légèrement augmentée
    fontWeight: 'bold',
    color: '#007BFF', // Couleur bleue pour mettre en avant le prix
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});