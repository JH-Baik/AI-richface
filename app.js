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
    A: ['삼성전자', '넥슨', '셀트리온', '카카오', '스마일게이트', '삼성미술관 리움', '현대자동차'],
    B: ['호텔신라', '아모레퍼시픽', '삼성복지재단', '기아차', 'MBK 파트너스', 'SK그룹', 'LG그룹'],
    C: ['하이브', '엔씨소프트', '넷마블', 'NAVER', '호반건설', '메리츠금융', '부영그룹', '신세계그룹'],
    D: ['LX그룹', 'DB그룹', '교보생명', '교원그룹', '희성그룹', '아산재단', '미래에셋', 'CJ그룹', 'BGF그룹', '한국투자금융', '펄어비스'],
    E: ['SDJ 코퍼레이션', '오리온', '크래프톤', '아이에스 동서', '롯데케미칼', '한화솔루션'],
    F: ['신세계', '롯데장학 재단', '(주)현대', '대상그룹', '두산중공업', '포스코', 'LG 생활건강'],
    G: ['오뚜기', '대상', '영풍', '대한항공', '애경그룹', '스튜디오드래곤', '테고사이언스', '중앙일보', '하림'],
    H: ['BBQ', '삼천리', '삼양', '동국제강', '반도홀딩스', '하이트진로', '대방건설', '고려아연']
};

const ai_Comments = {
    A: '인공지능이 분석한 당신의 부자상 이미지는 "글로벌 기업 재벌상"입니다. 어느 누구와도 어울리는 호감형 인상과 태도를 보여주며 많은 사람들로부터 관심을 받습니다. 당신은 믿었던 사람들과 함께 일을 하며 간혹 배신으로 인해 어려움을 겪지만 본인 특유의 긍정 에너지와 실행력으로 프로젝트를 성공적으로 마무리합니다.',
    B: '인공지능이 분석한 당신의 부자상 이미지는 "국내기업 재벌상"입니다. 차분하고 단정한 인상과 태도를 보여주며 많은 사람들로부터 관심을 받습니다. 당신은 여러 사람들의 의견을 잘 듣고 반영하며 일을 진행하지만 가끔 주변 의견과 다른 본인만의 단호한 결단력으로 투자 또는 프로젝트를 성공으로 이끕니다.',
    C: '인공지능이 분석한 당신의 부자상 이미지는 "국내기업 준재벌상"입니다. 당신은 유순하고 안정된 인상과 태도와는 다르게 상당히 적극적 성향을 보이며 선견지명의 안목도 갖고 있습니다. 유순한 외모로 인해 돌직구 성격이 잘 드러나지 않지만 어떤 일이 결정된 후 추진할 때는 누구보다 꿋꿋하게 그 일을 진행하여 당신의 주변 사람들이 부러워 할만한 결과물을 곧잘 만들어 냅니다.',
    D: '인공지능이 분석한 당신의 부자상 이미지는 "국내 상장기업 대표상"입니다. 당신은 주변사람들과 함께 의견을 조율하며 일을 진행하는데 익숙합니다. 독단적인 판단이나 튀는 성격의 사람들과는 다소 거리를 두고 돌다리도 두드리며 가는 안정적인 성향을 가졌습니다. 간혹 공격적인 투자를 감행하고 성공도 하지만 대체로 안전한 투자를 지향하므로 프로젝트 실패의 확률도 낮습니다.',
    E: '인공지능이 분석한 당신의 부자상 이미지는 "내실이 탄탄한 중견기업 대표상"입니다. 당신은 사막의 모래밭에서도 보석을 찾아낼 수 있는 눈과 일을 과감히 밀어 부칠 수 있는 실행력을 가졌습니다. 때때로 주변 사람들의 무시와 핀잔으로 당신이 하는 일에 대해 성공여부가 의심될 때도 있지만 결국에는 이뤄내고야 마는 성격의 소유자입니다.',
    F: '인공지능이 분석한 당신의 부자상 이미지는 "지방 대표기업 대표상"입니다. 다소 딱딱하게 보이는 외모와 강직한 성격으로 주변 사람들과 잘 어울리기엔 어려움이 있지만 오랫동안 함께한 사람들에게는 당신의 부드러운 내면을 잘 드러냅니다. 주변의 만류에도 항상 자신의 결정대로 일을 진행하며 난관에 부딪쳐도 혼자서 견뎌내고 해결하는 책임감이 강한 성격의 소유자입니다.',
    G: '인공지능이 분석한 당신의 부자상 이미지는 "기업체 임원 또는 그럭저럭 부자상"입니다. 항상 정돈된 이미지와 바른 자세를 취하는 당신이지만 가끔 내면 깊숙한 곳에서 나오는 연예인 급의 끼를 억누르고 있습니다. 일을 추진할 때는 타인의 의견을 지나치게 존중하는 성격이다 보니 말 못할 어려움도 있지만 결국엔 성공적으로 프로젝트를 마무리하는 당신은 배려심과 이해심 많은 성격의 소유자입니다.',
    H: '인공지능이 분석한 당신은 "자유로운 영혼" 입니다. 자유분방한 성향을 가진 당신은 누구를 탓하지도 나무라지도 않으며 세상을 있는 그대로 바라보고 받아들입니다. 주변 사람들로부터 부러움과 조롱을 동시에 받을 수 있지만 이마저도 전혀 개의치 않는 당신은 자유로운 영혼의 소유자입니다.'
};

const bar_char = {
    A: '글로벌 기업 재벌상', B: '국내기업 재벌상', C: '국내기업 준재벌상', D: '상장기업 대표상',
    E: '중견기업 대표상', F: '지방 대표기업 오너상', G: '그럭저럭 부자상', H: '자유로운 영혼'
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

    Kakao.init('9a668d2af9fa8727114c6891bfba0f2c');
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

