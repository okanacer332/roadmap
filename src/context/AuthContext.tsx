// src/context/AuthContext.tsx

import React, { createContext, useState, useContext } from 'react';
import { User, USERS } from '../data/dummyData';


interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  // --- YENİ EKLENEN KISIMLAR ---
  likedRoadmaps: Set<string>; // Beğenilen haritaların ID'lerini tutacak bir Set
  toggleLike: (roadmapId: string) => void; // Beğeni durumunu değiştirecek fonksiyon
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // --- YENİ BİR STATE DAHA EKLİYORUZ ---
  const [likedRoadmaps, setLikedRoadmaps] = useState<Set<string>>(new Set());

  const login = (email: string, pass: string) => {
    if (email === 'okan@gmail.com' && pass === 'okanacer') {
      const loggedInUser = USERS.find(u => u.username === 'okanacer');
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setLikedRoadmaps(new Set()); // Çıkış yapınca beğenileri de sıfırla
  };

  // --- BEĞENİ DURUMUNU DEĞİŞTİREN FONKSİYON ---
  const toggleLike = (roadmapId: string) => {
    // Mevcut beğenilenler set'inin bir kopyasını alıyoruz
    const newLikedRoadmaps = new Set(likedRoadmaps);
    if (newLikedRoadmaps.has(roadmapId)) {
      // Eğer zaten beğenilmişse, set'ten çıkar (beğeniyi geri al)
      newLikedRoadmaps.delete(roadmapId);
    } else {
      // Eğer beğenilmemişse, set'e ekle (beğen)
      newLikedRoadmaps.add(roadmapId);
    }
    // State'i yeni set ile güncelle
    setLikedRoadmaps(newLikedRoadmaps);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, likedRoadmaps, toggleLike }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};