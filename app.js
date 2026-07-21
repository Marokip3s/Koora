/* ==========================================
   MAROKIP3S APP
   PART 1
   APP + INIT
========================================== */

const App = {

    data: null,

    matches: [],

    competitions: [],

    teams: [],

    servers: [],

    currentMatch: null,

    currentServers: [],

    currentServer: null

};

/* ==========================================
   DOM
========================================== */

const $ = (id) => document.getElementById(id);

const $$ = (selector) => document.querySelectorAll(selector);

/* ==========================================
   INIT
========================================== */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {

    try {

        showLoading();

        await loadData();

        renderCompetitions();

        renderMatches(App.matches);

        updateCounters();

        bindEvents();

    }

    catch (err) {

        console.error(err);

        showToast("تعذر تحميل البيانات", "error");

    }

    finally {

        hideLoading();

    }

}

/* ==========================================
   LOAD DATA
========================================== */

async function loadData() {

    const response = await API.getData();

    App.data = response;

    App.matches = Array.isArray(response.matches)
        ? response.matches
        : [];

    App.competitions = Array.isArray(response.competitions)
        ? response.competitions
        : [];

    App.teams = Array.isArray(response.teams)
        ? response.teams
        : [];

    App.servers = Array.isArray(response.servers)
        ? response.servers
        : [];

    console.log(
        "Loaded:",
        App.matches.length,
        "matches"
    );

       }
/* ==========================================
   PART 2
   HELPERS
========================================== */

function getCompetition(id) {

    return App.competitions.find(

        item => Number(item.id) === Number(id)

    ) || null;

}

function getTeam(id) {

    return App.teams.find(

        item => Number(item.id) === Number(id)

    ) || null;

}

function getServers(matchId) {

    return App.servers.filter(

        item => Number(item.match_id) === Number(matchId)

    );

}

function getMatchStatus(match) {

    const status = String(

        match.status || ""

    ).toLowerCase();

    switch (status) {

        case "live":
            return "live";

        case "finished":
            return "finished";

        default:
            return "upcoming";

    }

}

/* ==========================================
   DATE & TIME
========================================== */

function formatTime(dateString) {

    if (!dateString) return "--:--";

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString)

        .toLocaleDateString();

}

/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHtml(text) {

    if (text === null || text === undefined)

        return "";

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

           }
/* ==========================================
   PART 3
   COMPETITIONS
========================================== */

function renderCompetitions() {

    const container = $("competitionList");

    if (!container) return;

    container.innerHTML = "";

    // جميع البطولات
    const allButton = document.createElement("button");

    allButton.className = "competition-card active";

    allButton.innerHTML = `
        <span>🌍</span>
        <span>جميع البطولات</span>
    `;

    allButton.onclick = () => {

        $$(".competition-card").forEach(card => {

            card.classList.remove("active");

        });

        allButton.classList.add("active");

        renderMatches(App.matches);

    };

    container.appendChild(allButton);

    // البطولات
    App.competitions.forEach(comp => {

        container.appendChild(

            createCompetitionCard(comp)

        );

    });

}

/* ==========================================
   CREATE CARD
========================================== */

function createCompetitionCard(comp) {

    const button = document.createElement("button");

    button.className = "competition-card";

    button.dataset.id = comp.id;

    button.innerHTML = `

        <img
            src="${comp.logo || ""}"
            alt="${escapeHtml(comp.name)}">

        <span>

            ${escapeHtml(comp.name)}

        </span>

    `;

    button.onclick = () => {

        $$(".competition-card").forEach(card => {

            card.classList.remove("active");

        });

        button.classList.add("active");

        const matches = App.matches.filter(match =>

            Number(match.competition_id) === Number(comp.id)

        );

        renderMatches(matches);

    };

    return button;

}

    if ($("liveCount")) {

        $("liveCount").textContent = live;

    }

    if ($("upcomingCount")) {

        $("upcomingCount").textContent = upcoming;

    }

    if ($("finishedCount")) {

        $("finishedCount").textContent = finished;

    }

    }
/* ==========================================
   PART 4
   MATCHES
========================================== */

function renderMatches(matches) {

    const container = $("matchesGrid");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(matches) || matches.length === 0) {

        container.innerHTML = `

            <div class="state-box">

                <i class="fa-solid fa-calendar-xmark"></i>

                <p>لا توجد مباريات</p>

            </div>

        `;

        return;

    }

    const html = matches.map(match =>

        createMatchCard(match)

    ).join("");

    container.innerHTML = html;

}

/* ==========================================
   MATCH CARD
========================================== */

function createMatchCard(match) {

    const home = getTeam(match.team1_id);

    const away = getTeam(match.team2_id);

    const competition = getCompetition(match.competition_id);

    const status = getMatchStatus(match);

    let badge = "";

    switch (status) {

        case "live":

            badge = `
                <span class="live-badge-card live">
                    🔴 مباشر
                </span>
            `;

            break;

        case "finished":

            badge = `
                <span class="live-badge-card finished">
                    ✓ انتهت
                </span>
            `;

            break;

        default:

            badge = `
                <span class="live-badge-card upcoming">
                    🕒 قادمة
                </span>
            `;

    }

    return `

<div class="match-card">

    <div class="match-header">

        <div class="match-header-left">

            ${badge}

        </div>

        <div class="match-header-right">

            <img
                class="competition-logo"
                src="${competition?.logo || ""}"
                alt="">

            <span class="competition-name">

                ${competition?.name || ""}

            </span>

        </div>

    </div>

    <div class="match-body">

        <div class="team">

            <img
                src="${home?.logo || ""}"
                alt="">

            <span>

                ${home?.name || ""}

            </span>

        </div>

        <div class="match-center">

            <div class="match-time">

                ${formatTime(match.start_time)}

            </div>

            <div class="match-date">

                ${formatDate(match.start_time)}

            </div>

        </div>

        <div class="team">

            <img
                src="${away?.logo || ""}"
                alt="">

            <span>

                ${away?.name || ""}

            </span>

        </div>

    </div>

    <div class="match-footer">

        <button
            class="watch-btn"
            onclick="openPlayer(${match.id})">

            <i class="fa-solid fa-play"></i>

            مشاهدة

        </button>

    </div>

</div>

`;

       }
/* ==========================================
   PART 5
   SEARCH
========================================== */

function searchMatches(keyword) {

    keyword = String(keyword || "")
        .trim()
        .toLowerCase();

    if (!keyword) {

        renderMatches(App.matches);

        return;

    }

    const results = App.matches.filter(match => {

        const home = getTeam(match.team1_id);

        const away = getTeam(match.team2_id);

        const competition = getCompetition(match.competition_id);

        return (

            (home?.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (away?.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (competition?.name || "")
                .toLowerCase()
                .includes(keyword)

        );

    });

    renderMatches(results);

}

/* ==========================================
   COUNTERS
========================================== */

function updateCounters() {

    let live = 0;
    let upcoming = 0;
    let finished = 0;

    App.matches.forEach(match => {

        switch (getMatchStatus(match)) {

            case "live":
                live++;
                break;

            case "finished":
                finished++;
                break;

            default:
                upcoming++;
                break;

        }

    });

    if ($("liveCount")) {

        $("liveCount").textContent = live;

    }

    if ($("upcomingCount")) {

        $("upcomingCount").textContent = upcoming;

    }

    if ($("finishedCount")) {

        $("finishedCount").textContent = finished;

    }

           }
/* ==========================================
   PART 6
   PLAYER
========================================== */

function openPlayer(matchId) {

    const match = App.matches.find(

        item => Number(item.id) === Number(matchId)

    );

    if (!match) {

        showToast("المباراة غير موجودة", "error");

        return;

    }

    const servers = getServers(matchId);

    if (servers.length === 0) {

        showToast("لا توجد سيرفرات", "error");

        return;

    }

    App.currentMatch = match;

    App.currentServers = servers;

    App.currentServer = servers[0];

    const home = getTeam(match.team1_id);

    const away = getTeam(match.team2_id);

    const competition = getCompetition(match.competition_id);

    if ($("playerTitle")) {

        $("playerTitle").textContent =

            `${home?.name || ""} VS ${away?.name || ""}`;

    }

    if ($("playerSubtitle")) {

        $("playerSubtitle").textContent =

            competition?.name || "";

    }

    if ($("playerCompetitionLogo")) {

        $("playerCompetitionLogo").src =

            competition?.logo || "";

    }

    Player.serverList = servers;

    renderServers();

    Player.open();

    Player.load(servers[0]);

}

/* ==========================================
   SERVERS
========================================== */

function renderServers() {

    const container = $("serverList");

    if (!container) return;

    container.innerHTML = "";

    App.currentServers.forEach((server, index) => {

        const button = document.createElement("button");

        button.className =

            "server-item" +

            (index === 0 ? " active" : "");

        button.innerHTML = `

            <span>

                ${escapeHtml(server.name)}

            </span>

            <small>

                ${escapeHtml(server.quality || "")}

            </small>

        `;

        button.onclick = () => {

            document.querySelectorAll(".server-item")

                .forEach(item => {

                    item.classList.remove("active");

                });

            button.classList.add("active");

            App.currentServer = server;

            Player.load(server);

        };

        container.appendChild(button);

    });

}

/* ==========================================
   CLOSE PLAYER
========================================== */

function closePlayer() {

    Player.close();

           }
/* ==========================================
   PART 7
   UI + EVENTS + AUTO REFRESH
========================================== */

/* ==========================================
   LOADING
========================================== */

function showLoading() {

    $("loadingScreen")?.classList.add("show");

}

function hideLoading() {

    $("loadingScreen")?.classList.remove("show");

}

/* ==========================================
   TOAST
========================================== */

let toastTimer = null;

function showToast(message, type = "success") {

    const toast = $("toast");

    if (!toast) return;

    const text = $("toastText");

    if (text) {

        text.textContent = message;

    } else {

        toast.textContent = message;

    }

    toast.className = `toast ${type} show`;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/* ==========================================
   EVENTS
========================================== */

function bindEvents() {

    const search = $("searchInput");

    if (search) {

        search.addEventListener("input", e => {

            searchMatches(e.target.value);

        });

    }

    const closeBtn = $("closePlayer");

    if (closeBtn) {

        closeBtn.addEventListener("click", closePlayer);

    }

    const modal = $("playerModal");

    if (modal) {

        modal.addEventListener("click", e => {

            if (e.target === modal) {

                closePlayer();

            }

        });

    }

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            closePlayer();

        }

    });

    window.addEventListener("online", () => {

        showToast("تم استرجاع الاتصال", "success");

    });

    window.addEventListener("offline", () => {

        showToast("لا يوجد اتصال بالإنترنت", "error");

    });

}

/* ==========================================
   AUTO REFRESH
========================================== */

async function refreshData() {

    try {

        await loadData();

        renderCompetitions();

        renderMatches(App.matches);

        updateCounters();

    }

    catch (err) {

        console.error(err);

    }

}

setInterval(refreshData, 60000);

/* ==========================================
   END APP
========================================== */
