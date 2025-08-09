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

// Header Component
const Header = ({ onLoginClick, currentUser, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏠</div>
            <h1 className="site-title">عنوان</h1>
            <p className="site-subtitle">منصة الوساطة والتسويق العقاري</p>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li><a href="#properties">العقارات</a></li>
              <li><a href="#brokers">الوساطة</a></li>
              <li><a href="#photography">التصوير</a></li>
              <li><a href="#pricing">الأسعار والباقات</a></li>
              <li><a href="#policies">السياسات والشروط</a></li>
              <li><a href="#support">الدعم</a></li>
              <li><a href="#language">اللغة</a></li>
            </ul>
          </nav>
          
          <div className="auth-section">
            {currentUser ? (
              <div className="user-menu">
                <span className="welcome-text">
                  مرحباً، {currentUser.full_name_arabic || currentUser.phone_number}
                </span>
                <span className="user-type-badge">{USER_TYPES[currentUser.user_type]}</span>
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

// Login Modal Component
const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('phone'); // phone, otp, nafath
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
        // Refresh user data
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
    // Check for stored user data
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

  return (
    <div className="App">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h2 className="hero-title">منصة عنوان للوساطة والتسويق العقاري</h2>
              <p className="hero-description">
                المنصة الرائدة في المملكة العربية السعودية للوساطة والتسويق العقاري
                <br />
                تقدم عروض وتستقبل طلبات عقارية بأحدث التقنيات
              </p>
              
              {currentUser ? (
                <div className="user-welcome">
                  <h3>مرحباً {currentUser.full_name_arabic || currentUser.phone_number}</h3>
                  <p>نوع الحساب: {USER_TYPES[currentUser.user_type]}</p>
                  
                  {currentUser.is_phone_verified && (
                    <div className="verification-status verified">
                      ✅ تم التحقق من رقم الهاتف
                    </div>
                  )}
                  
                  {currentUser.is_nafath_verified && (
                    <div className="verification-status verified">
                      ✅ تم التحقق من الهوية عبر النفاذ الوطني
                    </div>
                  )}
                  
                  {!currentUser.is_nafath_verified && 
                   ['property_owner', 'broker_individual', 'broker_company'].includes(currentUser.user_type) && (
                    <div className="verification-status pending">
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
              ) : (
                <div className="auth-prompt">
                  <p>سجل دخولك للوصول إلى جميع الخدمات</p>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="cta-button"
                  >
                    ابدأ الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="features-section">
          <div className="container">
            <h3 className="section-title">أنواع المستخدمين</h3>
            <div className="user-types-grid">
              {Object.entries(USER_TYPES).map(([key, name]) => (
                <div key={key} className="user-type-card">
                  <h4>{name}</h4>
                  <p>
                    {key === 'visitor' && 'يمكنه التصفح والتفاعل مع الإعلانات بالتفضيل والإعجاب فقط'}
                    {key === 'property_seeker' && 'يمكنه إضافة طلب عقار والتفاعل مع الإعلانات'}
                    {key === 'property_owner' && 'يمكنه إضافة العقارات وطلب عقود الوساطة والتسويق'}
                    {key === 'broker_individual' && 'وسيط عقاري فردي مع صلاحيات إدارة العقارات'}
                    {key === 'broker_company' && 'وسيط عقاري مؤسسي مع صلاحيات موسعة'}
                    {key === 'photographer' && 'يمكنه تقديم خدمات التصوير العقاري'}
                    {key === 'admin' && 'مدير الموقع مع كامل الصلاحيات'}
                  </p>
                  {['property_owner', 'broker_individual', 'broker_company'].includes(key) && (
                    <div className="nafath-required">🔐 يتطلب التحقق عبر النفاذ الوطني</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;