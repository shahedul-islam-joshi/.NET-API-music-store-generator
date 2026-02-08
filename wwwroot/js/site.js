let currentPage = 1;
let isLoading = false;

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

        currentPage++; // Prepare for the next 10 items
    } catch (error) {
        console.error("Failed to load songs", error);
    } finally {
        isLoading = false;
    }
}

// Infinite Scroll logic: trigger when user is near bottom
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreSongs();
    }
};

// Listeners for UI controls
document.getElementById('seedInput').addEventListener('input', () => loadMoreSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => loadMoreSongs(true));
document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadMoreSongs(true);
});

// Initial load
loadMoreSongs();