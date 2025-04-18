//Justin Lessard

import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

const Header = (props) => {
    return (
        <View style={[styles.header, {backgroundColor: props.couleurFond}]}>
            <Text style={styles.title}>{ props.titre }</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header:{
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        color: "white",
        fontSize: 28,
        fontWeight: '500',
        textTransform: 'uppercase' 
    }
});

export default Header;