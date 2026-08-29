/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'kirana_app_language'

const translations = {
  en: {
    appName: 'Kirana Store Admin',
    language: 'Language',
    loginBadge: 'Kirana Store Admin',
    loginTitle: 'Login',
    loginDescription: 'Sign in to manage your store inventory.',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'admin@example.com',
    passwordPlaceholder: 'Enter your password',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    loginFailed: 'Login failed',
    loginSuccess: 'Login successful',
    registerPrompt: "Don't have an account?",
    registerLink: 'Register here',
    alreadyHaveAccount: 'Already have an account?',
    registerBadge: 'Create Admin Account',
    registerTitle: 'Register',
    registerDescription: 'Create your store owner account.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Store Owner',
    registerButton: 'Register',
    registering: 'Registering...',
    registrationFailed: 'Registration failed',
    registrationSuccess: 'Registration successful',
    dashboardTitle: 'Inventory Dashboard',
    dashboardDescription: 'Manage products, pricing, stock and status from one simple screen.',
    addProduct: 'Add Product',
    logout: 'Logout',
    loggedInAs: 'Logged in as',
    totalProducts: 'Total Products',
    available: 'Available',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    searchFilter: 'Search & Filter',
    searchPlaceholder: 'Search by name, brand or unit',
    allStatus: 'All Status',
    availableStatus: 'Available',
    lowStockStatus: 'Low Stock',
    outOfStockStatus: 'Out of Stock',
    applyFilters: 'Apply Filters',
    reset: 'Reset',
    products: 'Products',
    shown: 'shown',
    loadingProducts: 'Loading products...',
    sessionExpired: 'Session expired. Please login again.',
    somethingWentWrong: 'Something went wrong',
    noProductsFound: 'No products found.',
    productForm: 'Product Form',
    editProduct: 'Edit Product',
    productDetails: 'Product Details',
    backToDashboard: 'Back to Dashboard',
    productInfo: 'Product Info',
    stockInfo: 'Stock Info',
    close: 'Close',
    productName: 'Product name',
    productNameEn: 'Product name in English',
    productNameHi: 'Hindi name (optional)',
    productNameMr: 'Marathi name (optional)',
    brandOptional: 'Brand (optional)',
    unit: 'Unit (kg, piece, litre)',
    purchasePrice: 'Purchase price',
    sellingPrice: 'Selling price',
    sellingPrice50g: 'Selling price for 50g',
    sellingPrice250g: 'Selling price for 250g',
    currentStock: 'Current stock quantity',
    minimumStock: 'Minimum stock quantity',
    productImage: 'Product image',
    noImageSelected: 'No image selected',
    englishName: 'English name',
    hindiName: 'Hindi name',
    marathiName: 'Marathi name',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    openProductDetails: 'Open product details',
    updateProduct: 'Update Product',
    addProductButton: 'Add Product',
    saving: 'Saving...',
    productAdded: 'Product added successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    stockUpdated: 'Stock updated successfully',
  },
  hi: {
    appName: 'किराना स्टोर एडमिन',
    language: 'भाषा',
    loginBadge: 'किराना स्टोर एडमिन',
    loginTitle: 'लॉगिन',
    loginDescription: 'अपने स्टोर का प्रबंधन करने के लिए साइन इन करें।',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailPlaceholder: 'admin@example.com',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    loginButton: 'लॉगिन',
    loggingIn: 'लॉगिन हो रहा है...',
    loginFailed: 'लॉगिन विफल',
    loginSuccess: 'लॉगिन सफल',
    registerPrompt: 'क्या आपका खाता नहीं है?',
    registerLink: 'यहां रजिस्टर करें',
    alreadyHaveAccount: 'क्या आपके पास पहले से खाता है?',
    registerBadge: 'एडमिन खाता बनाएं',
    registerTitle: 'रजिस्टर',
    registerDescription: 'अपना स्टोर मालिक खाता बनाएं।',
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'स्टोर मालिक',
    registerButton: 'रजिस्टर',
    registering: 'रजिस्टर हो रहा है...',
    registrationFailed: 'रजिस्ट्रेशन विफल',
    registrationSuccess: 'रजिस्ट्रेशन सफल',
    dashboardTitle: 'इन्वेंटरी डैशबोर्ड',
    dashboardDescription: 'एक ही स्क्रीन से उत्पाद, कीमत, स्टॉक और स्थिति प्रबंधित करें।',
    addProduct: 'उत्पाद जोड़ें',
    logout: 'लॉगआउट',
    loggedInAs: 'के रूप में लॉग इन',
    totalProducts: 'कुल उत्पाद',
    available: 'उपलब्ध',
    lowStock: 'कम स्टॉक',
    outOfStock: 'स्टॉक खत्म',
    searchFilter: 'खोज और फ़िल्टर',
    searchPlaceholder: 'नाम, ब्रांड या यूनिट से खोजें',
    allStatus: 'सभी स्थिति',
    availableStatus: 'उपलब्ध',
    lowStockStatus: 'कम स्टॉक',
    outOfStockStatus: 'स्टॉक खत्म',
    applyFilters: 'फ़िल्टर लागू करें',
    reset: 'रीसेट',
    products: 'उत्पाद',
    shown: 'दिखाए गए',
    loadingProducts: 'उत्पाद लोड हो रहे हैं...',
    sessionExpired: 'सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।',
    somethingWentWrong: 'कुछ गलत हो गया',
    noProductsFound: 'कोई उत्पाद नहीं मिला।',
    productForm: 'उत्पाद फ़ॉर्म',
    editProduct: 'उत्पाद संपादित करें',
    productDetails: 'उत्पाद विवरण',
    backToDashboard: 'डैशबोर्ड पर वापस',
    productInfo: 'उत्पाद जानकारी',
    stockInfo: 'स्टॉक जानकारी',
    close: 'बंद करें',
    productName: 'उत्पाद का नाम',
    productNameEn: 'अंग्रेज़ी में उत्पाद का नाम',
    productNameHi: 'हिंदी नाम (वैकल्पिक)',
    productNameMr: 'मराठी नाम (वैकल्पिक)',
    brandOptional: 'ब्रांड (वैकल्पिक)',
    unit: 'यूनिट (किलो, पीस, लीटर)',
    purchasePrice: 'खरीद मूल्य',
    sellingPrice: 'बिक्री मूल्य',
    sellingPrice50g: '50 ग्राम का बिक्री मूल्य',
    sellingPrice250g: '250 ग्राम का बिक्री मूल्य',
    currentStock: 'वर्तमान स्टॉक मात्रा',
    minimumStock: 'न्यूनतम स्टॉक मात्रा',
    productImage: 'उत्पाद छवि',
    noImageSelected: 'कोई छवि नहीं चुनी गई',
    englishName: 'अंग्रेज़ी नाम',
    hindiName: 'हिंदी नाम',
    marathiName: 'मराठी नाम',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    view: 'देखें',
    openProductDetails: 'उत्पाद विवरण खोलें',
    updateProduct: 'उत्पाद अपडेट करें',
    addProductButton: 'उत्पाद जोड़ें',
    saving: 'सहेजा जा रहा है...',
    productAdded: 'उत्पाद सफलतापूर्वक जोड़ा गया',
    productUpdated: 'उत्पाद सफलतापूर्वक अपडेट हुआ',
    productDeleted: 'उत्पाद सफलतापूर्वक हटाया गया',
    stockUpdated: 'स्टॉक सफलतापूर्वक अपडेट हुआ',
  },
  mr: {
    appName: 'किराणा स्टोअर अ‍ॅडमिन',
    language: 'भाषा',
    loginBadge: 'किराणा स्टोअर अ‍ॅडमिन',
    loginTitle: 'लॉगिन',
    loginDescription: 'तुमच्या दुकानाचे व्यवस्थापन करण्यासाठी साइन इन करा.',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailPlaceholder: 'admin@example.com',
    passwordPlaceholder: 'तुमचा पासवर्ड टाका',
    loginButton: 'लॉगिन',
    loggingIn: 'लॉगिन होत आहे...',
    loginFailed: 'लॉगिन अयशस्वी',
    loginSuccess: 'लॉगिन यशस्वी',
    registerPrompt: 'तुमच्याकडे खाते नाही का?',
    registerLink: 'इथे नोंदणी करा',
    alreadyHaveAccount: 'तुमच्याकडे आधीच खाते आहे का?',
    registerBadge: 'अ‍ॅडमिन खाते तयार करा',
    registerTitle: 'नोंदणी',
    registerDescription: 'तुमचे दुकान मालक खाते तयार करा.',
    fullName: 'पूर्ण नाव',
    fullNamePlaceholder: 'दुकान मालक',
    registerButton: 'नोंदणी',
    registering: 'नोंदणी होत आहे...',
    registrationFailed: 'नोंदणी अयशस्वी',
    registrationSuccess: 'नोंदणी यशस्वी',
    dashboardTitle: 'इन्व्हेंटरी डॅशबोर्ड',
    dashboardDescription: 'एका स्क्रीनवरून उत्पादने, किंमत, स्टॉक आणि स्थिती व्यवस्थापित करा.',
    addProduct: 'उत्पादन जोडा',
    logout: 'लॉगआउट',
    loggedInAs: 'म्हणून लॉग इन',
    totalProducts: 'एकूण उत्पादने',
    available: 'उपलब्ध',
    lowStock: 'कमी स्टॉक',
    outOfStock: 'स्टॉक संपला',
    searchFilter: 'शोध आणि फिल्टर',
    searchPlaceholder: 'नाव, ब्रँड किंवा युनिटने शोधा',
    allStatus: 'सर्व स्थिती',
    availableStatus: 'उपलब्ध',
    lowStockStatus: 'कमी स्टॉक',
    outOfStockStatus: 'स्टॉक संपला',
    applyFilters: 'फिल्टर लागू करा',
    reset: 'रीसेट',
    products: 'उत्पादने',
    shown: 'दाखवलेले',
    loadingProducts: 'उत्पादने लोड होत आहेत...',
    sessionExpired: 'सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.',
    somethingWentWrong: 'काहीतरी चुकले',
    noProductsFound: 'कोणतेही उत्पादन सापडले नाही.',
    productForm: 'उत्पादन फॉर्म',
    editProduct: 'उत्पादन संपादित करा',
    productDetails: 'उत्पादन तपशील',
    backToDashboard: 'डॅशबोर्डकडे परत',
    productInfo: 'उत्पादन माहिती',
    stockInfo: 'स्टॉक माहिती',
    close: 'बंद करा',
    productName: 'उत्पादनाचे नाव',
    productNameEn: 'इंग्रजीतील उत्पादनाचे नाव',
    productNameHi: 'हिंदी नाव (ऐच्छिक)',
    productNameMr: 'मराठी नाव (ऐच्छिक)',
    brandOptional: 'ब्रँड (ऐच्छिक)',
    unit: 'युनिट (किलो, पीस, लिटर)',
    purchasePrice: 'खरेदी किंमत',
    sellingPrice: 'विक्री किंमत',
    sellingPrice50g: '50 ग्रॅमची विक्री किंमत',
    sellingPrice250g: '250 ग्रॅमची विक्री किंमत',
    currentStock: 'सध्याचा स्टॉक',
    minimumStock: 'किमान स्टॉक',
    productImage: 'उत्पादन प्रतिमा',
    noImageSelected: 'कोणतीही प्रतिमा निवडलेली नाही',
    englishName: 'इंग्रजी नाव',
    hindiName: 'हिंदी नाव',
    marathiName: 'मराठी नाव',
    edit: 'संपादित करा',
    delete: 'हटवा',
    view: 'पहा',
    openProductDetails: 'उत्पादन तपशील उघडा',
    updateProduct: 'उत्पादन अपडेट करा',
    addProductButton: 'उत्पादन जोडा',
    saving: 'जतन करत आहे...',
    productAdded: 'उत्पादन यशस्वीरित्या जोडले गेले',
    productUpdated: 'उत्पादन यशस्वीरित्या अपडेट झाले',
    productDeleted: 'उत्पादन यशस्वीरित्या हटवले गेले',
    stockUpdated: 'स्टॉक यशस्वीरित्या अपडेट झाला',
  },
}

const productNameTranslations = {
  jeera: { hi: 'जीरा', mr: 'जिरे' },
  cumin: { hi: 'जीरा', mr: 'जिरे' },
  coriander: { hi: 'धनिया', mr: 'धणे' },
  turmeric: { hi: 'हल्दी', mr: 'हळद' },
  sugar: { hi: 'चीनी', mr: 'साखर' },
  salt: { hi: 'नमक', mr: 'मीठ' },
  rice: { hi: 'चावल', mr: 'तांदूळ' },
  wheat: { hi: 'गेहूं', mr: 'गहू' },
  atta: { hi: 'आटा', mr: 'पीठ' },
  flour: { hi: 'आटा', mr: 'पीठ' },
  tea: { hi: 'चाय', mr: 'चहा' },
  milk: { hi: 'दूध', mr: 'दूध' },
  oil: { hi: 'तेल', mr: 'तेल' },
  ghee: { hi: 'घी', mr: 'तूप' },
  chili: { hi: 'मिर्च', mr: 'मिरची' },
  chilli: { hi: 'मिर्च', mr: 'मिरची' },
  pepper: { hi: 'काली मिर्च', mr: 'मिरी' },
  saltine: { hi: 'नमक', mr: 'मीठ' },
  poha: { hi: 'पोहा', mr: 'पोहा' },
  besan: { hi: 'बेसन', mr: 'बेसन' },
  jaggery: { hi: 'गुड़', mr: 'गूळ' },
  dal: { hi: 'दाल', mr: 'डाळ' },
  'moong dal': { hi: 'मूंग दाल', mr: 'मुगडाळ' },
  'toor dal': { hi: 'अरहर दाल', mr: 'तूर डाळ' },
  'chana dal': { hi: 'चना दाल', mr: 'हरभरा डाळ' },
  'urad dal': { hi: 'उड़द दाल', mr: 'उडीद डाळ' },
}

const normalizeProductKey = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

export function translateProductName(name, language) {
  if (!name) {
    return ''
  }

  if (language === 'en') {
    return name
  }

  const normalized = normalizeProductKey(name)
  const translated = productNameTranslations[normalized]

  if (!translated) {
    return name
  }

  return translated[language] || name
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage)
  }

  const value = useMemo(() => {
    const t = (key) => translations[language]?.[key] || translations.en[key] || key

    return {
      language,
      setLanguage,
      t,
      languages: [
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'हिन्दी' },
        { value: 'mr', label: 'मराठी' },
      ],
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
