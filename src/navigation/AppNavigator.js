import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import RoutesScreen from '../screens/RoutesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d1f2d',
          borderTopColor: '#1e3d56',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#2a9d8f',
        tabBarInactiveTintColor: '#3a6a88',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Карта') icon = focused ? 'map' : 'map-outline';
          else if (route.name === 'Маршруты') icon = focused ? 'bus' : 'bus-outline';
          else if (route.name === 'Расписание') icon = focused ? 'time' : 'time-outline';
          return <Ionicons name={icon} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Карта" component={MapScreen} />
      <Tab.Screen name="Маршруты" component={RoutesScreen} />
      <Tab.Screen name="Расписание" component={ScheduleScreen} />
    </Tab.Navigator>
  );
}
