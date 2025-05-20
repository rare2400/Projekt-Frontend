//last.fm and ticketmaster API keys
const apikey = "1fceb8e923bab7aefbfc3b7b526a26ab"
const concertApikey = "DHOhBMoFKvOXDJD5HEN0wno3M6d6bN2Q";

//get name of the artist from the url
const urlParams = new URLSearchParams(window.location.search);
const artistName = urlParams.get("artist");

//initialize page when loading window
window.onload = init;

/**
 * initialize page by fetching data about the artist from multiple APIs
 * 
 * @returns {void}
 */
function init() {
    if (artistName) {
        getArtistInfo(artistName);
        getTopTracks(artistName);
        getSimilarArtists(artistName);
        getConcerts(artistName);
    }
}

/**
 * fetch image of the searched artist from Deezers API
 * 
 * @param {string} artistName - name of the artist to fetch info about
 * @returns {Promise<void>}
 */
async function getImage(artistName) {
    const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`;

    try {
        const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
        const data = await response.json();
        const image = data.data[0].picture_medium;
        return image;
    } catch (error) {
        console.error("fel vid hämtning av artistbild", error);
    }
}

/**
 * fetch info about the searched artist from Last.fm API
 * 
 * @param {string} artistName - name of the artist to fetch info about
 * @returns {Promise<void>}
 */
async function getArtistInfo(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apikey}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayArtistInfo(data.artist);
    } catch (error) {
        console.error("fel vid hämtning av artistinfo", error);
    }

}

/**
 * display info about the artist in DOM
 * 
 * @param {Object} artist - artistobject from API
 * @returns {void}
 */
async function displayArtistInfo(artist) {
    const artistInfo = document.querySelector(".artist-info");
    // Rensa tidigare resultat
    artistInfo.innerHTML = "";

    if (artist) {
        const artistName = document.createElement("h1");
        const artistImage = document.createElement("img");

        const name = artist.name;
        artistName.textContent = name;

        const image = await getImage(name);
        artistImage.src = image;
        artistImage.alt = `Bild på ${name}`;

        artistInfo.appendChild(artistName);
        artistInfo.appendChild(artistImage);
    } else {
        console.log("Ingen information hittades för denna artist.");
    }
}

/**
 * fetch top tracks by the searched artist from last.fm API
 * 
 * @param {string} artistName - name of the artist
 * @returns {Promise<void>}
 */
async function getTopTracks(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${apikey}&format=json&limit=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayTopTracks(data.toptracks.track);
    } catch (error) {
        console.error("Fel vid hämtning av topplåtar", error);
    }
}

/**
 * display top tracks in DOM
 * 
 * @param {Array<Object>} tracks - array of track-object
 * @returns {void}
 */
function displayTopTracks(tracks) {
    const topTracksList = document.querySelector(".top-tracks");
    //clear list
    topTracksList.innerHTML = "";

    if (tracks.length > 0) {
        tracks.forEach(track => {
            const listItem = document.createElement("li");
            const trackLink = document.createElement("a");

            trackLink.href = track.url;
            trackLink.target = "_blank";
            trackLink.textContent = `${track.name} - ${track.artist.name}`;

            listItem.appendChild(trackLink);
            topTracksList.appendChild(listItem);
        });
    } else {
        console.log("Inga låtar hittades för denna artist.");
    }
}

/**
 * fetch artist similiar to the searched artist
 * 
 * @param {string} artistName - name of the artist to find similar artist for
 * @returns {Promise<void>}
 */
async function getSimilarArtists(artistName) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${apikey}&format=json&limit=5`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displaySimilarArtists(data.similarartists.artist);
    } catch (error) {
        console.error("Fel vid hämtning av liknande artister", error);
    }
}

/**
 * display similar artist in DOM
 * 
 * @param {Array<Object>} artists - Array of similar artist-objects
 * @returns {void}
 */
function displaySimilarArtists(artists) {
    const similarArtistsList = document.querySelector(".similar-artists");
    //clear element
    similarArtistsList.innerHTML = "";

    if (artists.length > 0) {
        artists.forEach(artist => {
            const listItem = document.createElement("p");
            const artistLink = document.createElement("a");

            artistLink.href = `artist.html?artist=${encodeURIComponent(artist.name)}`;
            artistLink.target = "_self";
            artistLink.textContent = artist.name;

            listItem.appendChild(artistLink);
            similarArtistsList.appendChild(listItem);
        });
    } else {
        console.log("Inga liknande artister hittades.");
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Inga liknande artister hittades.";
        similarArtistsList.appendChild(errorMessage);
    }
}

/**
 * fetch concerts by the searched artist
 * 
 * @param {string} artistName - name of artist
 * @returns {Promise<void>}
 */
async function getConcerts(artistName) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artistName)}&apikey=${concertApikey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(url, data)

        if (data._embedded && data._embedded.events) {
            displayConcerts(data._embedded.events);
        } else {
            console.log("Inga konserter hittades för denna artist.");
            displayConcerts([]);
        }
    } catch (error) {
        console.error("Fel vid hämtning av konserter", error);
        return [];
    }
}

/**
 * display concerts in the DOM
 * 
 * @param {Array<Object>} concerts - array of concert objects
 * @returns {void} No return value
 */
function displayConcerts(concerts) {
    const concertList = document.querySelector(".concerts");
    //clear the concert list
    concertList.innerHTML = "";

    if (concerts && concerts.length > 0) {
        concerts.forEach(concert => {
            //create elements for concert information
            const container = document.createElement("div")
            container.classList.add("concert-container");
            const concertName = document.createElement("h3");
            const concertInfo = document.createElement("p");
            const ticketLink = document.createElement("a");

            //variables for each 
            const name = concert.name;
            const date = concert.dates.start.localDate;
            const url = concert.url;
            const venues = concert._embedded?.venues?.[0];

            const venueName = venues?.name || "Okänd arena/plats";
            const city = venues?.city?.name || "Okänd stad";


            //create link to buy tickets to the concert
            ticketLink.href = url;
            ticketLink.target = "_blank";
            ticketLink.textContent = name;

            concertInfo.textContent = ` ${date} - ${venueName}, ${city}`;

            // Append elements to the container
            concertName.appendChild(ticketLink);
            container.appendChild(concertName);
            container.appendChild(concertInfo);
            concertList.appendChild(container);
        });
    } else {
        console.log("Inga konserter hittades för denna artist.");
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Inga konserter hittades för denna artist.";
        concertList.appendChild(errorMessage);
    }
}