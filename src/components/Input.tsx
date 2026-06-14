// Purpose: Reusable text input component with focus styling and mandatory asterisk display.
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardTypeOptions
} from 'react-native';
import { PRIMARY, BORDER, TEXT_PRIMARY, TEXT_SECONDARY, DANGER_TEXT } from '../constants/colors';

interface InputProps {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  helperText?: string;
  errorText?: string;
  editable?: boolean;
}

const Input = ({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  helperText,
  errorText,
  editable = true,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          isFocused && editable ? styles.inputFocused : styles.inputUnfocused,
          errorText ? styles.inputError : null,
          !editable && styles.inputDisabled
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TEXT_SECONDARY}
        keyboardType={keyboardType}
        onFocus={() => editable && setIsFocused(true)}
        onBlur={() => editable && setIsFocused(false)}
        editable={editable}
      />
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : (
        helperText && <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  asterisk: {
    color: TEXT_PRIMARY, // Same color as label in mockup screenshot
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT_PRIMARY,
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: PRIMARY,
  },
  inputUnfocused: {
    borderColor: BORDER,
  },
  inputDisabled: {
    backgroundColor: '#F5F5FA',
    color: TEXT_SECONDARY,
    borderColor: BORDER,
  },
  inputError: {
    borderColor: DANGER_TEXT,
  },
  helperText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: DANGER_TEXT,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default Input;
