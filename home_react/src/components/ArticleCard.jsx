import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ArticleCard.module.scss";

import { getComments } from "../helpers/get-comments-by-article";

const cx = classNames.bind(styles);

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

  const toggleLike = () => {
    setLiked((prevLiked) => {
      setLikes((prevLikes) => (prevLiked ? prevLikes - 1 : prevLikes + 1));
      return !prevLiked;
    });
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
    <div className={cx("card", { liked })}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>

      <div className={styles.metaRow}>
        <span className={styles.meta}>Likes: {likes}</span>

        <button className={styles.button} onClick={toggleLike}>
          {liked ? "Unlike" : "Like"}
        </button>

        <span className={styles.meta}>Comments: {commentsCount}</span>

        <button className={styles.button} onClick={() => setIsCommentsOpen((p) => !p)}>
          {isCommentsOpen ? "Hide comments" : "Open comments"}
        </button>

        <span className={cx("badge", { badgeVisible: liked })}>Liked</span>
      </div>

      <div className={cx("comments", { open: isCommentsOpen })}>
        {isCommentsOpen && (
          <>
            {isLoadingComments && !hasLoadedComments ? (
              <div className={styles.loader}>Loading comments...</div>
            ) : currentComments.length === 0 ? (
              <div className={styles.empty}>No comments</div>
            ) : (
              <ul className={styles.commentList}>
                {currentComments.map((c, idx) => (
                  <li key={`${c.author}-${idx}`} className={styles.commentItem}>
                    <b>{c.author}:</b> {c.text}
                    <button
                      className={cx("button", "danger")}
                      onClick={() => onDeleteComment(articleId, idx)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form className={styles.form} onSubmit={handleSubmitComment}>
              <input
                className={styles.input}
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Comment text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className={styles.button} type="submit">
                Publish
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}