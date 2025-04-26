import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from '../firebaseConfig';
import { useUser } from './contexte'; // Import the user context

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Historique() {
  const { user } = useUser(); // Get the connected user
  const [transactions, setTransactions] = useState([]); // State to store transactions

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !user.id) {
        console.error('Utilisateur non connecté ou ID manquant.');
        return;
      }

      try {
        const transactionsRef = collection(db, 'Transactions'); // Reference to the Transactions collection
        const q = query(transactionsRef, where('userId', '==', user.id)); // Query transactions for the connected user
        const querySnapshot = await getDocs(q);
        

        const fetchedTransactions = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Spread the document data
        }));

        setTransactions(fetchedTransactions); // Update the state with the fetched transactions
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error);
      }
    };

    fetchTransactions();
  }, [user]);

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Aucune transaction trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionContainer}>
            <Text style={styles.transactionDate}>
                Date : {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}{/* *1000 pour conversion de seconde a milliseconde firestore et javascript est tata */}
            </Text>
            <Text style={styles.transactionTotal}>Total : ${item.total}</Text>
            <Text style={styles.transactionItems}>Articles :</Text>
            {item.items.map((product, index) => (
              <Text key={index} style={styles.transactionItem}>
                - {product.nom} (Quantité : {product.quantite})
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  transactionTotal: {
    fontSize: 16,
    marginBottom: 8,
  },
  transactionItems: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionItem: {
    fontSize: 14,
    color: '#555',
  },
});