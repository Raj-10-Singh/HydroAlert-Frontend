import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer }         from '@react-navigation/native';
import { createStackNavigator }        from '@react-navigation/stack';
import { createBottomTabNavigator }    from '@react-navigation/bottom-tabs';
import { useAuth }                     from './context/AuthContext';

import Login    from './screens/LoginScreen';
import Register from './screens/RegisterScreen';
import Home     from './screens/HomeScreen';
import MapScreen    from './screens/MapScreen';
import Alerts   from './screens/AlertsScreen';
import Shelters from './screens/ShelterScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
    tabBarActiveTintColor: '#3b82f6',
    tabBarInactiveTintColor: '#475569',
  }}>
    <Tab.Screen name="Home"     component={Home} />
    <Tab.Screen name="Map"      component={MapScreen} />
    <Tab.Screen name="Alerts"   component={Alerts} />
    <Tab.Screen name="Shelters" component={Shelters} />
  </Tab.Navigator>
);

export default function Nav() {
  const { user, ready } = useAuth();

  if (!ready) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a' }}>
      <ActivityIndicator color="#3b82f6" />
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user
          ? <Stack.Screen name="Tabs"     component={Tabs} />
          : <>
              <Stack.Screen name="Login"    component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}