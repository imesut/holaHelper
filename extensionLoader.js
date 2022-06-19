const sideBar = document.createElement("div");
sideBar.style.height = "100vh";
sideBar.style.width = "300px";
sideBar.style.right = "0px";
sideBar.style.top = "0px";
sideBar.style.position = "fixed";
sideBar.style.backgroundColor = "rgba(0,0,0,0.5)";
sideBar.style.zIndex = "1000 ";
sideBar.style.padding = "60px 10px 10px 10px";
sideBar.id = "HolaSidebar";

document.body.appendChild(sideBar);

document.getElementById("HolaSidebar").innerHTML = `

<h1 class="hola-white">HOLA Accessibility Hub</h1>
<h2>1. Meeting Insights</h2>
<p>In this meeting, there are 2 visually impaired person, including 1 total blind and 1 low vision. Your accessible e-teaching recommendations will be based on these 2 attendees.</p>

<h2>2. Check Your Scene</h2>
<button id="holaButton1">Enable Scene Check</button>
<br><br>
<button id="holaButton2">Check</button>

<video id="webcamHola1" autoplay="true" width="280px"></video>
<canvas id="canvasHola1" width="280px"></canvas>


`;

console.log("LOAD Started!");
var videoHalo = document.getElementById("webcamHola1");
var canvasHalo = document.getElementById("canvasHola1");

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

document.getElementById("holaButton1").addEventListener("click", () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                video: true
            })
            .then(function (stream) {
                videoHalo.srcObject = stream;
                let heightHalo = videoHalo.videoHeight;
                let widthHalo = videoHalo.videoHeight;
                canvasHalo.width = widthHalo;
                canvasHalo.height = heightHalo;
                var contextHalo = canvasHalo.getContext("2d");
            })
            .catch(function (error) {
                console.log("Something went wrong!");
            });
    }
});

document.getElementById("holaButton2").addEventListener("click", () => {
    console.log("button click");
    contextHalo.drawImage(videoHalo, 0, 0, 280, heightHalo);

    canvasHalo.toBlob((blob) => {
        console.log(blob);

        blobToStream(blob)
            .then(readerResult => goToAzureCV(readerResult))
            .then(result => facePosition(result))
        // const newImg = document.createElement('img');
        // const url = URL.createObjectURL(blob);
        // console.log("BLOB");
        // console.log(url);
    });
    //console.log(canvasHalo.toDataURL());
});


let togglCamByFollowingFacePosition = (cmd) => {
    if (cmd == "open") {
        openCam();
    } else {
        closeCam();
    }
}


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