//Justin Lessard

import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AppDetailsItem() {
  const { nom, description, prix, image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{nom}</Text>
      <Text style={styles.desc}>{description}</Text>
      <Text style={styles.price}>Prix: ${prix}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // Centre verticalement
      alignItems: 'center', // Centre horizontalement
      padding: 20,
      backgroundColor: '#fff',
    },
    image: {
      width: '100%',
      height: 350,
      borderRadius: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    desc: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 15,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
  });