// 1.Render Songs
// 2.Scroll top
// 3.Play / pasuse / seek(tua)
// 4.CD rorate
// 5.Next / prev
// 6.Random
// 7.Next / Repeat when ended
// 8.Active Song
// 9.Scroll active song into view
// 10.Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThunmb = $(".cd-thumb");
const audio = $("#audio");

//thanh thoi gian bai hat
const progress = $(".progress");

const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Damn Song Raftaar Ft KrSNa",
            singer: "Mr. Nair",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Akuma No Ko",
            singer: "Ai Higuchi",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Red Swan",
            singer: "Yoshiki x Hyde",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg",
        },
        {
            name: "Homura",
            singer: "Lisa",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg",
        },
        {
            name: "Orange 7!",
            singer: "Shigatsu wa kimi no uso",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg",
        },
        {
            name: "Suzume",
            singer: "Julien Ando",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg",
        },
        {
            name: "Họ yêu ai mất rồi",
            singer: "Hoài Lâm",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg",
        },
        {
            name: "Ngày mai người ta đi lấy chồng",
            singer: "Voi bản đôn - The Mask Singer",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/song8.jpg",
        },
        {
            name: "Tôi là ai trong em",
            singer: "ERIK",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/song9.jpg",
        },
        {
            name: "Shinzou wo Sasageyo",
            singer: "Attack on Titan",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/song10.jpg",
        },
        {
            name: "Tình xa lúc ban chiều",
            singer: "K-ICM",
            path: "./assets/music/song11.mp3",
            image: "./assets/img/song11.jpg",
        },
        {
            name: "Năm ấy",
            singer: "Đức Phúc",
            path: "./assets/music/song12.mp3",
            image: "./assets/img/song12.jpg",
        },
        {
            name: "Ai mang em đi",
            singer: "K-ICM x APJ",
            path: "./assets/music/song13.mp3",
            image: "./assets/img/song13.jpg",
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${
                    index == this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        playlist.innerHTML = htmls.join("");
    },
    // co the dung cach khac
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //xu ly cd quay / dung
        const cdThunmbAnimate = cdThunmb.animate(
            [{ transform: "rotate(360deg" }],
            {
                duration: 10000, //10 seconds
                interation: Infinity,
            }
        );
        cdThunmbAnimate.pause();

        //lang nghe su kien scroll cho ca trang phong to/ thu nho cd
        //thu nho va lam mo cd
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThunmbAnimate.play();
        };
        // khi song bi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThunmbAnimate.pause();
        };

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // xu ly khi tua song
        progress.oninput = function (e) {
            const seekTime = (audio.duration * e.target.value) / 100;
            audio.currentTime = seekTime;
        };

        // xu ly khi next bai
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        };
        // xu ly khi prev bai
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        //xu ly khi chon/tat random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        //xu ly khi click chon/tat repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        //xu ly khi audio end
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        //lang nghe hanh vi click vao play list
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                //xu ly khi click vao song
                if (songNode) {
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //xu ly khi click vao option
                if (e.target.closest(".option")) {
                    alert("chuc nang dang phat trien");
                }
            }
        };
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRandom;
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThunmb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        //load config tu localstorage
        this.loadConfig();

        // dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        //lang nghe va xu ly cac su kien
        this.handleEvents();

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();

        //render danh sach bai hat
        this.render();

        //hien thi trang thai ban dau cua buuton repeat va random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
};

app.start();
