let currentPage = 1;
let currentSeed = document.getElementById('seedInput').value;
let currentLocale = document.getElementById('languageSelect').value;
let currentLikes = document.getElementById('likesSlider').value;

// Function to fetch data from your API
async function loadSongs(isNewSearch = false) {
    if (isNewSearch) {
        currentPage = 1;
        document.getElementById('tableBody').innerHTML = ''; // Clear table for new seed/lang
    }

    try {
        const url = `/api/music?seed=${currentSeed}&page=${currentPage}&locale=${currentLocale}&likes=${currentLikes}`;
        const response = await fetch(url);
        const songs = await response.json();

        renderSongs(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Function to inject rows into the table
function renderSongs(songs) {
    const tbody = document.getElementById('tableBody');
    songs.forEach(song => {
        const row = `
            <tr>
                <td>${song.index}</td>
                <td><strong>${song.title}</strong></td>
                <td>${song.artist}</td>
                <td><em>${song.album}</em></td>
                <td><span class="heart">❤️</span> ${song.likes}</td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// --- Event Listeners ---

// Language Change
document.getElementById('languageSelect').addEventListener('change', (e) => {
    currentLocale = e.target.value;
    loadSongs(true);
});

// Seed Change
document.getElementById('seedInput').addEventListener('input', (e) => {
    currentSeed = e.target.value;
    loadSongs(true);
});

// Random Seed Button
document.getElementById('shuffleBtn').addEventListener('click', () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    document.getElementById('seedInput').value = randomSeed;
    currentSeed = randomSeed;
    loadSongs(true);
});

// Likes Slider
document.getElementById('likesSlider').addEventListener('input', (e) => {
    currentLikes = e.target.value;
    document.getElementById('likesValue').innerText = e.target.value;
    loadSongs(true);
});

// Initial Load on page open
loadSongs();