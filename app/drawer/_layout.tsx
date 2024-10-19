import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './index';
import HighScore from './highscore';
import Logout from './logout';

const Drawer = createDrawerNavigator();
export default function DrawerLayout() {
  return (
    <Drawer.Navigator initialRouteName="index">
      <Drawer.Screen name="index" component={Home}
                     options={{ drawerLabel: 'Home' }} />
     <Drawer.Screen name="highscore" component={HighScore}
                     options={{ drawerLabel: 'Highscore' }} />
     <Drawer.Screen name="logout" component={Logout}
                     options={{ drawerLabel: 'Logout' }} />
   </Drawer.Navigator>
  );
}