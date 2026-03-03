import { useRouter } from 'expo-router';
import {
    Bell, Book, BookOpen, CloudSun, Coins, Compass, FileText, Heart,
    LayoutGrid, MessageCircle, Moon, Search, Share2, Sun, Sunrise, Sunset
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TEAL = '#728D8E';

const DEFAULT_PRAYER_TIMES = [
    { name: 'Subuh', time: '04:43', Icon: Sunrise },
    { name: 'Dzuhur', time: '12:09', Icon: Sun },
    { name: 'Ashar', time: '15:12', Icon: CloudSun },
    { name: 'Maghrib', time: '18:15', Icon: Sunset },
    { name: 'Isya', time: '19:24', Icon: Moon },
];

export interface DoaItem {
    id: string; nama: string; judul: string; isi: string; waktu: string;
    likes: number; hasLiked?: boolean;
}

const LOCATION = 'Bogor, Indonesia';

const MENU_ITEMS = [
    { label: 'Al-Quran', Icon: BookOpen, route: '/AlQuran' },
    { label: 'Doa Harian', Icon: MessageCircle, route: '/DoaHarian' },
    { label: 'Dzikir Duha', Icon: Heart, route: '/Dzikir' },
    { label: 'Hadits', Icon: FileText, route: '/Hadits' },
    { label: 'Arah Kiblat', Icon: Compass, route: '/ArahKiblat' },
    { label: 'Donasi', Icon: Coins, route: '/Donasi' },
    { label: 'Asmaul Husna', Icon: Book, route: '/AsmaulHusna' },
    { label: 'Lainnya', Icon: LayoutGrid, route: '/Lainnya' },
];

function pad(n: number) { return n.toString().padStart(2, '0'); }

function getNextPrayer(now: Date, prayerTimes: typeof DEFAULT_PRAYER_TIMES) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    for (const p of prayerTimes) {
        const [ph, pm] = p.time.split(':').map(Number);
        if (ph * 60 + pm > nowMin) return p;
    }
    return prayerTimes[0];
}

function getCountdown(now: Date, prayerTime: string) {
    const [ph, pm] = prayerTime.split(':').map(Number);
    const target = new Date(now);
    target.setHours(ph, pm, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    const hh = Math.floor(diff / 3600);
    const mm = Math.floor((diff % 3600) / 60);
    const ss = diff % 60;
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

export default function Home() {
    const router = useRouter();
    const [now, setNow] = useState(new Date());
    const [hijriDate, setHijriDate] = useState('Memuat...');
    const [prayerTimes, setPrayerTimes] = useState(DEFAULT_PRAYER_TIMES);
    const [doas, setDoas] = useState<DoaItem[]>([
        { id: '1', nama: 'Ahmad Fauzi', waktu: '2 jam yang lalu', judul: 'Doa untuk Kesembuhan Ibu', isi: 'Mohon doanya untuk kesembuhan ibu saya yang sedang sakit. Semoga Allah memberikan kesembuhan yang sem...', likes: 128 },
        { id: '2', nama: 'Fatimah Zahra', waktu: '5 jam yang lalu', judul: 'Doa Kelancaran Ujian', isi: 'Mohon doanya untuk anak saya yang akan ujian nasional. Semoga diberikan kemudahan dan kelancaran...', likes: 89 },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formNama, setFormNama] = useState('');
    const [formJudul, setFormJudul] = useState('');
    const [formIsi, setFormIsi] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Bogor&country=Indonesia&method=11');
                const json = await res.json();
                if (json.data) {
                    const timings = json.data.timings;
                    const hijri = json.data.date.hijri;
                    setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
                    setPrayerTimes([
                        { name: 'Subuh', time: timings.Fajr, Icon: Sunrise },
                        { name: 'Dzuhur', time: timings.Dhuhr, Icon: Sun },
                        { name: 'Ashar', time: timings.Asr, Icon: CloudSun },
                        { name: 'Maghrib', time: timings.Maghrib, Icon: Sunset },
                        { name: 'Isya', time: timings.Isha, Icon: Moon },
                    ]);
                }
            } catch { setHijriDate('Gagal memuat tanggal'); }
        })();
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const timeStr = `${pad(now.getHours())}.${pad(now.getMinutes())}`;
    const next = getNextPrayer(now, prayerTimes);
    const countdown = getCountdown(now, next.time);

    const toggleLike = (id: string) => {
        setDoas((prev) => prev.map((d) =>
            d.id === id ? { ...d, likes: d.hasLiked ? d.likes - 1 : d.likes + 1, hasLiked: !d.hasLiked } : d
        ));
    };

    const submitDoa = () => {
        if (!formNama || !formJudul || !formIsi) return;
        const newDoa: DoaItem = { id: Date.now().toString(), nama: formNama, judul: formJudul, isi: formIsi, waktu: 'Baru saja', likes: 0, hasLiked: false };
        setDoas([newDoa, ...doas]);
        setModalVisible(false);
        setFormNama(''); setFormJudul(''); setFormIsi('');
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }} contentContainerStyle={{ paddingBottom: 110 }}>

            {/* Hero */}
            <ImageBackground
                source={require('../../assets/images/element.png')}
                style={{ width: '100%', height: 340 }}
                imageStyle={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
                resizeMode="cover"
            >
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,30,50,0.52)', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }} />

                <SafeAreaView style={{ paddingHorizontal: 20, paddingBottom: 20 }} edges={['top']}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '400', marginTop: 30, color: '#fff' }}>{hijriDate}</Text>
                            <Text style={{ fontSize: 12, color: '#ccc', marginTop: 2 }}>{LOCATION}</Text>
                        </View>
                        <TouchableOpacity style={{ width: 38, height: 38, justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.7} onPress={() => router.push('/Notifikasi')}>
                            <Bell size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 60, fontWeight: '500', color: '#fff', letterSpacing: 2, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 }}>
                        {timeStr}
                    </Text>

                    <Text style={{ fontSize: 13, color: '#ddd', textAlign: 'center', marginTop: 4, marginBottom: 16 }}>
                        {next.name} dalam{' '}
                        <Text style={{ color: '#E2C675', fontWeight: '400' }}>{countdown}</Text>
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                        {prayerTimes.map((p) => (
                            <View key={p.name} style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 11, color: '#ccc', fontWeight: '500' }}>{p.name}</Text>
                                <p.Icon size={18} color="#E2C675" style={{ marginVertical: 4 }} />
                                <Text style={{ fontSize: 13, color: '#fff', fontWeight: '400', marginTop: 2 }}>{p.time}</Text>
                            </View>
                        ))}
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3EFE9', borderWidth: 1, borderColor: '#E8E4DF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <TextInput style={{ flex: 1, color: '#1a1a1a', fontSize: 14, padding: 0, marginRight: 8 }} placeholder="Cari surat, doa, artikel, hadits ..." placeholderTextColor="#a0a0a0" />
                    <Search size={20} color="#a0a0a0" />
                </View>
            </View>

            {/* Menu Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginTop: 20, justifyContent: 'space-between' }}>
                {MENU_ITEMS.map((menu, i) => (
                    <TouchableOpacity
                        key={i}
                        style={{ width: '25%', alignItems: 'center', marginBottom: 24 }}
                        activeOpacity={0.7}
                        onPress={() => { if (menu.route) router.navigate(menu.route as any); }}
                    >
                        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8F0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                            <menu.Icon size={24} color="#E2C675" strokeWidth={2} />
                        </View>
                        <Text style={{ fontSize: 11, color: '#444', textAlign: 'center', fontWeight: '500' }}>{menu.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Banner Ramadhan */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#8C9D97', borderRadius: 12, padding: 18, borderWidth: 2, borderColor: '#738D8E' }}>
                    <Moon size={28} color="#F59E0B" fill="#F59E0B" />
                    <View style={{ marginLeft: 14 }}>
                        <Text style={{ color: '#1a1a1a', fontSize: 16, fontWeight: '700' }}>Ramadhan Mubarak!</Text>
                        <Text style={{ color: '#555', fontSize: 12, marginTop: 2 }}>Selamat menjalankan ibadah puasa</Text>
                    </View>
                </View>
            </View>

            {/* Doa Section */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a' }}>Aminkan doa saudaramu</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={{ fontSize: 14, color: TEAL, fontWeight: '500' }}>Buat doa +</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 16 }}>
                {doas.map((doa) => (
                    <View key={doa.id} style={{ width: 280, backgroundColor: '#E8EDE9', borderRadius: 16, overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12, backgroundColor: '#EAEBE8' }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                                <Moon size={12} color="#E2C675" fill="#E2C675" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1a1a1a' }}>{doa.nama}</Text>
                                <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{doa.waktu}</Text>
                            </View>
                        </View>
                        <View style={{ padding: 16, paddingTop: 8 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 }} numberOfLines={1}>{doa.judul}</Text>
                            <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }} numberOfLines={3}>{doa.isi}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#dbe0dc' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => toggleLike(doa.id)}>
                                <Heart size={20} color={doa.hasLiked ? '#E2C675' : TEAL} fill={doa.hasLiked ? '#E2C675' : 'transparent'} />
                                <Text style={{ fontSize: 14, color: doa.hasLiked ? '#E2C675' : TEAL, fontWeight: '600' }}>
                                    Aamiin <Text style={{ fontSize: 12, color: '#999', fontWeight: '400' }}>({doa.likes})</Text>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 4 }}>
                                <Share2 size={20} color={TEAL} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Text style={{ textAlign: 'center', fontSize: 10, color: '#999', paddingHorizontal: 40, marginTop: 10, lineHeight: 16 }}>
                Semua operasional aplikasi ini di develop dengan individu{'\n'}bukan kelompok atau organisasi masyarakat
            </Text>

            {/* Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 20, textAlign: 'center' }}>Buat Doa</Text>

                        <Text style={{ fontSize: 13, color: '#444', marginBottom: 6, fontWeight: '500' }}>Nama Kamu</Text>
                        <TextInput style={{ backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 16 }} placeholder="Contoh: Hamba Allah" value={formNama} onChangeText={setFormNama} />

                        <Text style={{ fontSize: 13, color: '#444', marginBottom: 6, fontWeight: '500' }}>Judul Doa</Text>
                        <TextInput style={{ backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 16 }} placeholder="Contoh: Doa Kelancaran Ujian" value={formJudul} onChangeText={setFormJudul} />

                        <Text style={{ fontSize: 13, color: '#444', marginBottom: 6, fontWeight: '500' }}>Isi Doa</Text>
                        <TextInput style={{ backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 16, height: 100 }} placeholder="Tulis doamu di sini..." value={formIsi} onChangeText={setFormIsi} multiline textAlignVertical="top" />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                            <TouchableOpacity style={{ paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }} onPress={() => setModalVisible(false)}>
                                <Text style={{ color: '#888', fontWeight: '600', fontSize: 14 }}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: TEAL, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }} onPress={submitDoa}>
                                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Kirim Doa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}