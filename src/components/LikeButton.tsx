// src/components/LikeButton.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext'; // Context'e erişmek için

interface Props {
  initialLikes: number;
  roadmapId: string; // Hangi roadmap'e ait olduğunu bilmemiz gerek
}

const LikeButton = ({ initialLikes, roadmapId }: Props) => {
  // Artık state'i ve fonksiyonu context'ten alıyoruz
  const { likedRoadmaps, toggleLike } = useAuth();

  // Bu kartın beğenilip beğenilmediğini context'teki Set'e bakarak anlıyoruz
  const isLiked = likedRoadmaps.has(roadmapId);

  // Beğeni sayısını anlık olarak hesaplıyoruz
  // Başlangıç sayısı 152, beğenilmemiş -> 152
  // Başlangıç sayısı 152, beğenilmiş -> 153
  const likeCount = initialLikes + (isLiked ? 1 : 0);

  return (
    <TouchableOpacity onPress={() => toggleLike(roadmapId)} style={styles.container}>
      <Icon
        name={isLiked ? 'heart' : 'heart-outline'}
        size={22}
        color={isLiked ? '#E53935' : 'gray'}
      />
      <Text style={[styles.likeText, { color: isLiked ? '#E53935' : 'gray' }]}>
        {likeCount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LikeButton;