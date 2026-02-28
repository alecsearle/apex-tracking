import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import TextInput from "@/src/components/TextInput";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { mockCreateBusiness, mockJoinBusiness } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type OnboardingMode = "create" | "join";

export default function Onboarding() {
  const colors = useColors();
  const { completeOnboarding } = useAuthContext();

  const [mode, setMode] = useState<OnboardingMode>("create");
  const [businessName, setBusinessName] = useState("");
  const [businessCode, setBusinessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  function handleCreate() {
    const trimmed = businessName.trim();
    if (!trimmed) {
      setError("Business name is required.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Business name must be at least 2 characters.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate async delay
    setTimeout(() => {
      const { business } = mockCreateBusiness(trimmed);
      setSuccessCode(business.businessCode);
      setLoading(false);
    }, 500);
  }

  function handleJoin() {
    const trimmed = businessCode.trim();
    if (!trimmed) {
      setError("Business code is required.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate async delay
    setTimeout(() => {
      const result = mockJoinBusiness(trimmed);
      if (!result.success) {
        setError(result.error ?? "Failed to join business.");
        setLoading(false);
        return;
      }
      setLoading(false);
      completeOnboarding();
    }, 500);
  }

  function handleSuccessContinue() {
    completeOnboarding();
  }

  // Success state after creating a business
  if (successCode) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successContainer}>
            <Icon
              name="check-circle"
              iosName="checkmark.circle.fill"
              androidName="check-circle"
              size={64}
              color={colors.statusActiveText}
            />
            <Text style={[styles.successTitle, { color: colors.textHeading }]}>
              Business Created!
            </Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              Share this code with your team so they can join:
            </Text>
            <View style={[styles.codeBox, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
              <Text style={[styles.codeText, { color: colors.brandPrimary }]}>
                {successCode}
              </Text>
            </View>
            <Button variant="primary" onPress={handleSuccessContinue} fullWidth>
              Continue
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const isCreateMode = mode === "create";
  const isJoinMode = mode === "join";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textHeading }]}>Get Started</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create a new business or join an existing one.
        </Text>

        {/* Mode selection cards */}
        <View style={styles.cardsRow}>
          <Card
            variant={isCreateMode ? "outlined" : "default"}
            padding="medium"
            onPress={() => { setMode("create"); setError(""); }}
            style={{
              ...styles.modeCard,
              ...(isCreateMode && { borderColor: colors.brandPrimary, borderWidth: 2 }),
            }}
          >
            <View style={styles.cardContent}>
              <Icon
                name="business"
                iosName="building.2.fill"
                androidName="business"
                size={28}
                color={isCreateMode ? colors.brandPrimary : colors.textMuted}
              />
              <Text style={[
                styles.cardTitle,
                { color: isCreateMode ? colors.brandPrimary : colors.textPrimary },
              ]}>
                Create a Business
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                Start tracking assets for your business
              </Text>
            </View>
          </Card>

          <Card
            variant={isJoinMode ? "outlined" : "default"}
            padding="medium"
            onPress={() => { setMode("join"); setError(""); }}
            style={{
              ...styles.modeCard,
              ...(isJoinMode && { borderColor: colors.brandPrimary, borderWidth: 2 }),
            }}
          >
            <View style={styles.cardContent}>
              <Icon
                name="group"
                iosName="person.2.fill"
                androidName="group"
                size={28}
                color={isJoinMode ? colors.brandPrimary : colors.textMuted}
              />
              <Text style={[
                styles.cardTitle,
                { color: isJoinMode ? colors.brandPrimary : colors.textPrimary },
              ]}>
                Join a Business
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                Enter a business code to join your team
              </Text>
            </View>
          </Card>
        </View>

        {/* Form section */}
        <View style={styles.form}>
          {isCreateMode && (
            <>
              <TextInput
                label="Business Name"
                placeholder="e.g. Carter Landscaping"
                value={businessName}
                onChangeText={(text) => { setBusinessName(text); setError(""); }}
                error={error}
              />
              <Button
                variant="primary"
                onPress={handleCreate}
                disabled={loading}
                fullWidth
              >
                {loading ? "Creating..." : "Create Business"}
              </Button>
            </>
          )}

          {isJoinMode && (
            <>
              <TextInput
                label="Business Code"
                placeholder="e.g. APEX-7K2X"
                value={businessCode}
                onChangeText={(text) => { setBusinessCode(text.toUpperCase()); setError(""); }}
                error={error}
              />
              <Button
                variant="primary"
                onPress={handleJoin}
                disabled={loading}
                fullWidth
              >
                {loading ? "Joining..." : "Join Business"}
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: Platform.OS === "android" ? 60 : 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  modeCard: {
    flex: 1,
  },
  cardContent: {
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  successContainer: {
    alignItems: "center",
    gap: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  codeBox: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  codeText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
