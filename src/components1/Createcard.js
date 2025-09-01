import './Createcard.css';
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig.js';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateCard = ({ user }) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', image: null, cost: '', details: '' });
  const [shopPhoto, setShopPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);
  const [shopPhotoURL, setShopPhotoURL] = useState('');
  const [ownerPhotoURL, setOwnerPhotoURL] = useState('');
  const [publicLink, setPublicLink] = useState('');
  const [cardExists, setCardExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCard();
    }
  }, [user]);

  const fetchCard = async () => {
    if (!user) return;
    const docRef = doc(db, 'cards', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setBusinessName(data.businessName || '');
      setOwnerName(data.ownerName || '');
      setAddress(data.address || '');
      setPrimaryPhone(data.primaryPhone || '');
      setAltPhone(data.altPhone || '');
      setWhatsapp(data.whatsapp || '');
      setEmail(data.email || '');
      setProducts(data.products || []);
      setShopPhotoURL(data.shopPhotoURL || '');
      setOwnerPhotoURL(data.ownerPhotoURL || '');
      setPublicLink(`yourwebsite.com/card/${user.uid}`);
      setCardExists(true);
    } else {
      setCardExists(false);
    }
  };

  const handleFileUpload = async (file, folder) => {
    if (!file) return null;
    const storageRef = ref(storage, `${folder}/${user.uid}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleProductImageUpload = async (file) => {
    if (!file) return null;
    return await handleFileUpload(file, 'productImages');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in first.');
    
    setLoading(true);
    
    let shopURL = shopPhoto ? await handleFileUpload(shopPhoto, 'shopPhotos') : shopPhotoURL;
    let ownerURL = ownerPhoto ? await handleFileUpload(ownerPhoto, 'ownerPhotos') : ownerPhotoURL;

    const cardData = {
      businessName,
      ownerName,
      address,
      primaryPhone,
      altPhone,
      whatsapp,
      email,
      products,
      shopPhotoURL: shopURL,
      ownerPhotoURL: ownerURL,
      userId: user.uid,
    };

    await setDoc(doc(db, 'cards', user.uid), cardData);
    
    setCardExists(true);
    setLoading(false);
    alert(cardExists ? 'Card Updated!' : 'Card Created!');
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.cost) {
      return alert('Please enter product name and cost.');
    }

    let imageURL = newProduct.image ? await handleProductImageUpload(newProduct.image) : '';

    setProducts([...products, { ...newProduct, image: imageURL }]);
    setNewProduct({ name: '', image: null, cost: '', details: '' });
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return user ? (
    <div className="card-container">
      <h2>{cardExists ? 'Your Business Card' : 'Create Your Business Card'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Business Name' value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        <input type='text' placeholder='Owner Name' value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
        <input type='text' placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
        <input type='text' placeholder='Primary Phone' value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} required />
        <input type='text' placeholder='Alternate Phone' value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
        <input type='text' placeholder='WhatsApp Number' value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <label>Shop Photo:</label>
        <input type="file" onChange={(e) => setShopPhoto(e.target.files[0])} />
        
        <label>Owner Photo:</label>
        <input type="file" onChange={(e) => setOwnerPhoto(e.target.files[0])} />

        <h3>Products</h3>
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <p><strong>{product.name}</strong> - ₹{product.cost}</p>
            {product.image && <img src={product.image} alt={product.name} width="100" />}
            <button type="button" onClick={() => handleRemoveProduct(index)}>Remove</button>
          </div>
        ))}

        <h4>Add New Product</h4>
        <input type='text' placeholder='Product Name' value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
        <input type='number' placeholder='Cost' value={newProduct.cost} onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })} required />
        <input type='text' placeholder='Details' value={newProduct.details} onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })} />
        <input type='file' onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} />
        <button type='button' onClick={handleAddProduct}>Add Product</button>

        <button type='submit' disabled={loading}>{loading ? 'Saving...' : cardExists ? 'Update Card' : 'Create Card'}</button>
      </form>

      {cardExists && (
        <div>
          <p>Share your business card: <a href={publicLink} target='_blank' rel='noopener noreferrer'>{publicLink}</a></p>
        </div>
      )}
    </div>
  ) : (
    <p>Please log in to create or view your business card.</p>
  );
};

export default CreateCard;
