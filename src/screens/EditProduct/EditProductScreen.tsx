// Purpose: Display edit form for a product, identified by its productId parameter.
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { db } from '../../config/firebase';
import Toast from 'react-native-simple-toast';
import { deleteProduct, updateProduct } from '../../services/inventoryService';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockThreshold: number;
  createdAt: any;
}

const CATEGORY_OPTIONS = [
  'Electronics',
  'Stationery',
  'Grocery',
  'Clothing',
  'Furniture',
  'Other',
];

const UNIT_OPTIONS = ['pcs', 'kg', 'litres', 'boxes', 'metres'];

const EditProductScreen = ({ navigation, route }: EditProductScreenProps) => {
  const { productId } = route.params;
  // Product loading state
  const [product, setProduct] = useState<Product | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Form states — pre-filled once product loads from Firestore
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [unit, setUnit] = useState('pcs');
  const [minThreshold, setMinThreshold] = useState('');
  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Dropdown visibility
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  // ADD — fetch product once on mount and pre-fill form fields
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const snap = await db
          .collection('products')
          .doc(productId)
          .get();

        if (snap.exists) {
          const data = snap.data() as Product;
          setProduct({ id: snap.id, ...data });

          // Pre-fill form with existing product data
          setProductName(data.name);
          setSku(data.sku);
          setCategory(data.category);
          setUnit(data.unit);
          setMinThreshold(data.minStockThreshold.toString());
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const validateForm = (): boolean => {
    if (!productName.trim()) {
      Toast.show('Product name is required', Toast.LONG)
      return false;
    }
    if (!minThreshold || isNaN(Number(minThreshold)) || Number(minThreshold) < 0) {
      Toast.show('Please enter a valid minimum threshold', Toast.LONG)
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    const result = await updateProduct(productId, {
      name: productName.trim(),
      category,
      unit,
      minStockThreshold: Number(minThreshold),
    });

    setIsSaving(false);

    if (result.success) {
      Toast.show('Product updated successfully', Toast.LONG)
      navigation.goBack()
    } else {
      Toast.show(result.error || 'Failed to update product', Toast.LONG);
    }
  };

  const handleDeleteProduct = () => {
    // Show confirmation before deleting
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This will also delete all transaction history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);

            const result = await deleteProduct(productId);

            setIsDeleting(false);

            if (result.success) {
              // Navigate to ProductList — goBack would go to detail of deleted product
              Toast.show('Product deleted successfully', Toast.LONG)
              navigation.navigate(string.screens.productList);
            } else {
              Toast.show('Failed to delete product', Toast.LONG)
            }
          },
        },
      ]
    );
  };
  if (pageLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#534AB7" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
        <Text style={styles.errorSub}>{error}</Text>
      </View>
    );
  }
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
              options={CATEGORY_OPTIONS}
              // onPress={() => setShowCategoryDropdown(true)}
              onSelect={setCategory}

            />
            <Dropdown
              label={string.editProduct.unitLabel}
              value={unit}
              options={UNIT_OPTIONS}

              // onPress={() => setShowUnitDropdown(true)}
              onSelect={setUnit}

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
              title={isSaving ? 'Saving...' : string.editProduct.saveChangesBtn}
              onPress={handleSaveChanges}
              disabled={isSaving || isDeleting}
            />

            <TouchableOpacity
              style={[styles.deleteButton, isDeleting && { opacity: 0.6 }]}
              onPress={handleDeleteProduct}
              activeOpacity={0.7}
              disabled={isDeleting || isSaving}
            >
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : string.editProduct.deleteProductBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProductScreen;
