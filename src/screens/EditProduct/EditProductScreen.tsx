// Purpose: Display edit form for a product, identified by its productId parameter.
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
import type { EditProductScreenProps } from '../../navigation/types';
import { string } from '../../constants/strings';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import styles from './styles';

interface ProductDetails {
  name: string;
  sku: string;
  category: string;
  minLevel: string;
  stock: number;
  unit: string;
}

const PRODUCTS_DATA: Record<string, ProductDetails> = {
  '1': {
    name: 'Wireless Mouse',
    sku: 'WM-001',
    category: 'Electronics',
    minLevel: '20 pcs',
    stock: 148,
    unit: 'pcs'
  },
  '2': {
    name: 'USB-C Cables',
    sku: 'UC-042',
    category: 'Electronics',
    minLevel: '10 pcs',
    stock: 8,
    unit: 'pcs'
  },
  '3': {
    name: 'HDMI Adapter',
    sku: 'HD-017',
    category: 'Electronics',
    minLevel: '5 pcs',
    stock: 0,
    unit: 'pcs'
  },
  '4': {
    name: 'Notebook A5',
    sku: 'NB-088',
    category: 'Stationery',
    minLevel: '50 pcs',
    stock: 312,
    unit: 'pcs'
  }
};

const EditProductScreen = ({ navigation, route }: EditProductScreenProps) => {
  // Retrieve productId parameter passed from routing, default to '1'
  const productId = route.params?.productId || '1';
  const productInfo = PRODUCTS_DATA[productId] || PRODUCTS_DATA['1'];

  // Form states pre-filled with lookup product details
  const [productName, setProductName] = useState(productInfo.name);
  const [sku] = useState(productInfo.sku);
  const [category] = useState(productInfo.category);
  const [unit] = useState(productInfo.unit === 'pieces' ? 'pcs' : productInfo.unit);
  const [minThreshold, setMinThreshold] = useState(parseInt(productInfo.minLevel, 10).toString());

  const handleSaveChanges = () => {
    // Return back to product details screen after saving
    navigation.goBack();
  };

  const handleDeleteProduct = () => {
    // Navigate back to the home/productList screen after deletion
    navigation.navigate(string.screens.productList);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Custom Header Row with inline back button */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.chevron} />
            </TouchableOpacity>
            <Text style={styles.title}>{string.editProductTitle}</Text>
          </View>

          {/* Warning Banner explaining that stock cannot be modified here */}
          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>ℹ️</Text>
            <Text style={styles.warningText}>{string.editProduct.warning}</Text>
          </View>

          {/* Product Details Section */}
          <Text style={styles.sectionHeader}>{string.editProduct.productDetailsSection}</Text>
          <Input
            label={string.editProduct.productNameLabel}
            required
            value={productName}
            onChangeText={setProductName}
            placeholder={string.editProduct.productNamePlaceholder}
          />

          <Input
            label={string.editProduct.skuLabel}
            required
            value={sku}
            onChangeText={() => { }}
            placeholder={string.editProduct.skuPlaceholder}
            editable={false}
          />

          <View style={styles.row}>
            <Dropdown
              label={string.editProduct.categoryLabel}
              value={category}
              onPress={() => { }}
            />
            <Dropdown
              label={string.editProduct.unitLabel}
              value={unit}
              onPress={() => { }}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Stock Settings Section */}
          <Text style={styles.sectionHeader}>{string.editProduct.stockSettingsSection}</Text>
          <Input
            label={string.editProduct.minThresholdLabel}
            required
            value={minThreshold}
            onChangeText={setMinThreshold}
            placeholder={string.editProduct.minThresholdPlaceholder}
            keyboardType="numeric"
            helperText={string.editProduct.minThresholdHelper}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={string.editProduct.saveChangesBtn}
              onPress={handleSaveChanges}
            />

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteProduct}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonText}>{string.editProduct.deleteProductBtn}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProductScreen;
