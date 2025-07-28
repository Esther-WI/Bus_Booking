import { useState, useEffect, useContext } from "react";
import RatingStars from "../components/RatingStars";
import CommentCard from "../components/CommentCard";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState({
    rating: 5,
    text: "",
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get("api/buses/reviews");
        setComments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch feedback");
      }
    };
    fetchComments();
  }, []);

  const handleRatingChange = (rating) => {
    setNewComment((prev) => ({ ...prev, rating }));
  };

  const handleTextChange = (e) => {
    setNewComment((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("api/buses/reviews", {
        rating: newComment.rating,
        text: newComment.text,
      });

      setComments([response.data, ...comments]);
      setNewComment({ rating: 5, text: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-page">
      <section className="testimonials-section">
        <h1>What Our Customers Say</h1>
        <p className="subtitle">Real experiences from real travelers</p>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <RatingStars rating={5} />
            <p className="testimonial-text">
              "Amazing service! The bus was comfortable and arrived on time."
            </p>
            <p className="testimonial-author">Sarah Johnson</p>
            <p className="testimonial-route">New York – Boston</p>
          </div>

          <div className="testimonial-card">
            <RatingStars rating={5} />
            <p className="testimonial-text">
              "Easy booking process and great customer support."
            </p>
            <p className="testimonial-author">Michael Chen</p>
            <p className="testimonial-route">LA – San Francisco</p>
          </div>

          <div className="testimonial-card">
            <RatingStars rating={5} />
            <p className="testimonial-text">
              "Clean buses, friendly drivers, highly recommended!"
            </p>
            <p className="testimonial-author">Emily Davis</p>
            <p className="testimonial-route">Chicago – Detroit</p>
          </div>
        </div>
      </section>

      <section className="feedback-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join thousands of satisfied customers who trust BusBooker</p>
        <button className="cta-button">Book Your First Trip</button>
      </section>

      {user && (
        <section className="add-feedback">
          <h3>Share Your Experience</h3>
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "1em" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label>Your Rating</label>
              <RatingStars
                rating={newComment.rating}
                setRating={handleRatingChange}
                editable={true}
              />
            </div>
            <div className="form-group">
              <label>Your Comment</label>
              <textarea
                value={newComment.text}
                onChange={handleTextChange}
                required
                rows="4"
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Feedback
            </button>
          </form>
        </section>
      )}

      <div className="user-feedback-list">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Feedback;
