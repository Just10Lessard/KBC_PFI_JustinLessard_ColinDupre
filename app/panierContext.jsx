import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (item) => {
    setPanier((prevPanier) => {
      const itemIndex = prevPanier.findIndex((i) => i.id === item.id);

      if (itemIndex !== -1) {
        
        const nouveauPanier = [...prevPanier];
        nouveauPanier[itemIndex].quantite += 1;

        Alert.alert("Succès", `${item.nom} a été ajouté au panier (quantité: ${nouveauPanier[itemIndex].quantite}).`);
        return nouveauPanier;
      } else {
        
        Alert.alert("Succès", `${item.nom} a été ajouté au panier.`);
        return [...prevPanier, { ...item, quantite: 1 }];
      }
    });
  };

  const retirerDuPanier = (itemId) => {
    setPanier((prevPanier) => prevPanier.filter((item) => item.id !== itemId));
  };

  const viderPanier = () => {
    setPanier([]);
  };

  return (
    <PanierContext.Provider value={{ panier, ajouterAuPanier, retirerDuPanier, viderPanier }}>
      {children}
    </PanierContext.Provider>
  );
};


export const usePanier = () => useContext(PanierContext);