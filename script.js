// ==========================
// CONFIG
// ==========================
const API_KEY = "b384060c08c6fe771268e9d4b1b9ed6f";  // 👈 ADD YOUR KEY
const BASE_URL = "https://api.themoviedb.org/3/movie/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ==========================
// GLOBAL STATE
// ==========================
let currentMovies = [];

// ==========================
// FETCH MOVIES (SAFE)
// ==========================
async function getMovies(type = "popular") {

    const container = document.getElementById("movies");
    container.innerHTML = "<h2 style='text-align:center'>Loading...</h2>";

    try {
        const response = await fetch(
            `${BASE_URL}${type}?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("API ERROR");
        }

        const data = await response.json();

        currentMovies = data.results || [];

        if (currentMovies.length === 0) {
            container.innerHTML = "<h2>No movies found</h2>";
            return;
        }

        displayMovies(currentMovies);

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <h2 style="text-align:center; color:red;">
                Failed to load movies ❌ <br>
                Check your API key or internet
            </h2>
        `;
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
            : "https://via.placeholder.com/300x400?text=No+Image";

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${poster}">
            <h3>${movie.title}</h3>
        `;

        card.onclick = () => playTrailer(movie.id);

        container.appendChild(card);
    });
}

// ==========================
// SEARCH FUNCTION
// ==========================
document.getElementById("search")?.addEventListener("input", () => {

    const value = document.getElementById("search").value.toLowerCase();

    const filtered = currentMovies.filter(movie =>
        movie.title.toLowerCase().includes(value)
    );

    displayMovies(filtered);
});

// ==========================
// TRAILER FUNCTION
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

    } catch (err) {
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
// LOAD DEFAULT (IMPORTANT)
// ==========================
window.onload = () => {
    getMovies("popular");
};
