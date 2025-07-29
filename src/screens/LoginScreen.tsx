// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  ActivityIndicator, // Yükleme göstergesi için import edildi
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/globalStyles'; // Renkleri import et

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu için state
  const { login } = useAuth();

  const validateInputs = () => {
    // E-posta doğrulaması
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return false;
    }

    // Şifre doğrulaması
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return; // Doğrulama başarısız olursa işlemi durdur
    }

    setIsLoading(true); // Yükleme durumunu başlat
    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Giriş Hatası', 'E-posta veya şifre yanlış. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Giriş sırasında bir hata oluştu:', error);
      Alert.alert('Hata', 'Giriş işlemi sırasında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false); // Yükleme durumunu sonlandır
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Giriş Yap</Text>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading} // Yükleme sırasında düzenlemeyi engelle
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading} // Yükleme sırasında düzenlemeyi engelle
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading} // Yükleme sırasında butonu devre dışı bırak
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} /> // Yüklenirken spinner göster
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.text,
  },
  input: {
    height: 50,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50, // Buton yüksekliğini sabit tutmak için
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;