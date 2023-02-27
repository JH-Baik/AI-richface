/*!
 * richface ver2.0.0
 * Copyright (c) 2023 Baik
 * All rights reserved
 * ##############
 *   app.js
 * ##############
 */

const URL = "https://teachablemachine.withgoogle.com/models/bzwOCY62c/";

let model, labelContainer, maxPredictions;

const company_Name = {
    A: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'],
    B: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'],
    C: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
    D: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11'],
    E: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'],
    F: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
    G: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9'],
    H: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']
};

const ai_Comments = {
    A: 'comments-a',
    B: 'comments-b',
    C: 'comments-c',
    D: 'comments-d',
    E: 'comments-e',
    F: 'comments-f',
    G: 'comments-g',
    H: 'comments-h'
};

const bar_char = {
    A: 'model-a',
    B: 'model-b',
    C: 'model-c',
    D: 'model-d',
    E: 'model-e',
    F: 'model-f',
    G: 'model-g',
    H: 'model-h'
}

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

// run the webcam image through the image model
async function predict() {
    let words = [];

    const RICH_VOLUME = { A: 109629, B: 25043, C: 10423, D: 6073, E: 1197, F: 476, G: 145, H: 3.2 };
    // predict can take in an image, video or canvas html element
    let image = document.getElementById("face-image")
    const prediction = await model.predict(image, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    let sum = 0;
    for (let i = 0; i < 1; i++) {
        sum += prediction[i].probability * RICH_VOLUME[prediction[i].className];
    }

    let weight = [[15, 14, 13], [12, 12, 12], [12, 11, 11], [11, 10, 10], [10, 10, 10], [9, 9, 9]];
    words = selectCompany();
    const ai_Comment = ai_Comments[prediction[0].className];

    //select Company
    function selectCompany() {
        let endNum = sum.toString().slice(-7, -1);
        const changeArrayOrder = function (list, moveValue) {
            while (moveValue > 0 || moveValue % list.length > 0) {
                let tmp = list.pop();
                list.unshift(tmp);
                moveValue--;
            }
            return list;
        };

        names = [];
        for (let i = 0; i < 6; i++) {
            let list = changeArrayOrder(company_Name[prediction[i].className], Number(endNum[i]));
            for (let j = 0; j < 3; j++) {
                names.push({ 'text': list[j], 'weight': weight[i][j], 'link': '' });
            }
        }
        return names;
    };

    //output animation
    $({ val: 0 }).animate({ val: sum }, {
        duration: 2500,
        step: function () {
            let num = numberWithCommas(Math.floor(this.val));
            let str = `<p>당신이 이룰 수 있는 예상<br>자산은 <span class="count_num_result">${num}</span>입니다!</p>`;
            $(".count_num").html(str);
        },

        complete: function () {
            let count = 0;
            getBarItem();

            function getBarItem() {
                while (prediction[count].probability * 100 > 1) {
                    let getPredictionItem = prediction[count];
                    getProgressBar(getPredictionItem);
                    count++;
                    getBarItem();
                }
            };

            function getProgressBar(getPredictionItem) {
                let template = document.querySelector("#progress-template");
                let label = template.content.children[0];
                let bar = template.content.children[1];

                let cloneLabel = document.importNode(label, true);
                let cloneBar = document.importNode(bar, true);
                let progressWrapDiv = document.querySelector(".progress_wrap");
                let probability = parseInt(getPredictionItem.probability * 100);
                let textTransparency = Math.max(0.9 - (count * 0.16), 0.2);

                cloneLabel.textContent = bar_char[getPredictionItem.className];
                cloneLabel.style.color = `rgba(0, 0, 0, ${textTransparency})`;

                cloneBar.querySelector("#progress").style.width = `${probability}%`;
                cloneBar.querySelector("#progress").textContent = `${probability}%`;
                if (count == 0) cloneBar.querySelector("#progress").className =
                    'progress-bar progress-bar-striped progress-bar-animated'

                progressWrapDiv.appendChild(cloneLabel);
                progressWrapDiv.appendChild(cloneBar);
            }

            $('.image-title-wrap').show();
            $(".ai_comment").text(ai_Comment);
            $('.wordCloud').jQCloud(words, { autoResize: true });
        }
    });
}

function numberWithCommas(x) {
    let countCho = ""
    if (Math.floor(x / 10000)) countCho = `${(Math.floor(x / 10000))}조`;
    x = x % 10000;
    return `${countCho} ${x}억원`;
}

const input = document.querySelector('.file-upload-input')
input.addEventListener('change', async () => {
    readURL();
})

async function readURL() {
    if (input.files && input.files[0]) {
        document.getElementById("label-container").style.display = "block";
        var reader = new FileReader();
        reader.onload = async function (e) {
            document.querySelector('.image-upload-wrap').style.display = "none";
            document.querySelector('.file-upload-image').setAttribute('src', e.target.result);
            document.querySelector('.file-upload-content').style.display = "block";
            document.querySelector('.image-title-wrap').style.display = "none";
            await faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
                await faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
                await faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
            const imageUpload = document.getElementById('face-image');
            const faces = await faceapi.detectAllFaces(imageUpload)
                .withFaceLandmarks()
                .withFaceDescriptors()
            const container = document.querySelector('.detect-face')

            const canvas = faceapi.createCanvasFromMedia(imageUpload)
            container.append(canvas)
            const displaySize = { width: imageUpload.width, height: imageUpload.height }
            faceapi.matchDimensions(canvas, displaySize)

            if (faces.length < 1) {
                document.querySelector('#analysis').style.display = "none";
                document.querySelector('#nothing-face').style.display = "block";
                return
            } else if (faces.length > 1) {
                document.querySelector('#analysis').style.display = "none";
                document.querySelector('#toomuch-face').style.display = "block";
                document.querySelector('#faces-qty').textContent = faces.length;
                drawDetectionSquare(canvas, faces, displaySize)
                return
            } else {
                init().then(() => {
                    drawDetectionSquare(canvas, faces, displaySize)
                    predict();
                });
            }
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

function drawDetectionSquare(canvas, faces, displaySize) {
    const resizedDetections = faceapi.resizeResults(faces, displaySize)
    let count = 1;
    resizedDetections.forEach(detection => {
        const box = detection.detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: `F-${count}` })
        drawBox.draw(canvas)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        count++
    })
}

function removeUpload() {
    location.reload();
}

document.querySelector('#lucky-number').addEventListener('click', () => { luckyNumber() })
document.querySelector('#remove-upload').addEventListener('click', () => { removeUpload() })

function luckyNumber() {
    const lottoNumbers = getNumberData();
    let template = document.querySelector("#lotto-ball-template");
    let lottoBallDiv = template.content.children[0];
    let lottoWrapperDiv = document.querySelector(".lotto-wrapper");
    lottoWrapperDiv.innerHTML = "";
    lottoWrapperDiv.innerHTML = `<p class="mb-4" style="color:red">행운의 번호(${lottoNumbers.length}개)를 이미지에서 추출!</p>`;

    let count = 0;
    getBall();

    //recur function(chart)
    function getBall() {
        setTimeout(() => {
            if (count >= lottoNumbers.length) return;
            let cloneDiv = document.importNode(lottoBallDiv, true);
            cloneDiv.querySelector(".number").textContent = lottoNumbers[count];
            lottoWrapperDiv.appendChild(cloneDiv);
            count++;
            getBall();

        }, 700);
    }
}

function getNumberData() {
    let numberData = [];
    let canvas = document.createElement("canvas");
    let image = document.getElementById("face-image");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    let count = 0;
    for (let i = 1; i < 11; i++) {
        const x = Math.round(i * 0.1 * canvas.width);
        for (let j = 1; j < 11; j++) {
            const y = Math.round(j * 0.1 * canvas.height);
            const data = ctx.getImageData(x, y, canvas.width, canvas.height).data;
            numberData[count] = (data[0] + data[1] + data[2]) % 45 + 1;
            count++;
        }
    }

    const uniqueNumberData = numberData.filter((val, idx) => {
        return numberData.indexOf(val) === idx;
    });

    const getNumberData = uniqueNumberData.slice(-7, -1).sort(function (a, b) {
        return a - b;
    });

    return getNumberData;
}

shareSns();

function shareSns() {
    const btnShareFb = document.querySelector('#btn-sns-facebook');
    const btnShareTw = document.querySelector('#btn-sns-twitter');
    const btnShareNb = document.querySelector('#btn-sns-naverband');
    const btnShareLi = document.querySelector('#btn-sns-linkedin');
    const btnShareKs = document.querySelector('#btn-sns-kakaostory');
    const btnShareNg = document.querySelector('#btn-sns-naverblog');
    const btnShareCl = document.querySelector('#btn-sns-copylink');
    const btnShareKt = document.querySelector('#btn-sns-kakaotalk')

    const sendText = document.querySelector('#main-title').textContent;
    const HREF = 'https://richface.kr/';
    const stageW = (window.innerWidth > 500) ? 500 : window.innerWidth;
    const stageH = (window.innerHeight > 600) ? 600 : window.innerHeight;

    btnShareFb.addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${HREF}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareTw.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${sendText.replace(/[|]/gi, '-')}&url=${HREF}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareNb.addEventListener('click', () => {
        window.open(`https://band.us/plugin/share?url=${HREF}&title=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareLi.addEventListener('click', () => {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${HREF}&title=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareKs.addEventListener('click', () => {
        window.open(`https://story.kakao.com/s/share?url=${HREF}`, 'kakaostorysharedialog', `width=${stageW}, height=${stageH}`);
    });
    btnShareNg.addEventListener('click', () => {
        window.open(`https://share.naver.com/web/shareView.nhn?url=${HREF}&title=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });

    Kakao.init('********************************');
    btnShareKt.addEventListener('click', () => {
        Kakao.Share.sendScrap({
            requestUrl: HREF,
        })
    });

    btnShareCl.addEventListener('click', () => {
        navigator.clipboard.writeText(HREF)
            .then(() => {
                document.querySelector('.bi-link-45deg').style.display = 'none';
                document.querySelector('#link-copied').style.display = 'inline-block';

                setTimeout(() => {
                    document.querySelector('#link-copied').style.display = 'none';
                    document.querySelector('.bi-link-45deg').style.display = 'inline-block';
                }, 3000);
            })
            .catch(err => {
                document.querySelector('#link-copy-failed').style.display = 'block';
            })
    });
}

//Get the button
let btnBackToTop = document.getElementById('btn-back-to-top');

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};
btnBackToTop.addEventListener('click', backToTop);
function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btnBackToTop.classList.remove('disappear');
        btnBackToTop.classList.add('appear');
    } else {
        if (btnBackToTop.classList.contains('appear')) {
            btnBackToTop.classList.add('disappear');
            setTimeout(function () { btnBackToTop.classList.remove('appear') }, 500);
        }
    }
}

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// copy to clipboard
const clipboardIcons = document.querySelectorAll('.clipboard-copy')
clipboardIcons.forEach(element => {
    element.onclick = (e) => {
        let content = document.getElementById('content-' + e.target.id).textContent;
        navigator.clipboard.writeText(content)
            .then(() => {
                document.getElementById(e.target.id).style.display = 'none';
                document.getElementById(e.target.id + '-copied').style.display = 'inline-block';

                setTimeout(() => { 
                    document.getElementById(e.target.id + '-copied').style.display = 'none';
                    document.getElementById(e.target.id).style.display = 'inline-block';
                }, 3000);
            })
            .catch(err => {
                document.getElementById(e.target.id + '-failed').style.display = 'block';
            })
    }
});

