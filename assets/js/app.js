const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const slideInput = $(".doashboard__progress")
const slideProgressBar = $(".doashboard__progress-bar")
const playList = $(".playlist")
const doashboardImage = $(".doashboard__image")
const currentTitle = $(".doashboard__title")
const doashboardImageBlock = $(".doashboard__image-block")
const audio = $("#audio")
const playBtn = $(".btn-play")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")
const inputProgress = $(".doashboard__progress")
const PLAYER_STORAGE_KEY = "PLAYER"
const durationTime = $(".doashboard__duration-time")
const currentMinute = $(".doashboard__current-minute")
const currentSecond = $(".doashboard__current-second")
const volume = $(".volume")
const volumeProgress = $(".volume-progress")


const app = {
    currentSong: 0,
    isRandom: false,
    isPlay: false,
    isRepeat: false,
    played: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig:function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig: function(){
        this.isRepeat = this.config.isRepeat
        this.isRandom = this.config.isRandom
    },
    songs: [
        {
            name: "Cứ chill thôi",
            singer: "Chillies",
            path: "Song_1.mp3",
            image: "Song_1.jpg",
            duration: 280,
        },
        {
            name: "Let's not fall in love",
            singer: "BIGBANG",
            path: "Song_2.mp3",
            image: "Song_2.jpg",
            duration: 228,
        },
        {
            name: "The spectre",
            singer: "Alan Walker",
            path: "Song_3.mp3",
            image: "Song_3.jpg",
            duration: 206,
        },
        {
            name: "Save me",
            singer: "DEAMN",
            path: "Song_4.mp3",
            image: "Song_4.jpg",
            duration: 185,
        },
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "Song_5.mp3",
            image: "Song_5.jpg",
            duration: 208,
        },
        {
            name: "Thời không sai lệch",
            singer: "Ngải Thần",
            path: "Song_6.mp3",
            image: "Song_6.jpg",
            duration: 210,
        },
        {
            name: "FRIENDS",
            singer: "Anne Marie",
            path: "Song_7.mp3",
            image: "Song_7.jpg",
            duration: 231,
        },
        {
            name: "Bad guy",
            singer: "Billie Eilish",
            path: "Song_8.mp3",
            image: "Song_8.jpg",
            duration: 194,
        },
        {
            name: "Девочка с картинки",
            singer: "Егор Крид",
            path: "Song_9.mp3",
            image: "Song_9.jpg",
            duration: 147,
        }
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            let currentSongRender = this.config.currentSong === undefined ? this.currentSong : this.config.currentSong
            return`
                <div class="playlist__song ${index === currentSongRender ? 'active': ''}" data-index="${index}">
                    <div class="playlist__song-thumb">
                        <img src="./assets/img/${song.image}" alt="">
                    </div>
                    <div class="playlist__song-content">
                        <h3 class="playlist__song-title">${song.name}</h3>
                        <div class="playlist__song-author">${song.singer}</div>
                    </div>
                    <div class="playlist__song-option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join("")
    },

    handleEvents: function(){
        const _this = this
        // Scroll top
        const widthImage = doashboardImage.offsetWidth
        window.onscroll = function(){
            var scrollY = window.scrollY
            var newWidth = widthImage - scrollY

            doashboardImage.style.width = newWidth > 0 ? `${newWidth}px` : 0
            doashboardImage.style.opacity = newWidth > 0 ? `${newWidth/widthImage}` : 0
        }

        // Xử lý CD quay / dừng
        const doashImageAninmate = doashboardImage.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })

        doashImageAninmate.pause()
        // Play toggle
        playBtn.addEventListener("click", ()=>{
            if(_this.isPlay){
                audio.pause()
            }else{
                audio.play()
            }
        })

        audio.addEventListener("play", ()=>{
            _this.isPlay = true
            playBtn.classList.add("playing")
            doashImageAninmate.play()
        })

        audio.addEventListener("pause",()=>{
            _this.isPlay = false
            playBtn.classList.remove("playing")
            doashImageAninmate.pause()
        })

        // When play audio change progress
        audio.addEventListener("timeupdate", ()=>{
            const currentTime = audio.currentTime
            _this.setCurrentTime(currentTime)
            const durationTime = audio.duration
            if(durationTime){
                const currentPercent = Math.floor(currentTime/durationTime*100)
                inputProgress.value = currentPercent
                slideProgressBar.style.width = `${currentPercent}%`
            }
        })

        // When player seeked audio
        inputProgress.addEventListener("input", (e)=>{
            var seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
            audio.muted = true
        })

        inputProgress.addEventListener("change", (e)=>{
            audio.muted = false
        })

        // Next Song
        nextBtn.addEventListener("click", ()=>{
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            this.render()
            this.scrollActiveSong()
        })

        // Prev Song
        prevBtn.addEventListener("click", ()=>{
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            this.render()
            this.scrollActiveSong()
        })

        // Xu ly bat tat random
        randomBtn.addEventListener("click", ()=>{
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
            _this.setConfig("isRandom", _this.isRandom)
        })

        // Audio ended
        audio.addEventListener("ended", ()=>{
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        })

        // Xu ly bat tat repeat
        repeatBtn.addEventListener("click", ()=>{
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
            _this.setConfig("isRepeat", _this.isRepeat)
        })

        // Lang nghe hanh vi click vao playlist
        playList.addEventListener("click", (e)=>{
            const songNode = e.target.closest(".playlist__song:not(.active)")
            if(songNode || e.target.closest(".playlist__song-option")){
                if(e.target.closest(".playlist__song:not(.active)")){
                    _this.currentSong = Number(songNode.dataset.index)
                    _this.setConfig("currentSong", _this.currentSong)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest(".playlist__song-option")){
                    // 
                    // 
                    // 
                }
            }
        })

        // Tang giam am luong
        audio.volume = .5
        volume.addEventListener("input",(e)=>{
            audio.volume = e.target.value / 100
            volumeProgress.style.width = `${e.target.value}%`
        })
    },

    scrollActiveSong: function(){
        setTimeout(()=>{
            $(".playlist__song.active").scrollIntoView({
                block: "center",
                behavior:  "smooth"
            })
        }, 100)
        
    },

    playRandomSong: function(){
        let randomSong 
        do{
            randomSong = Math.floor(Math.random() * this.songs.length)
        }while(randomSong === this.currentSong || this.played.includes(randomSong))
        if(this.played.length === this.songs.length - 1){
            this.played = []
        }
        this.currentSong = randomSong
        this.played.push(randomSong)
        this.setConfig("currentSong", this.currentSong)
        this.loadCurrentSong()
    },

    nextSong: function(){
        this.currentSong++
        if(this.currentSong === this.songs.length){
            this.currentSong = 0
        }
        this.setConfig("currentSong", this.currentSong)
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentSong--
        if(this.currentSong === -1){
            this.currentSong = this.songs.length -1
        }
        this.setConfig("currentSong", this.currentSong)
        this.loadCurrentSong()
    },

    loadCurrentSong: function(){
        currentTitle.textContent = this.getCurrentSong().name
        doashboardImageBlock.style.backgroundImage = `url(./assets/img/${this.getCurrentSong().image})`
        audio.src = `./assets/music/${this.getCurrentSong().path}`

        var durationTimeEl = this.getCurrentSong().duration
        var durationMinute = Math.floor(durationTimeEl/60)
        var durationSecond = durationTimeEl % 60  
        this.setDurationTime(durationMinute, durationSecond)
    },

    setCurrentTime: function(currentTimeEl){
        var currentTimeFloor = Math.floor(currentTimeEl)
        var currentMinuteEl = Math.floor(currentTimeFloor / 60)
        var currentSecondEl = currentTimeFloor % 60

        currentMinute.innerHTML = `0${currentMinuteEl}`
        if(currentSecondEl < 10){
            currentSecond.innerHTML = `0${currentSecondEl}`
        }else{
            currentSecond.innerHTML = `${currentSecondEl}`
        }
    },

    setDurationTime: function(durationMinute, durationSecond){
        if(durationSecond < 10){
            durationTime.innerHTML = `0${durationMinute}:0${durationSecond}`
        }else{
            durationTime.innerHTML = `0${durationMinute}:${durationSecond}`

        }
    },

    getCurrentSong: function(){
        return this.config.currentSong === undefined ? this.songs[this.currentSong] : this.songs[this.config.currentSong]
    },

    start: function(){
        // Gan cau hinh tu config dc luu san
        this.loadConfig()

        // Xu ly cac events
        this.handleEvents()

        // Tai bai dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hien thi trang thai ban dau cau cac buttons
        if(this.isRepeat){
            repeatBtn.classList.toggle("active", this.isRepeat)
        }
        if(this.isRandom){
            randomBtn.classList.toggle("active", this.isRandom)
        }
        
    }
}

app.start()