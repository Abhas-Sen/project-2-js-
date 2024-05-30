let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    songs.forEach((song) => {
        songul.innerHTML += `
     <li>
     <img class="invert" src="music.svg" alt="">
     <div class="info">
         <div> ${song.replaceAll("%20", " ")}</div>
         <div>abhas</div>
     </div>
     <div class="playnow">
         <span>play now</span>
         <img class="invert" src="play.svg" alt="">
     </div>
 
     
    </li>`;
    });

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })


    })


    return songs;

}

const playmusic = (track, pause = false) => {
    // let audio =new Audio("/songs/"+ track);
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play();
    }
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayalbums() {
    let response = await fetch(`songs/`);
    let htmlContent = await response.text();
    let tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlContent;
    let anchors = tempContainer.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors);

    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/songs/")[1];

            // Get the meta data of the folder
            let response = await fetch(`songs/${folder}/info.json`);
            let folderInfo = await response.json();

            // Create the card element
            let card = document.createElement('div');
            card.classList.add('card');
            card.dataset.folder = folder;
            card.innerHTML = `
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" fill="none">
                        <circle cx="15" cy="15" r="12" stroke="black" stroke-width="1.5" fill="green" />
                        <path d="M18.6797 15.5922C18.516 16.3114 17.8796 16.8855 16.3908 17.9118C14.9425 18.894 14.1156 19.4217 13.0403 19.0819C12.2754 18.8621 11.6584 18.5457 11.211 18.1185C10.827 17.7527 10.827 16.9128 10.827 15C10.827 13.0872 10.827 12.2473 11.211 11.8815C11.6584 11.4543 12.2754 11.1379 13.0403 10.9181C14.1156 10.5783 14.9425 11.106 16.3908 12.0882C17.8796 13.1145 18.516 13.6886 18.6797 14.4078C18.7497 14.7319 18.7497 15.2681 18.6797 15.5922Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${folderInfo.title}</h2>
                <p>${folderInfo.description}</p>
            `;

            // Add click event listener to the card element
            card.addEventListener('click', async () => {
                songs = await getsongs(`songs/${folder}`);
            });

            // Append the card to the card container
            cardcontainer.appendChild(card);
        }
    }


    
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);

        })
    })
}

async function main() {

    //get the list of all songs in directory
    await getsongs("songs/cs");
    playmusic(songs[0], true)

    //display all the albums on the page
    displayalbums();





    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }

    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = secondsToMinutesSeconds(currentSong.currentTime) + "/" + secondsToMinutesSeconds(currentSong.duration);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / document.querySelector(".seekbar").offsetWidth) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";

    })

    document.querySelector("#previous").addEventListener("click", () => {
        currentSong.pause();
        console.log("previous");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])

        }
    })

    document.querySelector("#next").addEventListener("click", () => {
        // currentSong.pause();
        console.log("next");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if (index < songs.length - 1) {
            playmusic(songs[index + 1]);
        }
    })

    // console.log(document.querySelector(".range").getElementsByTagName("input")[0])

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to ", e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
        }

    })

    //load the playlist when it is clicked


    // add event listener to the volume icon
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })



}

main();