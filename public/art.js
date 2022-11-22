var data;
var preview = document.getElementsByClassName("preview");
var imgcheck = document.getElementsByClassName("use-img");
var framecheck = document.getElementsByClassName("use-frame");
var bgmcheck = document.getElementsByClassName("use-bgm");
var explancheck = document.getElementsByClassName("use-explan");
var infoContainer = document.getElementsByClassName("info_container");

async function load() {
    var response = await fetch('./data')
    data = await response.json();
}

function use_info(idx) {
    fetch("./use_info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idx: idx,
            explan: explancheck[idx-1].checked
        }),
    }).then((response) => console.log(response));
}
function hide_info() {
    var info_idx = document.getElementById("info_idx");
    infoContainer[0].style.display = "none";
}
function showExplan(idx) {
    var info_idx = document.getElementById("info_idx");
    infoContainer[0].style.display = "flex";
    var temp = data.art.find(v => v.idx === idx);
    document.getElementById("info_title").value = temp.title;
    document.getElementById("info_artist").value = temp.artist;
    document.getElementById("info_explan").value = temp.info;
    info_idx.value = idx;
}
function setInfo() {
    var info_idx = document.getElementById("info_idx");
    fetch("./info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idx: info_idx.value,
            title: document.getElementById("info_title").value,
            artist: document.getElementById("info_artist").value,
            info: document.getElementById("info_explan").value
        }),
    }).then((response) => console.log(response));
    infoContainer[0].style.display = "none";
}

function show(idx) {
    fetch("./show", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idx: idx,
            show: imgcheck[idx - 1].checked
        }),
    }).then((response) => console.log(response));
}

function frame(idx) {
    fetch("./frame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idx: idx,
            frame: framecheck[idx - 1].checked
        }),
    }).then((response) => console.log(response));
}

function bgm() {
    fetch("./bgmplay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idx: 0,
            play: bgmcheck[0].checked
        }),
    }).then((response) => console.log(response));
}


window.onload = function () {

    var flexbox = document.getElementsByClassName("picture")[0];

    var flexStr = "";
    for (var i = 1; i <= 35; i++) {
        flexStr += `
        <div class="item">
            <h3>${i}번 그림</h3>
            <div class="art">
                <div class="info">
                    <form method="post" enctype="multipart/form-data" action="/upload">
                        <input type="hidden" name="order" value="${i}">
                        <p><input type="file" name="image"></p>
                        <p>이미지 사용 : <input type="checkbox" class="use-img" onchange="show(${i})"></p>
                        <p>액자 사용 : <input type="checkbox" class="use-frame" onchange="frame(${i})"></p>
                        <p>설명 사용 : <input type="checkbox" class="use-explan" onchange="use_info(${i})"> <input type="button" value="설명 설정" onclick="showExplan(${i})"></p>
                        <input class="button" type="submit" value="이미지 업로드" name="submit">
                    </form>
                </div>
                <div class="preview"></div>
            </div>
        </div>
        `
    }
    flexbox.innerHTML = flexStr;

    load().then(function () {
        var light_color = document.getElementById("light_color");
        var light_range = document.getElementById("light_range");
        var light_angle = document.getElementById("light_angle");
        var bgm_current = document.getElementById("bgm_current");

        console.log(data);
        for (var i = 0; i < data.art.length; i++) {
            preview[data.art[i].idx - 1].style.backgroundImage = "url('./images/" + data.art[i].url + "')";
            preview[data.art[i].idx - 1].style.visibility = "visible";
            imgcheck[data.art[i].idx - 1].checked = data.art[i].show;
            explancheck[data.art[i].idx - 1].checked = data.art[i].explan;
            framecheck[data.art[i].idx - 1].checked = data.art[i].frame;
        }
        var temp = data.light[0].color;
        light_color.value = temp;
        light_range.value = data.light[0].range;
        light_angle.value = data.light[0].angle;
        bgm_current.innerHTML = data.bgm[0].title;
        bgmcheck[0].checked = data.bgm[0].play;
    })
}