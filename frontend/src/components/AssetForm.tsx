import { useColors } from "@/src/styles/globalColors";
import { CreateAssetDTO } from "@/src/types/asset";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";
import Button from "./Button";
import Card from "./Card";
import TextInput from "./TextInput";

interface AssetFormProps {
  initialValues?: Partial<CreateAssetDTO>;
  onSubmit: (data: CreateAssetDTO) => Promise<void>;
  submitLabel: string;
}

const AssetForm = ({ initialValues, onSubmit, submitLabel }: AssetFormProps) => {
  const colors = useColors();

  const [name, setName] = useState(initialValues?.name ?? "");
  const [brand, setBrand] = useState(initialValues?.brand ?? "");
  const [model, setModel] = useState(initialValues?.model ?? "");
  const [serialNumber, setSerialNumber] = useState(initialValues?.serialNumber ?? "");
  const [purchaseDate, setPurchaseDate] = useState(initialValues?.purchaseDate ?? "");
  const [nfcTagId, setNfcTagId] = useState(initialValues?.nfcTagId ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!brand.trim()) newErrors.brand = "Brand is required";
    if (!model.trim()) newErrors.model = "Model is required";
    if (!serialNumber.trim()) newErrors.serialNumber = "Serial number is required";
    if (!purchaseDate.trim()) newErrors.purchaseDate = "Purchase date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        purchaseDate: purchaseDate.trim(),
        ...(nfcTagId.trim() && { nfcTagId: nfcTagId.trim() }),
      };
      await onSubmit(data);
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
    paddingBottom: 32,
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

  return (
    <ScrollView style={containerStyle} contentContainerStyle={scrollContent} keyboardShouldPersistTaps="handled">
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
            <TextInput
              label="Purchase Date"
              value={purchaseDate}
              onChangeText={setPurchaseDate}
              placeholder="YYYY-MM-DD"
              error={errors.purchaseDate}
            />
            <TextInput
              label="NFC Tag ID (optional)"
              value={nfcTagId}
              onChangeText={setNfcTagId}
              placeholder="e.g. NFC-001"
            />
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
    </ScrollView>
  );
};

export default AssetForm;
