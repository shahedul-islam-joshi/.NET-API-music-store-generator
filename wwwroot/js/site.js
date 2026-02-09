let currentPage = 1;
let isLoading = false;

// 1. Main Function to Fetch Data
async function loadMoreSongs(isNewSearch = false) {
    if (isLoading) return;
    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    if (isNewSearch) {
        currentPage = 1;
        document.getElementById('tableBody').innerHTML = '';
    }

    const seed = document.getElementById('seedInput').value || 0;
    const locale = document.getElementById('languageSelect').value;
    const likes = document.getElementById('likesSlider').value;

    try {
        const response = await fetch(`/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`);
        const songs = await response.json();

        const tbody = document.getElementById('tableBody');

        songs.forEach(song => {
            // Generate consistent Album Art
            const artUrl = `https://picsum.photos/seed/${song.index + seed}/200`;

            // Main Row (Visible)
            const mainRow = `
            <tr class="song-row" onclick="toggleDetails(${song.index})">
                <td><span id="arrow-${song.index}">&#9654;</span> ${song.index}</td>
                <td><strong>${song.title}</strong></td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td style="color:#e74c3c; font-weight:bold;">❤️ ${song.likes}</td>
            </tr>`;

            // Detail Row (Hidden)
            const detailRow = `
            <tr id="detail-${song.index}" class="detail-row" style="display: none;">
                <td colspan="5">
                    <div class="detail-content">
                        <img src="${artUrl}" class="album-art" alt="Album Art">
                        <div class="track-info">
                            <h4>${song.title} <small class="text-muted">by ${song.artist}</small></h4>
                            
                            <audio controls style="width: 100%; margin: 10px 0;">
                                <source src="${song.audioUrl}" type="audio/mpeg">
                            </audio>

                            <div class="lyrics-box">
                                <strong>Lyrics:</strong><br/>
                                <em>${song.lyrics.replace(/\n/g, '<br/>')}</em>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;

            tbody.insertAdjacentHTML('beforeend', mainRow + detailRow);
        });

        currentPage++;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        isLoading = false;
        document.getElementById('loading').style.display = 'none';
    }
}

// 2. Expand/Collapse Function
function toggleDetails(index) {
    const row = document.getElementById(`detail-${index}`);
    const arrow = document.getElementById(`arrow-${index}`);

    if (row.style.display === "none") {
        row.style.display = "table-row";
        arrow.innerHTML = "&#9660;"; // Down Arrow
    } else {
        row.style.display = "none";
        arrow.innerHTML = "&#9654;"; // Right Arrow
    }
}

// 3. Event Listeners
document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadMoreSongs(true); // REFRESH TABLE ON SLIDER CHANGE
});

document.getElementById('seedInput').addEventListener('input', () => loadMoreSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => loadMoreSongs(true));
document.getElementById('shuffleBtn').addEventListener('click', () => {
    document.getElementById('seedInput').value = Math.floor(Math.random() * 1000000);
    loadMoreSongs(true);
});

// 4. Infinite Scroll
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        loadMoreSongs();
    }
};

// Initial Load
loadMoreSongs();