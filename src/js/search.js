//fetch searchform to get artist
const artistSearch = document.getElementById("search-form");

/**
 * eventlistener for submit that get input-value put into url 
 * to redirect to the artist-page
 */
if (artistSearch) {
    artistSearch.addEventListener('submit', (event) => {
        /**
         * prevent page from loading when submitting
         * @param {SubmitEvent} event - forms submit-event
         */
        event.preventDefault();

        //variable for the input value
        const artist = document.getElementById("search").value;

        if (artist) {
            //navigate to artist.html with the artists name as parameter in url
            window.location.href = `artist.html?artist=${encodeURIComponent(artist)}`;
        }
    });
};