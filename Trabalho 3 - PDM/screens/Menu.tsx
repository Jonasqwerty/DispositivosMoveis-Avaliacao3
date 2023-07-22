import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ManterInstrumento from './ManterInstrumento';
import ListarInstrumento from './ListarInstrumento';
import Sair from './SairScreen';
import ListarCores from './ListarCor';
import ManterCor from './ManterCor';
import { Cor } from '../model/Cor';

function ListarScreen({ navigation }) {
  return (
   <ListarInstrumento></ListarInstrumento>
  );
}
function ManterScreen({ navigation }) {
  return (
   <ManterInstrumento></ManterInstrumento>
  );
}

function ManterCoresScreen({ navigation }) {
  return (
    <ManterCor></ManterCor>
  );
}

function ListarCoresScreen({ navigation }) {
  return (
    <ListarCores></ListarCores>
  );
}

function SairScreen({ navigation }) {
  return (
      <Sair></Sair>
  );
}

const Drawer = createDrawerNavigator();

export default function Menu() {
  return (
    
      <Drawer.Navigator initialRouteName="Manter Instrumento">
        <Drawer.Screen name="Manter Instrumento" component={ManterScreen} />
        <Drawer.Screen name="Listar Instrumento" component={ListarScreen} />
        <Drawer.Screen name="Manter Cores" component={ManterCoresScreen} />
        <Drawer.Screen name="Listar Cores" component={ListarCoresScreen} />
        <Drawer.Screen name="Sair" component={SairScreen} />
      </Drawer.Navigator>
    
  );
}
