import { useColors } from "@/src/styles/globalColors";
import { CreateAssetDTO } from "@/src/types/asset";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Button from "./Button";
import Card from "./Card";
import Icon from "./Icon";
import TextInput from "./TextInput";

export interface SelectedFile {
  uri: string;
  name: string;
}

interface AssetFormProps {
  initialValues?: Partial<CreateAssetDTO>;
  onSubmit: (data: CreateAssetDTO, file?: SelectedFile) => Promise<void>;
  submitLabel: string;
  existingManual?: boolean;
  onDeleteManual?: () => void;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const AssetForm = ({ initialValues, onSubmit, submitLabel, existingManual, onDeleteManual }: AssetFormProps) => {
  const colors = useColors();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [brand, setBrand] = useState(initialValues?.brand ?? "");
  const [model, setModel] = useState(initialValues?.model ?? "");
  const [serialNumber, setSerialNumber] = useState(initialValues?.serialNumber ?? "");
  const [purchaseDate, setPurchaseDate] = useState(
    initialValues?.purchaseDate ? parseDate(initialValues.purchaseDate) : new Date()
  );
  const [hasPickedDate, setHasPickedDate] = useState(!!initialValues?.purchaseDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nfcTagId, setNfcTagId] = useState(initialValues?.nfcTagId ?? "");
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!brand.trim()) newErrors.brand = "Brand is required";
    if (!model.trim()) newErrors.model = "Model is required";
    if (!serialNumber.trim()) newErrors.serialNumber = "Serial number is required";
    if (!hasPickedDate) newErrors.purchaseDate = "Purchase date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setPurchaseDate(selectedDate);
      setHasPickedDate(true);
      if (errors.purchaseDate) {
        setErrors((prev) => {
          const { purchaseDate: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({ uri: file.uri, name: file.name });
      }
    } catch {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const data: CreateAssetDTO = {
        name: name.trim(),
        brand: brand.trim(),
        model: model.trim(),
        serialNumber: serialNumber.trim(),
        purchaseDate: formatDate(purchaseDate),
        ...(nfcTagId.trim() && { nfcTagId: nfcTagId.trim() }),
      };
      await onSubmit(data, selectedFile ?? undefined);
    } catch (err) {
      Alert.alert(
        "Error",
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  };

  const scrollContent: ViewStyle = {
    padding: 16,
    paddingBottom: 48,
  };

  const sectionTitle: TextStyle = {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4,
  };

  const sectionStyle: ViewStyle = {
    marginBottom: 24,
  };

  const cardContent: ViewStyle = {
    padding: 16,
  };

  const buttonContainer: ViewStyle = {
    marginTop: 8,
    alignItems: "center",
  };

  const dateFieldLabel: TextStyle = {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  };

  const dateButton: ViewStyle = {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1.5,
    borderColor: errors.purchaseDate ? colors.statusErrorText : colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  };

  const dateButtonText: TextStyle = {
    fontSize: 16,
    color: hasPickedDate ? colors.textPrimary : colors.textMuted,
  };

  const dateErrorStyle: TextStyle = {
    fontSize: 12,
    color: colors.statusErrorText,
    marginTop: 6,
    fontWeight: "500",
  };

  const fileRow: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  };

  const fileInfo: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  };

  const fileName: TextStyle = {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  };

  const fileHint: TextStyle = {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  };

  return (
    <KeyboardAvoidingView
      style={containerStyle}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View style={sectionStyle}>
            <Text style={sectionTitle}>Equipment Info</Text>
            <Card variant="elevated" padding="none">
              <View style={cardContent}>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Chainsaw"
                  error={errors.name}
                />
                <TextInput
                  label="Brand"
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="e.g. Stihl"
                  error={errors.brand}
                />
                <TextInput
                  label="Model"
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g. MS 261"
                  error={errors.model}
                />
              </View>
            </Card>
          </View>

          <View style={sectionStyle}>
            <Text style={sectionTitle}>Identification</Text>
            <Card variant="elevated" padding="none">
              <View style={cardContent}>
                <TextInput
                  label="Serial Number"
                  value={serialNumber}
                  onChangeText={setSerialNumber}
                  placeholder="e.g. SN-12345"
                  error={errors.serialNumber}
                />
                <View style={{ marginBottom: 20 }}>
                  <Text style={dateFieldLabel}>Purchase Date</Text>
                  <Pressable
                    style={dateButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowDatePicker(true);
                    }}
                  >
                    <Text style={dateButtonText}>
                      {hasPickedDate ? formatDate(purchaseDate) : "Select a date"}
                    </Text>
                  </Pressable>
                  {errors.purchaseDate && (
                    <Text style={dateErrorStyle}>{errors.purchaseDate}</Text>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={purchaseDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      accentColor={colors.brandPrimary}
                    />
                  )}
                </View>
                <TextInput
                  label="NFC Tag ID (optional)"
                  value={nfcTagId}
                  onChangeText={setNfcTagId}
                  placeholder="e.g. NFC-001"
                />
              </View>
            </Card>
          </View>

          <View style={sectionStyle}>
            <Text style={sectionTitle}>Maintenance Manual</Text>
            <Card variant="elevated" padding="none">
              <View style={cardContent}>
                {selectedFile ? (
                  <View>
                    <View style={fileRow}>
                      <View style={fileInfo}>
                        <Icon
                          name="description"
                          iosName="doc.fill"
                          androidName="description"
                          size={20}
                          color={colors.brandPrimary}
                        />
                        <Text style={fileName} numberOfLines={1}>
                          {selectedFile.name}
                        </Text>
                      </View>
                      <Pressable onPress={() => setSelectedFile(null)} hitSlop={8}>
                        <Icon
                          name="close"
                          iosName="xmark.circle.fill"
                          androidName="close"
                          size={24}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    </View>
                    <Text style={fileHint}>PDF will be uploaded when you save</Text>
                  </View>
                ) : (
                  <View>
                    {existingManual && (
                      <Text style={{ ...fileHint, marginTop: 0, marginBottom: 12 }}>
                        A manual is already attached. Select a new file to replace it.
                      </Text>
                    )}
                    <Button
                      variant="outline"
                      fullWidth
                      icon="upload-file"
                      iosIcon="doc.badge.plus"
                      androidIcon="upload-file"
                      onPress={handlePickDocument}
                    >
                      {existingManual ? "Replace Manual" : "Attach PDF Manual"}
                    </Button>
                    {existingManual && onDeleteManual && (
                      <View style={{ marginTop: 10 }}>
                        <Button
                          variant="ghost"
                          status="error"
                          fullWidth
                          onPress={onDeleteManual}
                        >
                          Remove Manual
                        </Button>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </Card>
          </View>

          <View style={buttonContainer}>
            <Button
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving..." : submitLabel}
            </Button>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AssetForm;
