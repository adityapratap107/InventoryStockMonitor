// useInventory.js
// Custom hook that provides real-time product data using Firestore onSnapshot.
// Handles loading state, error state, and automatic listener cleanup on unmount.

import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { db } from '../config/firebase';

export const useInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        // onSnapshot sets up a real-time listener on the products collection
        // It fires immediately with current data, then again on every change
        const unsubscribe = db
            .collection('products')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (snapshot) => {
                    // Map each Firestore document to a plain JS object
                    const productList = snapshot.docs.map((doc) => ({
                        id: doc.id,         // Firestore document ID
                        ...doc.data(),      // All fields: name, sku, currentStock, etc.
                    }));

                    setProducts(productList);
                    setLoading(false);
                    setError(null);
                },
                (err) => {
                    // This callback fires if the listener encounters an error
                    console.error('useInventory snapshot error:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

        // CRITICAL — unsubscribe when component unmounts
        // Without this, the listener keeps running in the background
        // causing memory leaks and setState calls on unmounted components
        return () => unsubscribe();
    }, []); // Empty array = runs once on mount, cleans up on unmount


    // Derived counts — computed from live products array
    // No extra Firestore queries needed, calculated on the fly
    const inStockCount = products.filter(
        (p) => p.currentStock > p.minStockThreshold
    ).length;

    const lowStockCount = products.filter(
        (p) => p.currentStock > 0 && p.currentStock <= p.minStockThreshold
    ).length;

    const outOfStockCount = products.filter(
        (p) => p.currentStock === 0
    ).length;

    return {
        products,
        loading,
        error,
        inStockCount,
        lowStockCount,
        outOfStockCount,
    };

};


// useFilteredProducts.js
// Returns filtered product list based on active filter tab
// Low stock and out of stock use Firestore queries
// "All" uses the existing onSnapshot listener results

export const useFilteredProducts = (activeFilter) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // "all" filter is handled by useInventory hook directly
        // Only run Firestore queries for low-stock and out-of-stock
        if (activeFilter === 1) return;

        setLoading(true);

        let query;



        if (activeFilter === 2) {
            // Note: Firestore cannot compare two fields directly
            // So we fetch all and filter client-side for low stock
            // This is acceptable for small-medium inventory sizes
            query = db
                .collection('products')
                .where('currentStock', '>', 0);
        }
        if (activeFilter === 3) {
            query = db
                .collection('products')
                .where('currentStock', '==', 0);
        }

        const unsubscribe = query.onSnapshot((snapshot) => {
            let results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // For low-stock, apply the threshold comparison client-side
            if (activeFilter === 2) {
                results = results.filter(
                    (p) => p.currentStock <= p.minStockThreshold
                );
            }

            setFilteredProducts(results);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeFilter]);

    return { filteredProducts, loading };
};