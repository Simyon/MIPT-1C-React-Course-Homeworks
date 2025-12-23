import articles from "../assets/data/articles.json";

const ARTICLES_LOAD_DURATION = 1500;
const FAIL_PROBABILITY = 0.05;

export async function getArticles() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAIL_PROBABILITY) {
        reject(new Error("getArticles failed (mock)"));
        return;
      }
      resolve(articles);
    }, ARTICLES_LOAD_DURATION);
  });
}