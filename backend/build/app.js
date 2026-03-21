const state = {
  token: localStorage.getItem("yt_token") || "",
  videos: [],
  likedVideos: [],
  savedVideos: [],
  subscriptions: [],
  filter: "home",
  query: ""
};

const authPanel = document.getElementById("authPanel");
const videoGrid = document.getElementById("videoGrid");
const hero = document.getElementById("hero");
const searchInput = document.getElementById("searchInput");
const navButtons = [...document.querySelectorAll(".nav-btn")];

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.toLowerCase();
  renderVideos();
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter || "home";
    renderVideos();
  });
});

function authHeaders() {
  return state.token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`
      }
    : { "Content-Type": "application/json" };
}

function renderAuth() {
  if (state.token) {
    authPanel.innerHTML = `<span>Signed in</span><button id="logoutBtn">Logout</button>`;
    document.getElementById("logoutBtn").onclick = () => {
      state.token = "";
      localStorage.removeItem("yt_token");
      state.likedVideos = [];
      state.savedVideos = [];
      state.subscriptions = [];
      renderAuth();
      renderVideos();
    };
    return;
  }

  authPanel.innerHTML = `
    <input id="name" placeholder="Name" />
    <input id="email" placeholder="Email" />
    <input id="password" placeholder="Password" type="password" />
    <button id="signupBtn">Sign up</button>
    <button id="loginBtn">Login</button>
  `;

  document.getElementById("signupBtn").onclick = () => submitAuth("signup");
  document.getElementById("loginBtn").onclick = () => submitAuth("login");
}

async function submitAuth(action) {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const body = action === "signup" ? { name, email, password } : { email, password };

  const response = await fetch(`/api/users/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    alert("Authentication failed.");
    return;
  }

  state.token = data.token;
  localStorage.setItem("yt_token", data.token);
  await loadLibrary();
  renderAuth();
  renderVideos();
}

async function loadVideos() {
  const response = await fetch("/api/videos");
  const data = await response.json();
  state.videos = data.videos || [];
}

async function loadLibrary() {
  if (!state.token) return;
  const response = await fetch("/api/videos/library", {
    headers: authHeaders()
  });

  if (!response.ok) return;

  const data = await response.json();
  state.likedVideos = data.likedVideos || [];
  state.savedVideos = data.savedVideos || [];
  state.subscriptions = data.subscriptions || [];
}

async function toggle(action, payload) {
  if (!state.token) {
    alert("Please login first.");
    return;
  }

  const response = await fetch(`/api/videos/${action}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    alert("Action failed.");
    return;
  }

  const data = await response.json();
  state.likedVideos = action === "like" ? data.likedVideos : state.likedVideos;
  state.savedVideos = action === "save" ? data.savedVideos : state.savedVideos;
  state.subscriptions = action === "subscribe" ? data.subscriptions : state.subscriptions;

  renderVideos();
}

function getFilteredVideos() {
  let list = [...state.videos];
  if (state.filter === "saved") {
    list = list.filter((video) => state.savedVideos.includes(video.id));
  }

  if (state.filter === "liked") {
    list = list.filter((video) => state.likedVideos.includes(video.id));
  }

  if (state.filter === "subscriptions") {
    list = list.filter((video) => state.subscriptions.includes(video.channelId));
  }

  if (state.query) {
    list = list.filter((video) =>
      `${video.title} ${video.channelName}`.toLowerCase().includes(state.query)
    );
  }

  return list;
}

function renderVideos() {
  const list = getFilteredVideos();
  hero.textContent =
    state.filter === "home"
      ? "Recommended"
      : `${state.filter[0].toUpperCase()}${state.filter.slice(1)} videos`;

  videoGrid.innerHTML = list
    .map((video) => {
      const liked = state.likedVideos.includes(video.id);
      const saved = state.savedVideos.includes(video.id);
      const subscribed = state.subscriptions.includes(video.channelId);

      return `
        <article class="card">
          <div class="thumb-wrap">
            <img class="thumb" src="${video.thumbnail}" alt="${video.title}" />
            <span class="duration">${video.duration}</span>
          </div>
          <div class="meta">
            <h3 class="title">${video.title}</h3>
            <div class="subtext">${video.channelName}</div>
            <div class="subtext">${video.views.toLocaleString()} views • ${video.uploadedAt}</div>
            <div class="actions">
              <button class="${liked ? "active" : ""}" onclick="window.handleLike('${video.id}')">👍 Like</button>
              <button class="${saved ? "active" : ""}" onclick="window.handleSave('${video.id}')">💾 Save</button>
              <button class="${subscribed ? "active" : ""}" onclick="window.handleSubscribe('${video.channelId}')">🔔 Subscribe</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

window.handleLike = (videoId) => toggle("like", { videoId });
window.handleSave = (videoId) => toggle("save", { videoId });
window.handleSubscribe = (channelId) => toggle("subscribe", { channelId });

(async function init() {
  renderAuth();
  await loadVideos();
  await loadLibrary();
  renderVideos();
})();
