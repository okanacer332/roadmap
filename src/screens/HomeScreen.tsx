// src/screens/HomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar, // StatusBar'ı import et
} from 'react-native';
import { ROADMAPS } from '../data/dummyData';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LikeButton from '../components/LikeButton';

import { colors, globalStyles } from '../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeStack'>;

const HomeScreen = ({ navigation }: Props) => {
  const handlePressRoadmap = (roadmapId: string) => {
    navigation.navigate('RoadmapDetail', { roadmapId: roadmapId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Karanlık tema için status bar'ı açık renk yapıyoruz */}
      <StatusBar barStyle="light-content" />
      <FlatList
        data={ROADMAPS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[globalStyles.card, globalStyles.shadow]}
            onPress={() => handlePressRoadmap(item.id)}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.footer}>
              <Text style={styles.author}>by @{item.author.username}</Text>
              <LikeButton initialLikes={item.likes} roadmapId={item.id} />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Artık bu renk koyu lacivert
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text, // Artık bu renk kirli beyaz
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary, // Artık bu renk gri
  },
});

export default HomeScreen;