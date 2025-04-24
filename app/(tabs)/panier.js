import React from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePanier } from '../panierContext';

export default function Panier() {
  const { panier, retirerDuPanier, viderPanier } = usePanier();

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