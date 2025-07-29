// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { colors, globalStyles } from '../theme/globalStyles';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import RoadmapDetailScreen from '../screens/RoadmapDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateRoadmapScreen from '../screens/CreateRoadmapScreen';

export type RootStackParamList = {
  HomeStack: undefined;
  RoadmapDetail: { roadmapId: string };
  CreateRoadmap: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type RootTabParamList = {
  'Ana Sayfa': NavigatorScreenParams<RootStackParamList>;
  'Oluştur': undefined;
  'Profil': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{ title: 'Yol Haritaları' }}
      />
      <Stack.Screen
        name="RoadmapDetail"
        component={RoadmapDetailScreen}
        options={{ title: 'Yol Haritası Detayı' }}
      />
      <Stack.Screen
        name="CreateRoadmap"
        component={CreateRoadmapScreen}
        options={{ title: 'Yeni Yol Haritası Oluştur' }}
      />
    </Stack.Navigator>
  );
}

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Oluştur') {
            return (
              <View style={styles.createButtonContainer}>
                <Icon name="add" size={32} color={colors.background} />
              </View>
            );
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabel: route.name === 'Oluştur' ? '' : route.name,
      })}>
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeStackNavigator}
        // --- YENİ EKLENEN KISIM BURASI ---
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Varsayılan davranışı engelle
            e.preventDefault();
            // İlgili stack'i en başa döndür
            navigation.navigate('Ana Sayfa', { screen: 'HomeStack' });
          },
        })}
      />
      <Tab.Screen
        name="Oluştur"
        component={() => null}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate('Ana Sayfa', { screen: 'CreateRoadmap' });
          },
        })}
      />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? (
        <MainAppTabs />
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  createButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    ...globalStyles.shadow,
  },
});

export default AppNavigator;