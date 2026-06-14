// Purpose: Reusable dropdown selector component styled to match inputs.
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Modal,
  ScrollView
} from 'react-native';
import { 
  BORDER, 
  TEXT_PRIMARY, 
  TEXT_SECONDARY,
  PRIMARY,
  PRIMARY_LIGHT
} from '../constants/colors';

interface DropdownProps {
  label: string;
  value: string;
  options?: string[];
  onSelect?: (value: string) => void;
  onPress?: () => void;
  required?: boolean;
}

const Dropdown = ({ label, value, options, onSelect, onPress, required }: DropdownProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (options && options.length > 0) {
      setModalVisible(true);
    }
    if (onPress) {
      onPress();
    }
  };

  const handleSelect = (option: string) => {
    if (onSelect) {
      onSelect(option);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownValue}>{value}</Text>
        <View style={styles.chevron} />
      </TouchableOpacity>

      {options && options.length > 0 && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <ScrollView style={styles.optionsContainer} bounces={false}>
                {options.map((option) => {
                  const isSelected = option === value;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                      ]}
                      onPress={() => handleSelect(option)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  optionsContainer: {
    width: '100%',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: PRIMARY_LIGHT,
  },
  modalOptionText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  modalOptionTextSelected: {
    color: PRIMARY,
    fontWeight: '500',
  },
});

export default Dropdown;
