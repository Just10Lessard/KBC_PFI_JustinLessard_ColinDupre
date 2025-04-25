import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { usePanier } from '../panierContext';
import { useUser } from '../contexte';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const enregistrerTransaction = async (userId, panier) => {
  try {
    const total = panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);

    const transaction = {
      userId: userId,
      items: panier,
      total: total,
      timestamp: serverTimestamp(), // Add the timestamp here
    };

    await addDoc(collection(db, "Transactions"), transaction);
    console.log("Transaction enregistrée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la transaction :", error);
  }
};


export default function Panier() {
  const { panier, retirerDuPanier, viderPanier } = usePanier();
  const { user } = useUser();
  const [total, setTotal] = useState(0);
  

  useEffect(() => {
    let newTotal = 0;
    panier.forEach((item) => {
      newTotal += item.prix * item.quantite;
    });
    setTotal(newTotal);
  }, [panier]);

  const formaterDate = (timestamp) => {
    const date = new Date(timestamp); 
    const jour = date.getDate(); 
    const mois = date.getMonth() + 1; // Récupère le mois (0-indexé, donc +1)
    const annee = date.getFullYear(); 
    return `${jour}/${mois}/${annee}`; 
  };

  const handleTransaction = () => {
    if (user) {
      console.log(user);
      enregistrerTransaction(user.id, panier, total); // Pass the total to the function
      viderPanier(); // Clear the cart after the transaction
      //router.push('/'); // Redirect to the home page or another screen
    } else {
      console.error("Erreur : Aucun utilisateur connecté.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Panier</Text>
      <FlatList
        data={panier}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.nom}</Text>
              <Text style={styles.itemQuantity}>Quantité : {item.quantite}</Text>
              <Button title="Retirer" onPress={() => retirerDuPanier(item.id)} />
            </View>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total : ${total.toFixed(2)}</Text>
        <Button title="Confirmer l'achat" onPress={handleTransaction} />
      </View>
      <Button title="Vider le panier" onPress={viderPanier} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
});