// --- REFERENCIAS A ELEMENTOS DEL DOM ---
const loadMp3Btn = document.getElementById('load-mp3');
const audioPlayer = document.getElementById('audio-player');
const statusElement = document.getElementById('status');
const nowPlayingElement = document.getElementById('now-playing');
const trackTitleDisplay = document.getElementById('track-title-display');
const playlistUI = document.getElementById('playlist-ui');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const repeatBtn = document.getElementById('repeat-btn');
const playPauseBtn = document.getElementById('play-pause-btn');

// Nuevas referencias para controles personalizados
const seekSlider = document.getElementById('seek-slider');
const progressBarFill = document.getElementById('progress-bar-fill');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeLabel = document.getElementById('current-time');
const totalDurationLabel = document.getElementById('total-duration');

// --- ESTADO DEL REPRODUCTOR ---
let playlist = [];
let currentTrackIndex = -1;
let repeatMode = 'none'; // 'none', 'one', 'all'

// --- FUNCIONES DE UTILIDAD ---

// Formatea el tiempo en segundos a MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// --- FUNCIONES DE LA PLAYLIST ---

// Añade una pista a la playlist, evitando duplicados.
async function addTrack(filePath) {
    if (playlist.some(track => track.source === filePath)) {
        statusElement.textContent = 'Este archivo ya está en la lista.';
        return;
    }
    const fileName = filePath.split('\\').pop().split('/').pop();
    const track = { source: filePath, title: decodeURI(fileName) };
    playlist.push(track);
    updatePlaylistUI();
    statusElement.textContent = `"${track.title}" añadido.`;
    
    // Si no hay nada sonando, reproducir automáticamente
    if (currentTrackIndex === -1) {
        playTrack(0);
    }
}

// Elimina una pista de la playlist.
function deleteTrack(index) {
    playlist.splice(index, 1);
    
    if (index === currentTrackIndex) {
        audioPlayer.pause();
        audioPlayer.src = '';
        nowPlayingElement.textContent = "Ahora suena: Nada";
        trackTitleDisplay.textContent = "Selecciona una canción";
        currentTrackIndex = -1;
        updatePlayPauseIcon();
        resetSeeker();
    } else if (index < currentTrackIndex) {
        currentTrackIndex--;
    }
    updatePlaylistUI();
}

// Reproduce una pista de la playlist según su índice.
function playTrack(index) {
    if (index < 0 || index >= playlist.length) {
        currentTrackIndex = -1;
        nowPlayingElement.textContent = "Ahora suena: Nada";
        trackTitleDisplay.textContent = "Selecciona una canción";
        audioPlayer.src = "";
        updatePlaylistUI();
        updatePlayPauseIcon();
        resetSeeker();
        return;
    }
    
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    nowPlayingElement.textContent = "Ahora suena:";
    trackTitleDisplay.textContent = track.title;
    audioPlayer.src = track.source;
    audioPlayer.play();
    updatePlaylistUI();
    updatePlayPauseIcon();
}

// Actualiza el icono de Reproducir/Pausa
function updatePlayPauseIcon() {
    if (audioPlayer.paused) {
        playPauseBtn.textContent = '▶';
        playPauseBtn.title = 'Reproducir';
    } else {
        playPauseBtn.textContent = '⏸';
        playPauseBtn.title = 'Pausar';
    }
}

// Resetea la barra de progreso
function resetSeeker() {
    seekSlider.value = 0;
    progressBarFill.style.width = '0%';
    currentTimeLabel.textContent = "0:00";
    totalDurationLabel.textContent = "0:00";
}

// Actualiza la lista visual de la playlist en el HTML.
function updatePlaylistUI() {
    playlistUI.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        if (index === currentTrackIndex) {
            li.classList.add('playing');
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'track-title';
        titleSpan.textContent = `${index + 1}. ${track.title}`;
        titleSpan.onclick = () => playTrack(index);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Borrar';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteTrack(index);
        };

        li.appendChild(titleSpan);
        li.appendChild(deleteButton);
        playlistUI.appendChild(li);
    });
}

// --- EVENT LISTENERS ---

// Cargar Archivo
loadMp3Btn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
        addTrack(filePath);
    }
});

// Botón Reproducir / Pausa
playPauseBtn.addEventListener('click', () => {
    if (playlist.length === 0) return;
    if (currentTrackIndex === -1) {
        playTrack(0);
        return;
    }
    
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    updatePlayPauseIcon();
});

// Botones de Navegación
nextBtn.addEventListener('click', () => {
    if (playlist.length === 0) return;
    playTrack((currentTrackIndex + 1) % playlist.length);
});

prevBtn.addEventListener('click', () => {
    if (playlist.length === 0) return;
    playTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
});

// Modo de Repetición
repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'none') {
        repeatMode = 'all';
        repeatBtn.textContent = '🔁';
        repeatBtn.style.color = 'var(--accent-color)';
        repeatBtn.title = 'Repetir: Todo';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        repeatBtn.textContent = '🔂';
        repeatBtn.style.color = 'var(--accent-color)';
        repeatBtn.title = 'Repetir: Una';
    } else {
        repeatMode = 'none';
        repeatBtn.textContent = '🔁';
        repeatBtn.style.color = 'var(--text-dim)';
        repeatBtn.title = 'Repetir: No';
    }
});

// Actualización de la barra de progreso mientras suena
audioPlayer.addEventListener('timeupdate', () => {
    if (!isNaN(audioPlayer.duration)) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekSlider.value = progress;
        progressBarFill.style.width = `${progress}%`;
        currentTimeLabel.textContent = formatTime(audioPlayer.currentTime);
    }
});

// Al cargar la metadata de la canción (duración)
audioPlayer.addEventListener('loadedmetadata', () => {
    totalDurationLabel.textContent = formatTime(audioPlayer.duration);
});

// Al mover el slider manualmente
seekSlider.addEventListener('input', () => {
    const seekTo = audioPlayer.duration * (seekSlider.value / 100);
    audioPlayer.currentTime = seekTo;
    progressBarFill.style.width = `${seekSlider.value}%`;
});

// Control de Volumen
volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
});

// Al terminar una canción
audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        playTrack(currentTrackIndex);
    } else if (repeatMode === 'all') {
        playTrack((currentTrackIndex + 1) % playlist.length);
    } else if (currentTrackIndex < playlist.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else {
        currentTrackIndex = -1;
        updatePlayPauseIcon();
        updatePlaylistUI();
        resetSeeker();
    }
});