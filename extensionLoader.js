// UI DEFINTIONS
const sideBar = document.createElement("div");
sideBar.style.height = "calc(100vh - 110px)";
sideBar.style.width = "300px";
sideBar.style.right = "0px";
sideBar.style.top = "110px";
sideBar.style.position = "fixed";
sideBar.style.backgroundColor = "#000000";
sideBar.style.zIndex = "1000";
sideBar.style.padding = "10px";
sideBar.id = "HolaSidebar";
sideBar.style.overflowY = "auto";

document.body.appendChild(sideBar);

document.getElementById("HolaSidebar").innerHTML = `

<h1>HOLA Accessibility Hub</h1>
<h2>1. Meeting Insights</h2>
<p>In this meeting, there are 2 visually impaired person, including 1 total blind and 1 low vision. Your accessible e-teaching recommendations will be based on these 2 attendees.</p>

<h2>2. Check Your Scene</h2>
<center>
<button id="holaButton1">Enable Scene Check</button>
<br><br>
<button id="holaButton2">Check</button>
</center>

<video id="webcamHola1" autoplay="true" width="280px"></video>
<canvas id="canvasHola1" width="280" height="150"></canvas>

<h2>3. In-Meeting Insights</h2>
<p id="holaMeetingInsightsLog"></p>


`;


const infoBox = document.createElement("div");
infoBox.style.height = "50px";
infoBox.style.width = "50vw";
infoBox.style.left = "calc(100vw - 300px - 50vw - 20px)";
infoBox.style.bottom = "110px";
infoBox.style.position = "fixed";
infoBox.style.backgroundColor = "#000000";
infoBox.style.zIndex = "1000";
infoBox.style.padding = "10px";
infoBox.style.display = "block";
infoBox.id = "HolaInfoBox";
document.body.appendChild(infoBox);
infoBox.innerHTML = '<center><p style="color:white; margin: 0px" id="holaInfoBoxText">InfoBox Sample Text</p></center>';


console.log("LOAD Started!");


// INIT WEBCAMs
var videoHalo = document.getElementById("webcamHola1");
var canvasHalo = document.getElementById("canvasHola1");
var contextHalo = canvasHalo.getContext("2d");
let heightHalo = 150;
let widthHalo = 280
canvasHalo.width = widthHalo;
canvasHalo.height = heightHalo;


// WEBCAM LISTENERS
document.getElementById("holaButton1").addEventListener("click", () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                video: true
            })
            .then(function (stream) {
                videoHalo.srcObject = stream;
                heightHalo = videoHalo.videoHeight;
                widthHalo = videoHalo.videoHeight;
                canvasHalo.width = widthHalo;
                canvasHalo.height = heightHalo;
            })
            .catch(function (error) {
                console.log("Something went wrong!");
            });
    }
});

document.getElementById("holaButton2").addEventListener("click", () => {
    console.log("button click");
    contextHalo.drawImage(videoHalo, 0, 0, widthHalo, heightHalo);

    // canvasHalo.toBlob((blob) => {
    //     console.log(blob);

    //     blobToStream(blob)
    //         .then(readerResult => goToAzureCV(readerResult))
    //         .then(result => facePosition(result))
    //     // const newImg = document.createElement('img');
    //     // const url = URL.createObjectURL(blob);
    //     // console.log("BLOB");
    //     // console.log(url);
    // });
    //console.log(canvasHalo.toDataURL());
});



// UI Functions
var timeoutForHidingMessage;

let displayMeetingRecommendation = (message) => {
    let box = document.getElementById("HolaInfoBox");
    let messageEl = document.getElementById("holaInfoBoxText");
    clearTimeout(timeoutForHidingMessage);
    box.style.display = "block";
    messageEl.innerText = message;
    timeoutForHidingMessage = setTimeout(() => {
        box.style.display = "none";
    }, 2000);

    document.getElementById("holaMeetingInsightsLog").innerText += "\n" + message;
}


//UTILS
let blobToStream = (blob) => {

    return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onloadend = function () {
            readerResult = reader.result;
            resolve(readerResult);
        };

        reader.readAsArrayBuffer(blob);
    });
}

let facePosition = (response) => {

    if (response.faces.length > 0) {
        let windowHeight = response.metadata.height;
        let windowWidth = response.metadata.width;
        let sizes = response.faces[0].faceRectangle;
        let topSpacing = Math.floor((sizes.top / windowHeight) * 100);
        let bottomSpacing = Math.floor((windowHeight - sizes.top - sizes.height) / windowHeight * 100);
        let horizontalPosition = Math.floor((sizes.left + sizes.width / 2) / windowWidth);

        console.log(topSpacing, bottomSpacing, horizontalPosition);

        if (horizontalPosition < 0.35) {
            console.log("Your face at the left side of the screen.")
        } else if (horizontalPosition > 0.65) {
            console.log("Your face at the right side of the screen.")
        } else {
            console.log("Your face at the horizontal middle of the screen.")
        }

        if (topSpacing > 10 & bottomSpacing > 10) {
            console.log("Your face fits to the screen")
        } else {
            console.log("You can keep more vertical top and bottom spacing. Please stand a little bit far. Now top and bottom space percentags are: " + topSpacing + " " + bottomSpacing)
        }

    } else {
        togglCamByFollowingFacePosition("close");
        console.log("Face is not fit into the camera, please stand a little bit far or change the angle of your screen.")
    }
}

// UTILS - CAM
// let toggleMic = () => {
//     document.getElementById('microphone-button').click();
// }

let toggleCam = () => {
    document.getElementById('video-button').click();
}

let openCam = () => {
    if (document.getElementById('video-button').ariaLabel == "Kamerayı aç") {
        toggleCam();
    }
}

let closeCam = () => {
    if (document.getElementById('video-button').ariaLabel == "Kamerayı kapat") {
        toggleCam();
    }
}


let togglCamByFollowingFacePosition = (cmd) => {
    if (cmd == "open") {
        openCam();
    } else {
        closeCam();
    }
}

// ENDPOINTS
let goToAzureCV = (blob) => {

    return new Promise((res, rej) => {
        var azureCVheaders = new Headers();
        azureCVheaders.append("Ocp-Apim-Subscription-Key", "9d74b55fa07b4a778a574e512f3c6af4");
        azureCVheaders.append("Content-Type", "application/octet-stream");

        var requestOptions = {
            method: 'POST',
            headers: azureCVheaders,
            body: blob,
            redirect: 'follow'
        };

        fetch("https://westeurope.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Faces", requestOptions)
            .then(response => response.text())
            .then(result => res(result))
            .catch(error => rej(error));
    })

}
