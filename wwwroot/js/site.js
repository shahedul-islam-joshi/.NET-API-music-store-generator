let currentPage = 1;
let isLoading = false;

// 1. Core function to fetch and render songs
async function loadMoreSongs(isNewSearch = false) {
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

        currentPage++; // Prepare for the next page fetch
    } catch (error) {
        console.error("Failed to load songs:", error);
    } finally {
        isLoading = false;
    }
}

// 2. Shuffle Button Logic: Generate random seed and reset table
document.getElementById('shuffleBtn').addEventListener('click', () => {
    const newSeed = Math.floor(Math.random() * 1000000000);
    document.getElementById('seedInput').value = newSeed;
    loadMoreSongs(true);
});

// 3. Infinite Scroll Listener
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreSongs();
    }
};

// 4. Input listeners for automatic refresh
document.getElementById('seedInput').addEventListener('input', () => loadMoreSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => loadMoreSongs(true));
document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadMoreSongs(true);
});

// Initial load
loadMoreSongs();