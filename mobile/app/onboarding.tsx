import { useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboarding } from "@/lib/onboarding-context";
import { colors } from "@/lib/theme";

const SLIDES = [
  {
    icon: "leaf" as const,
    title: "Welcome to NavUrja Ops",
    body: "Your field toolkit for collecting used cooking oil — every pickup tracked, verified, and paid.",
  },
  {
    icon: "list" as const,
    title: "See your route",
    body: "Today's assigned pickups, with one-tap directions and a call button for every outlet.",
  },
  {
    icon: "camera" as const,
    title: "Weigh, photograph, confirm",
    body: "Gross, tare, net weight, a required photo, and your location — recorded together for every collection.",
  },
  {
    icon: "stats-chart" as const,
    title: "Track your impact",
    body: "Full history of every pickup, plus today's and this week's totals — kg collected and paid out.",
  },
];

export default function OnboardingScreen() {
  const { markSeen } = useOnboarding();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  function goToNext() {
    if (isLast) {
      markSeen();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.skip} onPress={markSeen} hitSlop={10}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            {i === 0 ? (
              <Image source={require("@/assets/icon.png")} style={styles.logo} />
            ) : (
              <View style={styles.iconCircle}>
                <Ionicons name={slide.icon} size={40} color={colors.primary} />
              </View>
            )}
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Pressable style={styles.nextButton} onPress={goToNext}>
          <Text style={styles.nextButtonText}>{isLast ? "Get Started" : "Next"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skip: { position: "absolute", top: 56, right: 20, zIndex: 10 },
  skipText: { fontSize: 14, fontWeight: "600", color: colors.muted },
  slide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 36 },
  logo: { width: 88, height: 88, resizeMode: "contain", marginBottom: 28 },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: { fontSize: 22, fontWeight: "700", color: colors.darkText, textAlign: "center" },
  body: { fontSize: 15, color: colors.muted, textAlign: "center", marginTop: 12, lineHeight: 22 },
  footer: { paddingHorizontal: 28, paddingBottom: 40, paddingTop: 12, alignItems: "center" },
  dots: { flexDirection: "row", gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lightGreen },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  nextButton: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
  },
  nextButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
});
