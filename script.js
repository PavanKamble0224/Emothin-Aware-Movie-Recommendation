function detectEmotion() {

    const emotions = ["Happy", "Sad", "Angry", "Surprise", "Neutral"];

    const movies = {
        "Happy": ["3 Idiots", "ZNMD", "Chhichhore"],
        "Sad": ["Tamasha", "Rockstar", "Pursuit of Happyness"],
        "Angry": ["KGF", "John Wick", "Gangs of Wasseypur"],
        "Surprise": ["Inception", "Interstellar", "Shutter Island"],
        "Neutral": ["Forrest Gump", "Shawshank Redemption"]
    };

    // Random emotion (simulate AI)
    let emotion = emotions[Math.floor(Math.random() * emotions.length)];

    document.getElementById("emotion").innerText =
        "Detected Emotion: " + emotion;

    let movieList = document.getElementById("movies");
    movieList.innerHTML = "";

    movies[emotion].forEach(movie => {
        let li = document.createElement("li");
        li.innerText = movie;
        movieList.appendChild(li);
    });
}
