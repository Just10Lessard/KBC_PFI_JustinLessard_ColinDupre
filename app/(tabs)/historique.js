import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig';
import { useUser } from '../contexte'; 
//Colin Dupre


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function AppHistorique() {
  const { user } = useUser(); 
  const [transactions, setTransactions] = useState([]); 

  const fetchTransactions = () => {
    const transactionsRef = collection(db, 'Transactions'); 
    const q = query(transactionsRef, where('userId', '==', user.id)); 
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
    }, (error) => {
      console.log('Erreur', 'Il a eu une erreur', error);
    });
  
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchTransactions();
    return () => unsubscribe(); 
  }, []);

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Aucune transaction trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions - {user.nomUser ? user.nomUser : ""}</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionContainer}>
            <Text style={styles.transactionDate}>
                Date : {item.timestamp && item.timestamp.seconds
                  ? new Date(item.timestamp.seconds * 1000).toLocaleDateString()
                  : "attende de transaction"}{/* *1000 pour conversion de seconde a milliseconde firestore et javascript est tata */}
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