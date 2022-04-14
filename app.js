const heading = document.querySelector('header h2');
const cdThumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('#audio');
const cd = document.querySelector('.cd');
const playBtn = document.querySelector('.btn-toggle-play');
const player = document.querySelector('.player');
const inputBar = document.querySelector('.progress');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
const randomBtn = document.querySelector('.btn-random');
const repeatBtn = document.querySelector('.btn-repeat');
const playList = document.querySelector('.playlist');
const isSong = [];

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        { 
            name: 'Scars To Your Beautiful',
            singer: 'Alessia Cara',
            path: './assets/music/Alessia Cara - Scars To Your Beautiful (Lyrics).mp3',
            image: './assets/img/img1.png'
        },
        { 
            name: '2002',
            singer: 'Anne-Marie',
            path: './assets/music/Anne-Marie - 2002 (Lyrics).mp3',
            image: './assets/img/img2.png'
        },
        { 
            name: 'Work from Home',
            singer: 'Fifth Harmony ft. Ty Dolla $ign',
            path: './assets/music/Fifth Harmony - Work from Home (Lyrics) ft. Ty Dolla $ign.mp3',
            image: './assets/img/img3.png'
        },
        { 
            name: 'Stay',
            singer: 'The Kid LAROI, Justin Bieber',
            path: './assets/music/Stay - The Kid LAROI, Justin Bieber.mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'Peaches',
            singer: 'Justin Bieber ft. Daniel Caesar, Giveon',
            path: './assets/music/Justin Bieber - Peaches ft. Daniel Caesar, Giveon.mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'Yummy',
            singer: 'Justin Bieber',
            path: './assets/music/Justin Bieber - Yummy (Lyrics).mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'Industry Baby',
            singer: 'Lil Nas X, Jack Harlow',
            path: './assets/music/Lil Nas X, Jack Harlow - Industry Baby (Lyrics).mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'MONEY',
            singer: 'LISA',
            path: './assets/music/LISA - MONEY.mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'Savage',
            singer: 'Megan Thee Stallion ',
            path: './assets/music/Megan Thee Stallion - Savage (Lyrics).mp3',
            image: './assets/img/img4.png'
        },
        { 
            name: 'Counting Stars',
            singer: 'OneRepublic',
            path: './assets/music/OneRepublic - Counting Stars (Lyrics).mp3',
            image: './assets/img/img4.png'
        }
    ],
    render: function (){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth;
        const cdRotate = cdThumb.animate([
            {transform : 'rotate(360deg)'}
        ],{
            duration: 15000,
            iterations: Infinity
        })
        cdRotate.pause();

        document.onscroll = function(){
            const srollTop = window.scrollY;
            const newCdWidth = cdWidth - srollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth : 0 + 'px';
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
                player.classList.remove('playing');
                app.isPlaying = false;
                cdRotate.pause();
            }else{
                playingSong();
            }
        }
        playingSong = function(){
            audio.play();
            player.classList.add('playing');
            app.isPlaying = true;
            cdRotate.play();
        }

        audio.ontimeupdate = function(){
            if ( audio.duration ){
                const numInput = audio.currentTime / audio.duration * 100;
                inputBar.value = numInput.toFixed();
            }
        }
        inputBar.onchange = function(e){
            audio.currentTime = e.target.value * audio.duration / 100 ;
        }

        nextBtn.onclick = function(){
            app.nextSong();
            playingSong();
        }
        prevBtn.onclick = function(){
            app.prevSong();
            playingSong();
        }
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    playingSong();
                }
            }
        }
        audio.onended = function(){
            if(!app.isRepeat){
                app.nextSong();
                playingSong();
            }else{
                app.loadCurrentSong();
                audio.play();
            }
        }

    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        if(this.isRandom){
            if(isSong.length >= this.songs.length){
                isSong.splice(0, isSong.length)
            }
            this.randomSong();
        }else{
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length){
                this.currentSong = 0;
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong(); 
        app.render(); 
    },
    prevSong: function(){
        if(this.isRandom){
            if(isSong.length >= this.songs.length){
                isSong.splice(0, isSong.length)
            }
            this.randomSong();
        }else{
            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentSong = 0;
                this.currentIndex = 0;
            }
        }
        this.loadCurrentSong();
        app.render(); 

    },
    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(isSong.includes(newIndex));
        
        if(!isSong.includes(newIndex)){
            isSong.push(newIndex);
            this.currentIndex = newIndex
        }

    },
    
    start: function(){
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}
app.start();