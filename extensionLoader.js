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

<button class="hola-accordion">Meeting Audience</button>
<div class="hola-panel hola-active  ">
<br><br>
<p>In this meeting, there are 2 visually impaired person, including 1 total blind and 1 low vision. Your accessible e-teaching recommendations will be based on these 2 attendees.</p>
<br><br>

<p>TODO: WHO's camera is on!</p>

<br><br>
</div>

<button class="hola-accordion">Accessibility Helper - Check Your Scene</button>
<div class="hola-panel">
<br><br>
<center>
<button id="holaButton1" class="hola-black">Enable Scene Check</button>
<br><br>
<button id="holaButton2" class="hola-black">Check</button>
</center>
<br><br>

<video id="webcamHola1" autoplay="true" width="280px"></video>
<canvas id="canvasHola1" width="280" height="150" style="margin-top:-150px"></canvas>
</div>

<button class="hola-accordion">Accessibility Helper - Descriptions for Screen Sharing</button>
<div class="hola-panel">
<br><br>
<p>This helper help you to periodically get descriptions from screensharing.</p>
<br><br>
<center>
<button id="holaSSDescriptionButton" class="hola-black">Enable/Disable Screen Sharing Descriptions</button>
<br><br>
<input type="number" name="videoStreamID" id="videoStreamID" value="0" class="hola-black">
<button id="holaSSDescriptionManual" class="hola-black">Manually Check</button>
</center>
<br><br>

<video width="500" height="400" controls><source src="https://photo-sphere-viewer-data.netlify.app/assets/equirectangular-video/Ayutthaya_HD.mp4" type="video/mp4"></video>

<canvas id="canvasHola2" width="280" height="150"></canvas>
</div>




<button class="hola-accordion">In-Meeting Accessibility Suggestions</button>
<div class="hola-panel">
<p id="holaMeetingInsightsLog"></p>
</div>


<button class="hola-accordion">Section 3</button>
<div class="hola-panel">
  <p>Lorem ipsum...</p>
</div>


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
// infoBox.style.display = "none";
document.body.appendChild(infoBox);
infoBox.innerHTML = '<center><p style="color:white; margin: 0px" id="holaInfoBoxText">InfoBox Sample Text</p></center>';


// UI Functions

var acc = document.getElementsByClassName("hola-accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("hola-active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

var timeoutForHidingMessage;

let displayMeetingRecommendation = (message, bool) => {
    let box = document.getElementById("HolaInfoBox");
    let messageEl = document.getElementById("holaInfoBoxText");
    clearTimeout(timeoutForHidingMessage);
    box.style.display = "block";
    messageEl.innerText = message;
    // timeoutForHidingMessage = setTimeout(() => {
    //     box.style.display = "none";
    // }, 2000);

    if (bool) {
        document.getElementById("holaMeetingInsightsLog").innerText += "\n" + message;
    }
}


// STARTING THE GAME


displayMeetingRecommendation("LOAD started", false);


// INIT WEBCAMs
var videoHalo = document.getElementById("webcamHola1");
var canvasHalo = document.getElementById("canvasHola1");
var contextHalo = canvasHalo.getContext("2d");
let heightHalo = 150;
let widthHalo = 280
canvasHalo.width = widthHalo;
canvasHalo.height = heightHalo;

videoHalo.addEventListener('loadedmetadata', () => {
    rate = videoHalo.videoWidth / 280;
    newHight = videoHalo.videoHeight / rate;
    canvasHalo.height = newHight;
    heightHalo = newHight;
});


// WEBCAM LISTENERS
document.getElementById("holaButton1").addEventListener("click", () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                video: true
            })
            .then(function (stream) {
                videoHalo.srcObject = stream;
            })
            .catch(function (error) {
                console.log("Something went wrong!");
            });
    }
});



document.getElementById("holaButton2").addEventListener("click", () => {
    console.log("button click");
    contextHalo.drawImage(videoHalo, 0, 0, widthHalo, heightHalo);

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
    // console.log(canvasHalo.toDataURL());
});

var TakePeriodicalSS;

document.getElementById("holaSSDescriptionButton").addEventListener("click", () => {

    clearInterval(TakePeriodicalSS);

    let video_strem_no = document.getElementById("videoStreamID").value;
    let video_ss = document.getElementsByTagName("video")[video_strem_no];

    let canvas_ss = document.getElementById("canvasHola2");
    let heightHaloSC = video_ss.videoHeight;
    let widthHaloSC = video_ss.videoWidth;
    canvas_ss.width = widthHaloSC;
    canvas_ss.height = heightHaloSC;
    var context_ss = canvas_sc.getContext("2d");

    TakePeriodicalSS = setInterval(() => {
        context_ss.drawImage(canvas_ss, 0, 0, widthHaloSC, heightHaloSC);
        // console.log(canvas_sc.toDataURL());

        canvas_ss.toBlob((blob) => {
            console.log(blob);
            blobToStream(blob)
                .then(readerResult => azureDetectAndOCRservice(readerResult))
                .then(responses => description(responses))
        });


    }, 5000);
})



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

    console.log(response);

    if (response.faces.length > 0) {
        let windowHeight = response.metadata.height;
        let windowWidth = response.metadata.width;
        let sizes = response.faces[0].faceRectangle;
        let topSpacing = Math.floor((sizes.top / windowHeight) * 100);
        let bottomSpacing = Math.floor((windowHeight - sizes.top - sizes.height) / windowHeight * 100);
        let horizontalPosition = Math.floor((sizes.left + sizes.width / 2) / windowWidth);

        console.log(topSpacing, bottomSpacing, horizontalPosition);

        if (horizontalPosition < 0.35) {
            message = "Your face at the left side of the screen.";
            console.log(message);
            displayMeetingRecommendation(message, true);


        } else if (horizontalPosition > 0.65) {
            message = "Your face at the right side of the screen.";
            console.log(message);
            displayMeetingRecommendation(message, true);
        } else {
            message = "Your face at the horizontal middle of the screen.";
            console.log(message);
            displayMeetingRecommendation(message, true);
        }
        if (topSpacing > 10 & bottomSpacing > 10) {
            message = "Your face fits to the screen";
            console.log(message);
            displayMeetingRecommendation(message, true);
            togglCamByFollowingFacePosition("open");
        } else {
            message = "You can keep more vertical top and bottom spacing. Please stand a little bit far. Now top and bottom space percentags are: " + topSpacing + " " + bottomSpacing;
            console.log(message);
            displayMeetingRecommendation(message, true);
        }
    } else {
        togglCamByFollowingFacePosition("close");
        message = "Face is not fit into the camera, please stand a little bit far or change the angle of your screen.";
        console.log(message);
        displayMeetingRecommendation(message, true);
    }
}

let description = (responses) => {

    let ocr = responses[0];
    let detection = responses[1];


    // OCR Processing
    let allText = "There is no text available in the screen.";

    regions = ocr.regions;
    if (regions.length > 0) {
        allText = "";
        regions.forEach(region => {
            let lines = region.lines;
            lines.forEach(line => {
                let words = line.words;
                words.forEach(word => {
                    let text = word.text;
                    allText += text + " ";
                });
            });
        });
        allText = "Some texts are available in the screen." + allText;
    }

    console.log(allText);

    // Images Processing

    images = detection.objects;
    images_count = images.length;

    var imagesDescriptionText = "There are " + images_count + " images available.";

    if (images_count > 0) {
        images.forEach(image => {
            let name = image.object;
            let rectangle = image.rectangle;
            let centerOfImage = [
                rectangle.x + rectangle.w / 2,
                rectangle.y + rectangle.h / 2
            ]

            let horizontalMid = detection.metadata.width / 2;
            let h_threshold = detection.metadata.width * 0.15;
            let verticalMid = detection.metadata.height / 2;
            let v_threshold = detection.metadata.height * 0.15;
            var horizontalPosition = "";
            var verticalPosition = "";

            if (centerOfImage[0] < horizontalMid - h_threshold) {
                horizontalPosition = "left";
            } else if (centerOfImage[0] > horizontalMid + h_threshold) {
                horizontalPosition = "right";
            } else {
                horizontalPosition = "middle";
            }

            if (centerOfImage[1] < verticalMid - v_threshold) {
                verticalPosition = "top";
            } else if (centerOfImage[1] > verticalMid + v_threshold) {
                verticalPosition = "bottom";
            } else {
                verticalPosition = "middle";
            }

            imagesDescriptionText += " One " + name + " at the " + verticalPosition + "-" + horizontalPosition + " of the screen.";

        });
        console.log(imagesDescriptionText);
        let summary = allText + "\n" + imagesDescriptionText;
        
        console.log(summary);
        displayMeetingRecommendation(summary, true);
    }
}

//description([obj1, obj2])



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

const azurekey = "9d74b55fa07b4a778a574e512f3c6af4";
const azureCVheaders = new Headers();
azureCVheaders.append("Ocp-Apim-Subscription-Key", azurekey);
azureCVheaders.append("Content-Type", "application/octet-stream");

var requestOptions = {
    method: 'POST',
    headers: azureCVheaders,
    redirect: 'follow'
};


let goToAzureCV = (blob) => {

    return new Promise((res, rej) => {

        requestOptions.body = blob;
        fetch("https://westeurope.api.cognitive.microsoft.com/vision/v3.2/analyze?visualFeatures=Faces", requestOptions)
            .then(response => response.json())
            .then(result => res(result))
            .catch(error => rej(error));
    })

}


let azureDetectAndOCRservice = (blob) => {

    let ocrPromise = new Promise((res, rej) => {
        requestOptions.body = blob;
        fetch("https://westeurope.api.cognitive.microsoft.com/vision/v3.2/ocr", requestOptions)
            .then(response => response.json())
            .then(result => res(result))
            .catch(error => rej(error));
    });

    let detectPromise = new Promise((res, rej) => {
        requestOptions.body = blob;
        fetch("https://westeurope.api.cognitive.microsoft.com/vision/v3.2/detect", requestOptions)
            .then(response => response.json())
            .then(result => res(result))
            .catch(error => rej(error));
    });

    return new Promise.all([ocrPromise, detectPromise]);
}