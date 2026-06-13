// Purpose: Export application-wide string constants to avoid hardcoded UI and navigation text.
export const string = {
  navigation: {
    inventory: 'Inventory',
    addProduct: 'Add Product',
    productDetail: 'Product Detail',
    editProduct: 'Edit Product',
  },
  screens: {
    productList: 'ProductList',
    addProduct: 'AddProduct',
    productDetail: 'ProductDetail',
    editProduct: 'EditProduct',
    productIdLabel: 'Product ID:',
    notAvailable: 'N/A',
  },
  productListTitle: "Product List",
  addProductTitle: "Add Product",
  productDetailTitle: "Product Detail",
  editProductTitle: "Edit Product",
  editProduct: {
    warning: "Stock quantity cannot be edited here. Use stock-in / stock-out on the detail screen.",
    productDetailsSection: "Product Details",
    productNameLabel: "Product name",
    productNamePlaceholder: "Enter product name",
    skuLabel: "SKU / Product code",
    skuPlaceholder: "Enter SKU / Product code",
    categoryLabel: "Category",
    unitLabel: "Unit",
    stockSettingsSection: "Stock Settings",
    minThresholdLabel: "Min. threshold",
    minThresholdPlaceholder: "0",
    minThresholdHelper: "Items below this count will be flagged as low stock",
    saveChangesBtn: "Save changes",
    deleteProductBtn: "🗑️ Delete product",
  },
} as const;

