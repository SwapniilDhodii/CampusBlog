const defaultBlogs = [
  {id:1,title:"My First Week at College",author:"Aarav Sharma",category:"College Life",emoji:"🎓",content:"Starting college felt like opening the first page of a new book. The first week was full of new classrooms, new friends and lots of small moments that made the campus feel like home.",likes:12,date:"Sep 12, 2026"},
  {id:2,title:"Annual Cultural Fest: A Day to Remember",author:"Riya Patel",category:"Events",emoji:"🎉",content:"The annual cultural fest brought the whole campus together. From energetic performances to creative stalls, every corner of the campus was filled with excitement.",likes:18,date:"Sep 10, 2026"},
  {id:3,title:"5 Simple Study Habits That Actually Help",author:"Kabir Mehta",category:"Study",emoji:"📚",content:"Good study habits do not have to be complicated. Planning small daily goals, taking short breaks and revising regularly can make a big difference.",likes:9,date:"Sep 07, 2026"},
  {id:4,title:"Our Coding Club Built Something Cool",author:"Neha Singh",category:"Technology",emoji:"💻",content:"This semester our coding club started a small project to solve a campus problem. Working as a team taught us as much as the code itself.",likes:15,date:"Sep 03, 2026"},
  {id:5,title:"Celebrating Our Student Achievers",author:"Campus Team",category:"Achievements",emoji:"🏆",content:"From academic results to competitions and creative work, our students continue to make the campus proud. Here are some moments worth celebrating.",likes:21,date:"Aug 28, 2026"},
  {id:6,title:"Inter-College Sports Meet Highlights",author:"Dev Joshi",category:"Sports",emoji:"⚽",content:"The sports meet was filled with teamwork, energy and friendly competition. Students represented the college across several events.",likes:11,date:"Aug 25, 2026"}
];

function getBlogs() {
  const saved = localStorage.getItem("campusBlogs");
  return saved ? JSON.parse(saved) : defaultBlogs;
}
function saveBlogs(blogs) { localStorage.setItem("campusBlogs", JSON.stringify(blogs)); }

function blogCard(blog) {
  return `<article class="blog-card">
    <div class="blog-cover">${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}">` : escapeHtml(blog.emoji || "📝")}</div>
    <div class="blog-body">
      <span class="badge">${escapeHtml(blog.category)}</span>
      <h3>${escapeHtml(blog.title)}</h3>
      <p>${escapeHtml(blog.content).substring(0,125)}${blog.content.length > 125 ? "..." : ""}</p>
      <div class="blog-meta"><span>By ${escapeHtml(blog.author)} · ${escapeHtml(blog.date)}</span>
      <button class="like-btn" data-like="${blog.id}">♡ ${blog.likes || 0}</button></div>
      <a class="read-more" href="blog.html?id=${blog.id}">Read More →</a>
    </div>
  </article>`;
}
function renderBlogs(container, blogs) {
  container.innerHTML = blogs.map(blogCard).join("");
  container.querySelectorAll("[data-like]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.like);
      const all = getBlogs();
      const item = all.find(b => b.id === id);
      if (item) { item.likes = (item.likes || 0) + 1; saveBlogs(all); btn.textContent = `♥ ${item.likes}`; btn.classList.add("liked"); }
    });
  });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}


function renderBlogDetails() {
  const container = document.getElementById("blogDetails");
  if (!container) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const blog = getBlogs().find(b => b.id === id);

  if (!blog) {
    container.innerHTML = `
      <div class="not-found">
        <div>📝</div>
        <h2>Blog not found</h2>
        <p>This blog may have been removed or the link is incorrect.</p>
        <a class="btn" href="blogs.html">← Back to Blogs</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    <article class="full-blog">
      <div class="full-blog-cover">${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}">` : escapeHtml(blog.emoji || "📝")}</div>
      <div class="full-blog-content">
        <span class="badge">${escapeHtml(blog.category)}</span>
        <h1>${escapeHtml(blog.title)}</h1>
        <div class="article-meta">
          <span>✍️ By <strong>${escapeHtml(blog.author)}</strong></span>
          <span>📅 ${escapeHtml(blog.date)}</span>
        </div>
        <div class="article-text">${escapeHtml(blog.content).replace(/\n/g, "<br><br>")}</div>
        <div class="article-actions">
          <button class="btn like-detail" id="detailLike">♥ Like (${blog.likes || 0})</button>
          <a class="btn btn-outline" href="blogs.html">← Back to Blogs</a>
        </div>
      </div>
    </article>`;

  document.getElementById("detailLike").addEventListener("click", () => {
    const all = getBlogs();
    const item = all.find(b => b.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      saveBlogs(all);
      document.getElementById("detailLike").textContent = `♥ Like (${item.likes})`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year")?.replaceChildren(new Date().getFullYear());
  renderBlogDetails();

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  menuBtn?.addEventListener("click", () => navLinks.classList.toggle("open"));

  const themeBtn = document.getElementById("themeBtn");
  if (localStorage.getItem("campusTheme") === "dark") document.body.classList.add("dark");
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("campusTheme", document.body.classList.contains("dark") ? "dark" : "light");
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
  if (document.body.classList.contains("dark") && themeBtn) themeBtn.textContent = "☀️";

  const latest = document.getElementById("latestBlogs");
  if (latest) renderBlogs(latest, getBlogs().slice(0, 3));

  const all = document.getElementById("allBlogs");
  if (all) {
    const search = document.getElementById("searchInput");
    const filter = document.getElementById("categoryFilter");
    const params = new URLSearchParams(location.search);
    const requestedCategory = params.get("category");
    if (requestedCategory && [...filter.options].some(o => o.value === requestedCategory)) filter.value = requestedCategory;

    function applyFilters() {
      const q = search.value.toLowerCase().trim();
      const category = filter.value;
      const result = getBlogs().filter(b =>
        (category === "All" || b.category === category) &&
        (`${b.title} ${b.author} ${b.content} ${b.category}`.toLowerCase().includes(q))
      );
      renderBlogs(all, result);
      document.getElementById("noBlogs").hidden = result.length !== 0;
    }
    search.addEventListener("input", applyFilters);
    filter.addEventListener("change", applyFilters);
    applyFilters();
  }

  const emojiPicker = document.getElementById("emojiPicker");
  const emojiInput = document.getElementById("emoji");

  emojiPicker?.addEventListener("click", e => {
    const button = e.target.closest(".emoji-option");
    if (!button) return;

    emojiInput.value = button.dataset.emoji;
    emojiPicker.querySelectorAll(".emoji-option").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
  });

  const blogForm = document.getElementById("blogForm");
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) {
      imagePreview.hidden = true;
      imagePreview.src = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      imageInput.value = "";
      imagePreview.hidden = true;
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.src = e.target.result;
      imagePreview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  blogForm?.addEventListener("submit", e => {
    e.preventDefault();

    const file = imageInput?.files[0];
    const publish = imageData => {
      const blogs = getBlogs();
      blogs.unshift({
        id: Date.now(),
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        category: document.getElementById("category").value,
        emoji: document.getElementById("emoji")?.value.trim() || "📝",
        image: imageData || "",
        content: document.getElementById("content").value.trim(),
        likes: 0,
        date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
      });
      saveBlogs(blogs);
      blogForm.reset();
      if (imagePreview) {
        imagePreview.hidden = true;
        imagePreview.src = "";
      }
      const msg = document.getElementById("formMessage");
      msg.textContent = "✓ Blog published successfully! Redirecting to blogs...";
      setTimeout(() => location.href = "blogs.html", 900);
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = e => publish(e.target.result);
      reader.readAsDataURL(file);
    } else {
      publish("");
    }
  });

  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("contactMessage").textContent = "✓ Thank you! Your message has been submitted.";
    contactForm.reset();
  });
});
