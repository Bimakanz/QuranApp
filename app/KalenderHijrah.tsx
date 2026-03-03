import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const TEAL_DARK = '#32665C';
const BG = '#F5F0E8';
const GOLD = '#C8A84B';

const HIJRI_MONTHS = [
    'Muharram', 'Safar', "Rabi'ul Awwal", "Rabi'ul Akhir",
    'Jumadil Awwal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah',
];

const GREG_MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

interface CalendarDay {
    gregDay: string;
    gregDate: string;
    hijriDay: string;
    hijriMonth: string;
    hijriYear: string;
    holidays: string[];
    weekday: string;
}

function translateHoliday(en: string): string {
    const map: Record<string, string> = {
        'Eid-ul-Fitr': 'Idul Fitri 🌙',
        'Eid-ul-Adha': 'Idul Adha 🐏',
        'Arafat Day': 'Hari Arafah',
        '1st Day of Ramadan': 'Awal Ramadhan ✨',
        'Lailat-ul-Qadr': 'Lailatul Qadar ⭐',
        'Ashura': 'Asyura',
        'Eid Milad-un-Nabi': 'Maulid Nabi ﷺ',
        'Prophet\'s Birthday': 'Maulid Nabi ﷺ',
        'Islamic New Year': 'Tahun Baru Hijriah 🌙',
    };
    return map[en] || en;
}

function getWeekdayNumber(weekdayEn: string): number {
    const map: Record<string, number> = {
        'Sunday': 0, 'Al Ahad': 0,
        'Monday': 1, 'Al Athnayn': 1,
        'Tuesday': 2, 'Al Thalaata': 2,
        'Wednesday': 3, "Al Arba'a": 3,
        'Thursday': 4, 'Al Khamees': 4,
        'Friday': 5, "Al Juma'a": 5,
        'Saturday': 6, 'Al Sabt': 6,
    };
    return map[weekdayEn] ?? 0;
}

export default function KalenderHijrah() {
    const router = useRouter();
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [days, setDays] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    const fetchCalendar = useCallback(async (m: number, y: number) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${m}/${y}`);
            const json = await res.json();
            const mapped: CalendarDay[] = json.data.map((d: any) => ({
                gregDay: d.gregorian.day,
                gregDate: d.gregorian.date,
                hijriDay: d.hijri.day,
                hijriMonth: d.hijri.month.en,
                hijriYear: d.hijri.year,
                holidays: d.hijri.holidays ?? [],
                weekday: d.gregorian.weekday.en,
            }));
            setDays(mapped);
        } catch {
            setError('Gagal memuat kalender. Periksa koneksi internet.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCalendar(month, year); }, [month, year]);

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    // Build grid: get first day of month weekday offset
    const firstDayOffset = days.length > 0 ? getWeekdayNumber(days[0].weekday) : 0;
    const gridCells: (CalendarDay | null)[] = [
        ...Array(firstDayOffset).fill(null),
        ...days,
    ];
    // Pad to complete last row
    while (gridCells.length % 7 !== 0) gridCells.push(null);

    // Get current hijri month name for header
    const currentHijriMonth = days.length > 0
        ? HIJRI_MONTHS[parseInt(days[Math.floor(days.length / 2)].hijriMonth === 'Ramadan' ? '9' : String(days.length)) - 1] ?? days[Math.floor(days.length / 2)].hijriMonth
        : '';

    const holidays = days.filter(d => d.holidays.length > 0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a' }}>Kalender Hijriah</Text>
                <View style={{ width: 32 }} />
            </View>

            <FlatList
                data={[1]}
                keyExtractor={() => 'main'}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View style={{ paddingBottom: 40 }}>

                        {/* Month Navigator */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 }}>
                            <TouchableOpacity onPress={prevMonth} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
                                <ChevronLeft size={20} color={TEAL} />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a' }}>{GREG_MONTHS[month - 1]} {year}</Text>
                                {days.length > 0 && (
                                    <Text style={{ fontSize: 12, color: TEAL, marginTop: 2 }}>
                                        {days[0].hijriDay} – {days[days.length - 1].hijriDay} {days[0].hijriMonth} {days[0].hijriYear} H
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={nextMonth} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
                                <ChevronRight size={20} color={TEAL} />
                            </TouchableOpacity>
                        </View>

                        {/* Calendar Card */}
                        <View style={{ marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>

                            {/* Day headers */}
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                {DAY_NAMES.map((d) => (
                                    <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: d === 'Jum' ? GOLD : d === 'Min' ? '#e74c3c' : '#aaa' }}>{d}</Text>
                                ))}
                            </View>

                            {loading ? (
                                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                    <ActivityIndicator color={TEAL} />
                                </View>
                            ) : error ? (
                                <View style={{ paddingVertical: 32, alignItems: 'center', gap: 12 }}>
                                    <Text style={{ color: '#c0392b', fontSize: 13, textAlign: 'center' }}>{error}</Text>
                                    <TouchableOpacity onPress={() => fetchCalendar(month, year)} style={{ backgroundColor: TEAL, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 }}>
                                        <Text style={{ color: '#fff', fontWeight: '600' }}>Coba Lagi</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // Grid
                                Array.from({ length: Math.ceil(gridCells.length / 7) }, (_, rowIdx) => (
                                    <View key={rowIdx} style={{ flexDirection: 'row', marginBottom: 4 }}>
                                        {gridCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell, colIdx) => {
                                            const isToday = cell?.gregDate === todayStr;
                                            const isFriday = colIdx === 5;
                                            const isSunday = colIdx === 0;
                                            const hasHoliday = (cell?.holidays?.length ?? 0) > 0;
                                            return (
                                                <View key={colIdx} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
                                                    {cell ? (
                                                        <View style={{ width: 36, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: isToday ? TEAL : hasHoliday ? '#FFF8EC' : 'transparent' }}>
                                                            <Text style={{ fontSize: 14, fontWeight: isToday ? '800' : '500', color: isToday ? '#fff' : isFriday ? GOLD : isSunday ? '#e74c3c' : '#1a1a1a' }}>
                                                                {parseInt(cell.gregDay)}
                                                            </Text>
                                                            <Text style={{ fontSize: 9, color: isToday ? 'rgba(255,255,255,0.8)' : '#aaa', marginTop: 1 }}>
                                                                {cell.hijriDay}
                                                            </Text>
                                                            {hasHoliday && !isToday && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: GOLD, marginTop: 1 }} />}
                                                        </View>
                                                    ) : null}
                                                </View>
                                            );
                                        })}
                                    </View>
                                ))
                            )}
                        </View>

                        {/* Legend */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginTop: 14 }}>
                            {/* Hari ini */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E0DAD0' }}>
                                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: TEAL }} />
                                <Text style={{ fontSize: 11, color: '#555', fontWeight: '500' }}>Hari ini</Text>
                            </View>
                            {/* Hari istimewa */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E0DAD0' }}>
                                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: '#FFF8EC', borderWidth: 1, borderColor: GOLD, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD }} />
                                </View>
                                <Text style={{ fontSize: 11, color: '#555', fontWeight: '500' }}>Hari istimewa</Text>
                            </View>
                            {/* Jumat */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E0DAD0' }}>
                                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: GOLD + '22', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 8, color: GOLD, fontWeight: '800' }}>J</Text>
                                </View>
                                <Text style={{ fontSize: 11, color: '#555', fontWeight: '500' }}>Jumat</Text>
                            </View>
                            {/* Minggu */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E0DAD0' }}>
                                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: '#e74c3c22', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 8, color: '#e74c3c', fontWeight: '800' }}>M</Text>
                                </View>
                                <Text style={{ fontSize: 11, color: '#555', fontWeight: '500' }}>Minggu</Text>
                            </View>
                        </View>

                        {/* Holidays this month */}
                        {holidays.length > 0 && (
                            <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#666', letterSpacing: 0.5, marginBottom: 12, paddingHorizontal: 4 }}>HARI ISTIMEWA BULAN INI</Text>
                                <View style={{ gap: 8 }}>
                                    {holidays.map((d, i) => (
                                        <View key={i} style={{ backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
                                            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF8EC', alignItems: 'center', justifyContent: 'center' }}>
                                                <Star size={18} color={GOLD} fill={GOLD} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }}>
                                                    {d.holidays.map(translateHoliday).join(', ')}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                                                    {parseInt(d.gregDay)} {GREG_MONTHS[month - 1]} {year} • {d.hijriDay} {d.hijriMonth} {d.hijriYear} H
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
