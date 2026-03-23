// ==========================
// CONFIG
// ==========================
const API_KEY = "b384060c08c6fe771268e9d4b1b9ed6f";
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

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
        const response = await fetch(`${BASE_URL}${type}?api_key=${API_KEY}`);
        const data = await response.json();

        currentMovies = data.results || [];

        displayMovies(currentMovies);

    } catch (error) {
        container.innerHTML = "<h2 style='color:red'>Error loading movies ❌</h2>";
    }
}

// ==========================
// DISPLAY MOVIES (UPGRADED)
// ==========================
function displayMovies(movies) {

    const container = document.getElementById("movies");
    container.innerHTML = "";

    movies.forEach(movie => {

        const poster = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "https://via.placeholder.com/300x400?text=No+Image";

        const rating = movie.vote_average || "N/A";
        const desc = movie.overview ? movie.overview.substring(0, 80) : "No description";

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${poster}">
            <h3>${movie.title}</h3>
            <p>⭐ ${rating}</p>
            <p>${getAgeRating(rating)}</p>
            <p>${desc}...</p>
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
        alert("Error loading trailer");
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

    if (text.includes("sad")) return "top_rated";
    if (text.includes("happy") || text.includes("fun")) return "popular";
    if (text.includes("action") || text.includes("angry")) return "upcoming";
    if (text.includes("romantic") || text.includes("love")) return "top_rated";

    return "popular";
}

// ==========================
// 🎤 VOICE (UPGRADED)
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

        console.log("You said:", text);

        let type = detectEmotion(text);

        getMovies(type);

        // optional UI feedback
        document.getElementById("emotionText") &&
        (document.getElementById("emotionText").innerText =
            "Detected: " + text);
    };

    recognition.start();
}

// ==========================
// 🎭 CAMERA (SAFE VERSION)
// ==========================
async function toggleCamera() {

    const video = document.getElementById("video");

    if (!cameraOn) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;
            video.style.display = "block";
            cameraOn = true;

            // simulate detection
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
