// src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput, // TextInput'u import et
  ActivityIndicator, // Yükleme göstergesi için import et
} from 'react-native';
import { ROADMAPS } from '../data/dummyData'; // Dummy verileri
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LikeButton from '../components/LikeButton';

import { colors, globalStyles } from '../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeStack'>;

const HomeScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoadmaps, setFilteredRoadmaps] = useState(ROADMAPS);
  const [isRefreshing, setIsRefreshing] = useState(false); // Yenileme durumu için state

  // Roadmap'leri filtreleme fonksiyonu
  const filterRoadmaps = useCallback(() => {
    if (searchQuery === '') {
      setFilteredRoadmaps(ROADMAPS); // Arama boşsa tüm roadmap'leri göster
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = ROADMAPS.filter(
        roadmap =>
          roadmap.title.toLowerCase().includes(lowerCaseQuery) ||
          roadmap.author.username.toLowerCase().includes(lowerCaseQuery) ||
          roadmap.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)),
      );
      setFilteredRoadmaps(filtered);
    }
  }, [searchQuery]);

  // Arama sorgusu değiştiğinde filtrelemeyi tetikle
  useEffect(() => {
    filterRoadmaps();
  }, [searchQuery, filterRoadmaps]);

  const handlePressRoadmap = (roadmapId: string) => {
    navigation.navigate('RoadmapDetail', { roadmapId: roadmapId });
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simüle edilmiş veri yenileme (gerçek bir API çağrısı ile değiştirilebilir)
    setTimeout(() => {
      // Normalde burada yeni verileri çekersin
      // setFilteredRoadmaps(yeniVeriler);
      // Şimdilik sadece var olan veriyi tekrar atayalım
      setFilteredRoadmaps(ROADMAPS);
      setSearchQuery(''); // Arama çubuğunu temizle
      setIsRefreshing(false);
    }, 1500); // 1.5 saniye bekle
  }, []);

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>Henüz hiçbir yol haritası bulunamadı.</Text>
      {searchQuery !== '' && (
        <Text style={styles.emptyListText}>"{searchQuery}" için sonuç yok.</Text>
      )}
      <Text style={styles.emptyListText}>Yeni yol haritaları oluşturmak için + butonuna basabilirsin.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yol Haritaları</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Yol haritası ara..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={filteredRoadmaps}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[globalStyles.card, globalStyles.shadow, styles.roadmapCard]}
            onPress={() => handlePressRoadmap(item.id)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.tagsContainer}>
              {item.tags.map(tag => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
            <View style={styles.footer}>
              <Text style={styles.author}>by @{item.author.username}</Text>
              <LikeButton initialLikes={item.likes} roadmapId={item.id} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyList}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={filteredRoadmaps.length === 0 ? styles.centerEmptyList : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  searchInput: {
    height: 45,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  roadmapCard: {
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.cardBackground,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: colors.primary,
    color: colors.background,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  centerEmptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;