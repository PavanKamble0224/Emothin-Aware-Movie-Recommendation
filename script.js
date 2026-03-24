// ==========================
// CONFIG
// ==========================
const API_KEY = "b384060c08c6fe771268e9d4b1b9ed6f";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ==========================
// GENRE MAP (REAL)
// ==========================
const GENRE_MAP = {
    28: "Action",
    35: "Comedy",
    18: "Drama",
    27: "Horror",
    10749: "Romance",
    53: "Thriller",
    878: "Sci-Fi"
};

// ==========================
// GLOBAL STATE
// ==========================
let currentMovies = [];
let stream = null;
let cameraOn = false;

// ==========================
// FETCH MOVIES
// ==========================
async function getMovies(type = "popular") {

    const container = document.getElementById("movies");
    container.innerHTML = "<h2 style='text-align:center'>Loading...</h2>";

    try {
        const res = await fetch(`${BASE_URL}${type}?api_key=${API_KEY}`);
        const data = await res.json();

        currentMovies = data.results || [];
        displayMovies(currentMovies);

    } catch {
        container.innerHTML = "<h2 style='color:red'>Error loading movies ❌</h2>";
    }
}

// ==========================
// DISPLAY MOVIES (PRO VERSION)
// ==========================
function displayMovies(movies) {

    const container = document.getElementById("movies");
    container.innerHTML = "";

    movies.forEach(movie => {

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x400?text=No+Image";

        const rating = movie.vote_average
            ? movie.vote_average.toFixed(1)
            : "N/A";

        const year = movie.release_date
            ? movie.release_date.split("-")[0]
            : "N/A";

        const desc = movie.overview
            ? movie.overview.substring(0, 60)
            : "No description";

        const age = getAgeRating(rating);

        // REAL GENRE
        let genre = "Other";
        if (movie.genre_ids?.length) {
            genre = GENRE_MAP[movie.genre_ids[0]] || "Other";
        }

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${poster}">
            <div class="play-btn">▶</div>

            <div class="movie-info">
                <h3>${movie.title}</h3>

                <div class="badges">
                    <span class="badge rating">⭐ ${rating}</span>
                    <span class="badge age">${age}</span>
                    <span class="badge genre">${genre}</span>
                </div>

                <p>📅 ${year}</p>
                <p>${desc}...</p>
            </div>
        `;

        card.onclick = () => playTrailer(movie.id);

        container.appendChild(card);
    });
}

// ==========================
// AGE CATEGORY
// ==========================
function getAgeRating(rating) {
    if (rating >= 8) return "🔞 18+";
    if (rating >= 6) return "16+";
    return "13+";
}

// ==========================
// SEARCH
// ==========================
document.getElementById("search")?.addEventListener("input", () => {

    const value = document.getElementById("search").value.toLowerCase();

    const filtered = currentMovies.filter(movie =>
        movie.title.toLowerCase().includes(value)
    );

    displayMovies(filtered);
});

// ==========================
// TRAILER
// ==========================
async function playTrailer(id) {

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );

        const data = await res.json();

        const trailer = data.results.find(v => v.type === "Trailer");

        if (trailer) {
            document.getElementById("modal").style.display = "flex";
            document.getElementById("trailer").src =
                `https://www.youtube.com/embed/${trailer.key}`;
        } else {
            alert("Trailer not available 😅");
        }

    } catch {
        alert("Error loading trailer ❌");
    }
}

// ==========================
// CLOSE MODAL
// ==========================
function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("trailer").src = "";
}

// ==========================
// DARK / LIGHT MODE
// ==========================
function toggleMode() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}

// ==========================
// 🧠 AI EMOTION LOGIC
// ==========================
function detectEmotion(text) {

    text = text.toLowerCase();

    if (text.includes("sad") || text.includes("emotional"))
        return "top_rated";

    if (text.includes("happy") || text.includes("fun"))
        return "popular";

    if (text.includes("action") || text.includes("angry"))
        return "upcoming";

    if (text.includes("romantic") || text.includes("love"))
        return "top_rated";

    return "popular";
}

// ==========================
// 🎤 VOICE (IMPROVED)
// ==========================
function startVoice() {

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
        alert("Use Chrome for voice 🎤");
        return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";

    recognition.onresult = (e) => {

        let text = e.results[0][0].transcript;
        console.log("Voice:", text);

        let type = detectEmotion(text);
        getMovies(type);
    };

    recognition.start();
}

// ==========================
// 🎭 CAMERA
// ==========================
async function toggleCamera() {

    const video = document.getElementById("video");

    if (!cameraOn) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;
            video.style.display = "block";
            cameraOn = true;

            setTimeout(() => {
                getMovies("popular");
            }, 3000);

        } catch {
            alert("Camera permission denied ❌");
        }

    } else {
        stopCamera();
    }
}

function stopCamera() {

    const video = document.getElementById("video");

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    video.style.display = "none";
    cameraOn = false;
}

// ==========================
// INIT
// ==========================
window.onload = () => {
    getMovies("popular");
};
