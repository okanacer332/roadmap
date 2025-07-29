// src/theme/globalStyles.ts

import { StyleSheet } from 'react-native';

// roadmap.sh'dan esinlenen yeni renk paletimiz
export const colors = {
  primary: '#818cf8',      // Vurgu rengi (mor/indigo)
  background: '#111827',    // Ana koyu arka plan
  cardBackground: '#1f2937', // Kartların arka planı
  text: '#d1d5db',            // Ana metin rengi (kirli beyaz)
  textSecondary: '#9ca3af',   // İkincil metin rengi (gri)
  border: '#374151',          // Kenarlık rengi
  accent: '#E53935',       // Vurgu rengi (kırmızı, bu kalabilir)
  error: '#EF4444',        // Yeni eklenen hata rengi (kırmızı)
  white: '#FFFFFF',        // Yeni eklenen beyaz renk
};

// globalStyles objesinde değişiklik yok, olduğu gibi kalabilir
export const globalStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});