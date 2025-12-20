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
  onToggleCommentLike,
  onEditCommentText,
  onToggleArticleLike,
  onEditArticleTitle,
  onEditArticleText,
}) {
  const { articleId, commentsCount } = article;
<<<<<<< HEAD

=======
  
>>>>>>> 3285938 (Задание 6 готово.)
  const [likedArticle, setLikedArticle] = useState(false);
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
<<<<<<< HEAD
  
=======

>>>>>>> 3285938 (Задание 6 готово.)
  const [commentsSort, setCommentsSort] = useState(null); // "date" | "likes" | null
  
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isEditText, setIsEditText] = useState(false);
  const [titleDraft, setTitleDraft] = useState(article.title);
  const [textDraft, setTextDraft] = useState(article.text);

  useEffect(() => setTitleDraft(article.title), [article.title]);
  useEffect(() => setTextDraft(article.text), [article.text]);

  const hasLoadedComments = useMemo(() => Array.isArray(comments), [comments]);

  useEffect(() => {
    if (!isCommentsOpen) return;
    if (hasLoadedComments) return;

    setIsLoadingComments(true);
    getComments(articleId)
      .then((loaded) => onCommentsLoaded(articleId, loaded))
      .finally(() => setIsLoadingComments(false));
  }, [isCommentsOpen, hasLoadedComments, articleId, onCommentsLoaded]);

  const toggleArticleLike = () => {
    setLikedArticle((prev) => {
      const next = !prev;
      onToggleArticleLike(articleId, next);
      return next;
    });
  };

  const saveTitle = () => {
    const t = titleDraft.trim();
    if (!t) return;
    onEditArticleTitle(articleId, t);
    setIsEditTitle(false);
  };

  const saveText = () => {
    const t = textDraft.trim();
    if (!t) return;
    onEditArticleText(articleId, t);
    setIsEditText(false);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const a = author.trim();
    const t = commentText.trim();
    if (!a || !t) return;

    onAddComment(articleId, {
      author: a,
      articleId,
      text: t,
      createdAt: Date.now(),
      likes: 0,
      commentId: `${articleId}-${Date.now()}`,
    });

    setAuthor("");
    setCommentText("");
  };

  const displayedComments = useMemo(() => {
    const list = comments ?? [];
    const copy = [...list];
    if (commentsSort === "date") copy.sort((a, b) => b.createdAt - a.createdAt);
    if (commentsSort === "likes") copy.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return copy;
  }, [comments, commentsSort]);

  return (
    <div className={cx("card", { liked: likedArticle })}>
      {isEditTitle ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} />
          <button onClick={saveTitle}>Save title</button>
          <button onClick={() => setIsEditTitle(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <h3 className={styles.title} style={{ margin: 0 }}>
            {article.title}
          </h3>
          <button className={styles.button} onClick={() => setIsEditTitle(true)}>
            Edit title
          </button>
        </div>
      )}
      
      {isEditText ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <input
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            style={{ minWidth: 280 }}
          />
          <button onClick={saveText}>Save text</button>
          <button onClick={() => setIsEditText(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          <p className={styles.text} style={{ margin: 0 }}>
            {article.text}
          </p>
          <button className={styles.button} onClick={() => setIsEditText(true)}>
            Edit text
          </button>
        </div>
      )}
      
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        Created: {new Date(article.createdAt).toLocaleString("ru-RU")}
      </div>
      
      <div className={styles.metaRow} style={{ marginTop: 10 }}>
        <span className={styles.meta}>Likes: {article.currentLikes}</span>
        <button className={styles.button} onClick={toggleArticleLike}>
          {likedArticle ? "Unlike" : "Like"}
        </button>

        <span className={styles.meta}>Comments: {commentsCount}</span>

        <button className={styles.button} onClick={() => setIsCommentsOpen((p) => !p)}>
          {isCommentsOpen ? "Hide comments" : "Open comments"}
        </button>

        <span className={cx("badge", { badgeVisible: likedArticle })}>Liked</span>
      </div>
      
      <div className={cx("comments", { open: isCommentsOpen })}>
        {isCommentsOpen && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
              <button onClick={() => setCommentsSort("date")}>Sort comments by date</button>
              <button onClick={() => setCommentsSort("likes")}>Sort comments by likes</button>
              <button onClick={() => setCommentsSort(null)}>Clear sort</button>
            </div>

            {isLoadingComments && !hasLoadedComments ? (
              <div className={styles.loader}>Loading comments...</div>
            ) : displayedComments.length === 0 ? (
              <div className={styles.empty}>No comments</div>
            ) : (
              <ul className={styles.commentList}>
                {displayedComments.map((c) => (
                  <CommentRow
                    key={c.commentId}
                    comment={c}
                    onDelete={() => onDeleteComment(articleId, c.commentId)}
                    onToggleLike={(isNowLiked) =>
                      onToggleCommentLike(articleId, c.commentId, isNowLiked)
                    }
                    onSaveText={(nextText) => onEditCommentText(articleId, c.commentId, nextText)}
                  />
                ))}
              </ul>
            )}

            <form className={styles.form} onSubmit={handleSubmitComment} style={{ marginTop: 10 }}>
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
                style={{ minWidth: 240 }}
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

function CommentRow({ comment, onDelete, onToggleLike, onSaveText }) {
  const [liked, setLiked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [draft, setDraft] = useState(comment.text);

  useEffect(() => setDraft(comment.text), [comment.text]);

  const toggle = () => {
    setLiked((prev) => {
      const next = !prev;
      onToggleLike(next);
      return next;
    });
  };

  const save = () => {
    const t = draft.trim();
    if (!t) return;
    onSaveText(t);
    setIsEdit(false);
  };

  return (
    <li className={styles.commentItem} style={{ marginBottom: 10 }}>
      <div>
        <b>{comment.author}</b>{" "}
        <span style={{ fontSize: 12, opacity: 0.7 }}>
          {new Date(comment.createdAt).toLocaleString("ru-RU")}
        </span>
      </div>

      {isEdit ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button onClick={save}>Save</button>
          <button onClick={() => setIsEdit(false)}>Cancel</button>
        </div>
      ) : (
        <div style={{ marginTop: 4 }}>{comment.text}</div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <span>Likes: {comment.likes ?? 0}</span>
        <button onClick={toggle}>{liked ? "Unlike" : "Like"}</button>
        <button onClick={() => setIsEdit(true)}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}