import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, StyleSheet, FlatList, Text, Pressable, } from "react-native";
import { auth, firestore } from "../firebase";
import MeuEstilo from "../meuestilo";
import { Cor } from "../model/Cor";


export const EscolheCor = (props) => {
    const [loading, setLoading] = useState(true); // Set loading to true
    const [cores, setCores] = useState<Cor[]>([]); // Initial empty array
    const [isRefreshing, setIsRefreshing] = useState(true)

    const corRef = firestore.collection('Cor');

    useEffect(() => {
        const subscriber = corRef
            .onSnapshot((querySnapshot) => {
                const cores = [];
                querySnapshot.forEach((documentSnapshot) => {
                    cores.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setCores(cores);
                setLoading(false);
            });
        return () => subscriber();
    }, [cores]);


    if (loading) {
        return <ActivityIndicator />;
    }

    const closeModal = (bool, item) => {
        console.log(item)
        props.setModalCorVisible(bool);
        props.setCor(item);
    }

    const renderCor = ({ item }: { item: Cor }) => {
        return <View style={styles.itemCard} key={item.id}>
            <Pressable
                style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, styles.listItem]}
                onLongPress={() => { closeModal(false, item) }}
                //onLongPress={() => deleteTipoUsuario(item)}
                //onPress={() => { editTipoUsuario(item) }}
                onPress={() => { closeModal(false, item) }}
            >
                {/* <Image source={{ uri: item.imageUri }} style={styles.itemImage} /> */}
                <View>
                    <Text>ID: {item.id}</Text>
                    <Text>Raça: {item.cor}</Text>
                </View>
            </Pressable>
        </View>
    }




    return (
        <SafeAreaView style={MeuEstilo.containerlistar}>
            <FlatList
                data={cores}
                renderItem={renderCor}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16
    },
    itemCard: {
        backgroundColor: '#fff',
        shadowColor: '#222222',
        shadowOffset: { height: 1, width: 1 },
    },
    itemImage: {
        width: 64,
        height: 64,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: '#eee'
    }
})


