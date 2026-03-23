// DATASET (your file converted inside JS)
const allMovies = [
    {title:"The White Stripes", year:1999, rating:0},
    {title:"De Stijl", year:2000, rating:0},
    {title:"White Blood Cells", year:2001, rating:61},
    {title:"Elephant", year:2003, rating:6},
    {title:"Get Behind Me Satan", year:2005, rating:3},
    {title:"Icky Thump", year:2007, rating:2},
    {title:"Under Great White Northern Lights", year:2010, rating:11},
    {title:"Live in Mississippi", year:2011, rating:0},
    {title:"Live at the Gold Dollar", year:2012, rating:0},
    {title:"Nine Miles from the White City", year:2013, rating:0}
];

// FILTER FUNCTION
function filterMovies(type) {

    let filtered = [];

    if (type === "high") {
        filtered = allMovies.filter(m => m.rating >= 10);
    } else if (type === "mid") {
        filtered = allMovies.filter(m => m.rating > 0 && m.rating < 10);
    } else {
        filtered = allMovies.filter(m => m.rating === 0);
    }

    displayMovies(filtered);
    document.getElementById("title").innerText =
        "Showing " + type.toUpperCase() + " Picks";
}

// DISPLAY FUNCTION
function displayMovies(list) {

    const container = document.getElementById("movies");
    container.innerHTML = "";

    list.forEach(movie => {

        let card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="https://via.placeholder.com/300x400?text=${movie.title}">
            <h3>${movie.title}</h3>
            <p>Year: ${movie.year}</p>
            <p>Rating: ${movie.rating}</p>
        `;

        container.appendChild(card);
    });
}

// DEFAULT LOAD (IMPORTANT FIX)
window.onload = () => {
    displayMovies(allMovies);
};

// MODE TOGGLE
function toggleMode() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
}
