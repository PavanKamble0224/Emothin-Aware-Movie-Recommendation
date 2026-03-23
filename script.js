let allMovies = [];

// Load dataset
fetch('movies.json')
    .then(res => res.json())
    .then(data => {
        // Transform your dataset
        allMovies = data.map(item => {

            let rating = item.US_peak_chart_post;

            if (rating === "-") rating = 0;

            return {
                title: item.album,
                year: item.year,
                rating: rating,
                image: "https://via.placeholder.com/300x400?text=" + item.album
            };
        });
    });

// Filter logic (AI-like grouping)
function filterMovies(type) {

    let filtered = [];

    if (type === "high") {
        filtered = allMovies.filter(m => m.rating >= 10);
    }
    else if (type === "mid") {
        filtered = allMovies.filter(m => m.rating > 0 && m.rating < 10);
    }
    else {
        filtered = allMovies.filter(m => m.rating === 0);
    }

    document.getElementById("title").innerText =
        "Showing " + type.toUpperCase() + " Picks";

    const container = document.getElementById("movies");
    container.innerHTML = "";

    filtered.forEach(movie => {

        let card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.image}">
            <h3>${movie.title}</h3>
            <p>Year: ${movie.year}</p>
            <p>Rating: ${movie.rating}</p>
        `;

        container.appendChild(card);
    });
}

// Toggle mode
function toggleMode() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}
