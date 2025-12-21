import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ArticleCard.module.scss";

import {
  toggleLike as toggleArticleLike,
  editTitle,
  editText,
  incrementCommentsCount,
  decrementCommentsCount,
  setCommentsCount,
} from "../store/articlesSlice";

import {
  addComment,
  deleteComment,
  editText as editCommentText,
  setSort as setCommentsSort,
  toggleLike as toggleCommentLike,
  fetchCommentsByArticleId,
} from "../store/commentsSlice";

const cx = classNames.bind(styles);

export default function ArticleCard({ article }) {
  const dispatch = useDispatch();
  const articleId = article.articleId;

  const comments = useSelector((s) => s.comments.byArticleId[articleId]);
  const isLoadingComments = useSelector((s) => s.comments.isLoadingByArticleId[articleId]);
  const commentsSort = useSelector((s) => s.comments.sortByArticleId[articleId] ?? null);

  const [likedArticle, setLikedArticle] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isEditText, setIsEditText] = useState(false);
  const [titleDraft, setTitleDraft] = useState(article.title);
  const [textDraft, setTextDraft] = useState(article.text);

  useEffect(() => setTitleDraft(article.title), [article.title]);
  useEffect(() => setTextDraft(article.text), [article.text]);
  
  const [author, setAuthor] = useState("");
  const [commentTextDraft, setCommentTextDraft] = useState("");
  
  useEffect(() => {
    if (!isCommentsOpen) return;
    if (Array.isArray(comments)) return;

    dispatch(fetchCommentsByArticleId(articleId));    
  }, [dispatch, isCommentsOpen, comments, articleId]);
  
  useEffect(() => {
    if (!Array.isArray(comments)) return;
    if ((article.commentsCount ?? 0) !== comments.length) {
      dispatch(setCommentsCount({ articleId, count: comments.length }));
    }
  }, [dispatch, articleId, article.commentsCount, comments]);

  const displayedComments = useMemo(() => {
    const list = comments ?? [];
    const copy = [...list];
    if (commentsSort === "date") copy.sort((a, b) => b.createdAt - a.createdAt);
    if (commentsSort === "likes") copy.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return copy;
  }, [comments, commentsSort]);

  const toggleArticle = () => {
    setLikedArticle((prev) => {
      const next = !prev;
      dispatch(toggleArticleLike({ articleId, isNowLiked: next }));
      return next;
    });
  };

  const saveTitle = () => {
    const t = titleDraft.trim();
    if (!t) return;
    dispatch(editTitle({ articleId, title: t }));
    setIsEditTitle(false);
  };

  const saveText = () => {
    const t = textDraft.trim();
    if (!t) return;
    dispatch(editText({ articleId, text: t }));
    setIsEditText(false);
  };

  const submitComment = (e) => {
    e.preventDefault();
    const a = author.trim();
    const t = commentTextDraft.trim();
    if (!a || !t) return;

    dispatch(addComment({ articleId, author: a, text: t }));
    dispatch(incrementCommentsCount(articleId));

    setAuthor("");
    setCommentTextDraft("");
  };

  return (
    <div className={cx("card", { liked: likedArticle })}>
      {isEditTitle ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} />
          <button className={styles.button} onClick={saveTitle}>
            Save title
          </button>
          <button className={styles.button} onClick={() => setIsEditTitle(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
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
          <button className={styles.button} onClick={saveText}>
            Save text
          </button>
          <button className={styles.button} onClick={() => setIsEditText(false)}>
            Cancel
          </button>
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
        <button className={styles.button} onClick={toggleArticle}>
          {likedArticle ? "Unlike" : "Like"}
        </button>

        <span className={styles.meta}>Comments: {article.commentsCount}</span>

        <button className={styles.button} onClick={() => setIsCommentsOpen((p) => !p)}>
          {isCommentsOpen ? "Hide comments" : "Open comments"}
        </button>

        <span className={cx("badge", { badgeVisible: likedArticle })}>Liked</span>
      </div>

      <div className={cx("comments", { open: isCommentsOpen })}>
        {isCommentsOpen && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
              <button onClick={() => dispatch(setCommentsSort({ articleId, sort: "date" }))}>
                Sort comments by date
              </button>
              <button onClick={() => dispatch(setCommentsSort({ articleId, sort: "likes" }))}>
                Sort comments by likes
              </button>
              <button onClick={() => dispatch(setCommentsSort({ articleId, sort: null }))}>
                Clear sort
              </button>
            </div>

            {isLoadingComments && !Array.isArray(comments) ? (
              <div className={styles.loader}>Loading comments...</div>
            ) : displayedComments.length === 0 ? (
              <div className={styles.empty}>No comments</div>
            ) : (
              <ul className={styles.commentList}>
                {displayedComments.map((c) => (
                  <CommentRow
                    key={c.commentId}
                    comment={c}
                    onDelete={() => {
                      dispatch(deleteComment({ articleId, commentId: c.commentId }));
                      dispatch(decrementCommentsCount(articleId));
                    }}
                    onToggleLike={(isNowLiked) =>
                      dispatch(
                        toggleCommentLike({
                          articleId,
                          commentId: c.commentId,
                          isNowLiked,
                        })
                      )
                    }
                    onSaveText={(text) =>
                      dispatch(editCommentText({ articleId, commentId: c.commentId, text }))
                    }
                  />
                ))}
              </ul>
            )}

            <form className={styles.form} onSubmit={submitComment} style={{ marginTop: 10 }}>
              <input
                className={styles.input}
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Comment text"
                value={commentTextDraft}
                onChange={(e) => setCommentTextDraft(e.target.value)}
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