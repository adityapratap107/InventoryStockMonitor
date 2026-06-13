import React, { useState } from 'react';
import {
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
    unit: 'pieces'
  },
  '2': {
    name: 'USB-C Cables',
    sku: 'UC-042',
    category: 'Electronics',
    minLevel: '10 pcs',
    stock: 8,
    unit: 'pieces'
  },
  '3': {
    name: 'HDMI Adapter',
    sku: 'HD-017',
    category: 'Electronics',
    minLevel: '5 pcs',
    stock: 0,
    unit: 'pieces'
  },
  '4': {
    name: 'Notebook A5',
    sku: 'NB-088',
    category: 'Stationery',
    minLevel: '50 pcs',
    stock: 312,
    unit: 'pieces'
  }
};

interface HistoryItem {
  id: string;
  type: 'in' | 'out';
  note: string;
  quantity: number;
  time: string;
}

const ProductDetailScreen = ({ navigation, route }: ProductDetailScreenProps) => {
  // Retrieve productId parameter passed from routing, default to '1' (Wireless Mouse)
  const productId = route.params?.productId || '1';
  const productInfo = PRODUCTS_DATA[productId] || PRODUCTS_DATA['1'];

  // Local state for stock and transaction history
  const [currentStock, setCurrentStock] = useState(productInfo.stock);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', type: 'in', note: 'Restock from supplier', quantity: 50, time: 'Today, 10:23 AM' },
    { id: '2', type: 'out', note: 'Order #4821', quantity: 12, time: 'Today, 8:05 AM' },
    { id: '3', type: 'in', note: 'Initial stock added', quantity: 110, time: 'Yesterday' }
  ]);

  // Modal (Bottom Sheet) states
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  // Determine stock color and status badge info
  const getStockStatus = (stock: number, minLevelStr: string) => {
    const minVal = parseInt(minLevelStr, 10) || 20;
    if (stock === 0) {
      return {
        label: 'Out of stock',
        bg: DANGER_BG,
        text: DANGER_TEXT,
        numberColor: DANGER_TEXT
      };
    }
    if (stock <= minVal) {
      return {
        label: 'Low stock',
        bg: WARNING_BG,
        text: WARNING_TEXT,
        numberColor: WARNING_TEXT
      };
    }
    return {
      label: 'In stock',
      bg: SUCCESS_BG,
      text: SUCCESS_TEXT,
      numberColor: SUCCESS_TEXT
    };
  };

  const statusInfo = getStockStatus(currentStock, productInfo.minLevel);

  const openTransactionModal = (type: 'in' | 'out') => {
    setTransactionType(type);
    setQuantity('');
    setNote('');
    setModalVisible(true);
  };

  const handleTransactionSubmit = () => {
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) return;

    // Calculate new stock
    let newStock = currentStock;
    if (transactionType === 'in') {
      newStock += qtyNum;
    } else {
      newStock = Math.max(0, currentStock - qtyNum);
    }

    // Add transaction to history
    const newTransaction: HistoryItem = {
      id: Date.now().toString(),
      type: transactionType,
      note: note.trim() || (transactionType === 'in' ? 'Manual stock in' : 'Manual stock out'),
      quantity: qtyNum,
      time: 'Just now'
    };

    setCurrentStock(newStock);
    setHistory([newTransaction, ...history]);
    setModalVisible(false);
  };

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
              {productInfo.name}
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
            {currentStock}
          </Text>
          <Text style={styles.stockCardUnit}>{productInfo.unit}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.text }]} />
            <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
          </View>
        </View>

        {/* Metrics Container (SKU, Category, Min. level) */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>SKU</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{productInfo.sku}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Category</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{productInfo.category}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Min. level</Text>
            <Text style={styles.metricValue} numberOfLines={1}>{productInfo.minLevel}</Text>
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
          {history.map((item, index) => {
            const isIn = item.type === 'in';
            return (
              <View key={item.id}>
                {index > 0 && <View style={styles.historyDivider} />}
                <View style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <View style={[
                      styles.historyIconContainer,
                      isIn ? styles.historyIconIn : styles.historyIconOut
                    ]}>
                      <Text style={[styles.historyIconText, isIn ? styles.stockInText : styles.stockOutText]}>
                        {isIn ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyType}>{isIn ? 'Stock in' : 'Stock out'}</Text>
                      <Text style={styles.historyNote} numberOfLines={1}>{item.note}</Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={[
                      styles.historyQuantity,
                      isIn ? styles.historyQuantityIn : styles.historyQuantityOut
                    ]}>
                      {isIn ? '+' : '-'}{item.quantity}
                    </Text>
                    <Text style={styles.historyTime}>{item.time}</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
                  title="Confirm"
                  onPress={handleTransactionSubmit}
                  disabled={!quantity || isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) <= 0}
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
