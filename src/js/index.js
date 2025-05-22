"use strict";

//js for index.html
//api key for ticketmaster
const ApiKey = "DHOhBMoFKvOXDJD5HEN0wno3M6d6bN2Q";

// Stockholm coordinates as fallback if geolocation fails
const fallbackCoord = { lat: 59.3293, lon: 18.0686 };

// get user location
navigator.geolocation.getCurrentPosition(success, error);

/**
 * success callback for geolocation, fetches concerts from Ticketmaster API
 * 
 * @param {GeolocationPosition} position - The users geolocation data
 * @returns {Promise<void>}
 */

async function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    //fetch concerts from Ticketmaster API using the location
    const concerts = await getConcerts(lat, lon);
    displayMap(lat, lon, concerts);
}

/**
 * error-function if geolocation fails
 * 
 * @param {GeolocationPositionError} error - Error from geolocation
 * @returns {Promise<void>}
 */
async function error(error) {
    console.error("Kunde inte hitta position.", error);

    try {
        //fetch concerts from Ticketmaster API using the fallback coordinates
        const concerts = await getConcerts(fallbackCoord.lat, fallbackCoord.lon);
        displayMap(fallbackCoord.lat, fallbackCoord.lon, concerts);
    } catch {
        console.error("Kunde inte hämta konserter med fallback-position:", error);
    }

}

/**
 * fetch conserts from Ticketmaster API based on coordinates
 * 
 * @param {number} lat - latitude coordinate
 * @param {number} lon - longitude coordinate
 * @returns {Promise<Object[]>} Array of concert objects
 * @throws {Error} - Throws error if response data is 
 */
async function getConcerts(lat, lon) {
    const radius = 100;
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ApiKey}&latlong=${lat},${lon}&radius=${radius}&unit=km&size=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`error: ${response.status}`);

        const data = await response.json();
        console.log(data);

        if (data._embedded && data._embedded.events) {
            return data._embedded.events;
        } else {
            console.error("Inga konserter hittade.");
            return [];
        }

    } catch (error) {
        console.error("Error när konserter ska hämtas", error);
        //Return an empty array if there was an error
        return [];
    }
}

/**
 * display concerts on map
 * 
 * @param {number} lat - latitude coordinate
 * @param {number} lon - longitude coordinate
 * @param {Object[]} concerts - array of concert objects
 * @returns {void} No return value
 */
function displayMap(lat, lon, concerts) {
    const map = L.map('map').setView([lat, lon], 12);
    const concertList = document.querySelector(".concert-list");
    concertList.innerHTML = "";

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (concerts.length === 0) {
        //message to user if no concerts are found
        concertList.textContent = "Inga konserter hittades i din närhet.";
        concertList.style.padding = "0.5em 2em";
        return;
    }

    concerts.forEach(concert => {
        const name = concert.name;
        const date = concert.dates.start.localDate;
        const venue = concert._embedded.venues?.[0];
        const url = concert.url;

        if (venue?.location?.latitude && venue?.location?.longitude) {
            const lat = venue.location.latitude;
            const lon = venue.location.longitude;

            const venueName = venue?.name || "Okänd arena/plats";
            const city = venue?.city?.name || "Okänd stad";

            const popupContent = `
                <a href="${url}" target="_blank">
                    ${name} - ${venueName}, ${city}: ${date}
                </a>`;

            L.marker([lat, lon])
                .addTo(map)
                .bindPopup(popupContent);
        }
    });
}