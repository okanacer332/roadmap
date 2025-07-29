// src/data/dummyData.ts

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
    description?: string; // Node açıklaması eklendi
    children?: RoadmapNode[];
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string; // Yorumun ne zaman yapıldığı
}

export interface Roadmap {
    id: string;
    title: string;
    description: string;
    author: {
        id: string;
        username: string;
    };
    likes: number;
    nodes: RoadmapNode[];
    tags: string[];
    comments: Comment[]; // Yorumlar alanı eklendi
}

export const ROADMAPS: Roadmap[] = [
    {
        id: '4',
        title: 'Elsinle Nasıl Evlenilir?',
        description: 'Hayatınızın aşkı Elsin ile mutlu bir evlilik için adım adım bir rehber. Bu yol haritası, ilişkinizi bir sonraki seviyeye taşımanız için pratik ipuçları ve duygusal hazırlık süreçlerini içerir. Adım atmaktan çekinmeyin!',
        author: {
            id: 'u3',
            username: 'okanacer',
        },
        likes: 256,
        tags: ['ilişki', 'aşk', 'evlilik', 'kişisel gelişim'],
        nodes: [
            {
                id: 'j1',
                title: 'Evliliğe Karar Verme',
                description: 'Karşılıklı duyguların tespiti ve geleceğe yönelik planların netleştirilmesi.',
                children: [
                    { 
                        id: 'j1.1', 
                        title: 'Duygusal Bağ Analizi', 
                        description: 'Hislerinizin karşılıklı olup olmadığını anlamak.',
                        children: [
                            { 
                                id: 'j1.1.1', 
                                title: 'Açık İletişim', 
                                description: 'Duyguları samimi bir şekilde ifade etme.',
                                children: [
                                    { id: 'j1.1.1.1', title: 'Aktif Dinleme', description: 'Elsin\'i gerçekten dinleme ve anlama.' },
                                    { id: 'j1.1.1.2', title: 'Empati Kurma', description: 'Onun bakış açısını anlama çabası.' },
                                ]
                            },
                            { id: 'j1.1.2', title: 'Gözlem ve Anlama', description: 'Elsin\'in tepkilerini ve hislerini dikkatle gözlemleme.' },
                        ]
                    },
                    { 
                        id: 'j1.2', 
                        title: 'Gelecek Planlarını Konuşma', 
                        description: 'Ortak hedefler ve beklentiler hakkında açık iletişim.',
                        children: [
                            { id: 'j1.2.1', title: 'Kariyer Hedefleri', description: 'İki tarafın da kariyer beklentilerini paylaşma.' },
                            { id: 'j1.2.2', title: 'Yaşam Tarzı Tercihleri', description: 'Ortak yaşam tarzı ve günlük rutin beklentileri.' },
                            { id: 'j1.2.3', title: 'Çocuk Konusu', description: 'Çocuk sahibi olma veya olmama konusundaki düşünceler.' },
                        ]
                    },
                ]
            },
            {
                id: 'j2',
                title: 'Teklif Aşaması',
                description: 'Unutulmaz bir evlilik teklifi planlaması.',
                children: [
                    { 
                        id: 'j2.1', 
                        title: 'Yaratıcı Fikirler', 
                        description: 'Sıradışı ve kişiye özel teklif önerileri.',
                        children: [
                            { id: 'j2.1.1', title: 'Hobilerini Araştır', description: 'Elsin\'in ilgi alanlarına göre fikirler geliştir.' },
                            { id: 'j2.1.2', title: 'Gizli Sürprizler', description: 'Beklenmedik anlar yaratma.' },
                        ]
                    },
                    { id: 'j2.2', title: 'Mekan ve Zaman Seçimi', description: 'Teklif için en uygun ortamın belirlenmesi.' },
                ]
            },
            {
                id: 'j3',
                title: 'Aileleri Tanıştırma',
                description: 'Kültürlerin ve aile yapılarının uyumu.',
                children: [
                    { id: 'j3.1', title: 'İlk İzlenim Yönetimi', description: 'Olumlu bir tanışma için ipuçları.' },
                    { id: 'j3.2', title: 'Ortak Değerler Bulma', description: 'Aileler arasında köprü kurma.' },
                ]
            },
            {
                id: 'j4',
                title: 'Evlilik Hazırlıkları',
                description: 'Düğün ve sonrası için pratik adımlar.',
                children: [
                    { id: 'j4.1', title: 'Düğün Bütçesi', description: 'Maddi planlama ve harcama kontrolü.' },
                    { id: 'j4.2', title: 'Yasal Süreçler', description: 'Nikah ve evlilik belgeleri.' },
                    { id: 'j4.3', title: 'Ev Düzenleme', description: 'Yeni yaşam alanının hazırlanması.' },
                ]
            },
            {
                id: 'j5',
                title: 'Mutlu Bir Evlilik Sürdürme',
                description: 'Evliliğin uzun vadeli sürdürülebilirliği için tavsiyeler.',
                children: [
                    { id: 'j5.1', title: 'İletişim ve Anlayış', description: 'Sağlıklı bir ilişki için anahtarlar.' },
                    { id: 'j5.2', title: 'Birlikte Yeni Şeyler Deneme', description: 'İlişkiyi canlı tutacak aktiviteler.' },
                ]
            }
        ],
        comments: [
            {
                id: 'c4-1',
                userId: 'u1',
                username: 'ahmet_yilmaz',
                text: 'Hahaha, Elsin mi? Başarılar dilerim Okan! Çok cesurca bir yol haritası. ;)',
                timestamp: '2025-07-29T14:30:00Z',
            },
            {
                id: 'c4-2',
                userId: 'u2',
                username: 'ayse_kaya',
                text: 'Evlilik düğümü çok kutsaldır, umarım her şey istediğin gibi gider. Benim yol haritam da yakın zamanda güncellenecek, oradan ipuçları alabilirsin :)',
                timestamp: '2025-07-29T15:10:00Z',
            },
            {
                id: 'c4-3',
                userId: 'u3',
                username: 'okanacer',
                text: 'Teşekkürler arkadaşlar, destekleriniz benim için önemli :)',
                timestamp: '2025-07-29T16:00:00Z',
            },
        ],
    },
    {
        id: '1',
        title: 'React Native ile 6 Ayda Mobil Uygulama Geliştirici Olmak',
        description: 'Bu yol haritası, sıfırdan başlayarak 6 ay içinde React Native ile profesyonel bir mobil uygulama geliştiricisi olmanıza yardımcı olacak adımları içerir. Yoğun ve pratik odaklı bir süreç sizi bekliyor!',
        author: {
            id: 'u1',
            username: 'ahmet_yilmaz',
        },
        likes: 152,
        tags: ['mobil', 'react-native', 'frontend', 'javascript', 'kariyer'],
        nodes: [
            { id: 'rn1', title: 'JavaScript ve ES6+ Temelleri', description: 'Modern JavaScript (ES6 ve sonrası) özelliklerini, asenkron programlamayı ve temel veri yapılarını öğrenin.' },
            { id: 'rn2', title: 'React Temelleri', description: 'React component yapısı, state, props, lifecycle metotları ve Hooks kullanımı konularına hakim olun.' },
            { id: 'rn3', title: 'React Native Kurulumu ve İlk Uygulama', description: 'Geliştirme ortamını kurun (Expo veya React Native CLI) ve ilk mobil uygulamanızı çalıştırın.' },
            { id: 'rn4', title: 'Temel RN Bileşenleri ve Stil Oluşturma', description: 'View, Text, Image, ScrollView, FlatList gibi temel bileşenleri ve StyleSheet ile stil yazmayı öğrenin. Flexbox konusunda derinleşin.' },
            { id: 'rn5', title: 'Navigasyon', description: '@react-navigation kütüphanesini kullanarak farklı navigasyon tiplerini (Stack, Tab, Drawer) implemente edin.' },
            { id: 'rn6', title: 'Durum Yönetimi', description: 'Uygulama genelindeki veriyi yönetmek için Context API, Redux veya Zustand gibi çözümleri kullanmayı öğrenin.' },
            { id: 'rn7', title: 'API Entegrasyonu', description: 'RESTful API\'ler ile iletişim kurma, veri çekme, gönderme ve hata yönetimi konularını ele alın.' },
            { id: 'rn8', title: 'Cihaz Özellikleri ve Native Modüller', description: 'Kamera, konum, bildirimler gibi cihaz özelliklerine erişim ve gerekirse native modüllerle çalışma.' },
            { id: 'rn9', title: 'Performans Optimizasyonu', description: 'Uygulama performansını iyileştirme teknikleri ve hata ayıklama araçlarını kullanma.' },
            { id: 'rn10', title: 'Uygulamayı Yayınlama', description: 'Uygulamanızı App Store ve Google Play Store\'a nasıl dağıtacağınızı öğrenin.' },
        ],
        comments: [
            {
                id: 'c1-1',
                userId: 'u3',
                username: 'okanacer',
                text: 'Bu yol haritası gerçekten çok kapsamlı ve yol gösterici! Teşekkürler Ahmet.',
                timestamp: '2025-07-28T09:15:00Z',
            },
            {
                id: 'c1-2',
                userId: 'u2',
                username: 'ayse_kaya',
                text: 'State management için Zustand önerini beğendim, daha hafif bir alternatif.',
                timestamp: '2025-07-28T10:05:00Z',
            },
        ],
    },
    {
        id: '2',
        title: 'Sıfırdan Başlayarak Başarılı Bir Freelancer Olmak',
        description: 'Bu yol haritası, kendi işini kurmak ve başarılı bir freelancer olmak isteyenler için pratik bilgiler ve stratejiler sunar. Müşteri bulmaktan fiyatlandırmaya kadar her detayı öğrenin.',
        author: {
            id: 'u2',
            username: 'ayse_kaya',
        },
        likes: 230,
        tags: ['freelance', 'kariyer', 'iş geliştirme', 'pazarlama'],
        nodes: [
            { id: 'f1', title: 'Niş Belirleme ve Uzmanlık', description: 'Hangi alanda freelancer olmak istediğine karar ver ve o alanda kendini geliştir.' },
            { id: 'f2', title: 'Güçlü Bir Portfolyo Oluşturma', description: 'Yaptığın en iyi işleri sergileyen profesyonel bir portfolyo hazırla.' },
            { id: 'f3', title: 'Fiyatlandırma Stratejileri', description: 'Hizmetlerini nasıl fiyatlandıracağını ve pazarlık yapmayı öğren.' },
            { id: 'f4', title: 'Müşteri Edinme Kanalları', description: 'Freelancer platformları, sosyal medya ve ağ kurma etkinliklerini kullanarak müşteri bul.' },
            { id: 'f5', title: 'Sözleşme ve Yasal Süreçler', description: 'Freelancer olarak yasal yükümlülüklerini ve sözleşme detaylarını anla.' },
            { id: 'f6', title: 'Zaman Yönetimi ve Verimlilik', description: 'Projeleri zamanında teslim etmek için etkili zaman yönetimi teknikleri geliştir.' },
            { id: 'f7', title: 'İletişim Becerileri', description: 'Müşterilerle etkili iletişim kurarak memnuniyetlerini sağla.' },
            { id: 'f8', title: 'Marka Oluşturma ve Pazarlama', description: 'Kişisel markanı oluştur ve kendini nasıl pazarlayacağını öğren.' },
            { id: 'f9', title: 'Finansal Yönetim', description: 'Gelir ve giderlerini takip etme, vergiler ve finansal planlama.' },
            { id: 'f10', title: 'Sürekli Öğrenme ve Gelişme', description: 'Sektördeki yenilikleri takip et ve kendini sürekli geliştir.' },
        ],
        comments: [
            {
                id: 'c2-1',
                userId: 'u1',
                username: 'ahmet_yilmaz',
                text: 'Ayşe, bu yol haritası benim de çok işime yarayacak! Detaylı anlatımın için teşekkürler.',
                timestamp: '2025-07-27T18:00:00Z',
            },
            {
                id: 'c2-2',
                userId: 'u3',
                username: 'okanacer',
                text: 'Freelancerlık için harika ipuçları var, özellikle niş belirleme çok önemli.',
                timestamp: '2025-07-27T19:30:00Z',
            },
        ],
    },
    {
        id: '3',
        title: 'İlk Maratonuma Nasıl Hazırlandım?',
        description: 'İlk maratonunuzu koşmak için fiziksel ve zihinsel olarak nasıl hazırlanmanız gerektiğini öğrenin. Bu yol haritası, antrenman programından beslenmeye kadar her şeyi kapsar.',
        author: {
            id: 'u2',
            username: 'ayse_kaya',
        },
        likes: 98,
        tags: ['koşu', 'maraton', 'fitness', 'sağlık', 'spor'],
        nodes: [
            { id: 'm1', title: 'Hedef Belirleme ve Kayıt', description: 'Maraton seçimi ve kayıt sürecini tamamla.' },
            { id: 'm2', title: 'Antrenman Programı Seçimi', description: 'Deneyim seviyene uygun bir maraton antrenman programı bul.' },
            { id: 'm3', title: 'Ayakkabı ve Ekipman Seçimi', description: 'Doğru koşu ayakkabıları ve diğer temel ekipmanları edin.' },
            { id: 'm4', title: 'Beslenme ve Hidrasyon', description: 'Maraton antrenmanı boyunca doğru beslenme ve sıvı alımı stratejileri.' },
            { id: 'm5', title: 'Sakatlıklardan Korunma', description: 'Esneklik, güç antrenmanı ve dinlenme ile sakatlık riskini azalt.' },
            { id: 'm6', title: 'Uzun Koşular', description: 'Haftalık uzun koşuları kademeli olarak artır.' },
            { id: 'm7', title: 'Tempo Antrenmanları', description: 'Hızını artırmak için tempo ve interval koşuları yap.' },
            { id: 'm8', title: 'Dinlenme ve Toparlanma', description: 'Yeterli uyku ve aktif dinlenmenin önemi.' },
            { id: 'm9', title: 'Zihinsel Hazırlık', description: 'Maraton günü için zihinsel olarak güçlü kalma teknikleri.' },
            { id: 'm10', title: 'Uygulamayı Yayınlama', description: 'Uygulamanızı App Store ve Google Play Store\'a nasıl dağıtacağınızı öğrenin.' }, // Düzeltme yapıldı: "Uygulamayı Yayınlama" buraya eklendi.
        ],
        comments: [
            {
                id: 'c3-1',
                userId: 'u3',
                username: 'okanacer',
                text: 'Vay be, maraton yol haritası! Benim için yeni bir alan, ama çok motive edici görünüyor.',
                timestamp: '2025-07-26T08:00:00Z',
            },
            {
                id: 'c3-2',
                userId: 'u1',
                username: 'ahmet_yilmaz',
                text: 'Ayşe, koşuya başlamayı düşünüyordum, bu yol haritası tam da ihtiyacım olan şeydi!',
                timestamp: '2025-07-26T09:45:00Z',
            },
        ],
    },
];
