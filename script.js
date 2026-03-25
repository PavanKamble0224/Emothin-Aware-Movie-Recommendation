// ==========================
// CONFIG
// ==========================
const API_KEY = "b384060c08c6fe771268e9d4b1b9ed6f";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ==========================
// GENRE MAP
// ==========================
const GENRE_MAP = {
    28: "Action", 35: "Comedy", 18: "Drama",
    27: "Horror", 10749: "Romance",
    53: "Thriller", 878: "Sci-Fi"
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
        container.innerHTML = "<h2 style='color:red'>Error ❌</h2>";
    }
}

// ==========================
// DISPLAY MOVIES
// ==========================
function displayMovies(movies) {

    const container = document.getElementById("movies");
    container.innerHTML = "";

    movies.forEach(movie => {

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x400";

        const rating = movie.vote_average?.toFixed(1) || "N/A";
        const year = movie.release_date?.split("-")[0] || "N/A";
        const desc = movie.overview?.substring(0, 60) || "No description";
        const age = getAgeRating(rating);

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
            modal.style.display = "flex";
            trailer.src = `https://youtube.com/embed/${trailer.key}`;
        }

    } catch {
        alert("Trailer error ❌");
    }
}

function closeModal() {
    modal.style.display = "none";
    trailer.src = "";
}

// ==========================
// DARK / LIGHT MODE
// ==========================
function toggleMode() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}

// ==========================
// 🎤 VOICE (SMART AI)
// ==========================
function startVoice() {

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) return alert("Use Chrome");

    const r = new SR();

    r.onresult = e => {
        let text = e.results[0][0].transcript.toLowerCase();

        if (text.includes("sad")) getMovies("top_rated");
        else if (text.includes("happy")) getMovies("popular");
        else if (text.includes("action")) getMovies("upcoming");
        else getMovies("popular");
    };

    r.start();
}

// ==========================
// 🧠 FACE AI MODELS
// ==========================
async function loadModels() {
    const URL = "https://justadudewhohacks.github.io/face-api.js/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(URL);

    console.log("AI Ready ✅");
}

// ==========================
// 🎭 CAMERA + AI DETECTION
// ==========================
async function toggleCamera() {

    const video = document.getElementById("video");

    if (!cameraOn) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = "block";
            cameraOn = true;

            await loadModels();
            detectEmotion(video);

        } catch {
            alert("Camera error ❌");
        }

    } else stopCamera();
}

// ==========================
// DETECT EMOTION
// ==========================
async function detectEmotion(video) {

    const interval = setInterval(async () => {

        const result = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (result) {

            const emotions = result.expressions;

            let emotion = Object.keys(emotions).reduce((a, b) =>
                emotions[a] > emotions[b] ? a : b
            );

            console.log("Emotion:", emotion);

            handleEmotion(emotion);

            clearInterval(interval);
            stopCamera();
        }

    }, 1500);
}

// ==========================
// EMOTION → MOVIES
// ==========================
function handleEmotion(emotion) {

    if (emotion === "happy") getMovies("popular");
    else if (emotion === "sad") getMovies("top_rated");
    else if (emotion === "angry") getMovies("upcoming");
    else getMovies("popular");
}

// ==========================
// STOP CAMERA
// ==========================
function stopCamera() {

    const video = document.getElementById("video");

    if (stream) {
        stream.getTracks().forEach(t => t.stop());
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
