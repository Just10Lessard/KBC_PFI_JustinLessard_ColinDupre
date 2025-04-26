import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import { usePanier } from '../panierContext';
import { useUser } from '../contexte';
//Colin Dupre


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export default function Panier() {
  const { panier, retirerDuPanier, viderPanier } = usePanier();
  const { user } = useUser();
  const [total, setTotal] = useState(0);
  const router = useRouter();
  

  useEffect(() => {
    let newTotal = 0;
    panier.forEach((item) => {
      newTotal += item.prix * item.quantite;
    });
    setTotal(newTotal);
  }, [panier]);


  const enregistrerTransaction = async (userId, panier, total) => {
    try {
      
      const transaction = {
        userId: userId,
        items: panier,
        total: total,
        timestamp: serverTimestamp(),
      };
      if(panier.length !== 0) {
        await addDoc(collection(db, "Transactions"), transaction);
        Alert.alert("Succès", "Achat confirmé !");
        console.log("Transaction enregistrée avec succès !");
      }
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction :", error);
    }
  };

  const handleTransaction = () => {
    if (user) {
      enregistrerTransaction(user.id, panier, total); // Pass the total to the function
      viderPanier(); // Clear the cart after the transaction
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
              <Pressable onPress={() => retirerDuPanier(item.id)} style={styles.pressableButton}>
                <Text style={styles.pressableButtonText}>Retirer</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total : ${total}</Text>
        <Pressable onPress={handleTransaction} 
        style={[
          styles.pressableButton,
          !user || user.admin ?  styles.disabledButton : null,]}
         disabled={!user || user.admin}>
          <Text style={styles.pressableButtonText}>Confirmer l'achat</Text>
        </Pressable>
      </View>
      <Pressable onPress={viderPanier} 
        style={[
          styles.pressableButton,
          !user || user.admin ? styles.disabledButton : null,]}
        disabled={!user || user.admin}>
        <Text style={styles.pressableButtonText}>Vider le panier</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/historique')} 
        style={[
          styles.pressableButton,
          !user || user.admin ? styles.disabledButton : null,]}
        disabled={!user || user.admin}>
        <Text style={styles.pressableButtonText}>Historique</Text>
      </Pressable>
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
  totalContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pressableButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  pressableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});