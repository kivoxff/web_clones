const hamBurgur = document.querySelector('.hamburger');
const leftSection = document.querySelector('.left-section');
const songs = document.querySelector('.songs');
const albumCards = document.querySelector('.album-cards');

const playBtn = document.querySelector('.play-btn');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

const songTitle = document.querySelector('.song-title');

const circle = document.querySelector('.circle');
const frontLine = document.querySelector('.front-line');
const seekBar = document.querySelector('.seek-bar');

const currDuration = document.querySelector('.curr-duration');
const totalDuration = document.querySelector('.total-duration');

const volumeBar = document.querySelector('.volume-bar');
const volumeBtn = document.querySelector('.volume-btn');

const loop = document.querySelector('.loop');
const shuffle = document.querySelector('.shuffle');

const search = document.querySelector('.search');
const header = document.querySelector('header');

const mainFolder = `web_clones/01-Vanilla-JS-Clones/Projects/${encodeURIComponent("Sargam Auckestra")}`;
const albumFolder = `${mainFolder}/albums/`;

let currentSong = new Audio();
let currSongEle;
let songVolume = 0.5;
let shuffleSong = false;
let loopSong = false;
let drag = false;

function getRandomHexColor() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return `#${hex.padStart(6, '0')}`;
}

function playSong(path) {
    currentSong.src = path;
    currentSong.play();
}

function playRandomSong() {
    const allSongs = document.querySelectorAll('.song');
    const totalSongs = allSongs.length;

    if (totalSongs === 0) return;

    let randomIndex = Math.floor(Math.random() * totalSongs); // 0 to totalSongs-1

    // optional: avoid repeating the same song
    if (allSongs[randomIndex] === currSongEle && totalSongs > 1) {
        randomIndex = (randomIndex + 1) % totalSongs;
    }

    trackSong(allSongs[randomIndex]);
}

function trackSong(song) {
    if (!song) return;

    if (song && song === currSongEle) {
        const oldBtn = currSongEle.querySelector('.song-btn');

        if (!currentSong.paused) {
            currentSong.pause();
            oldBtn.classList.remove('pause')
            playBtn.classList.remove('pause');
        }
        else if (currentSong.paused) {
            currentSong.play();
            oldBtn.classList.add('pause');
            playBtn.classList.add('pause');
        }

        return;
    }

    if (currSongEle) {
        const oldBtn = currSongEle.querySelector('.song-btn');
        oldBtn.classList.remove('pause');
    }

    currSongEle = song;
    songTitle.textContent = song.dataset.songName;
    playSong(song.dataset.songLink);

    const newBtn = song.querySelector('.song-btn');
    newBtn.classList.add('pause');
    playBtn.classList.add('pause');
}


function handleDrag(e) {
    if (!drag) return;

    const rect = seekBar.getBoundingClientRect();
    let x = e.clientX - rect.left; // position relative to seekBar

    const totalSeekWidth = seekBar.clientWidth;

    // clamp between 0 and total width
    x = Math.max(0, Math.min(x, totalSeekWidth));

    const percent = (x / totalSeekWidth) * 100;
    const totalSec = currentSong.duration;

    frontLine.style.width = `${percent}%`;
    circle.style.left = `${percent}%`;
    currentSong.currentTime = (percent / 100) * totalSec;
}


setInterval(() => {
    header.style.boxShadow = `0px 0px 50px 0 ${getRandomHexColor()}`;
}, 3000);


async function getSongs(path) {
    songs.innerHTML = '' // clear prev songs

    const response = await fetch(`${path}`);
    const data = await response.text();
    const tempNode = document.createElement('div');
    tempNode.innerHTML = data;
    const anchorTag = tempNode.querySelectorAll('a');

    for (const a of anchorTag) {
        const href = a.getAttribute('href');

        if (href.endsWith('.mp3')) {
            const songFullName = decodeURIComponent(href.slice(path.length));
            const songName = songFullName.slice(0, songFullName.indexOf('.'));

            const song = document.createElement('div');
            song.className = 'song';
            song.dataset.songName = songName;
            song.dataset.songLink = href;
            song.innerHTML = `  <span class="song-name">${songName}</span>
                <button class="song-btn reset-btn play"></button>`

            songs.appendChild(song);
        }
    }

    const firstSong = document.querySelector('.song');
    if (firstSong) {
        currSongEle = firstSong;
        currentSong.src = firstSong.dataset.songLink;
        songTitle.textContent = firstSong.dataset.songName;
        frontLine.style.width = 0;
        circle.style.left = 0;
    }
    playBtn.classList.remove('pause');

}

async function getDesc(path) {
    const response = await fetch(`${path}/info.json`);
    if (response.ok) {
        const data = await response.json();
        return data['description'];
    }
    else return `Add info.json at ${decodeURIComponent(path)}`; // error
}

async function imageExists(url) {
    try {
        const res = await fetch(url);
        return res.ok;      // true if status = 200
    } catch {
        return false;       // false if error
    }
}

(async function getAlbums() {
    const response = await fetch(albumFolder);
    const albumHtml = await response.text();
    const tempNode = document.createElement('div');
    tempNode.innerHTML = albumHtml;

    const anchorTag = tempNode.querySelectorAll('a');


    for (const a of anchorTag) {
        const href = a.getAttribute('href');

        if (href.startsWith(albumFolder)) {
            const albumName = decodeURIComponent(href.slice(albumFolder.length));

            const desc = await getDesc(href); // description
            let cardImg = href + '/Sargam.png';
            if (!(await imageExists(cardImg))) {
                cardImg = `${mainFolder}/images-icons/Sargam.png`;
            }


            const card = document.createElement('div');
            card.className = 'album-card';
            card.dataset.albumLink = href + '/';
            card.innerHTML = `  <img src="${cardImg}" alt="Album Cover" class="album-img">
                <div class="album-content">
                <h2 class="album-title">${albumName}</h2>
                <p class="album-desc">${desc}</p>
                </div>`

            albumCards.appendChild(card);
        }
    }

    const firstAlbum = document.querySelector('.album-card');
    if (firstAlbum) await getSongs(firstAlbum.dataset.albumLink);

})();

hamBurgur.addEventListener('click', () => leftSection.classList.toggle('open'));

albumCards.addEventListener('click', (e) => {
    const card = e.target.closest('.album-card');
    if (card) getSongs(card.dataset.albumLink).then(() => trackSong(currSongEle)); // play first song of album
})

songs.addEventListener('click', (e) => {
    const song = e.target.closest('.song');
    trackSong(song);
})

prevBtn.addEventListener('click', () => trackSong(currSongEle.previousElementSibling));
nextBtn.addEventListener('click', () => trackSong(currSongEle.nextElementSibling));
playBtn.addEventListener('click', () => trackSong(currSongEle));


currentSong.addEventListener('loadedmetadata', () => {
    const totalSec = currentSong.duration;
    const secInMin = Math.floor(totalSec / 60);
    const remainSec = Math.floor(totalSec - 60 * secInMin);

    currDuration.textContent = '0:00';
    totalDuration.textContent = `${secInMin}:${remainSec < 10 ? '0' + remainSec : remainSec}`;

    onePercent = totalSec / 100;
})


currentSong.addEventListener('timeupdate', () => {
    const totalSec = currentSong.duration;
    const currSec = currentSong.currentTime;
    const secInMin = Math.floor(currSec / 60);
    const remainSec = Math.floor(currSec - 60 * secInMin);

    currDuration.textContent = `${secInMin}:${remainSec < 10 ? '0' + remainSec : remainSec}`;
    // console.log(secInMin, remainSec, currentSong.duraticurr
    frontLine.style.width = `${(currSec / totalSec) * 100}%`;
    circle.style.left = `${(currSec / totalSec) * 100}%`;
    // console.log(((currSec / totalSec) * 100));
})

currentSong.addEventListener('ended', () => {
    const firstSong = document.querySelector('.song');
    const oldBtn = currSongEle.querySelector('.song-btn');
    oldBtn.classList.remove('pause');
    playBtn.classList.remove('pause');

    if (loopSong) {
        // Repeat the same song
        trackSong(currSongEle);
    } else if (shuffleSong) {
        // Play a random song
        playRandomSong();
    } else {
        // Play next song or stop at the end
        const nextSong = currSongEle.nextElementSibling;
        if (nextSong) trackSong(nextSong);
        else {
            // optional: stop or loop back to first song
            trackSong(firstSong);
        }
    }
});


seekBar.addEventListener('pointerdown', (e) => {
    drag = true;
    handleDrag(e);
});

document.addEventListener('pointerup', () => {
    drag = false;
});

document.addEventListener('pointermove', handleDrag);


volumeBar.addEventListener('input', () => {
    songVolume = volumeBar.value / 100;

    currentSong.volume = songVolume;

    // Update icon classes
    if (songVolume <= 0) {
        volumeBtn.classList.add('mute');
        volumeBtn.classList.remove('low');
    } else if (songVolume <= 0.5) {
        volumeBtn.classList.add('low');
        volumeBtn.classList.remove('mute');
    } else {
        volumeBtn.classList.remove('low');
        volumeBtn.classList.remove('mute');
    }
});

volumeBtn.addEventListener('click', () => {
    if (currentSong.volume > 0) {
        currentSong.volume = 0;
        volumeBar.value = 0;
        volumeBtn.classList.add('mute');
    }
    else {
        currentSong.volume = songVolume;
        volumeBar.value = songVolume * 100;
        volumeBtn.classList.remove('mute');
    }
})

loop.addEventListener('click', () => {
    loopSong ? loopSong = false : loopSong = true;
    loop.classList.toggle('active');
})

shuffle.addEventListener('click', () => {
    shuffleSong ? shuffleSong = false : shuffleSong = true;
    shuffle.classList.toggle('active');
})

search.addEventListener('input', () => {
    const value = search.value.toLowerCase();

    // album search
    document.querySelectorAll('.album-card').forEach(card => {
        const name = card.querySelector('.album-title').textContent.toLowerCase();
        card.style.display = name.includes(value) ? "block" : "none";
    });

    // song search
    document.querySelectorAll('.song').forEach(song => {
        const name = song.dataset.songName.toLowerCase();
        song.style.display = name.includes(value) ? "flex" : "none";
    });

});
