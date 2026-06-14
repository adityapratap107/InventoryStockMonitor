// Purpose: Display the list of products in the inventory with stats, filter pills, and a floating action button.
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator
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
import { useInventory } from '../../hooks/useInventory'

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStockThreshold: number;
  category: string;
  unit: string;
  createdAt: any;
}

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

type StockStatus = 'In stock' | 'Low stock' | 'Out of stock';

const ProductListScreen = ({ navigation }: ProductListScreenProps) => {
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(ProductFilter.All);
  const {
    products,
    loading,
    error,
    inStockCount,
    lowStockCount,
    outOfStockCount,
  } = useInventory() as {
    products: Product[];
    loading: boolean;
    error: any;
    inStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };

  const getStockStatus = (
    currentStock: number,
    minStockThreshold: number
  ): StockStatus => {
    if (currentStock === 0) return 'Out of stock';
    if (currentStock <= minStockThreshold) return 'Low stock';
    return 'In stock';
  };

  // Filter products based on selected pill ID
  const filteredProducts = products.filter(product => {
    if (selectedFilter === ProductFilter.All) return true;
    const status = getStockStatus(product.currentStock, product.minStockThreshold);
    if (selectedFilter === ProductFilter.LowStock) return status === 'Low stock';
    if (selectedFilter === ProductFilter.OutOfStock) return status === 'Out of stock';
    return false;
  });

  const getStatusColors = (status: StockStatus) => {
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
    const status = getStockStatus(item.currentStock, item.minStockThreshold);
    const colors = getStatusColors(status);
    const hasStatusBorder = status !== 'In stock';

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
            <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
          </View>
        </View>

        <Text style={styles.skuText}>SKU: {item.sku}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.quantityText}>
            <Text style={[
              styles.quantityNumber,
              status === 'Out of stock' && { color: DANGER_TEXT }
            ]}>
              {item.currentStock}        {/* ✅ correct field */}
            </Text> {item.unit}          {/* ✅ dynamic unit */}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderEmptyState = () => {
    let emoji = '📦';
    let title = 'No Products';
    let subtitle = 'Your inventory is currently empty.';

    if (selectedFilter === ProductFilter.LowStock) {
      emoji = '⚠️';
      title = 'All Good!';
      subtitle = 'No products are currently low on stock.';
    } else if (selectedFilter === ProductFilter.OutOfStock) {
      emoji = '🎉';
      title = 'Fully Stocked!';
      subtitle = 'No products are currently out of stock.';
    } else {
      emoji = '📦';
      title = 'No Products';
      subtitle = 'Your inventory is empty. Add a product to get started.';
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#534AB7" />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSub}>{error}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerSection}>
        {/* Screen Title & Subtitle */}
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>{products.length} products total</Text>
        {/* Stats Cards Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: SUCCESS_TEXT }]}>{inStockCount}</Text>
            <Text style={styles.statLabel}>In stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: WARNING_TEXT }]}>{lowStockCount}</Text>
            <Text style={styles.statLabel}>Low stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: DANGER_TEXT }]}>{outOfStockCount}</Text>
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
        ListEmptyComponent={renderEmptyState}
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
