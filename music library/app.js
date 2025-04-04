const body = document.body;
const music = document.querySelector('#audio');
const seekBar = document.querySelector('.seek-bar');
const musicName = document.querySelector('.music-name');
const artistName = document.querySelector('.artist-name');
const disk = document.querySelector('.disk');
const currentTime = document.querySelector('.current-time');
const songDuration = document.querySelector('.song-duration');
const playBtn = document.querySelector('.play-btn');
const backwardBtn = document.querySelector('.backward-btn');
const forwardBtn = document.querySelector('.forward-btn');
const volumeBar = document.querySelector('.volume-slider input');
const volumeIcon = document.querySelector('.volume-icon i');

let currentMusic = 0;

let songs = [
    {
        name: 'song 1',
        path: 'music/Song 1.mp3',
        artist: 'artist 1',
        cover: 'images/cover1.png'
    },
    {
        name: 'song 2',
        path: 'music/Song 2.mp3',
        artist: 'artist 2',
        cover: 'images/cover2.png'
    },
    {
        name: 'song 3',
        path: 'music/Song 3.mp3',
        artist: 'artist 3',
        cover: 'images/cover3.png'
    },
    {
        name: 'song 4',
        path: 'music/Song 4.mp3',
        artist: 'artist 4',
        cover: 'images/cover4.png'
    },
    {
        name: 'song 5',
        path: 'music/Song 5.mp3',
        artist: 'artist 5',
        cover: 'images/cover5.png'
    },
];
document.addEventListener('keydown', (e) => {
    e.preventDefault(); 

    if (e.code === 'Space') {
        if (music.paused) {
            playMusic();
        } else {
            music.pause();
            playBtn.classList.remove('pause');
            disk.classList.remove('play', 'beat');
            musicName.classList.remove('dancing');
        }
    } else if (e.code === 'ArrowRight') {
        currentMusic = (currentMusic >= songs.length - 1) ? 0 : currentMusic + 1;
        setMusic(currentMusic);
        playMusic();
    } else if (e.code === 'ArrowLeft') {
        currentMusic = (currentMusic <= 0) ? songs.length - 1 : currentMusic - 1;
        setMusic(currentMusic);
        playMusic();
    }else if (e.code === 'ArrowUp') {   
        changeVolume(5); 
    } else if (e.code === 'ArrowDown') {
        changeVolume(-5); 
    }
});

playBtn.addEventListener('click', () => {
    if (music.paused) {
        playMusic();
    } else {
        music.pause();
        playBtn.classList.remove('pause');
        disk.classList.remove('play', 'beat');
        musicName.classList.remove('dancing');

    }
});

const setMusic = (i) => {
    seekBar.value = 0;
    let song = songs[i];
    currentMusic = i;
    music.src = song.path;
    musicName.innerHTML = song.name;
    artistName.innerHTML = song.artist;
    disk.style.backgroundImage = `url(${song.cover})`;
    currentTime.innerHTML = '00:00';

    music.onloadedmetadata = () => {
        seekBar.max = music.duration;
        songDuration.innerHTML = formatTime(music.duration);
    };

    if (!music.paused) {
        disk.classList.add('play', 'beat');
        musicName.classList.add('dancing');
    } else {
        disk.classList.remove('play', 'beat');
        musicName.classList.remove('dancing');
    }
};
const formatTime = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
};
setInterval(() => {
    seekBar.value = music.currentTime;
    currentTime.innerHTML = formatTime(music.currentTime);
    if (Math.floor(music.currentTime) === Math.floor(seekBar.max)) {
        forwardBtn.click();
    }
}, 500);

seekBar.addEventListener('input', () => {
    music.currentTime = seekBar.value;
});
const playMusic = () => {
    music.play();
    playBtn.classList.add('pause');
    disk.classList.add('play', 'beat');
    musicName.classList.add('dancing');  
};
forwardBtn.addEventListener('click', () => {
    currentMusic = (currentMusic >= songs.length - 1) ? 0 : currentMusic + 1;
    setMusic(currentMusic);
    playMusic();
});
backwardBtn.addEventListener('click', () => {
    currentMusic = (currentMusic <= 0) ? songs.length - 1 : currentMusic - 1;
    setMusic(currentMusic);
    playMusic();
});
setMusic(0);
const changeVolume = (amount) => {
    let newVolume = Math.min(Math.max(music.volume * 100 + amount, 0), 100) / 100;
    music.volume = newVolume;
    volumeBar.value = newVolume * 100; 
    if (newVolume === 0) {
        volumeIcon.className = 'ri-volume-mute-line';
    } else if (newVolume < 0.5) {
        volumeIcon.className = 'ri-volume-down-line';
    } else {
        volumeIcon.className = 'ri-volume-up-line';
    }
};
volumeBar.addEventListener('input', () => {
    music.volume = volumeBar.value / 100;
    changeVolume(0); 
});
music.volume = volumeBar.value / 100;
