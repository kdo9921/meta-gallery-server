var data;
var preview = document.getElementsByClassName("preview");
var imgcheck = document.getElementsByClassName("use-img");
var framecheck = document.getElementsByClassName("use-frame");

async function load() {
    var response = await fetch('./data')
    data = await response.json();
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



window.onload = function() {

    var flexbox = document.getElementsByClassName("picture")[0];

    var flexStr = "";
    for (var i = 1; i <= 35; i++) {
        flexStr += `
        <div class="item">
        <div class="info">
            <h3>${i}번 그림</h3>
            <form method="post" enctype="multipart/form-data" action="/upload">
                <input type="hidden" name="order" value="${i}">
                <p><input type="file" name="image"></p>
                <p>이미지 사용 여부 : <input type="checkbox" class="use-img" onchange="show(${i})"></p>
                <p>액자 사용 여부 : <input type="checkbox" class="use-frame" onchange="frame(${i})"></p>
                <p><input type="submit" value="업로드" name="submit"></p>
            </form>
        </div>
        <img class="preview">
    </div>
        `
    }
    flexbox.innerHTML = flexStr;

    load().then(function () {
        var light_color = document.getElementById("light_color");
        var light_range = document.getElementById("light_range");
        var light_angle = document.getElementById("light_angle");

        console.log(data);
        for (var i = 0; i < data.art.length; i++) {
            preview[data.art[i].idx-1].src = "./images/" + data.art[i].url;
            preview[data.art[i].idx-1].style.visibility = "visible";
            imgcheck[data.art[i].idx-1].checked = data.art[i].show;
            framecheck[data.art[i].idx-1].checked = data.art[i].frame;
        }
        var temp = data.light[0].color;
        light_color.value = temp;
        light_range.value = data.light[0].range;
        light_angle.value = data.light[0].angle;
    
    })
}