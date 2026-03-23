function getMovies(mood) {

    const database = {

        romantic: [
            {title: "Titanic", img: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"},
            {title: "The Notebook", img: "https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg"},
            {title: "La La Land", img: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"},
            {title: "Before Sunrise", img: "https://image.tmdb.org/t/p/w500/8L7l7Y0E8N8E9kXg8vY0.jpg"}
        ],

        happy: [
            {title: "3 Idiots", img: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg"},
            {title: "Zindagi Na Milegi Dobara", img: "https://image.tmdb.org/t/p/w500/7cX6k6xW3.jpg"},
            {title: "Chhichhore", img: "https://image.tmdb.org/t/p/w500/some.jpg"},
            {title: "The Mask", img: "https://image.tmdb.org/t/p/w500/6fOq0Xg.jpg"}
        ],

        sad: [
            {title: "Tamasha", img: "https://image.tmdb.org/t/p/w500/tamasha.jpg"},
            {title: "Rockstar", img: "https://image.tmdb.org/t/p/w500/rockstar.jpg"},
            {title: "Joker", img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"},
            {title: "The Pursuit of Happyness", img: "https://image.tmdb.org/t/p/w500/6dW1HLSj.jpg"}
        ],

        action: [
            {title: "KGF", img: "https://image.tmdb.org/t/p/w500/kgf.jpg"},
            {title: "John Wick", img: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg"},
            {title: "Avengers Endgame", img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"},
            {title: "Pathaan", img: "https://image.tmdb.org/t/p/w500/pathaan.jpg"}
        ],

        thriller: [
            {title: "Inception", img: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg"},
            {title: "Interstellar", img: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg"},
            {title: "Shutter Island", img: "https://image.tmdb.org/t/p/w500/kve20tXwUZpu4GUX8l6X7Z4jmL6.jpg"},
            {title: "Fight Club", img: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg"}
        ]
    };

    document.getElementById("title").innerText =
        "Recommended Movies for " + mood.toUpperCase();

    const container = document.getElementById("movies");
    container.innerHTML = "";

    database[mood].forEach(movie => {

        let card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.img}" alt="">
            <h3>${movie.title}</h3>
        `;

        container.appendChild(card);
    });
}
