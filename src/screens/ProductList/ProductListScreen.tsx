// Purpose: Display the list of products in the inventory with stats, filter pills, and a floating action button.
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SUCCESS_BG,
  SUCCESS_TEXT,
  WARNING_BG,
  WARNING_TEXT,
  DANGER_BG,
  DANGER_TEXT
} from '../../constants/colors';
import type { ProductListScreenProps } from '../../navigation/types';
import styles from './styles';
import { string } from '../../constants/strings';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
  category: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    quantity: 148,
    status: 'In stock',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'USB-C Cables',
    sku: 'UC-042',
    quantity: 8,
    status: 'Low stock',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'HDMI Adapter',
    sku: 'HD-017',
    quantity: 0,
    status: 'Out of stock',
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'Notebook A5',
    sku: 'NB-088',
    quantity: 312,
    status: 'In stock',
    category: 'Stationery',
  },
];

enum ProductFilter {
  All = 1,
  LowStock = 2,
  OutOfStock = 3,
}

interface FilterItem {
  id: ProductFilter;
  label: string;
}

const FILTER_PILLS: FilterItem[] = [
  { id: ProductFilter.All, label: 'All' },
  { id: ProductFilter.LowStock, label: 'Low stock' },
  { id: ProductFilter.OutOfStock, label: 'Out of stock' },
];

const ProductListScreen = ({ navigation }: ProductListScreenProps) => {
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(ProductFilter.All);

  // Filter products based on selected pill ID
  const filteredProducts = mockProducts.filter(product => {
    if (selectedFilter === ProductFilter.All) return true;
    if (selectedFilter === ProductFilter.LowStock) return product.status === 'Low stock';
    if (selectedFilter === ProductFilter.OutOfStock) return product.status === 'Out of stock';
    return false;
  });

  const getStatusColors = (status: Product['status']) => {
    switch (status) {
      case 'In stock':
        return { bg: SUCCESS_BG, text: SUCCESS_TEXT, border: 'transparent' };
      case 'Low stock':
        return { bg: WARNING_BG, text: WARNING_TEXT, border: WARNING_TEXT };
      case 'Out of stock':
        return { bg: DANGER_BG, text: DANGER_TEXT, border: DANGER_TEXT };
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const colors = getStatusColors(item.status);
    const hasStatusBorder = item.status !== 'In stock';

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          hasStatusBorder && [styles.statusBorder, { borderLeftColor: colors.border }]
        ]}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={[styles.statusTag, { backgroundColor: colors.bg }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.skuText}>SKU: {item.sku}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.quantityText}>
            <Text style={[styles.quantityNumber, item.status === 'Out of stock' && { color: DANGER_TEXT }]}>
              {item.quantity}
            </Text> pcs
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerSection}>
        {/* Screen Title & Subtitle */}
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>12 products total</Text>

        {/* Stats Cards Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: SUCCESS_TEXT }]}>9</Text>
            <Text style={styles.statLabel}>In stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: WARNING_TEXT }]}>2</Text>
            <Text style={styles.statLabel}>Low stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: DANGER_TEXT }]}>1</Text>
            <Text style={styles.statLabel}>Out of stock</Text>
          </View>
        </View>

        {/* Filter Pills Section */}
        <View style={styles.filtersContainer}>
          {FILTER_PILLS.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillSelected : styles.filterPillUnselected
                ]}
                onPress={() => setSelectedFilter(filter.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected ? styles.filterTextSelected : styles.filterTextUnselected
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(string.screens.addProduct)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductListScreen;
