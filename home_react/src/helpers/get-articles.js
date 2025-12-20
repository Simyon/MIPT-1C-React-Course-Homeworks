import articles from "../assets/data/articles.json";

const ARTICLES_LOAD_DURATION = 1500;

export async function getArticles() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(articles), ARTICLES_LOAD_DURATION);
  });
}