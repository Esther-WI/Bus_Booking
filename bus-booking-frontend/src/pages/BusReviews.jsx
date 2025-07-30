import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import CommentCard from "../components/CommentCard";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import "./BusReviews.css";

const BusReviews = () => {
  const params = useParams();
  console.log("Route params:", params); 
  
  const { id: bus_id } = useParams();
  console.log("Extracted bus_id:", bus_id);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busDetails, setBusDetails] = useState(null);
  const [newComment, setNewComment] = useState({
    rating: 5,
    text: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bus details
        const busResponse = await api.get(`http://127.0.0.1:5000/api/buses/${bus_id}`);
        setBusDetails(busResponse.data);
        
        // Fetch reviews for this bus
        const reviewsResponse = await api.get(`http://127.0.0.1:5000/api/buses/${bus_id}/reviews`);
        setComments(reviewsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bus_id]);

  const handleRatingChange = (rating) => {
    setNewComment(prev => ({ ...prev, rating }));
  };

  const handleTextChange = (e) => {
    setNewComment(prev => ({ ...prev, text: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await api.post(`http://127.0.0.1:5000/api/buses/${bus_id}/reviews`, {
        rating: newComment.rating,
        text: newComment.text,
        comment: newComment.text 
      });

      setComments([response.data, ...comments]);
      setNewComment({ rating: 5, text: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bus-reviews-page">
      {busDetails && (
        <div className="bus-header">
          <h2>Reviews for {busDetails.model} ({busDetails.registration_number})</h2>
          <p>Capacity: {busDetails.capacity} | Status: {busDetails.status}</p>
        </div>
      )}

      {user && user.role === "Customer" && (
        <section className="add-review">
          <h3>Share Your Experience</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Your Rating</label>
              <RatingStars
                rating={newComment.rating}
                setRating={handleRatingChange}
                editable={true}
              />
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                value={newComment.text}
                onChange={handleTextChange}
                required
                rows="4"
                placeholder="Share your experience with this bus..."
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>
        </section>
      )}

      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default BusReviews;