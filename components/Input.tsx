import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, commonStyles } from '../lib/styles';

// Input variants
export type InputVariant = 'default' | 'filled' | 'outline';

// Input props
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: InputVariant;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
}) => {
  // Get input style based on variant
  const getInputStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledInput;
      case 'outline':
        return styles.outlineInput;
      default:
        return styles.defaultInput;
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          getInputStyle(),
          multiline && styles.multilineInput,
          error && styles.errorInput,
          !editable && styles.disabledInput,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        placeholderTextColor={colors.textMuted}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizeRegular,
    fontWeight: typography.fontWeightMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: typography.fontSizeRegular,
    color: colors.text,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  defaultInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filledInput: {
    backgroundColor: '#f0f0f0',
  },
  outlineInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: colors.error,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: colors.textMuted,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSizeSmall,
    marginTop: spacing.xs,
  },
});
