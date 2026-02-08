let currentPage = 1;
let loading = false;

async function loadSongs(reset = false) {
    if (loading) return;
    loading = true;

    if (reset) {
        currentPage = 1;
        document.getElementById("tableBody").innerHTML = "";
    }

    const seed = seedInput.value;
    const locale = languageSelect.value;
    const likes = likesSlider.value;

    const res = await fetch(`/api/music?seed=${seed}&page=${currentPage}&locale=${locale}&likes=${likes}`);
    const songs = await res.json();

    const tbody = document.getElementById("tableBody");

    songs.forEach(song => {
        const tr = document.createElement("tr");
        tr.className = "song-row";
        tr.innerHTML = `
            <td class="chevron">▾</td>
            <td>${song.index}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.album}</td>
            <td>${song.genre}</td>
        `;

        tr.onclick = () => toggleRow(tr, song);
        tbody.appendChild(tr);
    });

    currentPage++;
    loading = false;
}

function toggleRow(row, song) {
    const next = row.nextElementSibling;
    if (next && next.classList.contains("detail-row")) {
        next.remove();
        row.classList.remove("active");
        return;
    }

    document.querySelectorAll(".detail-row").forEach(r => r.remove());
    document.querySelectorAll(".song-row").forEach(r => r.classList.remove("active"));

    row.classList.add("active");

    const detail = document.createElement("tr");
    detail.className = "detail-row";
    detail.innerHTML = `
        <td colspan="6">
            <div class="detail-card">
                <img src="https://picsum.photos/seed/${song.index}/180" />

                <div class="detail-content">
                    <h2>${song.title}</h2>
                    <p class="meta">from <b>${song.album}</b> by <b>${song.artist}</b></p>

                    <div class="player">
                        ▶ <div class="bar"></div> <span>2:12</span>
                    </div>

                    <span class="likes">💙 ${song.likes}</span>

                    <div class="lyrics">
                        <b>Lyrics</b><br/>
                        ${song.lyrics.replace(/\n/g, "<br/>")}
                    </div>
                </div>
            </div>
        </td>
    `;
    row.after(detail);
}

seedInput.oninput = () => loadSongs(true);
languageSelect.onchange = () => loadSongs(true);
likesSlider.oninput = () => loadSongs(true);

window.onscroll = () => {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight - 200) {
        loadSongs();
    }
};

loadSongs();
