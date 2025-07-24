import RatingStars from "./RatingStars";

const CommentCard = ({ comment }) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <h4>{comment.userName}</h4>
        <RatingStars rating={comment.rating} />
        <span className="comment-date">
          {new Date(comment.date).toLocaleDateString()}
        </span>
      </div>
      <div className="comment-body">
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentCard;
