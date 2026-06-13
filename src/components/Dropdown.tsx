// Purpose: Reusable dropdown selector component styled to match inputs.
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { BORDER, TEXT_PRIMARY, TEXT_SECONDARY } from '../constants/colors';

interface DropdownProps {
  label: string;
  value: string;
  onPress?: () => void;
  required?: boolean;
}

const Dropdown = ({ label, value, onPress, required }: DropdownProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownValue}>{value}</Text>
        <View style={styles.chevron} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  asterisk: {
    color: TEXT_PRIMARY,
  },
  dropdownButton: {
    height: 52,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dropdownValue: {
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: TEXT_SECONDARY,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
});

export default Dropdown;
