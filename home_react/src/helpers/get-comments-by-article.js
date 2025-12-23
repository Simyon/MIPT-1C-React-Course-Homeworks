import comments from "../assets/data/comments.json";

const COMMENTS_LOAD_DURATION = 1000;
const FAIL_PROBABILITY = 0.05;

function selectByArticleId(totalData, id) {
  return totalData.filter(({ articleId }) => articleId === id);
}

export async function getComments(articleId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAIL_PROBABILITY) {
        reject(new Error(`getComments failed (mock), articleId=${articleId}`));
        return;
      }
      resolve(selectByArticleId(comments, articleId));
    }, COMMENTS_LOAD_DURATION);
  });
}