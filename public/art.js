var data;
var preview = document.getElementsByClassName("preview");
var check = document.getElementsByClassName("use-img");
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
            show: check[idx - 1].checked
        }),
    }).then((response) => console.log(response));
}



window.onload = function() {

    var flexbox = document.getElementsByClassName("flexbox")[0];

    var flexStr = "";
    for (var i = 1; i <= 35; i++) {
        flexStr += `
        <div class="item">
        <div class="info">
            <h3>${i}번 그림</h3>
            <form method="post" enctype="multipart/form-data" action="/upload">
                <input type="hidden" name="order" value="${i}">
                <input type="file" name="image">
                <input type="submit" value="업로드" name="submit">
            </form>
            <p>이미지 사용 여부 : <input type="checkbox" class="use-img" onchange="show(${i})"></p>
        </div>
        <img class="preview">
    </div>
        `
    }
    flexbox.innerHTML = flexStr;

    load().then(function () {
        console.log(data);
        for (var i = 0; i < data.art.length; i++) {
            preview[data.art[i].idx-1].src = "./images/" + data.art[i].url;
            preview[data.art[i].idx-1].style.visibility = "visible";
            check[data.art[i].idx-1].checked = data.art[i].show
        }
    
    })
}