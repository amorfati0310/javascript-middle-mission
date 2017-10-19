//타입이 숫자로만 구성된 요소를 뽑아 배열로 만들기

const widget = {
    "debug": "on",
    "window": {
        "title": "Sample Konfabulator Widget",
        "name": "main_window",
        "width": 500,
        "height": 500
    },
    "image": {
        "src": "Images/Sun.png",
        "name": "sun1",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": "center"
    },
    "text": {
        "data": "Click Here",
        "size": 36,
        "style": "bold",
        "name": "text1",
        "hOffset": 250,
        "vOffset": 100,
        "alignment": "center",
        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
}

//실행결과
//["width", "height", "hOffset", "vOffset", "size", "hOffset", "vOffset"]
var result = [];
function getNumber(obj) {
    for (property in obj) {
        if (typeof (obj[property]) == 'number') result.push(property);
        else if (typeof (obj[property]) == 'object') getNumber(obj[property])
    }
}
getNumber(widget);
console.log(result);