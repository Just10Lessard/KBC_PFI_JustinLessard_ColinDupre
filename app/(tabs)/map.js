import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList,Image, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router'; 
import commerces from '../commerces.json'; 
import homeIcon from '../../assets/home.png';
import { useUser } from '../contexte';
//Colin Dupre


export default function AppCommerce() {
  const router = useRouter();
  const mapRef = useRef(null);
  const { user } = useUser();
  const [selectedCommerce, setSelectedCommerce] = useState(null);

  const initialRegion = {
    latitude: 45.64241870868377,
    longitude: -73.84303075333384,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const commercePress = (commerce) => {
    setSelectedCommerce(commerce);
    mapRef.current.animateToRegion({
        latitude: commerce.coord.latitude,
        longitude: commerce.coord.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
        });  
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        selectedCommerce?.id === item.id ? styles.selectedListItem : null,
        ]}
      onPress={() => commercePress(item)}
    >
      <Text style={styles.listItemText}>{item.nom}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Carte - {user ? user.nomUser : ""}</Text>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {commerces.map((commerce) => (  
          <Marker
            key={commerce.id}
            coordinate={commerce.coord}
            title={commerce.nom}
            pinColor= "blue"
            onPress={() => commercePress(commerce)}
          >
          {commerce.id === 50 ? 
            <Image source={homeIcon} style={{ width: 30, height: 30 }} /> : null}
          </Marker>
        ))}
      </MapView>
      <FlatList
        data={commerces}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  map: {
    height: '79%',
  },
  list: {
    flex: '21%', 
    backgroundColor: 'white',
  },
  listItem: {
    padding: 3,
    borderWidth: 1,
    borderColor: 'black',
  },
  selectedListItem: {
    backgroundColor: 'lightgrey',
  },
  listItemText: {
    fontSize: 20,
  },
});