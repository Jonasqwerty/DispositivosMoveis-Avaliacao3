import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {  KeyboardAvoidingView, StyleSheet, Alert, Text,  Pressable, FlatList, Modal, TextInput,  TouchableOpacity,  View, Image, Button, AlertButton} from "react-native";
import { auth, firestore, storage } from "../firebase";
import {uploadBytes} from "firebase/storage"; //access the storage databaSse
import meuestilo from "../meuestilo";
import * as ImagePicker from "expo-image-picker";
import { Instrumento } from "../model/Instrumento";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { EscolheCor } from "../screens/EscolheCor";
import { Cor } from "../model/Cor";


const ManterInstrumento = (props) => {
  const [formInstrumento, setFormInstrumento] = useState<Partial<Instrumento>>({})
  const [formCor, setFormCor] = useState<Partial<Cor>>({})
  const instrumentoRef = firestore.collection('Usuario').doc(auth.currentUser?.uid).collection('Instrumento')
  const [formData, setFormData] = useState<Partial<Instrumento>>({})
  const [modalCorVisible, setModalCorVisible] = useState(false);
  const corRef = firestore.collection('Cor');
  const [pickedImagePath, setPickedImagePath]=useState('')
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dataString, setDataString]=useState('');
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]); // Initial empty array
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = instrumentoRef
      .onSnapshot((querySnapshot) => {
        const instrumentos = [];
        querySnapshot.forEach((documentSnapshot) => {
          instrumentos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setInstrumentos(instrumentos);
        setLoading(false);
        setIsRefreshing(false);
      });
    return () => subscriber();
  }, [instrumentos]);
  
  const setCor = async (item) => {
    const doc = await corRef.doc(item.id).get();
    const cor = new Cor(doc.data())
    setFormCor(cor)
    setFormInstrumento({ ...formInstrumento, cor: cor.toFirestore() })

  }

  const limparFormulario=()=>{
    setFormInstrumento({})
    setPickedImagePath("")
  }

  const cancelar = async () => {
    limparFormulario()
  }

  const listartodos = async () => {
    const subscriber = instrumentoRef
      .onSnapshot((querySnapshot) => {
        const instrumentos = [];
        querySnapshot.forEach((documentSnapshot) => {
          instrumentos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setInstrumentos(instrumentos);
        setLoading(false);
        setIsRefreshing(false);
      });
    return () => subscriber();
  }

  const salvar = async () => {
    const instrumento = new Instrumento(formInstrumento);

    if (instrumento.id == null) {
      const instrumentoRefComId = instrumentoRef.doc();
      // const instrumento= new Instrumento(formInstrumento);
      instrumento.id = instrumentoRefComId.id
      // exemplo com referencia de Id

      instrumentoRefComId.set(instrumento.toFirestore()).then(() => {
        alert("Instrumento" + instrumento.tipo + " Adicionado com Sucesso");
        limparFormulario()
      });

    } else {
      const instrumentoRefComId = instrumentoRef.doc(instrumento.id);
      instrumentoRefComId.update(instrumento.toFirestore())
        .then(() => {
          alert("Instrumento" + instrumento.tipo + " Atualizado com Sucesso");
          limparFormulario()
        });
    };
  }

    const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.getDate().toString().padStart(2, "0") + "/" + ((date.getMonth()+1).toString().padStart(2, "0"))  + "/" + date.getFullYear();
    console.log(formattedDate)
    setDataString(formattedDate)
    setFormInstrumento({...formInstrumento, datafabricacao:formattedDate})
    hideDatePicker();
  };


  const escolhefoto = () => {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
          style: "default",
        },

        {
          text: "Abrir galeria",
          onPress: () => showImagePicker(),
          style: "cancel",
        },

      ],
      {
        cancelable: true,
        onDismiss: () => { }
      }
    );
  }

  const enviarImagem = async (result) => {
    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
      const uploadUri = result.assets[0].uri;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
     
      const ref = storage.ref(`imagens/${name}.${extension}`);

      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();
      const fbResult = await uploadBytes(ref, bytes);

      const paraDonwload = await storage.ref(fbResult.metadata.fullPath).getDownloadURL()
      
      setFormInstrumento({... formInstrumento, urlfoto:paraDonwload})

      // const reference = firestore.collection("Usuario").doc(auth.currentUser.uid);
      //reference.update({ urlfoto: fbResult.metadata.fullPath, });
      // reference.update({ urlfoto: paraDonwload, nomeFoto: name + '.' + extension });
    } else {
      alert('Upload Cancelado')
    }
  }

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    enviarImagem(result);

  };


  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    enviarImagem(result);
  };
    
  const editInstrumento = async (instrumento: Instrumento) => {
    const result = firestore.collection('Usuario').doc(auth.currentUser.uid).collection('Instrumento').doc(instrumento.id)
      .onSnapshot(documentSnapshot => {
        const instrumento = new Instrumento(documentSnapshot.data())
        setFormInstrumento(instrumento);
      });
    return () => result();
  }

  const deleteInstrumento = async (instrumento: Instrumento) => {
    const cancelBtn: AlertButton = { text: 'Cancelar' }
    const deleteBtn: AlertButton = {
      text: 'Apagar',
      onPress: async () => {
        const res = await instrumentoRef.doc(instrumento.id).delete().then(() => {
          limparFormulario();
          setIsRefreshing(true);
          //  listartodos();
        })

      }
    }

    Alert.alert(`Apagar instrumento "${instrumento.nome}?"`, 'Essa ação não pode ser desfeita!', [deleteBtn, cancelBtn])
  }

  const renderInstrumentos = ({ item }: { item: Instrumento }) => {
    return <View style={meuestilo.item} key={item.id}>
      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, meuestilo.listItem]}
        onLongPress={() => deleteInstrumento(item)}
        onPress={() => { editInstrumento(item) }}
      >
        <View>
          <Text style={meuestilo.title}>ID: {item.id}</Text>
          <Text style={meuestilo.title}>Tipo: {item.tipo}</Text>
          <Text style={meuestilo.title}>Data de Fabricação: {item.datafabricacao}</Text>
          {/* Condição para mostrar Raca */}
          {item.cor != null ?
            <Text style={meuestilo.title}>Cor: {item.cor.cor}</Text> : <Text style={meuestilo.title}>Cor: Não Selecionada</Text>}
          {/* <Text>Raça: {item.raca.raca}</Text> */}
          
        </View>
      </Pressable>
    </View>
  }
  
  
  return (
    // <KeyboardAvoidingView 
    // style={meuestilo.container}
    // behavior="padding">
      <View style={meuestilo.inputContainer}>

      <Pressable onPress={() => escolhefoto()}>
        <View style={meuestilo.imageContainer}>
          {pickedImagePath !== "" && (
            <Image source={{ uri: pickedImagePath }} style={meuestilo.image} />
          )}
          {pickedImagePath === "" && (
            <Image source={require("../assets/camera.png")}
              style={meuestilo.image} />
          )}
        </View>
      </Pressable>
        <TextInput
          placeholder="Tipo"
          value={formInstrumento.tipo}
          onChangeText={val => setFormInstrumento({ ...formInstrumento, tipo: val })}
          style={meuestilo.input}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalCorVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalCorVisible(!modalCorVisible);
          }}
        >
          <View style={meuestilo.centeredView}>
            <View style={meuestilo.modalView}>
              <EscolheCor
                setModalCorVisible={setModalCorVisible}
                setCor={setCor}
              >
              </EscolheCor>
              </View>
              </View>
              </Modal>
              <Pressable style={[meuestilo.buttonModal, meuestilo.buttonOpen]}
          onPress={() => setModalCorVisible(true)} >
          <Text style={meuestilo.textStyle}>
            Cor: {formInstrumento.cor?.cor}
          </Text>
        </Pressable>

        <Button style={styles.calendario} title="calendário" onPress={showDatePicker} />
              
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

        <TextInput style={styles.input}
             placeholder="Data de Fabricação"
             value={dataString}
             editable={false}/>

        <View style={meuestilo.buttonContainer}>
        <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
          <Text style={meuestilo.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={salvar}
          style={[meuestilo.button, meuestilo.buttonOutline]}
        >
          <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
      data={instrumentos}
      renderItem={renderInstrumentos}
      keyExtractor={item => item.id.toString()}
      onRefresh={() => listartodos()}
      refreshing={isRefreshing}
    />
        
      {/* </View>

      <View style={meuestilo.buttonContainer}> */}
      
       </View> 
    // </KeyboardAvoidingView>
  );
};

export default ManterInstrumento;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 50,
    color: 'black',
  },

  calendario:{
    marginTop: 50,
  }
})
