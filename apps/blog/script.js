/* ============================================================
   BLOG
   Liste aller Einträge (aus posts.js) + Einzelansicht.
   ============================================================ */

const listEl = document.getElementById("postList");
const postView = document.getElementById("postView");
const postBackBtn = document.getElementById("postBackBtn");
const postBackBtnBottom = document.getElementById("postBackBtnBottom");
const postDateEl = document.getElementById("postDate");
const postTitleEl = document.getElementById("postTitle");
const postBodyEl = document.getElementById("postBody");

function excerptOf(post){
  const text = post.body.join(" ");
  return text.length > 140 ? text.slice(0, 140).trim() + "…" : text;
}

function renderList(){
  listEl.innerHTML = "";

  if(POSTS.length === 0){
    const empty = document.createElement("div");
    empty.className = "list__empty";
    empty.innerHTML = `
      <p class="list__empty-title">Hier entstehen bald die ersten Einträge.</p>
      <p>Ich schreibe gerne — die ersten Texte folgen in Kürze.</p>
    `;
    listEl.appendChild(empty);
    return;
  }

  POSTS.forEach((post, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "list__item";
    item.innerHTML = `
      <p class="list__item-date">${post.date}</p>
      <p class="list__item-title">${post.title}</p>
      <p class="list__item-excerpt">${excerptOf(post)}</p>
    `;
    item.addEventListener("click", ()=> openPost(index));
    listEl.appendChild(item);
  });
}

function openPost(index){
  const post = POSTS[index];
  postDateEl.textContent = post.date;
  postTitleEl.textContent = post.title;
  postBodyEl.innerHTML = "";
  post.body.forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    postBodyEl.appendChild(p);
  });
  listEl.hidden = true;
  postView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToList(){
  postView.hidden = true;
  listEl.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
postBackBtn.addEventListener("click", backToList);
postBackBtnBottom.addEventListener("click", backToList);

renderList();
