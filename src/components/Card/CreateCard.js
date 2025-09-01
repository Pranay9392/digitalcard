// src/components/Card/CreateCard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Card.css';


const CreateCard = () => {
  const { user, updateCardStatus } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: user?.displayName || '',
    address: '',
    primaryPhone: '',
    altPhone: '',
    whatsapp: '',
    email: user?.email || '',
    products: [],
    shopPhotoURL: '',
    ownerPhotoURL: ''
  });
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    image: null, 
    cost: '', 
    details: '' 
  });
  
  const [shopPhoto, setShopPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            ...data,
            email: data.email || user.email
          }));
        }
      } catch (err) {
        setError('Failed to load card data');
        console.error(err);
      }
    };

    fetchCard();
  }, [user]);

  const handleFileUpload = async (file, folder) => {
    if (!file) return null;
    const storageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [shopURL, ownerURL] = await Promise.all([
        shopPhoto ? handleFileUpload(shopPhoto, 'shopPhotos') : formData.shopPhotoURL,
        ownerPhoto ? handleFileUpload(ownerPhoto, 'ownerPhotos') : formData.ownerPhotoURL
      ]);

      const cardData = {
        ...formData,
        shopPhotoURL: shopURL,
        ownerPhotoURL: ownerURL,
        userId: user.uid,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(doc(db, 'cards', user.uid), cardData);
      updateCardStatus(true);
      
      navigate('/my-card');
    } catch (err) {
      setError('Failed to save card: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.cost) {
      setError('Product name and cost are required');
      return;
    }

    try {
      const imageURL = newProduct.image 
        ? await handleFileUpload(newProduct.image, 'productImages') 
        : '';

      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { 
          ...newProduct, 
          image: imageURL,
          id: Date.now().toString()
        }]
      }));
      
      setNewProduct({ name: '', image: null, cost: '', details: '' });
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  const handleRemoveProduct = (id) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div className="card-container">Please sign in to access this page</div>;
  }

  return (
    <div className="card-container">
      <h2>{formData.businessName ? 'Edit Your Business Card' : 'Create Your Business Card'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="card-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Business Name*</label>
            <input 
              type="text" 
              name="businessName"
              value={formData.businessName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Owner Name*</label>
            <input 
              type="text" 
              name="ownerName"
              value={formData.ownerName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleInputChange} 
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label>Primary Phone*</label>
            <input 
              type="tel" 
              name="primaryPhone"
              value={formData.primaryPhone} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Alternate Phone</label>
            <input 
              type="tel" 
              name="altPhone"
              value={formData.altPhone} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input 
              type="tel" 
              name="whatsapp"
              value={formData.whatsapp} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Email*</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Photos</h3>
          <div className="photo-upload">
            <div className="photo-group">
              <label>Shop Photo</label>
              <input 
                type="file" 
                onChange={(e) => setShopPhoto(e.target.files[0])} 
                accept="image/*"
              />
              {formData.shopPhotoURL && (
                <img src={formData.shopPhotoURL} alt="Shop preview" className="image-preview" />
              )}
            </div>
            
            <div className="photo-group">
              <label>Owner Photo</label>
              <input 
                type="file" 
                onChange={(e) => setOwnerPhoto(e.target.files[0])} 
                accept="image/*"
              />
              {formData.ownerPhotoURL && (
                <img src={formData.ownerPhotoURL} alt="Owner preview" className="image-preview" />
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Products/Services</h3>
          
          <div className="products-list">
            {formData.products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="price">₹{product.cost}</p>
                  {product.details && <p>{product.details}</p>}
                  {product.image && (
                    <img src={product.image} alt={product.name} className="product-image" />
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveProduct(product.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="add-product">
            <h4>Add New Product</h4>
            <div className="form-group">
              <label>Product Name*</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Cost*</label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Details</label>
              <textarea
                value={newProduct.details}
                onChange={(e) => setNewProduct({...newProduct, details: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Product Image</label>
              <input
                type="file"
                onChange={(e) => setNewProduct({...newProduct, image: e.target.files[0]})}
                accept="image/*"
              />
            </div>
            
            <button 
              type="button" 
              onClick={handleAddProduct}
              className="add-btn"
            >
              Add Product
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Saving...' : 'Save Card'}
        </button>
      </form>
    </div>
  );
};

export default CreateCard;