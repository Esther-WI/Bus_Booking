import RatingStars from "./RatingStars";
import "../components/CommentCard.css";

const CommentCard = ({ comment }) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="user-info">
          <h4 className="user-name">{comment.userName}</h4>
          <div className="meta-info">
            <RatingStars rating={comment.rating} />
            <span className="comment-date">
              {new Date(comment.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="comment-body">
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentCard;