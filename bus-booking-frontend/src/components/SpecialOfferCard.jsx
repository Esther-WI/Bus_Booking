import "./SpecialOfferCard.css"

const SpecialOfferCard = ({ offer }) => {
  return (
    <div className="special-offer-card">
      <div className="offer-badge">Limited Time</div>
      <div className="offer-content">
        <h3>{offer.title}</h3>
        <p className="offer-description">{offer.description}</p>
        <div className="offer-details">
          <span className="offer-price">{offer.discount}</span>
          <span className="offer-terms">{offer.terms}</span>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferCard;
