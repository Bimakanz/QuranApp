import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const TEAL_DARK = '#32665C';
const BG = '#F5F0E8';
const GOLD = '#C8A84B';

// Nisab 2025 estimate (IDR) — based on harga emas ~1.6jt/gram & perak ~13rb/gram
// User can adjust; these are defaults
const DEFAULT_NISAB_GOLD_GRAM = 85;    // 85 gram emas
const DEFAULT_NISAB_SILVER_GRAM = 595; // 595 gram perak
const GOLD_PRICE_PER_GRAM = 1600000;   // Rp 1.600.000/gram (approx 2025)
const SILVER_PRICE_PER_GRAM = 13000;   // Rp 13.000/gram (approx 2025)
const NISAB_GOLD_IDR = DEFAULT_NISAB_GOLD_GRAM * GOLD_PRICE_PER_GRAM;
const NISAB_SILVER_IDR = DEFAULT_NISAB_SILVER_GRAM * SILVER_PRICE_PER_GRAM;
const NISAB_IDR = Math.min(NISAB_GOLD_IDR, NISAB_SILVER_IDR); // pakai yang lebih rendah (perak)

const ZAKAT_RATE = 0.025; // 2.5%

type ZakatType = 'mal' | 'perdagangan' | 'emas';

interface Field { key: string; label: string; placeholder: string; hint?: string; }

const FIELDS: Record<ZakatType, Field[]> = {
    mal: [
        { key: 'tabungan', label: 'Tabungan & Uang Tunai', placeholder: '0', hint: 'Total seluruh tabungan dan uang tunai' },
        { key: 'investasi', label: 'Investasi (Saham, Deposito)', placeholder: '0', hint: 'Nilai saat ini dari semua investasi' },
        { key: 'piutang', label: 'Piutang (yang bisa ditagih)', placeholder: '0' },
        { key: 'lainnya', label: 'Aset Lainnya', placeholder: '0' },
        { key: 'hutang', label: 'Hutang (yang harus dibayar)', placeholder: '0', hint: 'Kurangi dari total harta' },
    ],
    perdagangan: [
        { key: 'stok', label: 'Nilai Stok Barang', placeholder: '0', hint: 'Harga pasar saat ini' },
        { key: 'piutang', label: 'Piutang Dagang', placeholder: '0' },
        { key: 'kas', label: 'Kas & Bank', placeholder: '0' },
        { key: 'hutang', label: 'Hutang Dagang', placeholder: '0' },
    ],
    // hargaEmas is intentionally excluded — displayed separately as read-only live price
    emas: [
        { key: 'beratEmas', label: 'Berat Emas (gram)', placeholder: '0', hint: 'Total emas yang dimiliki > 1 tahun' },
    ],
};

function formatRupiah(n: number): string {
    if (n === 0) return 'Rp 0';
    return 'Rp ' + n.toLocaleString('id-ID');
}

function parseNum(s: string): number {
    const clean = s.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
}

/** Format number with dot thousand separators: 10000000 → "10.000.000" */
function formatThousands(s: string): string {
    const digits = s.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toLocaleString('id-ID');
}

export default function KalkulatorZakat() {
    const router = useRouter();
    const [zakatType, setZakatType] = useState<ZakatType>('mal');
    const [values, setValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState<{ total: number; nisab: number; zakat: number; wajib: boolean } | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [goldPrice, setGoldPrice] = useState<number>(GOLD_PRICE_PER_GRAM);
    const [goldPriceLoading, setGoldPriceLoading] = useState(false);
    const [goldPriceTime, setGoldPriceTime] = useState('');

    // Fetch live gold price (USD/troy oz from metals.live, convert to IDR/gram)
    useEffect(() => {
        if (zakatType !== 'emas') return;
        setGoldPriceLoading(true);
        fetch('https://api.metals.live/v1/spot/gold')
            .then(r => r.json())
            .then((data: any) => {
                // data is [{ gold: price_in_usd_per_troy_oz }]
                const priceUSD = Array.isArray(data) ? data[0]?.gold : data?.price;
                if (priceUSD) {
                    const IDR_RATE = 16300; // approximate USD → IDR
                    const pricePerGram = Math.round((priceUSD / 31.1035) * IDR_RATE);
                    setGoldPrice(pricePerGram);
                    const now = new Date();
                    setGoldPriceTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
                }
            })
            .catch(() => { /* fallback to default */ })
            .finally(() => setGoldPriceLoading(false));
    }, [zakatType]);

    const setValue = useCallback((key: string, raw: string) => {
        const formatted = formatThousands(raw);
        setValues(v => ({ ...v, [key]: formatted }));
    }, []);

    const calculate = () => {
        const fields = FIELDS[zakatType];
        let total = 0;
        let hutang = 0;

        if (zakatType === 'emas') {
            const berat = parseNum(values['beratEmas'] || '0');
            total = berat * goldPrice;
            const nisabEmas = DEFAULT_NISAB_GOLD_GRAM * goldPrice;
            const wajib = total >= nisabEmas;
            setResult({ total, nisab: nisabEmas, zakat: wajib ? total * ZAKAT_RATE : 0, wajib });
            return;
        }

        fields.forEach(f => {
            const v = parseNum(values[f.key] || '0');
            if (f.key === 'hutang') hutang = v;
            else total += v;
        });

        const net = Math.max(0, total - hutang);
        const wajib = net >= NISAB_IDR;
        setResult({ total: net, nisab: NISAB_IDR, zakat: wajib ? net * ZAKAT_RATE : 0, wajib });
    };

    const reset = () => { setValues({}); setResult(null); };

    const types: { key: ZakatType; label: string; emoji: string }[] = [
        { key: 'mal', label: 'Zakat Mal', emoji: '💰' },
        { key: 'perdagangan', label: 'Perdagangan', emoji: '🏪' },
        { key: 'emas', label: 'Emas', emoji: '🥇' },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a' }}>Kalkulator Zakat</Text>
                <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={{ padding: 4 }}>
                    <HelpCircle size={22} color={TEAL} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* Info box */}
                    {showInfo && (
                        <View style={{ backgroundColor: '#FFF8EC', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F0E0B0' }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: GOLD, marginBottom: 8 }}>ℹ️ Info Zakat</Text>
                            <Text style={{ fontSize: 12, color: '#666', lineHeight: 20 }}>
                                • Zakat mal wajib bagi Muslim yang hartanya mencapai <Text style={{ fontWeight: '700' }}>nisab</Text> dan dimiliki selama <Text style={{ fontWeight: '700' }}>1 tahun (haul)</Text>.{'\n'}
                                • Nisab = 85g emas atau 595g perak (dipakai yang lebih rendah){'\n'}
                                • Nisab perak ≈ {formatRupiah(NISAB_IDR)}{'\n'}
                                • Tarif zakat = <Text style={{ fontWeight: '700' }}>2,5%</Text> dari total harta bersih
                            </Text>
                        </View>
                    )}

                    {/* Type selector */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                        {types.map(t => (
                            <TouchableOpacity
                                key={t.key}
                                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: zakatType === t.key ? TEAL : '#fff', borderWidth: 1, borderColor: zakatType === t.key ? TEAL : '#E0DAD0' }}
                                onPress={() => { setZakatType(t.key); setResult(null); setValues({}); }}
                                activeOpacity={0.7}
                            >
                                <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: zakatType === t.key ? '#fff' : '#555', marginTop: 4, textAlign: 'center' }}>{t.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Input fields */}
                    <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: TEAL_DARK, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Data Harta
                        </Text>

                        {/* Live gold price — read-only, only shown for emas tab */}
                        {zakatType === 'emas' && (
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#444' }}>Harga Emas per Gram</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: goldPriceLoading ? '#eee' : '#E8F8F0', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: goldPriceLoading ? '#bbb' : '#27ae60' }} />
                                        <Text style={{ fontSize: 9, fontWeight: '700', color: goldPriceLoading ? '#bbb' : '#27ae60' }}>
                                            {goldPriceLoading ? 'Memuat...' : goldPriceTime ? `Live · ${goldPriceTime}` : 'Estimasi'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E0DAD0', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#F5F5F5' }}>
                                    <Text style={{ fontSize: 14, color: '#bbb', marginRight: 4 }}>Rp</Text>
                                    <Text style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: '#555', fontWeight: '600' }}>
                                        {goldPrice.toLocaleString('id-ID')}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#bbb' }}>/gram</Text>
                                </View>
                            </View>
                        )}

                        {FIELDS[zakatType].map((field, i) => (
                            <View key={field.key} style={{ marginBottom: i < FIELDS[zakatType].length - 1 ? 16 : 0 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 }}>{field.label}</Text>
                                {field.hint && <Text style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{field.hint}</Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: values[field.key] ? TEAL : '#E0DAD0', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#FAFAF8' }}>
                                    {field.key !== 'beratEmas' && (
                                        <Text style={{ fontSize: 14, color: '#999', marginRight: 4 }}>Rp</Text>
                                    )}
                                    <TextInput
                                        style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1a1a' }}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#ccc"
                                        value={values[field.key] ?? ''}
                                        onChangeText={v => setValue(field.key, v)}
                                    />
                                    {field.key === 'beratEmas' && (
                                        <Text style={{ fontSize: 13, color: '#aaa' }}>gram</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                        <TouchableOpacity
                            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0DAD0' }}
                            onPress={reset}
                            activeOpacity={0.7}
                        >
                            <RotateCcw size={18} color="#aaa" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: TEAL, borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: TEAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                            onPress={calculate}
                            activeOpacity={0.8}
                        >
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Hitung Zakat</Text>
                            <ChevronRight size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Result card */}
                    {result && (
                        <View style={{ backgroundColor: result.wajib ? TEAL : '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: result.wajib ? 'rgba(255,255,255,0.8)' : '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                                Hasil Perhitungan
                            </Text>

                            {/* Harta bersih */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ fontSize: 14, color: result.wajib ? 'rgba(255,255,255,0.8)' : '#888' }}>Total Harta Bersih</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: result.wajib ? '#fff' : '#333' }}>{formatRupiah(result.total)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text style={{ fontSize: 14, color: result.wajib ? 'rgba(255,255,255,0.8)' : '#888' }}>Nisab</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: result.wajib ? '#fff' : '#333' }}>{formatRupiah(result.nisab)}</Text>
                            </View>

                            <View style={{ height: 1, backgroundColor: result.wajib ? 'rgba(255,255,255,0.2)' : '#eee', marginBottom: 16 }} />

                            {/* Status */}
                            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: result.wajib ? '#fff' : '#c0392b' }}>
                                    {result.wajib ? '✅ Wajib Zakat' : '❌ Belum Wajib Zakat'}
                                </Text>
                                {!result.wajib && (
                                    <Text style={{ fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' }}>
                                        Harta belum mencapai nisab atau belum genap 1 tahun (haul)
                                    </Text>
                                )}
                            </View>

                            {/* Zakat amount */}
                            {result.wajib && (
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 16, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Zakat yang harus dibayar (2,5%)</Text>
                                    <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>{formatRupiah(result.zakat)}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Disclaimer */}
                    <Text style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 20, lineHeight: 16 }}>
                        Perhitungan ini bersifat estimasi. Konsultasikan dengan ulama atau lembaga zakat terpercaya untuk kepastian hukum syar'i.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
