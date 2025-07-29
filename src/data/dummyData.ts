export interface User {
    id: string;
    username: string;
    avatar: string;
}

export const USERS: User[] = [
    { id: 'u1', username: 'ahmet_yilmaz', avatar: 'https://i.pravatar.cc/150?u=ahmet_yilmaz' },
    { id: 'u2', username: 'ayse_kaya', avatar: 'https://i.pravatar.cc/150?u=ayse_kaya' },
    { id: 'u3', username: 'okanacer', avatar: 'https://i.pravatar.cc/150?u=okanacer' },
];

export interface RoadmapNode {
    id: string;
    title: string;
    description?: string;
    children?: RoadmapNode[];
}

export interface Roadmap {
  id:string;
  title: string;
  author: {
    id: string;
    username: string;
  };
  likes: number;
  nodes: RoadmapNode[];
}

export const ROADMAPS: Roadmap[] = [
    {
        id: '4',
        title: 'Elsinle nasıl evlenilir ? ',
        author: {
          id: 'u3',
          username: 'okanacer',
        },
        likes: 256,
        nodes: [
            {
                id: 'j1',
                title: 'Java Temelleri',
                children: [
                    {
                        id: 'j2',
                        title: 'Spring Boot',
                        children: [
                            { id: 'j3', title: 'REST API Oluşturma' },
                            { id: 'j4', title: 'Spring Security' },
                        ]
                    },
                    {
                        id: 'j5',
                        title: 'Veritabanı',
                        children: [
                            { id: 'j6', title: 'PostgreSQL' },
                            { id: 'j7', title: 'MySQL' },
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '1',
        title: 'React Native ile 6 Ayda Mobil Uygulama Geliştirici Olmak',
        author: {
          id: 'u1',
          username: 'ahmet_yilmaz',
        },
        likes: 152,
        nodes: [
            { id: 's1-1', title: 'JavaScript ve ES6+ Temelleri' },
            { id: 's1-2', title: 'React Temelleri' },
            { id: 's1-3', title: 'React Navigation' },
            { id: 's1-4', title: 'State Management (Redux/Zustand)' },
        ]
    },
     {
        id: '2',
        title: 'Sıfırdan Başlayarak Başarılı Bir Freelancer Olmak',
        author: {
          id: 'u2',
          username: 'ayse_kaya',
        },
        likes: 230,
        nodes: [
            { id: 's2-1', title: 'Uzmanlık Alanı Belirle' },
            { id: 's2-2', title: 'Portfolyo Oluştur' },
            { id: 's2-3', title: 'Müşteri Bulma Kanallarını Kullan' },
        ]
    },
    {
        id: '3',
        title: 'İlk Maratonuma Nasıl Hazırlandım?',
        author: {
          id: 'u2',
          username: 'ayse_kaya',
        },
        likes: 98,
        nodes: [
            { id: 's3-1', title: 'Hedef Belirleme ve Kayıt' },
            { id: 's3-2', title: 'Antrenman Programı' },
        ]
    },
];