import React, { useState } from 'react';
import {
  Alert,
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
import { addProduct } from '../../services/inventoryService';
import Toast from 'react-native-simple-toast';
import Loader from '../../components/Loader';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Stationery',
  'Grocery',
  'Clothing',
  'Furniture',
  'Other',
];

const UNIT_OPTIONS = ['pcs', 'kg', 'litres', 'boxes', 'metres'];

const AddProductScreen = ({ navigation }: AddProductScreenProps) => {
  // Local form state
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [unit, setUnit] = useState('pcs');
  const [initialStock, setInitialStock] = useState('10');
  const [minThreshold, setMinThreshold] = useState('5');

  // Validation errors state
  const [productNameError, setProductNameError] = useState('');
  const [skuError, setSkuError] = useState('');
  const [initialStockError, setInitialStockError] = useState('');
  const [minThresholdError, setMinThresholdError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!productName.trim()) {
      setProductNameError('Product name is required');
      isValid = false;
    } else {
      setProductNameError('');
    }

    if (!sku.trim()) {
      setSkuError('SKU is required');
      isValid = false;
    } else {
      setSkuError('');
    }

    if (!initialStock || isNaN(Number(initialStock)) || Number(initialStock) < 0) {
      setInitialStockError('Please enter a valid initial stock quantity');
      isValid = false;
    } else {
      setInitialStockError('');
    }

    if (!minThreshold || isNaN(Number(minThreshold)) || Number(minThreshold) < 0) {
      setMinThresholdError('Please enter a valid minimum threshold');
      isValid = false;
    } else {
      setMinThresholdError('');
    }

    return isValid;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const result = await addProduct({
      name: productName.trim(),
      sku: sku.trim(),
      category,
      unit,
      initialStock: Number(initialStock),
      minStockThreshold: Number(minThreshold),
    });

    setIsLoading(false);

    if (result.success) {
      Toast.show(`${productName} has been added to inventory`, Toast.LONG);
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'Failed to add product');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Loader visible={isLoading} />
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
            onChangeText={(text) => {
              setProductName(text);
              if (productNameError) setProductNameError('');
            }}
            placeholder="Enter product name"
            errorText={productNameError}
          />

          <Input
            label="SKU / Product code"
            required
            value={sku}
            onChangeText={(text) => {
              setSku(text);
              if (skuError) setSkuError('');
            }}
            placeholder="Enter SKU / Product code"
            errorText={skuError}
          />

          <View style={styles.row}>
            <Dropdown
              label="Category"
              value={category}
              options={CATEGORY_OPTIONS}
              onSelect={setCategory}
            />
            <Dropdown
              label="Unit"
              value={unit}
              options={UNIT_OPTIONS}
              onSelect={setUnit}
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
                onChangeText={(text) => {
                  setInitialStock(text);
                  if (initialStockError) setInitialStockError('');
                }}
                placeholder="0"
                keyboardType="numeric"
                errorText={initialStockError}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Min. threshold"
                required
                value={minThreshold}
                onChangeText={(text) => {
                  setMinThreshold(text);
                  if (minThresholdError) setMinThresholdError('');
                }}
                placeholder="0"
                keyboardType="numeric"
                helperText="Low-stock alert"
                errorText={minThresholdError}
              />
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={isLoading ? 'Adding...' : 'Add product'}
              onPress={handleAddProduct}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
