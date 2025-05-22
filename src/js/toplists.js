"use strict";

//Last.fm api key
const apikey = "1fceb8e923bab7aefbfc3b7b526a26ab"

//function to get toplists - artists and tracks
getTracksAndArtists();

/**
 * fetch data from Last.fm API
 * 
 * @param {string} method - API-method used to fetch data from API
 * @param {number} limit - Number of objects to fetch
 * @returns {Promise<Object>} JSON response from API
 * @throws {error} when error fetching data
 * 
 */
async function getData(method, limit) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${apikey}&format=json&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if(!response.ok) throw new Error('Fel vid hämtning av data');

        console.log(data);
        return data;
    } catch (error) {
        console.error(`Fel vid hämtning av : ${method}`, error);
    }
}

/**
 * get top artists and top tracks from api and display them
 * 
 * @returns {Promise<void>} No return value
 */
async function getTracksAndArtists() {
    try {
        const artistData = await getData("chart.gettopartists", 10);
        const topArtists = artistData.artists.artist;
        displayTopArtists(topArtists);

        const chartData = await getData("chart.gettoptracks", 10);
        const topCharts = chartData.tracks.track;
        displayTopCharts(topCharts);
    } catch (error) {
        console.error("Fel vid hämtning av topplistor", error);
    }
}

/**
 * 
 * Display top artists in the DOM
 * 
 * @param {Array<Object>} topArtists - Array of top artists from Last.fm API
 * @returns {void} No return value
 */
function displayTopArtists(topArtists) {
    const artistList = document.querySelector(".artist-list");
    //Clear previous results
    artistList.innerHTML = "";

    if (topArtists.length > 0) {
        topArtists.forEach(artist => {
            //create elements for (each) track
            const itemcontainer = document.createElement("div");
            itemcontainer.classList.add("li-container");
            const listItem = document.createElement("li");
            const artistLink = document.createElement("a");

            artistLink.href = `artist.html?artist=${encodeURIComponent(artist.name)}`;
            artistLink.target = "_self";
            artistLink.textContent = artist.name;

            listItem.appendChild(artistLink);
            itemcontainer.appendChild(listItem);
            artistList.appendChild(itemcontainer);

        });
    } else {
        artistList.textContent = "Inga artister hittades.";
    }
}

/**
 * 
 * Display top tracks in the DOM
 * 
 * @param {Array<Object>} topCharts - Array of top tracks from Last.fm API
 * @return {void} No return value
 */
function displayTopCharts(topCharts) {
    const chartList = document.getElementById("top-tracks-world");
    //Clear previous results
    chartList.innerHTML = "";

    if (topCharts.length > 0) {
        topCharts.forEach(track => {
            //create elements for (each) track
            const trackcontainer = document.createElement("div");
            trackcontainer.classList.add("li-container");
            const listItem = document.createElement("li");
            const trackLink = document.createElement("a");
            trackLink.href = track.url;
            trackLink.target = "_blank";

            trackLink.textContent = `${track.name} - ${track.artist.name}`;

            listItem.appendChild(trackLink);
            trackcontainer.appendChild(listItem);
            chartList.appendChild(trackcontainer);
        });
    } else {
        chartList.textContent = "Inga låtar hittades.";
    }
}