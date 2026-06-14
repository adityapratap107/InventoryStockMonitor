import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProductDetailScreenProps } from '../../navigation/types';
import {
  SUCCESS_BG,
  SUCCESS_TEXT,
  WARNING_BG,
  WARNING_TEXT,
  DANGER_BG,
  DANGER_TEXT
} from '../../constants/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './styles';
import { db } from '../../config/firebase';
import { getTransactionHistory, stockIn, stockOut } from '../../services/inventoryService';
import Toast from 'react-native-simple-toast';


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

interface Transaction {
  id: string;
  type: 'stock-in' | 'stock-out';
  quantity: number;
  previousStock: number;
  newStock: number;
  note: string;
  createdAt: any;
}

// ADD this helper above the component
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return '—';

  // Firestore serverTimestamp returns a Timestamp object
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `Today, ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
  return 'Yesterday';
};

const ProductDetailScreen = ({ navigation, route }: ProductDetailScreenProps) => {
  const { productId } = route.params;
  console.log('productId:', productId);
  const [product, setProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal (Bottom Sheet) states
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ADD this useEffect for real-time product updates
  // When stock changes via transaction, this updates instantly
  useEffect(() => {
    if (!productId) return;

    const unsubscribe = db
      .collection('products')
      .doc(productId)
      .onSnapshot(
        (snap) => {
          if (snap.exists) {
            setProduct({ id: snap.id, ...snap.data() } as Product);
          } else {
            setError('Product not found');
          }
          setProductLoading(false);
        },
        (err) => {
          console.error('Product listener error:', err);
          setError(err.message);
          setProductLoading(false);
        }
      );

    return () => unsubscribe();
  }, [productId]);

  // ADD this useEffect for transaction history
  // Fetches subcollection ordered by newest first
  useEffect(() => {
    if (!productId) return;

    const fetchHistory = async () => {
      setHistoryLoading(true);
      const result = await getTransactionHistory(productId);
      if (result.success) {
        setHistory(result.transactions as Transaction[]);
      }
      setHistoryLoading(false);
    };

    fetchHistory();
  }, [productId]);

  // Determine stock color and status badge info
  const getStockStatus = (currentStock: number, minStockThreshold: number) => {
    if (currentStock === 0) {
      return { label: 'Out of stock', bg: DANGER_BG, text: DANGER_TEXT, numberColor: DANGER_TEXT };
    }
    if (currentStock <= minStockThreshold) {
      return { label: 'Low stock', bg: WARNING_BG, text: WARNING_TEXT, numberColor: WARNING_TEXT };
    }
    return { label: 'In stock', bg: SUCCESS_BG, text: SUCCESS_TEXT, numberColor: SUCCESS_TEXT };
  };

  const statusInfo = product
    ? getStockStatus(product.currentStock, product.minStockThreshold)
    : getStockStatus(0, 0);

  const openTransactionModal = (type: 'in' | 'out') => {
    setTransactionType(type);
    setQuantity('');
    setNote('');
    setModalVisible(true);
  };

  const handleTransactionSubmit = async () => {
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) return;

    setIsSubmitting(true);

    const result = transactionType === 'in'
      ? await stockIn(productId, qtyNum, note.trim())
      : await stockOut(productId, qtyNum, note.trim());

    setIsSubmitting(false);

    if (result.success) {
      // Refresh history after successful transaction
      const historyResult = await getTransactionHistory(productId);
      if (historyResult.success) {
        setHistory(historyResult.transactions as Transaction[]);
      }
      setModalVisible(false);
      setQuantity('');
      setNote('');
    } else {
      // Show error — most likely insufficient stock
      Toast.show(result.error || 'Something went wrong', Toast.LONG)
    }
  };
  if (productLoading) {
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Custom Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <View style={styles.chevron} />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {product.name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editLink}
            onPress={() => navigation.navigate('EditProduct', { productId })}
            activeOpacity={0.6}
          >
            <Text style={styles.editIconText}>✏️</Text>
            <Text style={styles.editLinkText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Current Stock Main Card */}
        <View style={styles.stockCard}>
          <Text style={styles.stockCardLabel}>Current stock</Text>
          <Text style={[styles.stockCardNumber, { color: statusInfo.numberColor }]}>
            {product.currentStock}
          </Text>
          <Text style={styles.stockCardUnit}>{product.unit}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.text }]} />
            <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
          </View>
        </View>

        {/* Metrics Container (SKU, Category, Min. level) */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>SKU</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{product.sku}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Category</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{product.category}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Min. level</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{`${product.minStockThreshold} ${product.unit}`}</Text>
          </View>
        </View>

        {/* Outlined Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.stockInButton]}
            onPress={() => openTransactionModal('in')}
            activeOpacity={0.7}
          >
            <Text style={[styles.arrowIcon, styles.stockInText]}>↓</Text>
            <Text style={[styles.actionButtonText, styles.stockInText]}>Stock in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.stockOutButton]}
            onPress={() => openTransactionModal('out')}
            activeOpacity={0.7}
          >
            <Text style={[styles.arrowIcon, styles.stockOutText]}>↑</Text>
            <Text style={[styles.actionButtonText, styles.stockOutText]}>Stock out</Text>
          </TouchableOpacity>
        </View>

        {/* Movement History Section */}
        <Text style={styles.historyTitle}>Movement history</Text>
        <View style={styles.historyList}>
          {historyLoading ? (
            <ActivityIndicator size="small" color="#534AB7" />
          ) : history.length === 0 ? (
            <Text style={styles.emptyHistory}>No transactions yet</Text>
          ) : (
            history.map((item, index) => {
              const isIn = item.type === 'stock-in';   // ✅ matches Firestore value
              return (
                <View key={item.id}>
                  {index > 0 && <View style={styles.historyDivider} />}
                  <View style={styles.historyItem}>
                    <View style={styles.historyLeft}>
                      <View style={[
                        styles.historyIconContainer,
                        isIn ? styles.historyIconIn : styles.historyIconOut
                      ]}>
                        <Text style={[
                          styles.historyIconText,
                          isIn ? styles.stockInText : styles.stockOutText
                        ]}>
                          {isIn ? '↓' : '↑'}
                        </Text>
                      </View>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyType}>
                          {isIn ? 'Stock in' : 'Stock out'}
                        </Text>
                        <Text style={styles.historyNote} numberOfLines={1}>
                          {item.note || '—'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={[
                        styles.historyQuantity,
                        isIn ? styles.historyQuantityIn : styles.historyQuantityOut
                      ]}>
                        {isIn ? '+' : '-'}{item.quantity}
                      </Text>
                      <Text style={styles.historyTime}>
                        {formatTimestamp(item.createdAt)}   {/* ✅ real timestamp */}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Slide-Up Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {transactionType === 'in' ? 'Stock In' : 'Stock Out'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {transactionType === 'in'
                  ? 'Add items to the current inventory stock.'
                  : 'Remove items from the current inventory stock.'
                }
              </Text>
            </View>

            <Input
              label="Quantity"
              required
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <Input
              label="Note"
              placeholder="e.g. Supplier delivery, damage, sale, etc."
              value={note}
              onChangeText={setNote}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <View style={styles.submitButtonWrapper}>
                <Button
                  title={isSubmitting ? 'Saving...' : 'Confirm'}
                  onPress={handleTransactionSubmit}
                  disabled={
                    isSubmitting ||
                    !quantity ||
                    isNaN(parseInt(quantity, 10)) ||
                    parseInt(quantity, 10) <= 0
                  }
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
