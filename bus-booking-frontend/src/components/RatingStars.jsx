const RatingStars = ({ rating, setRating, editable = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="rating-stars">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""} ${
            editable ? "editable" : ""
          }`}
          onClick={() => editable && setRating(star)}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
