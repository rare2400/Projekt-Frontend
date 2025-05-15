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
 * @async
 * @function success
 * @param {GeolocationPosition} position - The object containing the users location
 */

async function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(`Latitude: ${lat}, Longitude: ${lon}`);

    //fetch concerts from Ticketmaster API using the location
    const concerts = await getConcerts(lat, lon);
    displayConcerts(concerts);
}

/**
 * function if geolocation fails
 * 
 * @async
 * @function error
 * @param {GeolocationPositionError} error - Errormessage from geolocation
 */
function error(error) {
    console.error("Kunde inte hitta position.", error);

    //fetch concerts from Ticketmaster API using the fallback coordinates
    const concerts = getConcerts(fallbackCoord.lat, fallbackCoord.lon)
    displayConcerts(concerts);
}

/**
 * fetch conserts from Ticketmaster API based on coordinates
 * 
 * @async
 * @function getConcerts
 * @param {number} lat - latitude coorinate
 * @param {number} lon - longitude coordinate
 * @returns {Promise<Array>} - return array of concert objects
 */
async function getConcerts(lat, lon) {
    const radius = 100;
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ApiKey}&latlong=${lat},${lon}&radius=${radius}&unit=km`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (data._embedded && data._embedded.events) {
            return data._embedded.events;
        } else {
            console.error("No concerts found in the response.");
            return [];
        }

    } catch (error) {
        console.error("Error fetching concerts:", error);
        //Return an empty array if there was an error
        return [];
    }
}

/**
 * display concerts in the DOM
 * 
 * @function displayConcerts
 * @param {Array<Object>} concerts - array of concert objects
 * @returns {void} No return value
 */
function displayConcerts(concerts) {
    const concertList = document.querySelector(".concert-list");
    //clear the concert list
    concertList.innerHTML = "";

    if (concerts.length > 0) {
        concerts.forEach(concert => {
            //create elements for concert information
            const concertcontainer = document.createElement("div");
            concertcontainer.classList.add("concert-container");
            const concertName = document.createElement("h3");
            const concertInfo = document.createElement("p");
            const ticketLink = document.createElement("a");


            const name = concert.name;
            const date = concert.dates.start.localDate;
            const city = concert._embedded.venues[0].city.name;
            const url = concert.url;

            //create link to buy tickets to the concert
            ticketLink.href = url;
            ticketLink.target = "_blank";
            ticketLink.textContent = name;

            //info about the concert (where and when)
            concertInfo.textContent = `${city} - ${date}`;

            //element structure
            concertName.appendChild(ticketLink);
            concertcontainer.appendChild(concertName);
            concertcontainer.appendChild(concertInfo);
            concertList.appendChild(concertcontainer);
        });
    } else {
        //message to user if no concerts are found
        concertList.textContent = "Inga konserter hittades.";
        concertList.style.padding = "1em 2em";
    }
}