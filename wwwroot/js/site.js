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

        currentPage++;
    } catch (error) {
        console.error("Failed to load songs:", error);
    } finally {
        isLoading = false;
    }
}

// 2. Localization Logic: Updates UI text from JSON files
async function changeLanguage(lang) {
    try {
        const response = await fetch(`/Resources/${lang === 'uk' ? 'uk-UA.json' : 'en-US.json'}`);
        if (!response.ok) throw new Error("Translation file not found");

        const data = await response.json();

        // Update Page Title and Shuffle Button
        document.title = data.ui.title;
        document.getElementById('shuffleBtn').innerText = data.ui.shuffle;

        // Update Table Headers
        const headers = document.querySelectorAll('th');
        headers[0].innerText = data.ui.table.index;
        headers[1].innerText = data.ui.table.title;
        headers[2].innerText = data.ui.table.artist;
        headers[3].innerText = data.ui.table.album;
        headers[4].innerText = data.ui.table.likes;

        // Update Labels (Assuming you have labels for these inputs)
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            if (label.innerText.toLowerCase().includes('seed')) label.innerText = data.ui.seed;
            if (label.innerText.toLowerCase().includes('region')) label.innerText = data.ui.region;
        });

    } catch (error) {
        console.warn("Localization error:", error);
    }
}

// 3. Event Listeners
document.getElementById('shuffleBtn').addEventListener('click', () => {
    const newSeed = Math.floor(Math.random() * 1000000000);
    document.getElementById('seedInput').value = newSeed;
    loadMoreSongs(true);
});

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreSongs();
    }
};

document.getElementById('seedInput').addEventListener('input', () => loadMoreSongs(true));

// Combined Language Change: Update UI Text + Reload Data
document.getElementById('languageSelect').addEventListener('change', (e) => {
    changeLanguage(e.target.value); // Fetch JSON strings
    loadMoreSongs(true);           // Fetch new API data
});

document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadMoreSongs(true);
});

// Initial load
loadMoreSongs();