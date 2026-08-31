import { useCallback, useEffect, useMemo, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { apiGet, apiPost, apiUploadPhoto, ApiError } from "@/lib/api";
import { one } from "@/lib/normalize";
import { colors } from "@/lib/theme";
import { openDirections, callPhone } from "@/lib/directions";
import { SegmentedControl } from "@/components/segmented-control";
import type { PickupRequest, RateCard } from "@/lib/types";

const QUALITY_GRADES = ["standard", "premium", "low"] as const;
const PAYMENT_MODES = ["cash", "upi", "bank", "credit_note"] as const;

export default function CollectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [request, setRequest] = useState<PickupRequest | null>(null);
  const [rateCards, setRateCards] = useState<RateCard[]>([]);

  const [grossKg, setGrossKg] = useState("");
  const [tareKg, setTareKg] = useState("");
  const [netKg, setNetKg] = useState("");
  const [qualityGrade, setQualityGrade] = useState<(typeof QUALITY_GRADES)[number]>("standard");
  const [ratePerKg, setRatePerKg] = useState("");
  const [paymentMode, setPaymentMode] = useState<(typeof PAYMENT_MODES)[number]>("cash");
  const [notes, setNotes] = useState("");
  const [verbalConfirmation, setVerbalConfirmation] = useState(false);

  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"loading" | "done" | "error">("loading");

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const outlet = request ? one(request.outlets) : undefined;
  const org = outlet ? one(outlet.organizations) : undefined;

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [{ request }, { rateCards }] = await Promise.all([
        apiGet<{ request: PickupRequest }>(`/api/mobile/pickup-requests/${id}`),
        apiGet<{ rateCards: RateCard[] }>("/api/mobile/rate-cards"),
      ]);
      setRequest(request);
      setRateCards(rateCards);
    } catch (e) {
      setLoadError(e instanceof ApiError ? e.message : "Failed to load this request");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-fill the rate the moment we know the outlet's city/segment and
  // have a grade selected — still freely editable afterward.
  useEffect(() => {
    if (!outlet || !org) return;
    const match = rateCards.find(
      (rc) => rc.city === outlet.city && rc.segment === org.segment && rc.quality_grade === qualityGrade
    );
    if (match) setRatePerKg(String(match.rate_per_kg));
  }, [outlet, org, rateCards, qualityGrade]);

  // Gross/tare auto-computes net; the field stays a normal editable input
  // afterward, so the collector can override it.
  useEffect(() => {
    const g = parseFloat(grossKg);
    const t = parseFloat(tareKg);
    if (Number.isFinite(g) && Number.isFinite(t) && g > t) {
      setNetKg(String(Math.round((g - t) * 100) / 100));
    }
  }, [grossKg, tareKg]);

  const captureLocation = useCallback(async () => {
    setGpsStatus("loading");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setGpsStatus("error");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setGps({ lat: position.coords.latitude, lng: position.coords.longitude });
      setGpsStatus("done");
    } catch {
      setGpsStatus("error");
    }
  }, []);

  useEffect(() => {
    captureLocation();
  }, [captureLocation]);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera permission needed", "Enable camera access in Settings to photograph the collection.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  const netKgNumber = parseFloat(netKg);
  const rateNumber = parseFloat(ratePerKg);
  const estimatedPayable = useMemo(() => {
    if (!Number.isFinite(netKgNumber) || !Number.isFinite(rateNumber)) return null;
    return Math.round(netKgNumber * rateNumber);
  }, [netKgNumber, rateNumber]);

  const canSubmit =
    !!outlet &&
    Number.isFinite(netKgNumber) &&
    netKgNumber > 0 &&
    Number.isFinite(rateNumber) &&
    rateNumber > 0 &&
    gpsStatus === "done" &&
    !!gps &&
    !!photoUri &&
    !submitting;

  async function handleSubmit() {
    if (!outlet || !gps || !photoUri) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { path } = await apiUploadPhoto(photoUri);
      const result = await apiPost<{ netPayable: number }>("/api/mobile/collections", {
        pickupRequestId: request?.id,
        outletId: outlet.id,
        grossKg: grossKg ? parseFloat(grossKg) : undefined,
        tareKg: tareKg ? parseFloat(tareKg) : undefined,
        netKg: netKgNumber,
        qualityGrade,
        ratePerKg: rateNumber,
        paymentMode,
        gpsLat: gps.lat,
        gpsLng: gps.lng,
        photoPath: path,
        verbalConfirmation,
        notes: notes.trim() || undefined,
      });
      Alert.alert("Collection recorded", `₹${result.netPayable} payable for ${netKgNumber} kg.`, [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (e) {
      setSubmitError(e instanceof ApiError ? e.message : "Failed to submit — try again");
    } finally {
      setSubmitting(false);
    }
  }

  // Declared once, outside the loading/error/success branches below — a
  // <Stack.Screen> only inside the success branch's JSX means the title
  // never gets set at all while loading or on error, and the header falls
  // back to a raw route-name default ("collect/[id]") for however long
  // that lasts. Same fix applied to history/[id].tsx.
  const header = <Stack.Screen options={{ title: "Record Collection" }} />;

  if (loading) {
    return (
      <View style={styles.center}>
        {header}
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (loadError || !outlet) {
    return (
      <View style={styles.center}>
        {header}
        <Text style={styles.error}>{loadError ?? "Request not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      {header}

      <View style={styles.outletCard}>
        <Text style={styles.outletOrg}>{org?.legal_name}</Text>
        <Text style={styles.outletName}>{outlet.name}</Text>
        <Text style={styles.outletAddress}>{outlet.address}</Text>
        {outlet.contact_name && (
          <Text style={styles.outletContact}>
            {outlet.contact_name} {outlet.contact_phone ? `· ${outlet.contact_phone}` : ""}
          </Text>
        )}
        <View style={styles.outletActions}>
          <Pressable
            style={styles.outletActionButton}
            onPress={() => openDirections(outlet.lat, outlet.lng, outlet.address)}
          >
            <Ionicons name="navigate" size={14} color={colors.primary} />
            <Text style={styles.outletActionText}>Directions</Text>
          </Pressable>
          {outlet.contact_phone && (
            <Pressable style={styles.outletActionButton} onPress={() => callPhone(outlet.contact_phone!)}>
              <Ionicons name="call" size={14} color={colors.primary} />
              <Text style={styles.outletActionText}>Call</Text>
            </Pressable>
          )}
        </View>
      </View>

      <Section title="Weight">
        <Row>
          <Field label="Gross (kg)" value={grossKg} onChangeText={setGrossKg} />
          <Field label="Tare (kg)" value={tareKg} onChangeText={setTareKg} />
        </Row>
        <Field label="Net (kg) — required" value={netKg} onChangeText={setNetKg} bold />
      </Section>

      <Section title="Quality grade">
        <SegmentedControl options={QUALITY_GRADES} value={qualityGrade} onChange={setQualityGrade} />
      </Section>

      <Section title="Rate">
        <Field label="₹ per kg — required" value={ratePerKg} onChangeText={setRatePerKg} bold />
        {estimatedPayable != null && (
          <Text style={styles.payable}>Payable: ₹{estimatedPayable}</Text>
        )}
      </Section>

      <Section title="Payment mode">
        <SegmentedControl
          options={PAYMENT_MODES}
          value={paymentMode}
          onChange={setPaymentMode}
          labels={{ credit_note: "Credit" }}
        />
      </Section>

      <Section title="Location — required">
        {gpsStatus === "loading" && (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.statusText}>Getting your location…</Text>
          </View>
        )}
        {gpsStatus === "done" && gps && (
          <Text style={styles.statusOk}>
            Location captured ({gps.lat.toFixed(5)}, {gps.lng.toFixed(5)})
          </Text>
        )}
        {gpsStatus === "error" && (
          <View>
            <Text style={styles.error}>Couldn&apos;t get your location.</Text>
            <Pressable style={styles.retryButton} onPress={captureLocation}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}
      </Section>

      <Section title="Photo — required">
        {photoUri ? (
          <View>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <Pressable style={styles.retryButton} onPress={takePhoto}>
              <Text style={styles.retryButtonText}>Retake photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonText}>Take photo</Text>
          </Pressable>
        )}
      </Section>

      <Section title="Confirmation">
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Outlet contact confirmed the weight verbally</Text>
          <Switch value={verbalConfirmation} onValueChange={setVerbalConfirmation} />
        </View>
        <Text style={styles.hint}>
          Stand-in for a real OTP confirmation until SMS is wired up — not independently verified yet.
        </Text>
      </Section>

      <Section title="Notes (optional)">
        <TextInput
          style={[styles.input, { height: 70, textAlignVertical: "top" }]}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Anything worth flagging about this pickup"
          placeholderTextColor={colors.muted}
        />
      </Section>

      {submitError && <Text style={[styles.error, { marginBottom: 12 }]}>{submitError}</Text>}

      <Pressable
        style={[styles.submitButton, !canSubmit && { opacity: 0.4 }]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.submitButtonText}>Record collection</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", gap: 10 }}>{children}</View>;
}

function Field({
  label,
  value,
  onChangeText,
  bold,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  bold?: boolean;
}) {
  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, bold && { fontWeight: "700" }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  error: { color: colors.destructive, fontSize: 14 },
  outletCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  outletOrg: { fontSize: 16, fontWeight: "700", color: colors.darkText },
  outletName: { fontSize: 14, color: colors.darkText, marginTop: 2 },
  outletAddress: { fontSize: 13, color: colors.muted, marginTop: 2 },
  outletContact: { fontSize: 13, color: colors.muted, marginTop: 6 },
  outletActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  outletActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.lightGreen,
  },
  outletActionText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  fieldLabel: { fontSize: 12, color: colors.muted, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
    backgroundColor: colors.white,
  },
  payable: { marginTop: 8, fontSize: 14, fontWeight: "700", color: colors.green },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { color: colors.muted, fontSize: 13 },
  statusOk: { color: colors.green, fontSize: 13, fontWeight: "600" },
  retryButton: { marginTop: 8, alignSelf: "flex-start", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.lightGreen },
  retryButtonText: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  photo: { width: "100%", height: 180, borderRadius: 12, backgroundColor: "#eee" },
  photoButton: { borderWidth: 1, borderColor: colors.primary, borderStyle: "dashed", borderRadius: 12, paddingVertical: 24, alignItems: "center" },
  photoButtonText: { color: colors.primary, fontWeight: "600" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  switchLabel: { flex: 1, fontSize: 13, color: colors.darkText, marginRight: 12 },
  hint: { fontSize: 11, color: colors.muted, marginTop: 6 },
  submitButton: { backgroundColor: colors.primary, borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  submitButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
});
