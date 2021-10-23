async function windowActions(evt) {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const request = await fetch(endpoint);
    const locations = await request.json();

    function findMatches(wordToMatch, locations) {
        return locations.filter((place) => {
            const regex = new RegExp(wordToMatch, 'gi');
            // Search by name, city, and zipcode
            return place.name.match(regex) || place.city.match(regex) || place.zip.match(regex);
        });
    }

    // Demo video returned name, category, address, city, zipcode
    function displayMatches(event) {
        const matchArray = findMatches(event.target.value, locations);
        const html = matchArray.map(place => {
            return `
          <ul>
            <li><div class='name'>${place.name}</div></li>
            <div class='category'>${place.category}</div>
            <div class='address'>${place.address_line_1}</div>
            <div class='city'>${place.city}</div>
            <div class='zip'>${place.zip}</div>
          </ul>
          <br> 
          `;
        }).join('');
        suggestions.innerHTML = html;
    }

    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');
    searchInput.addEventListener('change', displayMatches);

    // Changes for resubmission
    // Need to reset result after clearing input
    // Suggestion list should be reset if input is cleared
    searchInput.addEventListener('keyup', (evt) => {
        if (searchInput.value === '') {
            suggestions.innerHTML = '';
        } else {
            displayMatches(evt)
        }
    });
}

window.onload = windowActions;