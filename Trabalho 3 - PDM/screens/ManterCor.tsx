import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {  KeyboardAvoidingView, Alert, Text,  Pressable, Modal, TextInput,  TouchableOpacity,  View,} from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Cor } from "../model/Cor";

const ManterCor = () => {
  const [formCor, setFormCor] = useState<Partial<Cor>>({})
  const corRef = firestore.collection('Cor');
  
  useEffect(() => {
   
  }, []);


  const limparFormulario=()=>{
    setFormCor({})
  }

  const cancelar = async() => {
    limparFormulario()
  }
  const salvar = async() => {
    const corRefComId = corRef.doc();
    const cor= new Cor(formCor);
    cor.id=corRefComId.id
    console.log(cor)
    corRefComId.set(cor.toFirestore()).then(() => {
         alert("Cor" + cor.cor + " Adicionado com Sucesso");
         console.log("Cor" + cor);
         console.log("Cor ToString: "+cor.toString())
         limparFormulario()
         });
    };
    
  
  return (
    <KeyboardAvoidingView 
    style={meuestilo.container}
    behavior="padding">
      <View style={meuestilo.inputContainer}>
        <TextInput
          placeholder="Cor"
          value={formCor.cor}
          onChangeText={val => setFormCor({ ...formCor, cor: val })}
          style={meuestilo.input}
        />
      </View>

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
    </KeyboardAvoidingView>
  );
};

export default ManterCor;

