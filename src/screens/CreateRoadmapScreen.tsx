// src/screens/CreateRoadmapScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert, // Alert'i geri ekledim, çünkü bazı durumlarda kullanıcıya bilgi vermek faydalı olabilir.
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ROADMAPS, RoadmapNode } from '../data/dummyData';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/globalStyles';

// Formdaki adımları temsil eden arayüz
interface FormStep {
  id: string; // Her adım için benzersiz ID
  title: string;
  description: string;
  parentId?: string; // Üst adımın ID'si, eğer varsa
  level: number; // Girinti seviyesi (0: ana adım, 1: alt adım, vb.)
}

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRoadmap'>;

const CreateRoadmapScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  // Başlangıçta tek bir ana adım (level 0) ile başlıyoruz
  const [steps, setSteps] = useState<FormStep[]>([{ id: 'root-0', title: '', description: '', level: 0 }]);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  // Yeni bir ana adım ekler
  const handleAddStep = () => {
    setSteps(prevSteps => [...prevSteps, { id: `step-${Date.now()}`, title: '', description: '', level: 0 }]);
  };

  // Belirli bir adımın altına alt adım ekler
  const handleAddSubStep = (parentId: string, parentLevel: number) => {
    const newSubStep: FormStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Benzersiz ID
      title: '',
      description: '',
      parentId: parentId,
      level: parentLevel + 1,
    };

    const parentIndex = steps.findIndex(step => step.id === parentId);
    if (parentIndex !== -1) {
      let insertIndex = parentIndex;
      // Üst adımın tüm alt adımlarını bulup en sonuncusunun altına ekle
      for (let i = parentIndex + 1; i < steps.length; i++) {
        if (steps[i].level > parentLevel) {
          insertIndex = i;
        } else {
          break;
        }
      }
      const newSteps = [...steps];
      newSteps.splice(insertIndex + 1, 0, newSubStep);
      setSteps(newSteps);
    } else {
      setSteps(prevSteps => [...prevSteps, newSubStep]);
    }
  };

  // Bir adımın başlığını veya açıklamasını günceller
  const handleStepChange = (text: string, id: string, field: 'title' | 'description') => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, [field]: text } : step
      )
    );
  };

  // Bir adımı ve tüm alt adımlarını siler
  const handleRemoveStep = (stepIdToRemove: string, stepLevelToRemove: number) => {
    // Silinecek tüm adım ID'lerini toplamak için bir küme (Set) kullanıyoruz
    const idsToRemove = new Set<string>();
    idsToRemove.add(stepIdToRemove);

    // Adımların kopyasını alıp üzerinde işlem yapıyoruz
    let currentSteps = [...steps];
    
    // Silinecek adımların alt adımlarını bulmak için döngü
    // Bu döngü, alt adımların alt adımlarını da bulacaktır
    let changed = true;
    while (changed) {
      changed = false;
      currentSteps.forEach(step => {
        if (step.parentId && idsToRemove.has(step.parentId) && !idsToRemove.has(step.id)) {
          idsToRemove.add(step.id);
          changed = true;
        }
      });
    }

    // Silinecek ID'leri içermeyen adımları filtreleyerek yeni listeyi oluştur
    const newSteps = steps.filter(step => !idsToRemove.has(step.id));
    
    // Eğer tüm adımlar silinirse, başlangıçtaki boş ana adımı tekrar ekle
    if (newSteps.length === 0) {
      setSteps([{ id: 'root-0', title: '', description: '', level: 0 }]);
    } else {
      setSteps(newSteps);
    }
  };

  // Düzleştirilmiş (flat) adımlar listesini iç içe geçmiş (nested) RoadmapNode yapısına dönüştürür
  const buildNestedNodes = (flatSteps: FormStep[], parentId?: string): RoadmapNode[] => {
    const children: RoadmapNode[] = [];
    const directChildren = flatSteps.filter(step => step.parentId === parentId);

    directChildren.forEach(directChild => {
      const nestedChildren = buildNestedNodes(flatSteps, directChild.id);
      children.push({
        id: directChild.id,
        title: directChild.title,
        description: directChild.description,
        children: nestedChildren.length > 0 ? nestedChildren : undefined,
      });
    });
    return children;
  };

  const handleSave = () => {
    // Kaydetmeden önce boş adımları kontrol et
    if (!title.trim() || !description.trim() || steps.some(step => !step.title.trim())) {
      setStatusMessage({ text: 'Lütfen yol haritası başlığını, açıklamasını ve tüm adımların başlıklarını doldurun.', type: 'error' });
      return;
    }

    if (!user) {
      setStatusMessage({ text: 'Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.', type: 'error' });
      return;
    }

    const nestedNodes = buildNestedNodes(steps);

    const newRoadmap = {
      id: Math.random().toString(),
      title: title,
      description: description,
      author: {
        id: user.id,
        username: user.username,
      },
      likes: 0,
      nodes: nestedNodes,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      comments: [],
    };

    ROADMAPS.unshift(newRoadmap);

    setStatusMessage({ text: 'Yol haritanız başarıyla oluşturuldu!', type: 'success' });
    // Başarılı kayıttan sonra formu temizle
    setTitle('');
    setDescription('');
    setTags('');
    setSteps([{ id: 'root-0', title: '', description: '', level: 0 }]); // Formu başlangıç durumuna sıfırla

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.header}>Yeni Yol Haritası Oluştur</Text>

      {statusMessage.text ? (
        <View style={[styles.messageContainer, statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage]}>
          <Text style={styles.messageText}>{statusMessage.text}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Yol Haritası Başlığı</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Örn: Başarılı Bir YouTuber Olmak"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Yol haritanızı kısaca açıklayın..."
        placeholderTextColor={colors.textSecondary}
        multiline
      />

      <Text style={styles.label}>Etiketler (virgülle ayırın)</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="Örn: mobil, react-native, kariyer"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.sectionTitle}>Adımlar</Text>
      {steps.map((step, index) => (
        <View key={step.id} style={[styles.stepContainer, { marginLeft: step.level * 20 }]}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepLabel}>Adım {index + 1} (Seviye: {step.level})</Text>
            {/* Sil butonu */}
            {steps.length > 1 && ( // Sadece bir adım varsa silme butonunu gösterme
              <TouchableOpacity onPress={() => handleRemoveStep(step.id, step.level)} style={styles.removeStepButton}>
                <Text style={styles.removeStepButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.input}
            value={step.title}
            onChangeText={(text) => handleStepChange(text, step.id, 'title')}
            placeholder="Adım Başlığı"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={step.description}
            onChangeText={(text) => handleStepChange(text, step.id, 'description')}
            placeholder="Adım Açıklaması (isteğe bağlı)"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity style={styles.addSubStepButton} onPress={() => handleAddSubStep(step.id, step.level)}>
            <Text style={styles.addSubStepButtonText}>Alt Adım Ekle</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
        <Text style={styles.addButtonText}>Yeni Ana Adım Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textSecondary,
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
    padding: 15,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepHeader: { // Yeni stil: Adım başlığı ve sil butonu için
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeStepButton: { // Yeni stil: Sil butonu
    backgroundColor: colors.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeStepButtonText: { // Yeni stil: Sil butonu metni
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addSubStepButton: {
    backgroundColor: colors.border,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addSubStepButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  successMessage: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    borderColor: 'rgba(0, 200, 83, 0.5)',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderWidth: 1,
  },
  messageText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CreateRoadmapScreen;
