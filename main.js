import { Functionality } from "./utils.js";
const article = new Functionality();
const submitArticle = document.getElementById("form-section");
const formTitle = document.getElementById("form-title");
const formContent = document.getElementById("form-content");
const checkBox = document.getElementById("visible");
const checkBoxBtn = document.getElementById("checkbox-area");
const visibleArticlesBtn = document.getElementById("visible-articles");
const hiddenArticlesBtn = document.getElementById("hidden-articles");
const listTitle = document.getElementById("list-title");
export const articleFeed = document.getElementById("articles-list");

document.addEventListener("DOMContentLoaded", () => {
  showVisibleArticles();
});

submitArticle.addEventListener("submit", (e) => {
  e.preventDefault();
  let material = {
    id: article.generateId(),
    title: formTitle.value,
    content: formContent.value,
    status: article.checkStatus(checkBox.checked),
  };
  article.addArticleStorage(material);
  article.showPopUpMessage(
    "success",
    "Success",
    "Article has been successfully created!"
  );
  displayNewestArticle(article.checkStatus(checkBox.checked));
  submitArticle.reset();
});

checkBoxBtn.addEventListener("click", () => {
  checkBox.checked = !checkBox.checked;
});

articleFeed.addEventListener("click", (e) => {
  article.changeVisibility(e);
  article.editArticle(e);
  try {
    articleFeed.removeChild(article.deleteArticle(e));
  } catch (err) {}
});

visibleArticlesBtn.addEventListener("click", () => {
  showVisibleArticles();
});

hiddenArticlesBtn.addEventListener("click", () => {
  showHiddenArticles();
});

export function showVisibleArticles() {
  articleFeed.innerHTML = "";
  const visibleArticles = article.getVisibleArticles() || [];
  for (let art of visibleArticles) {
    articleFeed.innerHTML += article.generateVisibleArticle(art);
  }

  listTitle.innerHTML = "List of Visible Articles";
}
export function showHiddenArticles() {
  articleFeed.innerHTML = "";
  const hiddenArticles = article.getHiddenArticles() || [];
  for (let art of hiddenArticles) {
    articleFeed.innerHTML += article.generateHiddenArticle(art);
  }

  listTitle.innerHTML = "List of Hidden Articles";
}

function displayNewestArticle(status) {
  if (status === "Visible") {
    return showVisibleArticles();
  } else if (status === "Hidden") {
    return showHiddenArticles();
  }
}
