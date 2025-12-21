import { useState } from "react";
import "./CardItem.css";

export default function CardItem({ item }) {
  const { title, text, currentLikes } = item;

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(currentLikes);

  const handleToggleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className={`card ${liked ? "card--liked" : ""}`}>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{text}</p>

      <div className="card__footer">
        <span className="card__likes">Likes: {likes}</span>

        <button className="card__btn" onClick={handleToggleLike}>
          {liked ? "Unlike" : "Like"}
        </button>

        {liked && <span className="card__badge">Liked</span>}
      </div>
    </div>
  );
}