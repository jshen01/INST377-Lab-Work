async function windowActions() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const request = await fetch(endpoint);
    const locations = await request.json();
    let mymap = null;
    let layerGroup = null;
    let coordsArray = [];

    function findMatches(wordToMatch, locations) {
        return locations.filter((place) => {
            const regex = new RegExp(wordToMatch, 'gi');
            return place.zip.match(regex);
        });
    }

    function displayMatches(event) {
        let matchArray = findMatches(event.target.value, locations);

        matchArray = matchArray.slice(0, 5);
        const html = matchArray.map(place => {
            return `
        <div class='box has-background-primary'>
            <span class="name"><b>${place.name}</b></span> 
            <br>
            <span class="address"><em>${place.address_line_1}</em></span>
        </div> 
        `;
        }).join('');
        suggestions.innerHTML = html;

        // Save coordinates after suggestion list is generated
        coordsArray = matchArray.map((i) => getCoords(i));

        // Check result
        console.log(coordsArray);
    }

    function getCoords(matchArray) {
        if (matchArray.geocoded_column_1 != undefined && matchArray.geocoded_column_1.coordinates !== null) {
            return [matchArray.geocoded_column_1.coordinates[1], matchArray.geocoded_column_1.coordinates[0]];
        } else {
            return null;
        }
    }

    function mapInit() {
        // Default view at College Park
        mymap = L.map('mapid').setView([38.9966, -76.9275], 12);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoianNoZW4wMSIsImEiOiJja3Y0Nno2Z2Qwc2Z1MnVwNjd1enB4OG5wIn0.7WW7XSp0HnwDbjvtjI8A7Q'
        }).addTo(mymap);

        layerGroup = L.layerGroup().addTo(mymap);
    }

    function mapCoords() {
        // Pan map to first coordinate
        let i = 0;
        layerGroup.clearLayers();

        coordsArray.forEach((element) => {
            if (i === 0) {
                mymap.panTo(element);
                i++;
            }

            if (element != null) {
                L.marker(element).addTo(layerGroup);
            }
        })
    }

    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');
    searchInput.addEventListener('input', mapCoords);
    searchInput.addEventListener('keyup', (evt) => {
        if (searchInput.value === '') {
            suggestions.innerHTML = '';
            coordsArray = [];
            layerGroup.clearLayers();
        } else {
            displayMatches(evt);
        }
    });

    mapInit();
}

window.onload = windowActions;