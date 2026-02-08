let currentPage = 1;
let isLoading = false; // Prevents multiple fetches at once

// Function to fetch and append data
async function loadSongs(isNewSearch = false) {
    if (isLoading) return;
    isLoading = true;

    if (isNewSearch) {
        currentPage = 1;
        document.getElementById('tableBody').innerHTML = '';
    }

    const seed = document.getElementById('seedInput').value;
    const locale = document.getElementById('languageSelect').value;
    const likes = document.getElementById('likesSlider').value;

    try {
        const url = `/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`;
        const response = await fetch(url);
        const songs = await response.json();

        renderSongs(songs);
        currentPage++; // Prepare for next scroll
    } catch (e) {
        console.error("Fetch failed", e);
    } finally {
        isLoading = false;
    }
}

// Infinite Scroll Listener
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadSongs(); // Fetch next 10 items
    }
};

function renderSongs(songs) {
    const tbody = document.getElementById('tableBody');
    songs.forEach(song => {
        const row = `<tr><td>${song.index}</td><td>${song.title}</td><td>${song.artist}</td><td>${song.album}</td><td>❤️ ${song.likes}</td></tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Initial Call
loadSongs();