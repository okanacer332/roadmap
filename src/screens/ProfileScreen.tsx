import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Button,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { ROADMAPS, User } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, globalStyles } from '../theme/globalStyles';

interface ProfileHeaderProps {
  user: User;
  roadmapCount: number;
  onLogout: () => void;
}

const ProfileHeader = ({ user, roadmapCount, onLogout }: ProfileHeaderProps) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: user.avatar }} style={styles.avatar} />
    <Text style={styles.username}>{user.username}</Text>
    <Text style={styles.roadmapCount}>{roadmapCount} Yol Haritası</Text>
    <View style={styles.profileButtons}>
      <Button title="Çıkış Yap" onPress={onLogout} color={colors.accent} />
    </View>
  </View>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [user]); // user değiştiğinde de loading'i tetikle

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: colors.text }}>Giriş yapmış bir kullanıcı bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  const userRoadmaps = ROADMAPS.filter(r => r.author.id === user.id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={userRoadmaps}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <ProfileHeader
            user={user}
            roadmapCount={userRoadmaps.length}
            onLogout={logout}
          />
        }
        renderItem={({ item }) => (
          <View style={[globalStyles.card, globalStyles.shadow]}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.footer}>
              <Text style={styles.likes}>❤️ {item.likes}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Icon name="document-text-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Henüz hiç yol haritası oluşturmadın.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  roadmapCount: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileButtons: {
    marginTop: 15,
    width: '80%',
  },
  card: { // Bu stil artık globalStyles'dan geldiği için silebiliriz ama kalsın da bilir.
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  likes: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default ProfileScreen;