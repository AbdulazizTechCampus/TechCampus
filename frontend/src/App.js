import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// User Types in Arabic
const USER_TYPES = {
  visitor: 'زائر',
  property_seeker: 'طالب عقار',
  property_owner: 'مالك عقار',
  broker_individual: 'وسيط عقاري - فرد',
  broker_company: 'وسيط عقاري - منشأة',
  photographer: 'مصور عقارات',
  admin: 'مدير الموقع'
};

// Property Categories
const PROPERTY_CATEGORIES = {
  residential: 'سكني',
  commercial: 'تجاري',
  industrial: 'صناعي',
  medical: 'صحي',
  educational: 'تعليمي',
  agricultural: 'زراعي'
};

const PROPERTY_TYPES = {
  land: 'أرض',
  room: 'غرفة',
  studio: 'استوديو',
  apartment: 'شقة',
  floor: 'دور',
  villa: 'فيلا',
  building: 'مبنى',
  tower: 'برج',
  showroom: 'معرض',
  store: 'متجر',
  office: 'مكتب',
  rest_house: 'استراحة',
  chalet: 'شاليه',
  farm: 'مزرعة',
  hospital: 'مستشفى',
  clinic: 'عيادة',
  workshop: 'ورشة',
  factory: 'مصنع',
  warehouse: 'مستودع',
  school: 'مدرسة',
  hotel: 'فندق',
  gas_station: 'محطة'
};

const REGIONS_AND_CITIES = {
  central: {
    name: 'المنطقة الوسطى',
    cities: ['الرياض', 'الخرج', 'الدوادمي', 'المجمعة', 'الزلفي', 'شقراء', 'عفيف', 'القويعية', 'وادي الدواسر', 'الحوطة والحريق', 'حريملاء', 'الدرعية', 'المزاحمية']
  },
  eastern: {
    name: 'المنطقة الشرقية',
    cities: ['الدمام', 'الخبر', 'الأحساء', 'القطيف', 'سيهات', 'الجبيل', 'رأس تنورة', 'النعيرية', 'الخفجي', 'حفر الباطن', 'بقيق', 'العديد', 'قرية العليا', 'تاروت', 'صفوى']
  },
  western: {
    name: 'المنطقة الغربية',
    cities: ['جدة', 'مكة المكرمة', 'المدينة المنورة', 'الطائف', 'ينبع', 'رابغ', 'الليث', 'القنفذة', 'جازان', 'صبيا', 'أبها', 'خميس مشيط', 'الباحة', 'بيشة', 'نجران']
  },
  northern: {
    name: 'المنطقة الشمالية',
    cities: ['تبوك', 'عرعر', 'سكاكا', 'طريف', 'القريات', 'رفحاء', 'حائل', 'بريدة', 'عنيزة', 'الرس', 'المذنب', 'البكيرية', 'الزلفي', 'الغاط']
  },
  southern: {
    name: 'المنطقة الجنوبية',
    cities: ['أبها', 'خميس مشيط', 'بيشة', 'نجران', 'جازان', 'صبيا', 'الباحة', 'المندق', 'القنفذة', 'محايل عسير', 'سراة عبيدة', 'تنومة', 'النماص', 'رجال ألمع', 'ظهران الجنوب']
  }
};

const REGIONS = {
  central: 'الوسطى',
  eastern: 'الشرقية', 
  northern: 'الشمالية',
  western: 'الغربية',
  southern: 'الجنوبية'
};

// Sample Properties Data
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: 'فيلا فاخرة مع مسبح في الرياض',
    price: '2,500,000',
    location: 'حي الملقا، الرياض',
    area: '450',
    bedrooms: 5,
    bathrooms: 4,
    type: 'villa',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlfGVufDB8fHx8MTc1NTI2OTg1NHww&ixlib=rb-4.1.0&q=85',
    status: 'للبيع',
    featured: true,
    views: 1250,
    agent: {
      name: 'أحمد محمد العبدالله',
      phone: '+966501234567',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent1'
    }
  },
  {
    id: 2,
    title: 'شقة حديثة في برج سكني راقي',
    price: '850,000',
    location: 'حي الملز، الرياض',
    area: '180',
    bedrooms: 3,
    bathrooms: 2,
    type: 'apartment',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlfGVufDB8fHx8MTc1NTI2OTg1NHww&ixlib=rb-4.1.0&q=85',
    status: 'للإيجار',
    featured: true,
    views: 890,
    agent: {
      name: 'فاطمة سالم الخالد',
      phone: '+966502345678',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent2'
    }
  },
  {
    id: 3,
    title: 'مجمع تجاري في موقع استراتيجي',
    price: '5,200,000',
    location: 'طريق الملك فهد، جدة',
    area: '1200',
    type: 'building',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1621831337128-35676ca30868?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmd8ZW58MHx8fHwxNzU1Mzc1MDEyfDA&ixlib=rb-4.1.0&q=85',
    status: 'للبيع',
    featured: true,
    views: 2150,
    agent: {
      name: 'خالد عبدالرحمن النمر',
      phone: '+966503456789',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent3'
    }
  },
  {
    id: 4,
    title: 'فيلا عصرية مع حديقة واسعة',
    price: '1,800,000',
    location: 'حي النرجس، الرياض',
    area: '380',
    bedrooms: 4,
    bathrooms: 3,
    type: 'villa',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYXxlbnwwfHx8fDE3NTUzNzUwMDd8MA&ixlib=rb-4.1.0&q=85',
    status: 'للبيع',
    featured: false,
    views: 765,
    agent: {
      name: 'سارة أحمد الفريح',
      phone: '+966504567890',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent4'
    }
  },
  {
    id: 5,
    title: 'مكاتب إدارية في برج حديث',
    price: '12,000',
    location: 'حي العليا، الرياض',
    area: '250',
    type: 'office',
    category: 'commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxjb21tZXJjaWFsJTIwYnVpbGRpbmd8ZW58MHx8fHwxNzU1Mzc1MDEyfDA&ixlib=rb-4.1.0&q=85',
    status: 'للإيجار',
    featured: false,
    views: 420,
    agent: {
      name: 'محمد علي السويد',
      phone: '+966505678901',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent5'
    }
  },
  {
    id: 6,
    title: 'قصر فخم مع إطلالة مميزة',
    price: '8,500,000',
    location: 'حي الياسمين، الرياض',
    area: '800',
    bedrooms: 8,
    bathrooms: 6,
    type: 'villa',
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjByZWFsJTIwZXN0YXRlfGVufDB8fHx8MTc1NTI2OTg1NHww&ixlib=rb-4.1.0&q=85',
    status: 'للبيع',
    featured: true,
    views: 3420,
    agent: {
      name: 'عبدالله راشد القحطاني',
      phone: '+966506789012',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent6'
    }
  }
];

// Sample Agents Data
const SAMPLE_AGENTS = [
  {
    id: 1,
    name: 'أحمد محمد العبدالله',
    license: 'FAL-12345',
    region: 'الرياض',
    followers: 1250,
    properties: 45,
    requests: 12,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent1',
    rating: 4.8
  },
  {
    id: 2,
    name: 'فاطمة سالم الخالد',
    license: 'FAL-23456',
    region: 'جدة',
    followers: 890,
    properties: 32,
    requests: 8,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent2',
    rating: 4.9
  },
  {
    id: 3,
    name: 'خالد عبدالرحمن النمر',
    license: 'FAL-34567',
    region: 'الدمام',
    followers: 2150,
    properties: 67,
    requests: 25,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent3',
    rating: 4.7
  }
];

// Header Component
const Header = ({ onLoginClick, currentUser, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏠</div>
            <div className="brand-info">
              <h1 className="site-title">عنوان</h1>
              <p className="site-subtitle">منصة الوساطة والتسويق العقاري</p>
            </div>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li className="nav-item dropdown">
                <a href="#properties" className="nav-link">العقارات</a>
                <div className="dropdown-content">
                  <a href="#add-property">إضافة عقار</a>
                  <a href="#property-request">طلب عقار</a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#brokers" className="nav-link">الوساطة</a>
                <div className="dropdown-content">
                  <a href="#brokers-list">الوسطاء</a>
                  <a href="#mediation-contract">عقد وساطة</a>
                  <a href="#marketing-contract">عقد تسويق</a>
                </div>
              </li>
              <li><a href="#photography" className="nav-link">التصوير</a></li>
              <li><a href="#pricing" className="nav-link">الأسعار والباقات</a></li>
              <li><a href="#policies" className="nav-link">السياسات والشروط</a></li>
              <li><a href="#support" className="nav-link">الدعم</a></li>
              <li><a href="#language" className="nav-link">اللغة (عربي/E)</a></li>
            </ul>
          </nav>
          
          <div className="auth-section">
            {currentUser ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="welcome-text">
                    مرحباً، {currentUser.full_name_arabic || currentUser.phone_number}
                  </span>
                  <span className="user-type-badge">{USER_TYPES[currentUser.user_type]}</span>
                </div>
                <button onClick={onLogout} className="logout-btn">تسجيل الخروج</button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="login-btn">تسجيل الدخول</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Search Bar Component
const SearchBar = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    type: 'all',
    region: '',
    city: '',
    category: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    voiceSearch: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Check for voice support
  useEffect(() => {
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'region') {
      const cities = value ? REGIONS_AND_CITIES[value]?.cities || [] : [];
      setAvailableCities(cities);
      setSearchData(prev => ({ ...prev, [name]: value, city: '' })); // Reset city when region changes
    } else {
      setSearchData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    onSearch(searchData);
  };

  // Voice Search functionality
  const startVoiceSearch = () => {
    if (!voiceSupported) {
      alert('المتصفح لا يدعم البحث الصوتي');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA'; // Arabic language
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setSearchData(prev => ({ ...prev, voiceSearch: voiceText }));
      
      // Auto-process voice command
      processVoiceCommand(voiceText);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command) => {
    // Simple voice command processing
    const lowerCommand = command.toLowerCase();
    
    // Check for property types
    if (lowerCommand.includes('فيلا')) {
      setSearchData(prev => ({ ...prev, propertyType: 'villa' }));
    } else if (lowerCommand.includes('شقة')) {
      setSearchData(prev => ({ ...prev, propertyType: 'apartment' }));
    } else if (lowerCommand.includes('أرض')) {
      setSearchData(prev => ({ ...prev, propertyType: 'land' }));
    }
    
    // Check for sale/rent
    if (lowerCommand.includes('للبيع')) {
      setSearchData(prev => ({ ...prev, type: 'sale' }));
    } else if (lowerCommand.includes('للإيجار')) {
      setSearchData(prev => ({ ...prev, type: 'rent' }));
    }
    
    // Check for cities
    Object.values(REGIONS_AND_CITIES).forEach(region => {
      region.cities.forEach(city => {
        if (lowerCommand.includes(city)) {
          setSearchData(prev => ({ ...prev, city: city }));
        }
      });
    });
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-bar">
          <div className="search-tabs">
            <button 
              className={`search-tab ${searchData.type === 'all' ? 'active' : ''}`}
              onClick={() => setSearchData(prev => ({ ...prev, type: 'all' }))}
            >
              الكل
            </button>
            <button 
              className={`search-tab ${searchData.type === 'sale' ? 'active' : ''}`}
              onClick={() => setSearchData(prev => ({ ...prev, type: 'sale' }))}
            >
              للبيع
            </button>
            <button 
              className={`search-tab ${searchData.type === 'rent' ? 'active' : ''}`}
              onClick={() => setSearchData(prev => ({ ...prev, type: 'rent' }))}
            >
              للإيجار
            </button>
            <button 
              className={`search-tab ${searchData.type === 'projects' ? 'active' : ''}`}
              onClick={() => setSearchData(prev => ({ ...prev, type: 'projects' }))}
            >
              المشاريع
            </button>
            <button 
              className={`search-tab ${searchData.type === 'requests' ? 'active' : ''}`}
              onClick={() => setSearchData(prev => ({ ...prev, type: 'requests' }))}
            >
              الطلبات
            </button>
          </div>
          
          <div className="search-inputs">
            <div className="search-field">
              <select name="region" value={searchData.region} onChange={handleInputChange}>
                <option value="">اختر المنطقة</option>
                {Object.entries(REGIONS_AND_CITIES).map(([key, region]) => (
                  <option key={key} value={key}>{region.name}</option>
                ))}
              </select>
            </div>
            
            <div className="search-field">
              <select name="city" value={searchData.city} onChange={handleInputChange} disabled={!searchData.region}>
                <option value="">اختر المدينة</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="search-field">
              <select name="category" value={searchData.category} onChange={handleInputChange}>
                <option value="">فئة العقار</option>
                {Object.entries(PROPERTY_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
            
            <div className="voice-search-container">
              {voiceSupported && (
                <button 
                  className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  title="البحث الصوتي"
                >
                  🎤
                </button>
              )}
              
              {searchData.voiceSearch && (
                <div className="voice-result">
                  <span>🗣️ {searchData.voiceSearch}</span>
                  <button 
                    className="clear-voice"
                    onClick={() => setSearchData(prev => ({ ...prev, voiceSearch: '' }))}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className="advanced-search-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              البحث المتقدم
            </button>
            
            <button className="search-btn" onClick={handleSearch}>
              <span>🔍</span>
              بحث
            </button>
          </div>
          
          {showAdvanced && (
            <div className="advanced-search">
              <div className="advanced-row">
                <select name="propertyType" value={searchData.propertyType} onChange={handleInputChange}>
                  <option value="">نوع العقار</option>
                  {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                
                <input 
                  type="number" 
                  name="minPrice" 
                  placeholder="الحد الأدنى للسعر"
                  value={searchData.minPrice}
                  onChange={handleInputChange}
                />
                
                <input 
                  type="number" 
                  name="maxPrice" 
                  placeholder="الحد الأقصى للسعر"
                  value={searchData.maxPrice}
                  onChange={handleInputChange}
                />
                
                <input 
                  type="number" 
                  name="minArea" 
                  placeholder="أقل مساحة (م²)"
                  value={searchData.minArea}
                  onChange={handleInputChange}
                />
                
                <input 
                  type="number" 
                  name="maxArea" 
                  placeholder="أكبر مساحة (م²)"
                  value={searchData.maxArea}
                  onChange={handleInputChange}
                />
                
                <select name="bedrooms" value={searchData.bedrooms} onChange={handleInputChange}>
                  <option value="">عدد الغرف</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
                
                <select name="bathrooms" value={searchData.bathrooms} onChange={handleInputChange}>
                  <option value="">دورات المياه</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// SVG Icons Component - Based on latest reference image in gray
const PropertyIcons = {
  Area: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <rect x="2" y="2" width="20" height="20" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
      <path d="M2 2l5 5M22 2l-5 5M2 22l5-5M22 22l-5-5" stroke="#6b7280" strokeWidth="1.5"/>
      <path d="M7 12h10M12 7v10" stroke="#6b7280" strokeWidth="1"/>
    </svg>
  ),
  Bed: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <rect x="2" y="11" width="20" height="7" rx="1" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
      <rect x="4" y="7" width="3.5" height="4" rx="0.5" fill="#6b7280"/>
      <rect x="16.5" y="7" width="3.5" height="4" rx="0.5" fill="#6b7280"/>
      <path d="M2 14h20M2 18v2M22 18v2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Bath: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <ellipse cx="12" cy="15" rx="9" ry="5" stroke="#6b7280" strokeWidth="1.5" fill="none"/>
      <path d="M12 5v5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="7" cy="15" r="0.8" fill="#6b7280"/>
      <circle cx="12" cy="16" r="0.8" fill="#6b7280"/>
      <circle cx="17" cy="15" r="0.8" fill="#6b7280"/>
      <circle cx="9" cy="13" r="0.5" fill="#6b7280"/>
      <circle cx="15" cy="17" r="0.5" fill="#6b7280"/>
      <circle cx="10" cy="17" r="0.4" fill="#6b7280"/>
      <circle cx="14" cy="13" r="0.4" fill="#6b7280"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg location-red">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#ef4444" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="9" r="2.5" fill="#ef4444"/>
    </svg>
  ),
  Views: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <path d="M1 12c2-5 5.5-8 11-8s9 3 11 8c-2 5-5.5 8-11 8s-9-3-11-8z" stroke="#6b7280" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="1.5" fill="#6b7280"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <rect x="6" y="2" width="12" height="20" rx="3" stroke="#6b7280" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="19" r="1" fill="#6b7280"/>
      <path d="M9 4h6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Chat: () => (
    <svg viewBox="0 0 24 24" className="property-icon-svg">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#6b7280" strokeWidth="2" fill="none"/>
      <path d="M8 9h8M8 13h6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

// Modern Social Media Icons for Agent Cards
const SocialMediaIcons = {
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <defs>
        <radialGradient id="instagram-gradient" cx="0.5" cy="1" r="1">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="5" fill="url(#instagram-gradient)"/>
      <rect x="4" y="4" width="16" height="16" rx="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path fill="white" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z"/>
    </svg>
  ),
  Snapchat: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="5" fill="#FFFC00"/>
      <path fill="white" d="M12.017 13.905c-.007-.027-.013-.053-.02-.08-.115-.43-.345-.79-.642-1.041.594-.264 1.077-.697 1.344-1.267.267-.57.267-1.232-.016-1.802-.283-.57-.798-.982-1.392-1.116-.594-.134-1.218.016-1.695.403-.477.387-.777.967-.815 1.577-.038.61.192 1.214.624 1.642-.298.249-.529.608-.644 1.039-.007.027-.014.053-.02.08-.236.89-.607 1.734-1.102 2.503C8.133 15.35 7.58 16.08 6.943 16.716c-.127.127-.254.242-.38.357-.063.057-.126.114-.188.172-.062.058-.124.114-.186.171-.248.228-.495.456-.74.687-.122.115-.243.232-.364.348-.06.058-.121.116-.181.175-.06.058-.12.117-.179.176-.118.118-.236.237-.353.357-.058.06-.116.12-.173.181-.057.061-.114.122-.171.184-.114.124-.227.248-.34.373-.056.062-.112.125-.168.188-.056.063-.111.126-.166.19-.11.128-.219.257-.328.386-.054.064-.108.129-.162.194-.054.065-.107.131-.161.196-.107.133-.214.266-.32.401-.053.067-.105.135-.157.203-.052.068-.104.136-.155.205-.102.137-.203.275-.304.414-.05.069-.1.139-.15.209-.05.07-.099.141-.148.212-.098.142-.195.285-.291.429-.048.072-.095.144-.142.217-.047.073-.094.146-.14.22-.092.148-.183.296-.274.446-.045.075-.09.15-.134.226-.044.076-.088.152-.131.229-.086.154-.171.308-.255.464-.042.078-.084.156-.125.235-.041.079-.082.158-.123.238-.082.159-.163.319-.244.480-.04.08-.08.161-.119.242-.039.081-.078.163-.117.245-.078.165-.155.331-.231.498-.038.083-.076.167-.113.251-.037.084-.074.168-.111.252-.074.17-.147.342-.22.514-.036.086-.072.172-.107.259-.035.087-.07.174-.105.261-.07.176-.139.353-.208.530-.034.089-.068.178-.101.267-.033.089-.066.179-.098.269-.065.181-.129.363-.193.545-.032.091-.064.183-.095.275-.031.092-.062.185-.093.278-.062.186-.123.373-.183.560-.03.094-.06.188-.089.282-.029.094-.058.189-.086.284-.056.191-.111.383-.166.575-.027.096-.054.193-.081.29-.027.097-.054.194-.08.291-.052.196-.103.393-.154.590-.025.098-.05.197-.074.296-.024.099-.048.198-.071.297-.046.201-.091.403-.136.605-.022.101-.044.202-.065.304-.021.102-.042.204-.062.306-.04.206-.079.413-.117.620-.019.104-.038.208-.056.312-.018.104-.036.209-.053.314-.034.211-.067.423-.099.635-.016.106-.032.213-.047.32-.015.107-.03.214-.044.322-.028.216-.055.433-.081.650-.013.109-.026.218-.038.327-.012.109-.024.218-.035.328-.022.221-.043.443-.063.665-.01.111-.02.223-.029.335-.009.112-.018.224-.026.337-.016.226-.031.453-.045.680-.007.114-.014.228-.02.342-.006.114-.012.229-.017.344-.01.231-.019.463-.027.695-.004.116-.008.233-.011.35-.003.117-.006.234-.008.351-.004.236-.007.473-.009.710-.001.119-.002.238-.002.357 0 .119.001.238.003.357.002.237.005.475.009.713.002.119.005.238.008.357.003.119.006.238.01.357.007.238.015.476.024.715.004.119.009.239.014.358.005.119.011.239.017.358.012.239.025.479.039.719.007.120.014.240.022.360.008.120.016.241.025.361.017.241.035.482.054.724.009.121.019.242.029.363.010.121.021.242.032.364.022.242.045.485.069.728.012.122.024.244.037.366.013.122.026.244.04.367.027.244.055.488.084.732.014.122.029.245.044.368.015.123.031.246.047.369.032.245.065.491.099.737.017.123.034.246.052.369.018.123.036.247.055.370.037.247.075.494.114.741.019.124.039.248.059.372.020.124.041.248.062.372.042.248.085.497.129.746.022.125.044.249.067.374.023.125.046.250.070.375.047.250.095.500.144.750.024.125.049.251.074.376.025.125.051.251.077.376.052.251.105.503.159.755.027.126.054.252.082.378.028.126.056.253.085.379.057.253.115.506.174.759.029.127.059.254.089.380.030.127.061.254.092.381.062.254.125.509.189.764.032.128.064.255.097.383.033.128.066.256.100.384.067.256.135.512.204.769.034.128.069.257.104.385.035.128.071.257.107.386.072.257.145.515.219.773.037.129.074.258.112.387.038.129.076.259.115.388.077.259.155.518.234.778.039.130.079.260.119.390.040.130.081.260.122.391.082.260.165.521.249.782.042.131.084.261.127.392.043.131.086.262.130.393.087.262.175.524.264.787.044.131.089.263.134.394.045.132.091.264.137.396.092.264.185.528.279.792.047.132.094.264.142.396.048.132.096.265.145.397.097.265.195.531.294.797.049.133.099.266.149.399.050.133.101.266.152.399.102.267.205.534.309.802.052.134.104.268.157.401.053.134.106.268.160.402.107.268.215.537.324.806.054.135.109.269.164.404.055.135.111.270.167.405.112.270.225.540.339.811.057.135.114.271.172.406.058.136.116.271.175.407.117.271.235.543.354.815.059.136.119.272.179.408.060.136.121.273.182.409.122.273.245.546.369.820.062.137.124.274.187.411.063.137.126.275.190.412.127.274.255.549.384.824.064.138.129.275.194.413.065.138.131.276.197.414.132.276.265.552.399.829.067.138.134.277.202.415.068.138.136.277.205.416.137.277.275.555.414.833.069.139.139.278.209.417.070.139.141.279.212.418.142.279.285.558.429.838.072.140.144.280.217.420.073.140.146.280.220.421.147.280.295.561.444.842.074.141.149.281.224.422.075.141.151.282.227.423.152.282.305.564.459.847.077.141.154.283.232.424.078.142.156.284.235.426.157.283.315.567.474.851.079.142.159.284.239.427.080.143.161.285.242.428.162.285.325.570.489.856.082.143.164.286.247.429.083.143.166.287.250.431.167.286.335.573.504.860.084.144.169.288.254.432.085.144.171.288.257.433.172.288.345.576.519.865.087.144.174.289.262.434.088.145.176.290.265.435.177.289.355.579.534.870.089.145.179.291.269.436.090.146.181.291.272.437.182.291.365.582.549.874.092.146.184.292.277.439.093.147.186.293.280.440.187.293.375.586.564.879.094.147.189.294.284.441.095.147.191.295.287.442.192.294.385.589.579.884.097.148.194.295.292.443.098.148.196.296.295.444.197.296.395.592.594.889.099.149.199.297.299.446.100.149.201.297.302.446.202.297.405.595.609.894.102.149.204.299.307.448.103.150.206.299.310.449.207.299.415.598.624.898.104.150.209.300.314.451.105.151.211.301.317.452.212.301.425.602.639.903.107.151.214.302.322.453.108.152.216.303.325.455.217.302.435.605.654.908.109.152.219.304.329.456.110.152.221.305.332.457.222.304.445.608.669.913.112.153.224.306.337.459.113.153.226.307.340.460.227.305.455.611.684.917.114.153.229.307.344.461.115.154.231.308.347.462.232.307.465.614.699.922.117.154.234.309.352.463.118.155.236.310.355.465.237.308.475.617.714.926.119.155.239.310.359.466.120.156.241.311.363.467.242.310.485.620.729.931.122.155.244.312.367.468.123.157.246.313.370.470.247.311.495.623.744.936.124.156.249.313.374.470.125.157.251.314.378.472.252.313.505.626.759.940.127.157.254.315.382.472.128.158.256.316.385.474.257.314.515.629.774.945.129.158.259.316.389.475.130.159.261.318.392.477.262.316.525.632.789.949.132.159.264.318.397.477.133.160.266.319.400.479.267.318.535.636.804.954.134.160.269.320.404.480.135.160.271.321.407.482.272.319.545.639.819.959.137.160.274.322.412.483.138.161.276.323.415.485.277.321.555.642.834.964.139.161.279.323.419.485.140.162.281.324.422.487.282.322.565.645.849.968.142.162.284.325.427.488.143.163.286.326.430.489.287.324.575.648.864.973.144.163.289.326.434.490.145.164.291.328.437.492.292.325.585.651.879.978.147.164.294.328.442.492.148.165.296.330.445.495.297.327.595.654.894.982.149.165.299.330.449.495.150.166.301.331.453.497.302.328.605.657.909.987.152.166.304.332.457.499.153.167.306.333.460.500.307.330.615.660.924.991.154.167.309.334.464.501.155.168.311.335.467.503.312.332.625.664.939.996.157.168.314.336.472.504.158.169.316.337.475.506.317.333.635.667.954 1.001.159.169.319.338.479.507.160.169.321.339.482.508.322.335.645.670.969 1.006.162.170.324.340.487.510.163.170.326.341.490.512.327.336.655.673.984 1.011.164.171.329.342.494.513.165.172.331.343.497.515.332.338.665.676.999 1.016.167.172.334.344.501.516.167.173.335.345.504.518.337.339.675.679 1.014 1.021.169.173.339.346.509.520.170.174.340.347.511.521.342.341.685.682 1.029 1.026.172.174.344.348.516.522.172.175.345.349.518.524.347.342.695.685 1.044 1.030.174.175.349.350.524.526.175.176.350.351.526.527.352.344.705.688 1.059 1.035.177.176.354.352.531.529.177.177.355.353.533.530.357.345.715.691 1.074 1.040.179.177.359.355.539.532.180.178.360.356.541.534.362.347.725.694 1.089 1.044.182.178.364.357.547.536.183.179.366.358.549.538.367.348.735.697 1.104 1.049.184.180.369.360.554.540.185.180.371.361.557.542.372.350.745.700 1.119 1.053.187.181.374.362.562.544.188.182.376.363.565.546.377.351.755.703 1.134 1.058.189.182.379.365.569.547.190.183.381.366.572.549.382.353.765.706 1.149 1.062.192.184.384.367.577.551.193.184.386.369.580.553.387.354.775.709 1.164 1.067.194.185.389.370.584.555.195.186.391.371.587.557.392.356.785.712 1.179 1.071.197.186.394.372.591.559.197.187.395.374.594.561.397.357.795.715 1.194 1.076.199.188.399.375.599.563.200.188.400.376.601.565.402.359.805.718 1.209 1.080.202.189.404.378.607.567.203.189.406.379.610.569.407.360.815.721 1.224 1.085.204.190.409.381.614.572.205.191.411.382.617.574.412.362.825.724 1.239 1.089.207.192.414.384.622.576.208.193.416.385.625.578.417.363.835.727 1.254 1.094.210.193.419.387.629.580.210.194.421.388.632.582.422.365.845.730 1.269 1.098.212.195.424.390.637.585.213.195.426.391.640.587.427.366.855.733 1.284 1.103.215.196.430.393.645.589.215.197.431.394.648.591.432.368.865.736 1.299 1.107.218.198.436.396.655.594.219.198.438.397.658.596.437.369.875.739 1.314 1.112.220.199.441.399.662.599.221.200.443.400.666.601.442.371.885.742 1.329 1.116.223.201.446.402.670.604.224.202.448.404.673.606.447.372.895.745 1.344 1.121.226.202.452.405.678.608.226.204.453.407.681.611.452.374.905.748 1.359 1.125.228.204.457.408.686.613.229.205.458.410.688.616.457.375.915.751 1.374 1.130.231.206.462.412.694.618.232.207.464.414.697.621.462.377.925.754 1.389 1.134.234.208.468.416.702.625.234.209.469.418.705.627.467.378.935.757 1.404 1.139.236.210.473.420.710.630.237.211.475.422.713.633.472.380.945.760 1.419 1.143.239.212.478.424.718.636.240.213.481.426.722.639.477.381.955.763 1.434 1.148.242.214.484.428.727.642.243.215.487.430.731.645.482.383.965.766 1.449 1.152.245.216.490.432.736.649.246.217.493.434.740.651.487.385.975.770 1.464 1.157.248.218.496.437.745.656.249.219.499.438.749.658.492.387.985.774 1.479 1.161.251.220.502.441.754.662.252.221.505.442.758.664.497.389.995.778 1.494 1.166.254.222.508.445.763.668.255.223.511.446.767.670.502.391 1.005.782 1.509 1.170.257.224.514.449.772.674.258.225.517.450.776.676.507.393 1.015.786 1.524 1.175.260.226.520.453.781.680.261.227.523.454.785.682.512.395 1.025.790 1.539 1.179.263.228.526.457.790.686.264.229.529.458.794.688.517.397 1.035.794 1.554 1.184.266.230.532.461.799.692.267.232.535.463.803.695.522.399 1.045.798 1.569 1.188.269.232.538.465.808.698.270.234.541.467.812.701.527.401 1.055.802 1.584 1.193.272.235.544.470.817.705.273.236.547.472.821.708.532.403 1.065.806 1.599 1.197.275.237.550.475.826.712.276.238.553.476.830.715.537.405 1.075.810 1.614 1.202.278.239.556.479.835.719.279.240.559.480.839.721.542.407 1.085.814 1.629 1.206.281.241.562.483.844.725.282.242.565.485.848.728.547.409 1.095.818 1.644 1.211.284.244.568.488.853.733.285.245.571.490.857.735.552.411 1.105.822 1.659 1.215.287.246.574.492.862.739.288.247.577.495.866.743.557.413 1.115.826 1.674 1.220.290.248.580.497.871.746.291.249.583.499.875.749.562.415 1.125.830 1.689 1.224.293.250.586.501.880.752.294.252.589.503.884.756.567.417 1.135.834 1.704 1.229.296.252.592.505.889.758.297.254.595.508.893.763.572.419 1.145.838 1.719 1.233.299.255.598.510.898.766.300.256.601.513.902.770.577.421 1.155.842 1.734 1.238.302.257.604.515.907.773.303.259.607.518.911.777.582.423 1.165.846 1.749 1.242.305.260.610.520.916.780.306.261.613.523.920.785.587.425 1.175.850 1.764 1.247.308.262.616.525.925.788.309.264.619.528.929.792.592.427 1.185.854 1.779 1.251.311.264.622.530.934.796.312.267.625.533.938.800.597.429 1.195.858 1.794 1.256.314.267.628.535.943.803.315.269.631.538.947.807.602.431 1.205.862 1.809 1.260.317.270.634.540.952.811.318.272.637.543.956.815.607.433 1.215.866 1.824 1.265.320.272.640.545.961.819.321.274.643.548.965.822.612.435 1.225.870 1.839 1.269.323.275.646.551.970.827.324.277.649.553.974.830.617.437 1.235.874 1.854 1.274.326.278.652.556.979.835.327.279.655.559.983.839.622.439 1.245.878 1.869 1.278.329.281.658.562.988.843.330.282.661.564.992.847.627.441 1.255.882 1.884 1.283.332.284.664.568.997.852.333.285.667.570 1.001.855.632.443 1.265.886 1.899 1.287.335.286.670.573 1.006.860.336.288.673.576 1.010.864.637.445 1.275.890 1.914 1.292.338.289.676.579 1.015.869.339.291.679.582 1.019.873.642.447 1.285.894 1.929 1.296.341.292.682.585 1.024.878.342.294.685.588 1.028.882.647.449 1.295.898 1.944 1.301.344.295.688.591 1.033.887.345.297.691.594 1.037.891.652.451 1.305.902 1.959 1.305.347.298.694.597 1.042.896.348.300.697.600 1.046.900.657.453 1.315.906 1.974 1.310.350.301.700.603 1.051.905.351.303.703.606 1.055.909.662.455 1.325.910 1.989 1.314.353.304.706.609 1.060.914.354.306.709.612 1.064.919.667.457 1.335.914 2.004 1.319.356.307.712.615 1.069.923.357.309.715.618 1.073.928.672.459 1.345.918 2.019 1.323.359.310.718.621 1.078.932.360.312.721.624 1.082.937.677.461 1.355.922 2.034 1.328.362.313.724.627 1.087.941.363.315.727.630 1.091.946.682.463 1.365.926 2.049 1.332.365.316.730.633 1.096.950.366.318.733.636 1.100.955.687.465 1.375.930 2.064 1.337.368.319.736.639 1.105.959.369.321.739.642 1.109.964.692.467 1.385.934 2.079 1.341.371.322.742.645 1.114.968.372.324.745.648 1.118.973.697.469 1.395.938 2.094 1.346.374.325.748.651 1.123.977.375.327.751.654 1.127.982.702.471 1.405.942 2.109 1.350.377.328.754.657 1.132.986.378.330.757.660 1.136.991.707.473 1.415.946 2.124 1.355.380.331.760.663 1.141.995.381.333.763.666 1.145 1.000.712.475 1.425.950 2.139 1.359.383.334.766.669 1.150 1.004.384.336.769.672 1.154 1.009.717.477 1.435.954 2.154 1.364.386.337.772.675 1.159 1.013.387.340.775.679 1.163 1.019.722.479 1.445.958 2.169 1.368.389.340.778.681 1.168 1.022.390.343.781.685 1.172 1.028.727.481 1.455.962 2.184 1.373.392.343.784.687 1.177 1.031.393.346.787.691 1.181 1.037.732.483 1.465.966 2.199 1.377.395.346.790.693 1.186 1.040.396.348.793.697 1.190 1.046.737.485 1.475.970 2.214 1.382.398.349.796.699 1.195 1.049.399.351.799.703 1.199 1.055.742.487 1.485.974 2.229 1.386.401.352.802.705 1.204 1.058.402.354.805.709 1.208 1.064.747.489 1.495.978 2.244 1.391.404.355.808.711 1.213 1.067.405.357.811.715 1.217 1.073.752.491 1.505.982 2.259 1.395.407.358.814.717 1.222 1.076.408.360.817.721 1.226 1.082.757.493 1.515.986 2.274 1.400.410.361.820.723 1.231 1.085.411.363.823.727 1.235 1.091.762.495 1.525.990 2.289 1.404.413.364.826.729 1.240 1.094.414.366.829.733 1.244 1.100.767.497 1.535.994 2.304 1.409.416.367.832.735 1.249 1.103.417.369.835.739 1.253 1.109.772.499 1.545.998 2.319 1.413.419.370.838.741 1.258 1.112.420.372.841.745 1.262 1.118.777.501 1.555 1.002 2.334 1.418.422.373.844.747 1.267 1.121.423.375.847.751 1.271 1.127.782.503 1.565 1.006 2.349 1.422.425.376.850.753 1.276 1.130.426.378.853.757 1.280 1.136.787.505 1.575 1.010 2.364 1.427.428.379.856.759 1.285 1.139.429.381.859.763 1.289 1.145.792.507 1.585 1.014 2.379 1.431.431.382.862.765 1.294 1.148.432.384.865.769 1.298 1.154.797.509 1.595 1.018 2.394 1.436.434.385.868.771 1.303 1.157.435.387.871.775 1.307 1.163.802.511 1.605 1.022 2.409 1.440.437.388.874.777 1.312 1.166.438.390.877.781 1.316 1.172.807.513 1.615 1.026 2.424 1.445.440.391.880.783 1.321 1.175.441.393.883.787 1.325 1.181.812.515 1.625 1.030 2.439 1.449.443.394.886.789 1.330 1.184.444.396.889.793 1.334 1.190.817.517 1.635 1.034 2.454 1.454.446.397.892.795 1.339 1.193.447.399.895.799 1.343 1.199.822.519 1.645 1.038 2.469 1.458.449.400.898.801 1.348 1.202.450.402.901.805 1.352 1.208.827.521 1.655 1.042 2.484 1.463.452.403.904.807 1.357 1.211.453.405.907.811 1.361 1.217.832.523 1.665 1.046 2.499 1.467.455.406.910.813 1.366 1.220.456.408.913.817 1.370 1.226.837.525 1.675 1.050 2.514 1.472.458.409.916.819 1.375 1.229.459.411.919.823 1.379 1.235.842.527 1.685 1.054 2.529 1.476.461.412.922.825 1.384 1.238.462.414.925.829 1.388 1.244.847.529 1.695 1.058 2.544 1.481.464.415.928.831 1.393 1.247.465.417.931.835 1.397 1.253.852.531 1.705 1.062 2.559 1.485.467.418.934.837 1.402 1.256.468.420.937.841 1.406 1.262.857.533 1.715 1.066 2.574 1.490.470.421.940.843 1.411 1.265.471.423.943.847 1.415 1.271.862.535 1.725 1.070 2.589 1.494.473.424.946.849 1.420 1.274.474.426.949.853 1.424 1.280.867.537 1.735 1.074 2.604 1.499.476.427.952.855 1.429 1.283.477.429.955.859 1.433 1.289.872.539 1.745 1.078 2.619 1.503.479.430.958.861 1.438 1.292.480.432.961.865 1.442 1.298.877.541 1.755 1.082 2.634 1.508.482.433.964.867 1.447 1.301.483.435.967.871 1.451 1.307.882.543 1.765 1.086 2.649 1.512.485.436.970.873 1.456 1.310.486.438.973.877 1.460 1.316.887.545 1.775 1.090 2.664 1.517.488.439.976.879 1.465 1.319.489.441.979.883 1.469 1.325.892.547 1.785 1.094 2.679 1.521.491.442.982.885 1.474 1.328.492.444.985.889 1.478 1.334.897.549 1.795 1.098 2.694 1.526.494.445.988.891 1.483 1.337.495.447.991.895 1.487 1.343.902.551 1.805 1.102 2.709 1.530.497.448.994.897 1.492 1.346.498.450.997.901 1.496 1.352.907.553 1.815 1.106 2.724 1.535.500.451 1.000.903 1.501 1.355.501.453 1.003.907 1.505 1.361.912.555 1.825 1.110 2.739 1.539.503.454 1.006.909 1.510 1.364.504.456 1.009.913 1.514 1.370.917.557 1.835 1.114 2.754 1.544.506.457 1.012.915 1.519 1.373.507.459 1.015.919 1.523 1.379.922.559 1.845 1.118 2.769 1.548.509.460 1.018.921 1.528 1.382.510.462 1.021.925 1.532 1.388.927.561 1.855 1.122 2.784 1.553.512.463 1.024.927 1.537 1.391.513.465 1.027.931 1.541 1.397.932.563 1.865 1.126 2.799 1.557.515.466 1.030.933 1.546 1.400.516.468 1.033.937 1.550 1.406.937.565 1.875 1.130 2.814 1.562.518.469 1.036.939 1.555 1.409.519.471 1.039.943 1.559 1.415.942.567 1.885 1.134 2.829 1.566.521.472 1.042.945 1.564 1.418.522.474 1.045.949 1.568 1.424.947.569 1.895 1.138 2.844 1.571.524.475 1.048.951 1.573 1.427.525.477 1.051.955 1.577 1.433.952.571 1.905 1.142 2.859 1.575.527.478 1.054.957 1.582 1.436.528.480 1.057.961 1.586 1.442.957.573 1.915 1.146 2.874 1.580.530.481 1.060.963 1.591 1.445.531.483 1.063.967 1.595 1.451.962.575 1.925 1.150 2.889 1.584.533.484 1.066.969 1.600 1.454.534.486 1.069.973 1.604 1.460.967.577 1.935 1.154 2.904 1.589.536.487 1.072.975 1.609 1.463.537.489 1.075.979 1.613 1.469.972.579 1.945 1.158 2.919 1.593.539.490 1.078.981 1.618 1.472.540.492 1.081.985 1.622 1.478.977.581 1.955 1.162 2.934 1.598.542.493 1.084.987 1.627 1.481.543.495 1.087.991 1.631 1.487.982.583 1.965 1.166 2.949 1.602.545.496 1.090.993 1.636 1.490.546.498 1.093.997 1.640 1.496.987.585 1.975 1.170 2.964 1.607.548.499 1.096.999 1.645 1.499.549.501 1.099 1.003 1.649 1.505.992.587 1.985 1.174 2.979 1.611.551.502 1.102 1.005 1.654 1.508.552.504 1.105 1.009 1.658 1.514.997.589 1.995 1.178 2.994 1.616.554.505 1.108 1.011 1.663 1.517.555.507 1.111 1.015 1.667 1.523 1.002.591 2.005 1.182 3.009 1.620.557.508 1.114 1.017 1.672 1.526.558.510 1.117 1.021 1.676 1.532 1.007.593 2.015 1.186 3.024 1.625.560.511 1.120 1.023 1.681 1.535.561.513 1.123 1.027 1.685 1.541 1.012.595 2.025 1.190 3.039 1.629.563.514 1.126 1.029 1.690 1.544.564.516 1.129 1.033 1.694 1.550 1.017.597 2.035 1.194 3.054 1.634.566.517 1.132 1.035 1.699 1.553.567.519 1.135 1.039 1.703 1.559 1.022.599 2.045 1.198 3.069 1.638.569.520 1.138 1.041 1.708 1.562.570.522 1.141 1.045 1.712 1.568 1.027.601 2.055 1.202 3.084 1.643.572.523 1.144 1.047 1.717 1.571.573.525 1.147 1.051 1.721 1.577 1.032.603 2.065 1.206 3.099 1.647.575.526 1.150 1.053 1.726 1.580.576.528 1.153 1.057 1.730 1.586 1.037.605 2.075 1.210 3.114 1.652.578.529 1.156 1.059 1.735 1.589.579.531 1.159 1.063 1.739 1.595 1.042.607 2.085 1.214 3.129 1.656.581.532 1.162 1.065 1.744 1.598.582.534 1.165 1.069 1.748 1.604 1.047.609 2.095 1.218 3.144 1.661.584.535 1.168 1.071 1.753 1.607.585.537 1.171 1.075 1.757 1.613 1.052.611 2.105 1.222 3.159 1.665.587.538 1.174 1.077 1.762 1.616.588.540 1.177 1.081 1.766 1.622 1.057.613 2.115 1.226 3.174 1.670.590.541 1.180 1.083 1.771 1.625.591.543 1.183 1.087 1.775 1.631 1.062.615 2.125 1.230 3.189 1.674.593.544 1.186 1.089 1.780 1.634.594.546 1.189 1.093 1.784 1.640 1.067.617 2.135 1.234 3.204 1.679.596.547 1.192 1.095 1.789 1.643.597.549 1.195 1.099 1.793 1.649 1.072.619 2.145 1.238 3.219 1.683.599.550 1.198 1.101 1.798 1.652.600.552 1.201 1.105 1.802 1.658 1.077.621 2.155 1.242 3.234 1.688.602.553 1.204 1.107 1.807 1.661.603.555 1.207 1.111 1.811 1.667 1.082.623 2.165 1.246 3.249 1.692.605.556 1.210 1.113 1.816 1.670.606.558 1.213 1.117 1.820 1.676 1.087.625 2.175 1.250 3.264 1.697.608.559 1.216 1.119 1.825 1.679.609.561 1.219 1.123 1.829 1.685 1.092.627 2.185 1.254 3.279 1.701.611.562 1.222 1.125 1.834 1.688.612.564 1.225 1.129 1.838 1.694 1.097.629 2.195 1.258 3.294 1.706.614.565 1.228 1.131 1.843 1.697.615.567 1.231 1.135 1.847 1.703 1.102.631 2.205 1.262 3.309 1.710.617.568 1.234 1.137 1.852 1.706.618.570 1.237 1.141 1.856 1.712 1.107.633 2.215 1.266 3.324 1.715.620.571 1.240 1.143 1.861 1.715.621.573 1.243 1.147 1.865 1.721 1.112.635 2.225 1.270 3.339 1.719.623.574 1.246 1.149 1.870 1.724.624.576 1.249 1.153 1.874 1.730 1.117.637 2.235 1.274 3.354 1.724.626.577 1.252 1.155 1.879 1.733.627.579 1.255 1.159 1.883 1.739 1.122.639 2.245 1.278 3.369 1.728.629.580 1.258 1.161 1.888 1.742.630.582 1.261 1.165 1.892 1.748 1.127.641 2.255 1.282 3.384 1.733.632.583 1.264 1.167 1.897 1.751.633.585 1.267 1.171 1.901 1.757 1.132.643 2.265 1.286 3.399 1.737.635.586 1.270 1.173 1.906 1.760.636.588 1.273 1.177 1.910 1.766 1.137.645 2.275 1.290 3.414 1.742.638.589 1.276 1.179 1.915 1.769.639.591 1.279 1.183 1.919 1.775 1.142.647 2.285 1.294 3.429 1.746.641.592 1.282 1.185 1.924 1.778.642.594 1.285 1.189 1.928 1.784 1.147.649 2.295 1.298 3.444 1.751.644.595 1.288 1.191 1.933 1.787.645.597 1.291 1.195 1.937 1.793 1.152.651 2.305 1.302 3.459 1.755.647.598 1.294 1.197 1.942 1.796.648.600 1.297 1.201 1.946 1.802 1.157.653 2.315 1.306 3.474 1.760.650.601 1.300 1.203 1.951 1.805.651.603 1.303 1.207 1.955 1.811 1.162.655 2.325 1.310 3.489 1.764.653.604 1.306 1.209 1.960 1.814.654.606 1.309 1.213 1.964 1.820 1.167.657 2.335 1.314 3.504 1.769.656.607 1.312 1.215 1.969 1.823.657.609 1.315 1.219 1.973 1.829 1.172.659 2.345 1.318 3.519 1.773.659.610 1.318 1.221 1.978 1.832.660.612 1.321 1.225 1.982 1.838 1.177.661 2.355 1.322 3.534 1.778.662.613 1.324 1.227 1.987 1.841.663.615 1.327 1.231 1.991 1.847 1.182.663 2.365 1.326 3.549 1.782.665.616 1.330 1.233 1.996 1.850.666.618 1.333 1.237 2.000 1.856z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path fill="white" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="3" fill="#0077B5"/>
      <path fill="white" d="M6.5 8.31h2.97v9.54H6.5V8.31zM7.965 7.04c-.95 0-1.72-.77-1.72-1.72s.77-1.72 1.72-1.72 1.72.77 1.72 1.72-.77 1.72-1.72 1.72zM18.85 17.85h-2.97v-4.64c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.72h-2.97V8.31h2.85v1.3h.04c.4-.75 1.37-1.55 2.82-1.55 3.02 0 3.57 1.99 3.57 4.57v5.22z"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="5" fill="#22c55e"/>
      <path fill="white" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" className="social-icon">
      <rect width="24" height="24" rx="5" fill="#FF0000"/>
      <path fill="white" d="M19.615 7.154c-.23-.86-.905-1.534-1.764-1.764C16.502 5 12 5 12 5s-4.502 0-5.85.39c-.86.23-1.535.905-1.765 1.764C4 8.502 4 12 4 12s0 3.498.385 4.846c.23.86.905 1.534 1.764 1.764C7.498 19 12 19 12 19s4.502 0 5.85-.39c.86-.23 1.535-.905 1.765-1.764C20 15.498 20 12 20 12s0-3.498-.385-4.846zM10 15V9l5.196 3L10 15z"/>
    </svg>
  )
};

// Property Card Component
const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        <div className="property-status">{property.status}</div>
        <div className="property-actions">
          <button 
            className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            ❤️
          </button>
          <button className="action-btn share">📤</button>
        </div>
        {property.featured && <div className="featured-badge">مميز</div>}
      </div>
      
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-price">
          {property.price} ريال سعودي
        </div>
        <div className="property-location">
          <PropertyIcons.Location />
          {property.location}
        </div>
        
        <div className="property-details">
          <div className="property-category">
            {PROPERTY_CATEGORIES[property.category]} - {PROPERTY_TYPES[property.type]}
          </div>
          <div className="property-icons">
            <div className="property-icon">
              <PropertyIcons.Area />
              {property.area} م²
            </div>
            {property.bedrooms && (
              <div className="property-icon">
                <PropertyIcons.Bed />
                {property.bedrooms}
              </div>
            )}
            {property.bathrooms && (
              <div className="property-icon">
                <PropertyIcons.Bath />
                {property.bathrooms}
              </div>
            )}
          </div>
        </div>
        
        <div className="property-stats">
          <span className="views">
            <PropertyIcons.Views />
            {property.views} مشاهدة
          </span>
        </div>
        
        <div className="agent-info">
          <img src={property.agent.image} alt={property.agent.name} className="agent-avatar" />
          <div className="agent-details">
            <div className="agent-name">{property.agent.name}</div>
            <div className="agent-contact">
              <button className="contact-btn">
                <PropertyIcons.Phone />
                اتصال
              </button>
              <button className="chat-btn">
                <PropertyIcons.Chat />
                محادثة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Agent Card Component - Exact match to reference image
const AgentCard = ({ agent }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <div></div>
        <button 
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? 'متابع' : 'متابعة'}
        </button>
      </div>
      
      <div className="agent-main-info">
        <div className="agent-photo-container">
          <div className="agent-photo">
            لا توجد صورة
          </div>
        </div>
        
        <h3 className="agent-name">{agent.name}</h3>
        <div className="agent-location">{agent.region}</div>
        
        <div className="agent-rating">
          <span className="rating-stars">★★★★★</span>
          <span className="rating-number">{agent.rating}</span>
          <span className="rating-count">({agent.followers})</span>
        </div>
        
        <div className="agent-join-date">انضم في فبراير 2024</div>
      </div>
      
      <div className="agent-stats">
        <div className="stat">
          <span className="stat-number">{agent.properties}</span>
          <span className="stat-label">عقار</span>
        </div>
        <div className="stat">
          <span className="stat-number">{agent.requests}</span>
          <span className="stat-label">طلب</span>
        </div>
        <div className="stat">
          <span className="stat-number">{agent.followers}</span>
          <span className="stat-label">متابع</span>
        </div>
      </div>
      
      <div className="agent-actions">
        <div className="social-media-icons">
          <button className="social-btn whatsapp" title="واتساب">
            <SocialMediaIcons.WhatsApp />
          </button>
          <button className="social-btn instagram" title="إنستغرام">
            <SocialMediaIcons.Instagram />
          </button>
          <button className="social-btn x" title="X (تويتر)">
            <SocialMediaIcons.X />
          </button>
          <button className="social-btn snapchat" title="سناب شات">
            <SocialMediaIcons.Snapchat />
          </button>
          <button className="social-btn tiktok" title="تيك توك">
            <SocialMediaIcons.TikTok />
          </button>
          <button className="social-btn linkedin" title="لينكد إن">
            <SocialMediaIcons.LinkedIn />
          </button>
        </div>
        <button className="contact-agent-btn">
          <SocialMediaIcons.Phone />
          اتصل بي
        </button>
      </div>
    </div>
  );
};

// Login Modal Component (unchanged from previous version)
const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('phone');
  const [formData, setFormData] = useState({
    phone_number: '',
    user_type: 'visitor',
    otp_code: '',
    national_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userTypes, setUserTypes] = useState([]);
  const [requiresNafath, setRequiresNafath] = useState(false);

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get(`${API}/user-types`);
      setUserTypes(response.data.user_types);
    } catch (error) {
      console.error('Failed to fetch user types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'user_type') {
      const selectedType = userTypes.find(type => type.key === value);
      setRequiresNafath(selectedType?.requires_nafath || false);
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API}/auth/send-otp`, {
        phone_number: formData.phone_number,
        user_type: formData.user_type,
        language: 'ar'
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setStep('otp');
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'خطأ في إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API}/auth/verify-otp`, {
        phone_number: formData.phone_number,
        otp_code: formData.otp_code,
        user_type: formData.user_type
      });
      
      if (response.data.success) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        if (requiresNafath && !response.data.user.is_nafath_verified) {
          setStep('nafath');
          setMessage('يتطلب التحقق من الهوية عبر النفاذ الوطني');
        } else {
          onSuccess(response.data.user);
          onClose();
          setStep('phone');
          setFormData({ phone_number: '', user_type: 'visitor', otp_code: '', national_id: '' });
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'خطأ في التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  const verifyNafath = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API}/auth/nafath/verify`, {
        national_id: formData.national_id,
        phone_number: formData.phone_number
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        const profileResponse = await axios.get(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.setItem('user_data', JSON.stringify(profileResponse.data.user));
        onSuccess(profileResponse.data.user);
        onClose();
        setStep('phone');
        setFormData({ phone_number: '', user_type: 'visitor', otp_code: '', national_id: '' });
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'خطأ في التحقق من النفاذ الوطني');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>تسجيل الدخول</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {step === 'phone' && (
            <div className="phone-step">
              <h3>أدخل رقم الهاتف ونوع المستخدم</h3>
              
              <div className="form-group">
                <label>نوع المستخدم</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {userTypes.map(type => (
                    <option key={type.key} value={type.key}>
                      {type.name_arabic}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="05xxxxxxxx"
                  className="form-input"
                  dir="rtl"
                />
              </div>
              
              {requiresNafath && (
                <div className="nafath-notice">
                  <p>⚠️ هذا النوع من المستخدمين يتطلب التحقق عبر النفاذ الوطني</p>
                </div>
              )}
              
              <button
                onClick={sendOTP}
                disabled={loading || !formData.phone_number}
                className="submit-btn"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
            </div>
          )}
          
          {step === 'otp' && (
            <div className="otp-step">
              <h3>أدخل رمز التحقق</h3>
              <p>تم إرسال رمز التحقق إلى {formData.phone_number}</p>
              
              <div className="form-group">
                <label>رمز التحقق</label>
                <input
                  type="text"
                  name="otp_code"
                  value={formData.otp_code}
                  onChange={handleInputChange}
                  placeholder="123456"
                  className="form-input otp-input"
                  maxLength="6"
                  dir="ltr"
                />
              </div>
              
              <button
                onClick={verifyOTP}
                disabled={loading || !formData.otp_code}
                className="submit-btn"
              >
                {loading ? 'جاري التحقق...' : 'تحقق من الرمز'}
              </button>
              
              <button
                onClick={() => setStep('phone')}
                className="back-btn"
              >
                العودة
              </button>
            </div>
          )}
          
          {step === 'nafath' && (
            <div className="nafath-step">
              <h3>التحقق من الهوية - النفاذ الوطني</h3>
              <p>يرجى إدخال رقم الهوية الوطنية للتحقق</p>
              
              <div className="form-group">
                <label>رقم الهوية الوطنية</label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="form-input"
                  maxLength="10"
                  dir="ltr"
                />
              </div>
              
              <button
                onClick={verifyNafath}
                disabled={loading || !formData.national_id}
                className="submit-btn"
              >
                {loading ? 'جاري التحقق...' : 'التحقق عبر النفاذ الوطني'}
              </button>
            </div>
          )}
          
          {message && (
            <div className={`message ${message.includes('خطأ') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
  };

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // Implement search functionality
  };

  const featuredProperties = SAMPLE_PROPERTIES.filter(p => p.featured);
  const latestProperties = SAMPLE_PROPERTIES.slice().reverse().slice(0, 4);
  const mostViewedProperties = SAMPLE_PROPERTIES.slice().sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <div className="App">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <SearchBar onSearch={handleSearch} />
      
      <main className="main-content">
        {currentUser && (
          <section className="user-welcome-section">
            <div className="container">
              <div className="user-welcome-card">
                <h2>مرحباً بك، {currentUser.full_name_arabic || currentUser.phone_number}</h2>
                <p>نوع الحساب: {USER_TYPES[currentUser.user_type]}</p>
                
                <div className="verification-badges">
                  {currentUser.is_phone_verified && (
                    <div className="verification-badge verified">
                      ✅ تم التحقق من رقم الهاتف
                    </div>
                  )}
                  
                  {currentUser.is_nafath_verified && (
                    <div className="verification-badge verified">
                      ✅ تم التحقق من الهوية عبر النفاذ الوطني
                    </div>
                  )}
                  
                  {!currentUser.is_nafath_verified && 
                   ['property_owner', 'broker_individual', 'broker_company'].includes(currentUser.user_type) && (
                    <div className="verification-badge pending">
                      ⚠️ يتطلب التحقق من الهوية عبر النفاذ الوطني
                      <button 
                        onClick={() => setShowLoginModal(true)} 
                        className="verify-btn"
                      >
                        التحقق الآن
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Featured Properties */}
        <section className="properties-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">العقارات المميزة</h2>
              <div className="section-tabs">
                <button className="tab-btn active">الكل</button>
                <button className="tab-btn">للبيع</button>
                <button className="tab-btn">للإيجار</button>
                <button className="tab-btn">المشاريع</button>
              </div>
              <a href="#more" className="more-link">المزيد →</a>
            </div>
            
            <div className="properties-grid">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Latest Properties */}
        <section className="properties-section latest">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">العقارات الأحدث</h2>
              <div className="section-tabs">
                <button className="tab-btn active">الكل</button>
                <button className="tab-btn">للبيع</button>
                <button className="tab-btn">للإيجار</button>
                <button className="tab-btn">المشاريع</button>
              </div>
              <a href="#more" className="more-link">المزيد →</a>
            </div>
            
            <div className="properties-grid">
              {latestProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Most Viewed Properties */}
        <section className="properties-section most-viewed">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">العقارات الأكثر مشاهدة</h2>
              <div className="section-tabs">
                <button className="tab-btn active">الكل</button>
                <button className="tab-btn">للبيع</button>
                <button className="tab-btn">للإيجار</button>
                <button className="tab-btn">المشاريع</button>
              </div>
              <a href="#more" className="more-link">المزيد →</a>
            </div>
            
            <div className="properties-grid">
              {mostViewedProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Properties by Region */}
        <section className="regions-section">
          <div className="container">
            <h2 className="section-title">العقارات حسب المنطقة</h2>
            
            <div className="regions-tabs">
              {Object.entries(REGIONS).map(([key, name]) => (
                <button key={key} className="region-tab">
                  {name}
                  <span className="property-count">(125)</span>
                </button>
              ))}
            </div>
            
            <div className="properties-grid">
              {SAMPLE_PROPERTIES.slice(0, 4).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Agents Section */}
        <section className="agents-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">الوسطاء المميزون</h2>
              <a href="#more-agents" className="more-link">المزيد →</a>
            </div>
            
            <div className="agents-grid">
              {SAMPLE_AGENTS.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo">🏠</div>
                <h3>عنوان</h3>
                <p>منصة الوساطة والتسويق العقاري</p>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>روابط سريعة</h4>
              <ul>
                <li><a href="#properties">العقارات</a></li>
                <li><a href="#brokers">الوسطاء</a></li>
                <li><a href="#photography">التصوير</a></li>
                <li><a href="#pricing">الأسعار</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>خدمات</h4>
              <ul>
                <li><a href="#add-property">إضافة عقار</a></li>
                <li><a href="#property-request">طلب عقار</a></li>
                <li><a href="#mediation">عقد وساطة</a></li>
                <li><a href="#marketing">عقد تسويق</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>تواصل معنا</h4>
              <div className="contact-info">
                <p>📞 +966 11 123 4567</p>
                <p>✉️ info@onwan.sa</p>
                <p>📍 الرياض، المملكة العربية السعودية</p>
              </div>
              
              <div className="social-links">
                <a href="#twitter" className="social-link">🐦</a>
                <a href="#linkedin" className="social-link">💼</a>
                <a href="#instagram" className="social-link">📷</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>شهادة التوثيق</h4>
              <div className="certification">
                <div className="cert-badge">🏛️</div>
                <p>منصة معتمدة من الهيئة العامة للعقار</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>© 2024 عنوان. جميع الحقوق محفوظة.</p>
              <div className="footer-links">
                <a href="#privacy">سياسة الخصوصية</a>
                <a href="#terms">الشروط والأحكام</a>
                <a href="#support">الدعم الفني</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;