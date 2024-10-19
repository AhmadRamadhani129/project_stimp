import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './index';
import HighScore from './highscore';
import Logout from './logout';

const Drawer = createDrawerNavigator();
export default function DrawerLayout() {
  return (
    <Drawer.Navigator initialRouteName="index">
      <Drawer.Screen name="Home" component={Home}
                     options={{ drawerLabel: 'Home' }} />
     <Drawer.Screen name="Highscore" component={HighScore}
                     options={{ drawerLabel: 'Highscore' }} />
     <Drawer.Screen name="Logout" component={Logout}
                     options={{ drawerLabel: 'Logout' }} />
   </Drawer.Navigator>
  );
}