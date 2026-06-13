import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AddProductScreenProps } from '../../navigation/types';
import { string } from '../../constants/strings';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import styles from './styles';

const AddProductScreen = ({ navigation }: AddProductScreenProps) => {
  // Local form state
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category] = useState('Electronics');
  const [unit] = useState('pcs');
  const [initialStock, setInitialStock] = useState('50');
  const [minThreshold, setMinThreshold] = useState('10');

  const handleAddProduct = () => {
    // Navigate back to the list screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Custom Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.chevron} />
            </TouchableOpacity>
            <Text style={styles.title}>{string.addProductTitle}</Text>
          </View>

          {/* Product Details Section */}
          <Text style={styles.sectionHeader}>Product Details</Text>
          <Input
            label="Product name"
            required
            value={productName}
            onChangeText={setProductName}
            placeholder="Enter product name"
          />

          <Input
            label="SKU / Product code"
            required
            value={sku}
            onChangeText={setSku}
            placeholder="Enter SKU / Product code"
          />

          <View style={styles.row}>
            <Dropdown
              label="Category"
              value={category}
              onPress={() => { }} // No-op for placeholder
            />
            <Dropdown
              label="Unit"
              value={unit}
              onPress={() => { }} // No-op for placeholder
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stock Settings Section */}
          <Text style={styles.sectionHeader}>Stock Settings</Text>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Initial stock"
                required
                value={initialStock}
                onChangeText={setInitialStock}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Min. threshold"
                required
                value={minThreshold}
                onChangeText={setMinThreshold}
                placeholder="0"
                keyboardType="numeric"
                helperText="Low-stock alert"
              />
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Add product"
              onPress={handleAddProduct}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
