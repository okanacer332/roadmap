// src/screens/CreateRoadmapScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ROADMAPS } from '../data/dummyData';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRoadmap'>;

const CreateRoadmapScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState([{ title: '', description: '' }]);

  const handleAddStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const handleStepChange = (text: string, index: number, field: 'title' | 'description') => {
    const newSteps = [...steps];
    newSteps[index][field] = text;
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (!title.trim() || steps.some(step => !step.title.trim())) {
      Alert.alert('Hata', 'Lütfen yol haritası başlığını ve tüm adımların başlıklarını doldurun.');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    // --- DÜZELTME BURADA ---
    // Artık 'steps' yerine 'nodes' içeren ve RoadmapNode tipine uygun bir obje oluşturuyoruz.
    const newRoadmap = {
      id: Math.random().toString(),
      title: title,
      author: {
        id: user.id,
        username: user.username,
      },
      likes: 0,
      nodes: steps.map((step) => ({ // 'steps' yerine 'nodes'
        id: Math.random().toString(),
        title: step.title,
        description: step.description,
        // children: [] // Şimdilik boş bırakıyoruz
      })),
    };

    ROADMAPS.unshift(newRoadmap);

    Alert.alert('Başarılı', 'Yol haritanız başarıyla oluşturuldu!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.label}>Yol Haritası Başlığı</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Örn: Başarılı Bir YouTuber Olmak"
        placeholderTextColor={colors.textSecondary}
      />

      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <Text style={styles.label}>Adım {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={step.title}
            onChangeText={(text) => handleStepChange(text, index, 'title')}
            placeholder="Adım Başlığı"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={step.description}
            onChangeText={(text) => handleStepChange(text, index, 'description')}
            placeholder="Adım Açıklaması"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Yeni Adım Ekle" onPress={handleAddStep} color={colors.primary} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Kaydet" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  stepContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default CreateRoadmapScreen;