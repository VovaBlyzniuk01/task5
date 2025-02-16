import React, { useState } from 'react';
import './App.css';
import skypeIcon from './images/skype.png';
import facebookIcon from './images/facebook.png';
import emailIcon from './icons/email.png';
import phoneIcon from './icons/phone.png';
import lockIcon from './icons/lock.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Country, City } from 'country-state-city';

// Простой API для работы с телефонными номерами
const phoneAPI = {
  // Валидация номера телефона
  validatePhone: (phoneNumber) => {
    const phoneRegex = /^\+1\s\d{3}\s\d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  },

  // Форматирование номера в нужный формат
  formatPhone: (phoneNumber) => {
    // Убираем все кроме цифр
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Форматируем как +1 XXX XXX-XXXX
    if (cleaned.length === 10) {
      return `+1 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  },

  // Получение кода страны
  getCountryCode: (phoneNumber) => {
    return phoneNumber.split(' ')[0];
  }
};

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    pin: '',
    skype: '',
    facebook: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    optional: '',
    confirmationCode: ''
  });
  const [countries] = useState(Country.getAllCountries());
  const [cities, setCities] = useState([]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCodeConfirm = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStep(5);
  };

  const handleContactsSubmit = (e) => {
    e.preventDefault();
    setStep(6);
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setStep(7);
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = phoneAPI.formatPhone(e.target.value);
    
    if (phoneAPI.validatePhone(formattedPhone)) {
      setFormData({...formData, phoneNumber: formattedPhone});
    }
  };

  // Обработчик выбора страны
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(country => country.isoCode === countryCode);
    
    setFormData({
      ...formData, 
      country: selectedCountry.name,
      city: '' // Сбрасываем город при смене страны
    });
    
    // Получаем города выбранной страны
    const countryCities = City.getCitiesOfCountry(countryCode);
    setCities(countryCities || []);
  };

  // Добавим функцию для сохранения данных
  const handleSaveData = () => {
    const registrationData = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth
      },
      contacts: {
        email: formData.email,
        phone: formData.phoneNumber,
        socialNetworks: {
          skype: formData.skype,
          facebook: formData.facebook
        }
      },
      address: {
        street: formData.address,
        city: formData.city,
        country: formData.country,
        zipCode: formData.zipCode,
        optional: formData.optional
      }
    };

    console.log('Registration completed successfully!');
    console.log('Form Data:', registrationData);
  };

  return (
    <div className="app-wrapper">
      <div className="company-logo">
        <div className="logo-circle">C</div>
        <span className="company-name">COMPANY NAME</span>
      </div>
      <div className="progress-container">
        <div className="progress-dots">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`progress-dot ${
                (step >= dot && step <= 3) || 
                (step >= dot + 3 && step <= 6)
                  ? 'active'
                  : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="registration-container">
        <div className="registration-header">
          <h1>{step === 4 || step === 5 || step === 6 ? 'Profile info' : 'Registration'}</h1>
          <p>
            {step === 4 || step === 5 || step === 6
              ? 'Fill in the data for profile. It will take a couple of minutes.\nYou only need a passport'
              : 'Fill in the registration data. It will take a couple of minutes.'}
            {step === 1 && <><br />All you need is a phone number and e-mail</>}
          </p>
        </div>

        <div className="security-notice">
          <span className="lock-icon">
            <img src={lockIcon} alt="Security" />
          </span>
          <p>We take privacy issues seriously. You can be sure that your personal data is securely protected.</p>
          <button className="close-button">×</button>
        </div>
        
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="phone-input">
              <label>Enter your phone number</label>
              <PhoneInput
                country={'us'}
                value={formData.phoneNumber}
                onChange={phone => setFormData({...formData, phoneNumber: phone})}
                containerClass="phone-field"
                inputClass="phone-field-input"
                buttonClass="country-dropdown"
                placeholder="Enter phone number"
              />
            </div>
            <div className="button-container">
              <button type="submit" className="primary-button outline compact">Send Code</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeConfirm}>
            <div className="confirmation-code">
              <label>Confirmation code</label>
              <div className="code-input">
                <input
                  type="text"
                  value={formData.confirmationCode}
                  onChange={(e) => setFormData({...formData, confirmationCode: e.target.value})}
                />
              </div>
              <p className="confirmation-hint">Confirm phone number with code from sms message</p>
              <button type="button" className="send-again-link">
                <span className="refresh-icon">⟳</span>
                Send again
              </button>
            </div>
            <div className="button-container">
              <button type="submit" className="primary-button outline compact">Confirm</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegistration}>
            <div className="phone-confirmed">
              <div className="phone-number-row">
                <p>{formData.phoneNumber}</p>
                <span className="check-icon">✓</span>
              </div>
              <p className="status-text">Number confirmed</p>
            </div>
            <div className="form-group">
              <label>Enter email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="alex_manager@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Set password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <p className="password-strength">Strong password</p>
            </div>
            <div className="button-container">
              <button type="submit" className="primary-button compact blue">Register now</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleProfileSubmit}>
            <div className="form-container">
              <div className="form-header">
                <h3>Personal data</h3>
                <p>Specify exactly as in your passport</p>
              </div>
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Place of birth</label>
                  <input
                    type="text"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="primary-button outline compact">
                Go next <span className="arrow-icon">→</span>
              </button>
            </div>
          </form>
        )}

        {step === 5 && (
          <form onSubmit={handleContactsSubmit}>
            <div className="form-container">
              <div className="form-header">
                <h3>Contacts</h3>
                <p>These contacts are used to inform about orders</p>
              </div>

              <div className="form-group">
                <div className="contact-field">
                  <span className="contact-icon">
                    <img src={emailIcon} alt="Email" />
                  </span>
                  <input
                    type="email"
                    value={formData.email || ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="contact-field">
                  <span className="contact-icon">
                    <img src={phoneIcon} alt="Phone" />
                  </span>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ''}
                    readOnly
                  />
                </div>
              </div>

              <div className="social-networks">
                <h4>Social network</h4>
                <p>Indicate the desired communication method</p>

                <div className="form-group">
                  <div className="social-field">
                    <span className="social-icon">
                      <img src={skypeIcon} alt="Skype" />
                    </span>
                    <select defaultValue="Skype">
                      <option>Skype</option>
                    </select>
                    <input
                      type="text"
                      placeholder="@alex_92"
                      value={formData.skype}
                      onChange={(e) => setFormData({...formData, skype: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="social-field">
                    <span className="social-icon">
                      <img src={facebookIcon} alt="Facebook" />
                    </span>
                    <select defaultValue="Facebook">
                      <option>Facebook</option>
                    </select>
                    <input
                      type="text"
                      placeholder="@profile"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    />
                  </div>
                </div>

                <button type="button" className="add-more-button">
                  <span className="plus-icon">+</span>
                  Add More
                </button>
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="primary-button outline compact">
                Go Next <span className="arrow-icon">→</span>
              </button>
            </div>
          </form>
        )}

        {step === 6 && (
          <form>
            <div className="form-container">
              <div className="form-header">
                <h3>Delivery address</h3>
                <p>Used for shipping orders</p>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="47 W 13th St"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    value={countries.find(c => c.name === formData.country)?.isoCode || ''}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    disabled={!formData.country}
                  >
                    <option value="">Select city</option>
                    {cities.map((city, index) => (
                      <option 
                        key={`${city.name}-${index}`} 
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Zip code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  placeholder="10011"
                />
              </div>

              <div className="form-group">
                <label>Optional</label>
                <input
                  type="text"
                  value={formData.optional}
                  onChange={(e) => setFormData({...formData, optional: e.target.value})}
                />
              </div>
            </div>
            <div className="button-container">
              <button 
                type="button" 
                className="primary-button blue compact"
                onClick={handleSaveData}
              >
                <span className="check-icon">✓</span>
                Save
              </button>
            </div>
          </form>
        )}

        {/* Добавим остальные шаги позже */}
      </div>
    </div>
  );
}

export default App;
