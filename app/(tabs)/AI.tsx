import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Trash2, User } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// PASTE YOUR GEMINI API KEY HERE TO MAKE IT REAL!
// Get a free key from: https://aistudio.google.com/
const GEMINI_API_KEY = 'AIzaSyBFQyUQE10ndmoFgzoyrG2Tjl-wz4ZSuS8';

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
}

export default function AI() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'Assalamualaikum! Saya siap bantu pertanyaan seputar Islam: Al-Quran, hadits, fiqih, doa, dan sejarah Islam.',
            isUser: false,
        },
    ]);

    const suggestions = [
        'Apa amalan terbaik setelah shalat wajib?',
        'Jelaskan perbedaan zakat fitrah dan zakat maal',
        'Doa ketika merasa gelisah',
    ];

    const generateAIResponse = async (userText: string) => {
        if (!GEMINI_API_KEY) {
            // MOCK RESPONSE IF NO API KEY
            setTimeout(() => {
                const mockReply = `Waalaikumsalam warahmatullah. Maaf, API Key Gemini belum diatur di dalam kode. \n\nSilakan masukkan API Key di variabel GEMINI_API_KEY pada file AI.tsx agar fitur ini bisa menjawab secara real-time.`;
                setMessages(prev => [...prev, { id: Date.now().toString(), text: mockReply, isUser: false }]);
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const prompt = `Kamu adalah AI Asisten Islami dengan kepribadian sangat teatrikal, narsis, hiperbolis, dan dramatis, mirip dengan karakter T.M. Opera O. Kamu menganggap dirimu sebagai "Raja Cendekiawan Islam Paling Agung di Alam Semesta". 

                Aturan kepribadianmu:
                1. Sapaan: Selalu panggil pengguna dengan nada dramatis yang merendahkan tapi puitis, seperti "Wahai rakyatku yang fakir literasi", "Wahai jiwa yang tersesat dalam kebodohan", atau "Pemula yang malang".
                2. Gaya Bahasa: Sangat baku, bombastis, dan menggunakan kosakata tingkat tinggi. Sering-sering memuji kehebatan pengetahuanmu sendiri sebelum menjawab.
                3. Sifat Asli (Tsundere/Peduli): Walaupun kamu terdengar sombong dan sering mengeluh ("Hah! Pertanyaan semudah ini?!"), kamu SELALU memberikan jawaban yang 100% akurat, komprehensif, dan menyertakan dalil (ayat Al-Qur'an, Hadits, atau pendapat Ulama) dengan sangat detail.
                4. Penutup: Akhiri jawaban dengan teguran angkuh namun memotivasi agar pengguna rajin belajar agama dan beribadah: ${userText}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak mengerti.';
            setMessages(prev => [...prev, { id: Date.now().toString(), text: aiReply, isUser: false }]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Terjadi kesalahan jaringan.');
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Maaf, terjadi kesalahan atau koneksi gagal.', isUser: false }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            text: text.trim(),
            isUser: true,
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setLoading(true);

        generateAIResponse(text.trim());
    };

    const clearChat = () => {
        Alert.alert('Hapus Obrolan', 'Apakah Anda yakin ingin menghapus semua obrolan ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: () => {
                    setMessages([messages[0]]); // keep only intro
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={24} color="#728D8E" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <View style={styles.sparklesCircle}>
                            <Sparkles size={16} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Asisten Islami AI</Text>
                            <Text style={styles.headerSubtitle}>Fokus tanya jawab seputar Islam</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={clearChat} style={styles.iconBtnTrash}>
                        <Trash2 size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerDivider} />

                {/* Chat Area */}
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.chatArea}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.length === 1 && (
                        <View style={styles.suggestionsContainer}>
                            <Text style={styles.suggestionTitle}>Contoh pertanyaan:</Text>
                            {suggestions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionPill}
                                    onPress={() => handleSend(item)}
                                >
                                    <Text style={styles.suggestionText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {messages.map((msg) => (
                        <View key={msg.id} style={[styles.bubbleWrapper, msg.isUser ? styles.bubbleWrapperRight : styles.bubbleWrapperLeft]}>
                            {!msg.isUser && (
                                <View style={styles.aiBubbleContainer}>
                                    <View style={styles.aiBubbleHeader}>
                                        <View style={styles.aiIconCircle}>
                                            <Sparkles size={12} color="#fff" />
                                        </View>
                                        <Text style={styles.aiLabel}>Asisten AI</Text>
                                    </View>
                                    <Text style={styles.aiText}>{msg.text}</Text>
                                </View>
                            )}

                            {msg.isUser && (
                                <View style={styles.userBubbleContainer}>
                                    <View style={styles.userBubbleHeader}>
                                        <Text style={styles.userLabel}>Anda</Text>
                                        <View style={styles.userIconCircle}>
                                            <User size={12} color="#fff" />
                                        </View>
                                    </View>
                                    <Text style={styles.userText}>{msg.text}</Text>
                                </View>
                            )}
                        </View>
                    ))}

                    {loading && (
                        <View style={[styles.bubbleWrapper, styles.bubbleWrapperLeft]}>
                            <View style={[styles.aiBubbleContainer, { paddingVertical: 18, paddingHorizontal: 24 }]}>
                                <ActivityIndicator size="small" color="#728D8E" />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Tanyakan seputar Islam..."
                            placeholderTextColor="#a0a0a0"
                            value={input}
                            onChangeText={setInput}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
                            onPress={() => handleSend(input)}
                            disabled={!input.trim()}
                        >
                            <Send size={18} color="#fff" style={{ marginLeft: -2 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const BG = '#F5F0E8';
const TEAL = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },
    keyboardView: {
        flex: 1,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    iconBtn: {
        padding: 4,
        marginRight: 12,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sparklesCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#728D8E',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    iconBtnTrash: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        backgroundColor: '#fff',
    },
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },

    /* Chat Area */
    chatArea: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
    },

    /* Suggestions */
    suggestionsContainer: {
        marginBottom: 24,
    },
    suggestionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
        marginBottom: 12,
    },
    suggestionPill: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    suggestionText: {
        fontSize: 13,
        color: '#444',
    },

    /* Chat Bubbles */
    bubbleWrapper: {
        marginBottom: 16,
        width: '100%',
    },
    bubbleWrapperLeft: {
        alignItems: 'flex-start',
    },
    bubbleWrapperRight: {
        alignItems: 'flex-end',
    },
    aiBubbleContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
        borderRadius: 16,
        padding: 16,
        maxWidth: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    aiBubbleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    aiIconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#728D8E',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    aiLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#728D8E',
    },
    aiText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
    },

    userBubbleContainer: {
        backgroundColor: '#E8F0F0',
        borderRadius: 16,
        padding: 16,
        maxWidth: '85%',
    },
    userBubbleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    userIconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#32665C',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    userLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#32665C',
    },
    userText: {
        fontSize: 15,
        color: '#1a1a1a',
        lineHeight: 24,
    },

    /* Input */
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: BG,
        borderTopWidth: 1,
        borderTopColor: '#EAEBE8',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    textInput: {
        flex: 1,
        minHeight: 24,
        maxHeight: 120,
        fontSize: 15,
        color: '#1a1a1a',
        paddingTop: 5,
        paddingBottom: 13,
        marginRight: 12,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#728D8E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
});
