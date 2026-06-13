// Purpose: Define application navigation and screen routing configuration.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../screens/ProductList/ProductListScreen';
import AddProductScreen from '../screens/AddProduct/AddProductScreen';
import ProductDetailScreen from '../screens/ProductDetail/ProductDetailScreen';
import EditProductScreen from '../screens/EditProduct/EditProductScreen';
import type { RootStackParamList } from './types';
import { string } from '../constants/strings';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={string.screens.productList}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={string.screens.productList}
          component={ProductListScreen}
          options={{ title: string.navigation.inventory }}
        />
        <Stack.Screen
          name={string.screens.addProduct}
          component={AddProductScreen}
          options={{ title: string.navigation.addProduct }}
        />
        <Stack.Screen
          name={string.screens.productDetail}
          component={ProductDetailScreen}
          options={{ title: string.navigation.productDetail }}
        />
        <Stack.Screen
          name={string.screens.editProduct}
          component={EditProductScreen}
          options={{ title: string.navigation.editProduct }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
