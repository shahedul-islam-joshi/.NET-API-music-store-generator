let currentPage = 1;
let isLoading = false;
let currentAudio = null;

async function loadMoreSongs(isNewSearch = false) {
    if (isLoading) return;
    isLoading = true;

    if (isNewSearch) {
        currentPage = 1;
        document.getElementById('tableBody').innerHTML = '';
    }

    const seed = document.getElementById('seedInput').value || 123;
    const locale = document.getElementById('languageSelect').value;
    const likes = document.getElementById('likesSlider').value;

    try {
        const response = await fetch(`/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`);
        const songs = await response.json();

        const tbody = document.getElementById('tableBody');

        songs.forEach(song => {
            // 1. Generate a consistent Album Art URL based on seed + index
            const artUrl = `https://picsum.photos/seed/${song.index + seed}/200`;

            // 2. The Main Row (Visible)
            // Note: We add 'onclick="toggleDetails(...)"' to handle the expand logic
            const mainRow = `
            <tr class="song-row" onclick="toggleDetails(${song.index})">
                <td>
                    <span id="arrow-${song.index}">&#9654;</span> ${song.index}
                </td>
                <td>
                    <strong>${song.title}</strong>
                </td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td style="color: #e74c3c;">❤️ ${song.likes}</td>
            </tr>`;

            // 3. The Detail Row (Hidden by default)
            // This contains the Album Art, Audio Player, and Lyrics
            const detailRow = `
            <tr id="detail-${song.index}" class="detail-row" style="display: none;">
                <td colspan="5">
                    <div class="detail-content">
                        <img src="${artUrl}" class="album-art" alt="Album Art">
                        
                        <div class="track-info">
                            <h3>${song.title} <small class="text-muted">by ${song.artist}</small></h3>
                            
                            <audio controls>
                                <source src="${song.audioUrl}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>

                            <div class="lyrics-box">
                                <strong>Lyrics:</strong><br/>
                                ${song.lyrics.replace(/\n/g, '<br/>')}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;

            // Append BOTH rows to the table
            tbody.insertAdjacentHTML('beforeend', mainRow + detailRow);
        });

        currentPage++;
    } catch (error) {
        console.error("Error loading songs:", error);
    } finally {
        isLoading = false;
    }
}

// --- NEW FUNCTION: Handles the Expand/Collapse logic ---
function toggleDetails(index) {
    const detailRow = document.getElementById(`detail-${index}`);
    const arrow = document.getElementById(`arrow-${index}`);

    if (detailRow.style.display === "none") {
        detailRow.style.display = "table-row"; // Show it
        arrow.innerHTML = "&#9660;"; // Change arrow to Down
    } else {
        detailRow.style.display = "none"; // Hide it
        arrow.innerHTML = "&#9654;"; // Change arrow to Right
    }
}

// --- EVENT LISTENERS (Same as before) ---
document.getElementById('shuffleBtn').addEventListener('click', () => {
    document.getElementById('seedInput').value = Math.floor(Math.random() * 1000000);
    loadMoreSongs(true);
});

document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadMoreSongs(true); // Recalculate likes immediately
});

document.getElementById('seedInput').addEventListener('input', () => loadMoreSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => loadMoreSongs(true));

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreSongs();
    }
};

// Initial Load
loadMoreSongs();