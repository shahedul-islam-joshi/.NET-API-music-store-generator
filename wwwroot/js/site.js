let currentPage = 1;
let isLoading = false;

// 1. Core Fetch Function
async function fetchSongs(isNewSearch = false) {
    if (isLoading) return;
    if (isNewSearch) {
        currentPage = 1;
        document.getElementById('tableBody').innerHTML = '';
    }

    isLoading = true;
    const seed = document.getElementById('seedInput').value;
    const locale = document.getElementById('languageSelect').value;
    const likes = document.getElementById('likesSlider').value;

    const response = await fetch(`/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`);
    const songs = await response.json();

    const tbody = document.getElementById('tableBody');
    songs.forEach(song => {
        const row = `<tr>
            <td>${song.index}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.album}</td>
            <td>❤️ ${song.likes}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    currentPage++; // Increment for the next scroll trigger
    isLoading = false;
}

// 2. Infinite Scroll Listener
window.onscroll = function () {
    // If user is near the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        fetchSongs();
    }
};

// 3. Event Listeners for Toolbar
document.getElementById('seedInput').addEventListener('change', () => fetchSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => fetchSongs(true));
document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    fetchSongs(true);
});

// Initial Load
fetchSongs();