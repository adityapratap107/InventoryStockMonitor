// Purpose: Define TypeScript types and interfaces for application navigation and routing.
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { string } from '../constants/strings';

export type RootStackParamList = {
  ProductList: undefined;
  AddProduct: undefined;
  ProductDetail: { productId: string };
  EditProduct: { productId: string };
};

export type ProductListScreenProps = NativeStackScreenProps<RootStackParamList, typeof string.screens.productList>;
export type AddProductScreenProps = NativeStackScreenProps<RootStackParamList, typeof string.screens.addProduct>;
export type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, typeof string.screens.productDetail>;
export type EditProductScreenProps = NativeStackScreenProps<RootStackParamList, typeof string.screens.editProduct>;
