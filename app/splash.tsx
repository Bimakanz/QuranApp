import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function splash() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            // Start fade out animation
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {

                router.replace("/(tabs)/Home");
            });
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#E2C675', '#F5E5A0', '#E2C675']}
            locations={[0, 0.5, 1]}
            style={{
                width: "100%",
                height: "100%",
                flex: 1,
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 15,
                        opacity: fadeAnim,
                    }}
                >
                    <Image
                        source={require("../assets/images/logoh.png")}
                        style={{ width: 250, height: 250 }}
                    />
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}
