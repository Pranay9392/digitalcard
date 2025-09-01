import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import '../../Styles/Card.css';

const PublicCard = () => {
  const { userId } = useParams();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, 'cards', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCardData(docSnap.data());
        } else {
          setError('Business card not found');
        }
      } catch (err) {
        setError('Failed to load card');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [userId]);

  if (loading) return <div className="loading">Loading business card...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cardData) return <div className="not-found">No card data available</div>;

  return (
    <div className="business-card public-card">
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

      {/* Static Google Map */}
      {cardData.address && (
          <div className="map-container">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                cardData.address
              )}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(
                cardData.address
              )}&key=AIzaSyCe-qF4ofvpaVALf5SuYY074hD1t1rkJ_I`}
              alt="Google Map"
              className="static-map"
            />
          </div>
        )}

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


      
    </div>
  );
};

export default PublicCard;
