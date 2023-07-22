import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, FlatList, Text, StatusBar, AlertButton, Alert, Pressable, } from "react-native";
import { auth, firestore } from "../firebase";
import MeuEstilo from "../meuestilo";
import { Cor } from "../model/Cor";

const ListarCores = () => {
  const [loading, setLoading] = useState(true); // Set loading to true
  const [cores, setCores] = useState<Cor[]>([]); // Initial empty array
  const corRef = firestore.collection('Cor');
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [cor, setCor] = useState<Partial<Cor>>()
  const navigation = useNavigation();

  const listartodos = () => {
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
        setIsRefreshing(false)
      });
    return () => subscriber();
  }

  useEffect(() => {

    listartodos()
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }




  const abrirCor = (cor: Cor) => {
    alert('Aqui tem que passar parametro e para ir para manter Cor')
  }

  const deleteCor = async (cor: Cor) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' }
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        const res = await corRef.doc(cor.id).delete().then(() => {
          setIsRefreshing(true);
        })

      }
    }

    Alert.alert(`Apagar cor "${cor.cor}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const renderCores = ({ item }: { item: Cor }) => {
    return <View style={MeuEstilo.item} key={item.id}>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, MeuEstilo.listItem]}
        onLongPress={() => deleteCor(item)}
        onPress={() => { abrirCor(item) }}
      >
        <View>
          <Text style={MeuEstilo.title}>ID: {item.id}</Text>
          <Text style={MeuEstilo.title}>Cor: {item.cor}</Text>
        </View>
      </Pressable>
    </View>
  }


  return (
    <SafeAreaView style={MeuEstilo.containerlistar}>
      <FlatList
        data={cores}
        renderItem={renderCores}
        keyExtractor={(item) => item.id}
        onRefresh={() => listartodos()}
        refreshing={isRefreshing}
      />
    </SafeAreaView>
  );
};
export default ListarCores;
