import { useEffect, useState } from "react";
import api from "../utils/api";
import SpecialOfferCard from "../components/SpecialOfferCard";
import CreateOfferForm from "../components/CreateOfferForm";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const res = await api.get("/offers/");
      setOffers(res.data);
    };

    fetchOffers();
  }, []);

  return (
    <div className="offers-page">
      <h1>Special Offers</h1>
      <CreateOfferForm />
      <div className="offers-grid">
        {offers.map((offer) => (
          <SpecialOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
