// Purpose: Reusable header component with support for custom back navigation.
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRIMARY, BORDER, CARD_BG, TEXT_PRIMARY } from '../constants/colors';

interface HeaderProps {
  title: string;
  navigation?: any;
}

const Header = ({ title, navigation }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const canGoBack = navigation && navigation.canGoBack();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <View style={styles.chevron} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, !canGoBack && styles.titleNoBack]}>{title}</Text>
        {/* Placeholder to keep header balanced/centered when back button is shown */}
        {canGoBack && <View style={styles.rightPlaceholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: PRIMARY,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    flex: 1,
  },
  titleNoBack: {
    textAlign: 'left',
    paddingLeft: 8,
  },
  rightPlaceholder: {
    width: 28, // Matches backButton size for centering
  },
});

export default Header;
