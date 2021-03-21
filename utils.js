import {
  showVisibleArticles,
  showHiddenArticles,
  articleFeed,
} from "./main.js";

export class Functionality {
  getVisibleArticles() {
    let articles = this.getLocalStorage();
    if (articles) {
      return articles.filter((art) => art.status === "Visible");
    }
  }

  getHiddenArticles() {
    let articles = this.getLocalStorage();
    if (articles) {
      return articles.filter((art) => art.status === "Hidden");
    }
  }

  generateVisibleArticle(article) {
    return `<li id='${article.id}'>
  <div class="article-box">
    <div contenteditable="false" class="article-title">
      <h3>
        ${article.title}
      </h3>
    </div>
    <div contenteditable="false" class="article-content">
      ${article.content}
    </div>
    <div class="active-btns">
      <button class="edit-btn"><i class="far fa-edit"></i></button>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
      <button class="change-vsbl-btn show">
        <i class="far fa-eye"></i>
      </button>
      <button disabled class="save-edit">
        <i class="far fa-save"></i>
      </button>
    </div>
  </div>
</li>`;
  }

  generateHiddenArticle(article) {
    return `<li id='${article.id}'>
    <div class="article-box">
      <div contenteditable="false" class="article-title">
        <h3>
        ${article.title}
        </h3>
      </div>
      <div contenteditable="false" class="article-content">
      ${article.content}
      </div>
      <div class="active-btns">
        <button class="edit-btn"><i class="far fa-edit"></i></button>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
        <button class="change-vsbl-btn hide">
          <i class="far fa-eye-slash"></i>
        </button>
        <button disabled class="save-edit" ><i class="far fa-save"></i></button>
      </div>
    </div>
  </li>`;
  }

  editArticle(e) {
    const editBtn = e.target.parentElement;
    if (editBtn.classList.contains("edit-btn")) {
      try {
        const articleTitle =
          e.target.parentElement.parentElement.previousElementSibling
            .previousElementSibling;
        const articleContent =
          e.target.parentElement.parentElement.previousElementSibling;
        if (articleContent && articleTitle) {
          articleTitle.contentEditable = "true";
          articleContent.contentEditable = "true";
          const eyeBtn =
            e.target.parentElement.nextElementSibling.nextElementSibling;
          const saveEditing =
            e.target.parentElement.nextElementSibling.nextElementSibling
              .nextElementSibling;
          saveEditing.classList.remove("hide-save-btn");
          saveEditing.disabled = false;
          console.log(saveEditing);
          saveEditing.addEventListener("click", () => {
            let articleId =
              e.target.parentElement.parentElement.parentElement.parentElement
                .id;
            let editedTitle = articleTitle.childNodes[1].innerText;
            let editedContent = articleContent.childNodes[0].textContent;
            if (editedTitle.length < 20 || editedTitle.length > 180) {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Your title's length must be between 20 and 180 characters`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else if (
              editedContent.length < 360 ||
              editedContent.length > 1080
            ) {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Your content's length must be between 360 and 1080 characters`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              const material = {
                id: articleId,
                title: editedTitle.trim(),
                content: editedContent.trim(),
              };
              this.setStorageEditedArticle(material);
              articleTitle.contentEditable = "false";
              articleContent.contentEditable = "false";
              this.showPopUpMessage(
                "success",
                "Success",
                "Article has been successfully edited!"
              );
              this.getVsbltyStatus(e);
              saveEditing.disabled = true;
            }
          });
        }
      } catch (err) {}
    }
  }

  setStorageEditedArticle(material) {
    let articles = this.getLocalStorage();

    let editedArticles = [];
    for (let article of articles) {
      if (article.id == material.id) {
        article.id = this.generateId();
        article.title = material.title;
        article.content = material.content;
        editedArticles.unshift(article);
      } else {
        editedArticles.push(article);
      }
    }
    this.setLocalStorage(editedArticles);
  }

  deleteArticle(e) {
    const validation = e.target.parentElement.classList.contains("delete-btn");
    const deletedArticle =
      e.target.parentElement.parentElement.parentElement.parentElement;
    let articles = this.getLocalStorage();
    if (validation) {
      let filtered = articles.filter((art) => art.id != deletedArticle.id);
      this.setLocalStorage(filtered);

      return deletedArticle;
    }
  }

  changeVisibility(e) {
    let article =
      e.target.parentElement.parentElement.parentElement.parentElement;
    let eyeBtn = e.target.parentElement.classList.contains("change-vsbl-btn");
    console.log(eyeBtn);
    if (eyeBtn) {
      const hidenBtn = e.target.classList;
      const parentBtn = e.target.parentElement.classList;
      const vsbltyIdStatus =
        e.target.parentElement.parentElement.parentElement.parentElement;
      let data = this.getLocalStorage();
      let modifiedData = [];
      if (hidenBtn.contains("fa-eye-slash")) {
        parentBtn.remove("hide");
        parentBtn.add("show");
        hidenBtn.remove("fa-eye-slash");
        hidenBtn.add("fa-eye");
      } else if (hidenBtn.contains("fa-eye")) {
        parentBtn.remove("show");
        parentBtn.add("hide");
        hidenBtn.remove("fa-eye");
        hidenBtn.add("fa-eye-slash");
      }
      for (let article of data) {
        if (article.id == vsbltyIdStatus.id) {
          if (article.status === "Visible") {
            article.status = "Hidden";
          } else if (article.status === "Hidden") {
            article.status = "Visible";
          }
          modifiedData.unshift(article);
        } else {
          modifiedData.push(article);
        }
      }
      this.setLocalStorage(modifiedData);
      articleFeed.removeChild(article);
    }
  }

  addArticleStorage(obj) {
    let arr = this.getLocalStorage() || [];
    arr.unshift(obj);
    this.setLocalStorage(arr);
  }

  generateId() {
    let date = Date.now();
    return date;
  }
  checkStatus(status) {
    return status === true ? "Visible" : "Hidden";
  }

  showPopUpMessage(type, title, message) {
    Swal.fire({
      icon: `${type}`,
      title: `${title}`,
      text: `${message}`,
    });
  }

  getLocalStorage() {
    return JSON.parse(localStorage.getItem("articles"));
  }

  setLocalStorage(data) {
    return localStorage.setItem("articles", JSON.stringify(data));
  }

  getVsbltyStatus(e) {
    const status =
      e.target.parentElement.nextElementSibling.nextElementSibling.childNodes[1]
        .classList;
    if (status.contains("fa-eye")) {
      showVisibleArticles();
    } else if (status.contains("fa-eye-slash")) {
      showHiddenArticles();
    }
  }
}
