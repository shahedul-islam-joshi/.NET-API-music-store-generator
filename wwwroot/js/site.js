let currentPage = 1;
let isLoading = false;

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

    const response = await fetch(`/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`);
    const songs = await response.json();

    const tbody = document.getElementById('tableBody');
    songs.forEach(song => {
        const tr = document.createElement('tr');
        tr.className = 'song-row';
        tr.innerHTML = `
            <td>${song.index}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.album}</td>
            <td>${song.genre}</td>
        `;

        // Logic to expand the row
        tr.onclick = () => toggleRow(tr, song);
        
        tbody.appendChild(tr);
    });

    currentPage++;
    isLoading = false;
}

function toggleRow(row, song) {
    const nextRow = row.nextElementSibling;
    
    // Close if already open
    if (nextRow && nextRow.classList.contains('detail-row')) {
        nextRow.remove();
        row.classList.remove('active-row');
        return;
    }

    // Close any other open rows
    document.querySelectorAll('.detail-row').forEach(r => r.remove());
    document.querySelectorAll('.active-row').forEach(r => r.classList.remove('active-row'));

    // Create the expanded card
    row.classList.add('active-row');
    const detailTr = document.createElement('tr');
    detailTr.className = 'detail-row';
    detailTr.innerHTML = `
        <td colspan="5">
            <div class="song-card">
                <div class="album-art-container">
                    <img src="https://picsum.photos/seed/${song.index}/200" alt="Album Art">
                    <div style="margin-top:10px; color:#3b82f6;">💙 ${song.likes} Likes</div>
                </div>
                <div class="song-details-content">
                    <h2>${song.title}</h2>
                    <p>from <strong>${song.album}</strong> by <strong>${song.artist}</strong></p>
                    <div class="lyrics-box">
                        <strong>Lyrics:</strong><br>
                        ${song.lyrics.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
        </td>
    `;
    row.after(detailTr);
}

// Initial Load and Event Listeners
document.getElementById('seedInput').addEventListener('input', () => loadSongs(true));
document.getElementById('languageSelect').addEventListener('change', () => loadSongs(true));
document.getElementById('likesSlider').addEventListener('input', (e) => {
    document.getElementById('likesValue').innerText = e.target.value;
    loadSongs(true);
});

window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadSongs();
    }
};

loadSongs(); // Start the app