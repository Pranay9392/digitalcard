// src/components/Card/UserCard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Card.css';

const UserCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'cards', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCardData(docSnap.data());
        } else {
          navigate('/create-card');
        }
      } catch (err) {
        setError('Failed to load card');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [user, navigate]);

  if (loading) return <div className="loading">Loading your card...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cardData) return <div className="not-found">No card data found</div>;

  return (
    <div className="card-view-container">
      <div className="card-actions">
        <button onClick={() => navigate('/create-card')} className="edit-btn">
          Edit Card
        </button>
      </div>
      
      <div className="business-card">
        <div className="card-header">
          {cardData.ownerPhotoURL && (
            <img src={cardData.ownerPhotoURL} alt="Owner" className="owner-photo" />
          )}
          <div className="header-text">
            <h1>{cardData.businessName}</h1>
            <h2>{cardData.ownerName}</h2>
          </div>
        </div>

        <div className="card-body">
          <div className="contact-info">
            {cardData.address && (
              <p><i className="fas fa-map-marker-alt"></i> {cardData.address}</p>
            )}
            <p><i className="fas fa-phone"></i> {cardData.primaryPhone}</p>
            {cardData.altPhone && (
              <p><i className="fas fa-phone-alt"></i> {cardData.altPhone}</p>
            )}
            {cardData.whatsapp && (
              <p><i className="fab fa-whatsapp"></i> {cardData.whatsapp}</p>
            )}
            <p><i className="fas fa-envelope"></i> {cardData.email}</p>
          </div>

          {cardData.shopPhotoURL && (
            <img src={cardData.shopPhotoURL} alt="Shop" className="shop-photo" />
          )}
        </div>

        {cardData.products?.length > 0 && (
          <div className="products-section">
            <h3>Products / Services</h3>
            <div className="products-grid">
              {cardData.products.map((product, index) => (
                <div key={index} className="product-card">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="product-image" />
                  )}
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p className="price">₹{product.cost}</p>
                    {product.details && <p className="details">{product.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="share-section">
          <h3>Share Your Card</h3>
          <p className="share-link">
            Your public link: <a 
              href={`${window.location.origin}/card/${user.uid}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {window.location.host}/card/{user.uid}
            </a>
          </p>
          {/* Add QR code generation here if needed */}
        </div>
      </div>
    </div>
  );
};

export default UserCard;