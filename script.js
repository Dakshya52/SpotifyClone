let currentSong = new Audio()

let songs;

function convertSecondsToMinutes(seconds) {
    // Calculate the number of minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zeros if necessary
    let minutesStr = String(minutes).padStart(2, '0');
    let secondsStr = String(remainingSeconds).padStart(2, '0');

    let min = parseInt(minutesStr, 10); 
    let secs = parseInt(secondsStr, 10); 

    // Return the formatted time string
    return `${min}:${secs}`;
}

async function getSongs() {
    let a =  await fetch("http://127.0.0.1:3000/Assets/songs")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
    
}

const playMusic = (track)=>{
    currentSong.src= "Assets/songs/" + track
    currentSong.play() 
    play.src = "Assets/pause.svg" 
    // if(currentSong.paused){
    //     play.src = "Assets/play.svg"
    // }
    document.querySelector(".songinfo").innerHTML = track 
    document.querySelector(".songtime").innerHTML = "00" 
}

 async function main() {

    songs = await getSongs()

    let songUL = document.querySelector(".Playlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
                            <li>
                                <img src="Assets/music.svg" alt="" >
                                <div> ${song.replaceAll("%20"," ")}</div>
                                <div>Song Artist</div>
                            </li>
                            `;
    }


    // var audio = new Audio(songs[0])
    // audio.play()
     
    // audio.addEventListener("loadeddata",()=>{
    //    console.log(audio.duration,audio.currentSrc, audio.currentTime)
    // })
    Array.from(document.querySelector(".Playlist").getElementsByTagName("li")).forEach(e=>{
        console.log(e);
        
        e.addEventListener("click",()=>{
            playMusic(e.getElementsByTagName("div")[0].innerHTML.trim())
            console.log(e.getElementsByTagName("div")[0].innerHTML);
        })
        
    })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "Assets/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "Assets/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left =  (currentSong.currentTime/currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        document.querySelector(".circle").style.left =  (e.offsetX/(e.target.getBoundingClientRect().width)) * 100 + "%"
        currentSong.currentTime = (currentSong.duration*(e.offsetX/e.target.getBoundingClientRect().width) * 100)/ 100
        
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "8px"
        document.querySelector(".left").style.bottom = "-1px"
        document.querySelector(".left-first").style.width = "300px"
        document.querySelector(".left-second").style.width = "300px"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })
    
    

    previous.addEventListener("click",()=>{
        let index =  songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if(index-1<0){
            index = songs.length-1
            playMusic(songs[index])
        }
        else{ 
            playMusic(songs[(index-1)%songs.length])
        }
    })

    next.addEventListener("click",()=>{
        let index =  songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        playMusic(songs[(index+1)%songs.length])
    })

}

main()