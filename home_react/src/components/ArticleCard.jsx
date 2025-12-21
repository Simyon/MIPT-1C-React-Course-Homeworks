import { useEffect, useMemo, useState } from "react";
import { getComments } from "../helpers/get-comments-by-article";

export default function ArticleCard({
  article,
  comments,  
  onCommentsLoaded,
  onAddComment,
  onDeleteComment,
}) {
  const { articleId, title, text, currentLikes, commentsCount } = article;
  
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(currentLikes);

  const toggleLike = () => {
    setLiked((prevLiked) => {
      setLikes((prevLikes) => (prevLiked ? prevLikes - 1 : prevLikes + 1));
      return !prevLiked;
    });
  };
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const hasLoadedComments = useMemo(() => Array.isArray(comments), [comments]);

  useEffect(() => {
    if (!isCommentsOpen) return;
    if (hasLoadedComments) return;

    setIsLoadingComments(true);
    getComments(articleId)
      .then((loaded) => onCommentsLoaded(articleId, loaded))
      .finally(() => setIsLoadingComments(false));
  }, [isCommentsOpen, hasLoadedComments, articleId, onCommentsLoaded]);

  const handleToggleComments = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    const a = author.trim();
    const t = commentText.trim();

    if (!a || !t) return;

    onAddComment(articleId, { author: a, articleId, text: t });

    setAuthor("");
    setCommentText("");
  };

  const currentComments = comments ?? [];

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 12 }}>
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <p style={{ margin: "0 0 12px" }}>{text}</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span>Likes: {likes}</span>
        <button onClick={toggleLike}>{liked ? "Unlike" : "Like"}</button>
        {liked && <span style={{ fontSize: 12, padding: "2px 8px", border: "1px solid #4caf50", borderRadius: 999 }}>Liked</span>}

        <span>Comments: {commentsCount}</span>

        <button onClick={handleToggleComments}>
          {isCommentsOpen ? "Hide comments" : "Open comments"}
        </button>
      </div>

      {isCommentsOpen && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee" }}>
          {isLoadingComments && !hasLoadedComments ? (
            <div>Loading comments...</div>
          ) : currentComments.length === 0 ? (
            <div>No comments</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {currentComments.map((c, idx) => (
                <li key={`${c.author}-${idx}`} style={{ marginBottom: 8 }}>
                  <b>{c.author}:</b> {c.text}{" "}
                  <button onClick={() => onDeleteComment(articleId, idx)} style={{ marginLeft: 8 }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          <form onSubmit={handleSubmitComment} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                placeholder="Comment text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ minWidth: 240 }}
              />
              <button type="submit">Publish</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}