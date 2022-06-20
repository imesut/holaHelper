// UI DEFINTIONS
const sideBar = document.createElement("div");
sideBar.style.height = "calc(100vh - 210px)";
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
<p>In this meeting, there are <b>2 visually impaired person</b>, including <b>1 total blind and 1 low vision</b>. Your accessible e-teaching recommendations will be based on these <b>2 attendees.</b></p>
<br><br>
<p>There are <b>3 participants</b> in the meeting, their cameras are <b>all open.</b></p>
<br><br>
</div>

<button class="hola-accordion">Accessibility Helper - Check Your Scene</button>
<div class="hola-panel">
<br><br>
<center>
<button id="holaButton1" class="hola-black">Let me Check</button>
<br><br>
<button id="holaButton2" class="hola-black">Enable/Disable Scene Check</button>
</center>
<br><br>

<video id="webcamHola1" autoplay="true" width="280px"></video>
<canvas id="canvasHola1" width="280" height="150"></canvas>
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
</center>
<br><br>
<canvas id="canvasHola2" width="800" height="500"></canvas>
</div>



<button class="hola-accordion">In-Meeting Accessibility Suggestions</button>
<div class="hola-panel">
<p id="holaMeetingInsightsLog"></p>
</div>



`;


const infoBox = document.createElement("div");
infoBox.style.width = "50vw";
infoBox.style.left = "calc(100vw - 300px - 50vw - 20px)";
infoBox.style.bottom = "110px";
infoBox.style.position = "fixed";
infoBox.style.backgroundColor = "#C4314B";
infoBox.style.zIndex = "1000";
infoBox.style.padding = "10px";
infoBox.style.display = "block";
infoBox.style.borderRadius = "10px";
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

// var toggleSidebar = true;
// document.getElementById("holaHide").addEventListener("click", () => {
//     if(toggleSidebar){
//         document.getElementById("HolaSidebar").right = "-275px";
//         toggleSidebar = true;
//     } else{
//         document.getElementById("HolaSidebar").right = "0px";
//         toggleSidebar = false;
//     }
    
// })

var timeoutForHidingMessage;

let displayMeetingRecommendation = (message, bool) => {
    let box = document.getElementById("HolaInfoBox");
    let messageEl = document.getElementById("holaInfoBoxText");
    clearTimeout(timeoutForHidingMessage);
    box.style.display = "block";
    messageEl.innerText = message;
    timeoutForHidingMessage = setTimeout(() => {
        box.style.display = "none";
    }, 10000);

    let date = new Date();
    let timeString = date.getHours()+":"+date.getMinutes();

    if (bool) {
        document.getElementById("holaMeetingInsightsLog").innerText += "\n -->>" + timeString + " " + message;
    }
}



// STARTING THE GAME

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


var SceneCheckPeriodicalInterval;
var sceneCheckActive = false;

document.getElementById("holaButton2").addEventListener("click", () => {

    if(sceneCheckActive){
        clearInterval(SceneCheckPeriodicalInterval);
        sceneCheckActive = false;
    } else {
        SceneCheckPeriodicalInterval = setInterval(() => {
            contextHalo.drawImage(videoHalo, 0, 0, widthHalo, heightHalo);
            // console.log(canvas_ss.toDataURL());
    
            canvasHalo.toBlob((blob) => {
                console.log(blob);
        
                blobToStream(blob)
                    .then(readerResult => goToAzureCV(readerResult))
                    .then(result => facePosition(result))
                // const newImg = document.createElement('img');
                // const url = URL.createObjectURL(blob);
                // console.log("BLOB");
                // console.log(url);
                // console.log(canvasHalo.toDataURL());
            });
        }, 1000);
        sceneCheckActive = true;
    }
});

var TakePeriodicalSS;
var toggleSSdescription = false;

var lastSSblobSize;

document.getElementById("holaSSDescriptionButton").addEventListener("click", () => {

    if (toggleSSdescription) {

        clearInterval(TakePeriodicalSS);
        toggleSSdescription = false;

    } else {

        let video_strem_no = document.getElementById("videoStreamID").value;
        console.log(video_strem_no);
        let video_ss = document.getElementsByTagName("video")[video_strem_no];
        console.log(video_ss);
        let canvas_ss = document.getElementById("canvasHola2");
        console.log(canvas_ss);
        var context_ss = canvas_ss.getContext("2d");
        console.log(context_ss);
        let heightHaloSS = video_ss.videoHeight;
        let widthHaloSS = video_ss.videoWidth;
        console.log(heightHaloSS, widthHaloSS);
        canvas_ss.width = widthHaloSS;
        canvas_ss.height = heightHaloSS;

        TakePeriodicalSS = setInterval(() => {
            context_ss.drawImage(video_ss, 0, 0, widthHaloSS, heightHaloSS);
            // console.log(canvas_ss.toDataURL());

            canvas_ss.toBlob((blob) => {
                if (blob.size != lastSSblobSize) {
                    console.log(blob);
                    blobToStream(blob)
                        .then(readerResult => azureDetectAndOCRservice(readerResult))
                        .then(responses => description(responses))
                }
                lastSSblobSize = blob.size;
            });

        }, 1000);

        toggleSSdescription = true;
    }

})


let warnings = [
    "WARNING: Repetitive words can be distracting for persons with cognitive disabilities.",
    "WARNING: Visually impaired people can not see the figure.",
    "WARNING: 3"
]

document.addEventListener('keydown', (event) => {
    var keyName = event.key;
    if(!isNaN(keyName) & keyName <= warnings.length){ //if is number

        displayMeetingRecommendation(warnings[keyName - 1], false);
        
        var notify = new Notification('Hola', {
            body: warnings[keyName - 1]
        });
        
    }
  }, false);



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

    var displayText = "";

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
            displayText += message;
            console.log(message);
        } else if (horizontalPosition > 0.65) {
            message = "Your face at the right side of the screen.";
            displayText += message;
            console.log(message);
        } else {
            message = "Your face at the horizontal middle of the screen.";
            displayText += message;
            console.log(message);
        }
        if (topSpacing > 10 & bottomSpacing > 10) {
            message = "Your face fits to the screen";
            displayText += message;
            console.log(message);
            togglCamByFollowingFacePosition("open");
        } else {
            message = "You can keep more vertical top and bottom spacing. Please stand a little bit far. Now top and bottom space percentags are: " + topSpacing + " " + bottomSpacing;
            displayText += message;
            console.log(message);
        }
    } else {
        togglCamByFollowingFacePosition("close");
        message = "Face is not fit into the camera, please stand a little bit far or change the angle of your screen.";
        displayText += message;
        console.log(message);
    }

    displayMeetingRecommendation(displayText, false);
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
    }
    let summary = allText + "\n" + imagesDescriptionText;

        console.log(summary);
        displayMeetingRecommendation(summary, true);
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

    return Promise.all([ocrPromise, detectPromise]);
}