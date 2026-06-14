import firestore from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

// Reference to the products collection
const productsCollection = db.collection('products');

// Creates a new product document in Firestore
// Initial stock is set here and also logged as first transaction
export const addProduct = async (productData) => {
    try {
        // Step 1 — Create the product document
        const productRef = await productsCollection.add({
            name: productData.name,
            sku: productData.sku,
            category: productData.category,
            unit: productData.unit,
            currentStock: productData.initialStock,
            minStockThreshold: productData.minStockThreshold,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        // Step 2 — Log initial stock as first transaction in subcollection
        await productRef.collection('transactions').add({
            type: 'stock-in',
            quantity: productData.initialStock,
            previousStock: 0,
            newStock: productData.initialStock,
            note: 'Initial stock added',
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, productId: productRef.id };
    } catch (error) {
        console.log("add product error:", error);
        return { success: false, error: error.message };
    }
};

// Updates product metadata only — never touches currentStock
// Stock changes must go through stockIn / stockOut transactions
export const updateProduct = async (productId, updatedData) => {
    try {
        await productsCollection.doc(productId).update({
            name: updatedData.name,
            category: updatedData.category,
            unit: updatedData.unit,
            minStockThreshold: updatedData.minStockThreshold,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        return { success: true, message: "Product added successfully." };
    } catch (error) {
        console.error('updateProduct error:', error);
        return { success: false, error: error.message };
    }
};

// Deletes a product and all its transaction history
// Firestore does NOT auto-delete subcollections, so we do it manually
export const deleteProduct = async (productId) => {
    try {
        const productRef = productsCollection.doc(productId);

        // Step 1 — Delete all transactions in the subcollection first
        const transactionsSnapshot = await productRef
            .collection('transactions')
            .get();

        const deletePromises = transactionsSnapshot.docs.map((doc) =>
            doc.ref.delete()
        );
        await Promise.all(deletePromises);

        // Step 2 — Delete the product document itself
        await productRef.delete();

        return { success: true, message: "Product deleted successfully." };
    } catch (error) {
        console.error('deleteProduct error:', error);
        return { success: false, error: error.message };
    }
};

// Increases stock using a Firestore transaction
// Atomically updates currentStock AND writes to transaction history
export const stockIn = async (productId, quantity, note = '') => {
    try {
        const productRef = productsCollection.doc(productId);
        await db.runTransaction(async (transaction) => {
            // Step 1 — Read current product state inside the transaction
            const productSnap = await transaction.get(productRef);
            if (!productSnap.exists) {
                throw new Error('Product not found');
            }
            console.log('ProductSnap_stockin', productSnap.data())
            const previousStock = productSnap.data().currentStock;
            const newStock = previousStock + quantity;

            // Step 2 — Update currentStock on product document
            transaction.update(productRef, {
                currentStock: newStock,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            })
            // Step 3 — Write history record to subcollection
            const txRef = productRef.collection('transactions').doc();
            transaction.set(txRef, {
                type: 'stock-in',
                quantity: quantity,
                previousStock: previousStock,
                newStock: newStock,
                note: note,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        })
        return { success: true };
    } catch (error) {
        console.error('stockIn error:', error);
        return { success: false, error: error.message };
    }
}

// Decreases stock using a Firestore transaction
// Validates stock won't go below zero before committing
export const stockOut = async (productId, quantity, note = '') => {
    try {
        const productRef = productsCollection.doc(productId);

        await db.runTransaction(async (transaction) => {
            // Step 1 — Read current product state inside the transaction
            const productSnap = await transaction.get(productRef);

            if (!productSnap.exists) {
                throw new Error('Product not found');
            }

            const previousStock = productSnap.data().currentStock;

            // Step 2 — Validate sufficient stock before doing anything
            if (quantity > previousStock) {
                throw new Error(
                    `Insufficient stock. Available: ${previousStock}, Requested: ${quantity}`
                );
            }

            const newStock = previousStock - quantity;

            // Step 3 — Update currentStock on product document
            transaction.update(productRef, {
                currentStock: newStock,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });

            // Step 4 — Write history record to subcollection
            const txRef = productRef.collection('transactions').doc();
            transaction.set(txRef, {
                type: 'stock-out',
                quantity: quantity,
                previousStock: previousStock,
                newStock: newStock,
                note: note,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        });

        return { success: true };
    } catch (error) {
        console.error('stockOut error:', error);
        return { success: false, error: error.message };
    }
};

// Fetches transaction history for a product from its subcollection
// Ordered by newest first
export const getTransactionHistory = async (productId) => {
    try {
        const snapshot = await productsCollection
            .doc(productId)
            .collection('transactions')
            .orderBy('createdAt', 'desc')
            .get();

        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { success: true, transactions };
    } catch (error) {
        console.error('getTransactionHistory error:', error);
        return { success: false, error: error.message };
    }
};