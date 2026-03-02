import { StyleSheet, Text, View } from 'react-native';

export default function AI() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>AI</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    text: { fontSize: 24, fontWeight: '600', color: '#333' },
});
