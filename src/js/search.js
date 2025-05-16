const artistSearch = document.getElementById("search-form");

if (artistSearch) {
    artistSearch.addEventListener('submit', (event) => {
        event.preventDefault();

        const artist = document.getElementById("search").value;
        console.log("sökt artist: ", artist);

        if (artist) {
            window.location.href = `artist.html?artist=${encodeURIComponent(artist)}`;
        }
    });
};