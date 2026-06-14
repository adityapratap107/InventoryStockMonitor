// Purpose: Reusable full-screen loading spinner component styled to match the app theme.
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { PRIMARY, TEXT_PRIMARY } from '../constants/colors';

interface LoaderProps {
  visible: boolean;
  message?: string;
}

const Loader = ({ visible, message = 'Please wait...' }: LoaderProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => { }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={PRIMARY} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minWidth: 140,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
});

export default Loader;
