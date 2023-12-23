var country = localStorage.getItem('country');
var oldCountry = localStorage.getItem('oldCountry');
var milliseconds;
var seconds;
const area = document.getElementById("location");
const statusArea = document.getElementById("status");
const temp_c = document.getElementById("temp_c");
const temp_f = document.getElementById("temp_f");
const img = document.getElementById("img");
const time = document.getElementById("time");
const input = document.querySelector("input");
input.value = country || localStorage.getItem('oldCountry') || "Mostaganem";


if(country)
    render();
else{
    localStorage.setItem('country',oldCountry|| "Mostaganem");
    render();
}


function render() {
    country = localStorage.getItem('country') || localStorage.getItem('oldCountry') || "Mostaganem";
    location.innerHTML = country;
    fetch(`https://api.weatherapi.com/v1/current.json?key=${KeyBridge.apikey()}&q=${country}&aqi=no`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res => {
        if(res.status === 200)
            return res.json();
        else
            throw new Error("Weather API request failed")
    }).then(data => {
        localStorage.setItem('country',data.location.name);
        localStorage.setItem('oldCountry',data.location.name);
        country = localStorage.getItem('country');
        area.innerHTML = country;
        milliseconds = Date.parse(data.location.localtime);
        seconds = parseInt(milliseconds / 1000);
        changeTime();
        img.src = "https:"+data.current.condition.icon;
        statusArea.innerHTML = data.current.condition.text;
        temp_c.innerHTML = data.current.temp_c;
        temp_f.innerHTML = data.current.temp_f;
    }).catch(error => {
        console.error('Error fetching weather data:', error);
        localStorage.setItem('country',localStorage.getItem('oldCountry'));
    })
            
}

function inputRefresh() {
    localStorage.setItem('country',input.value);
    render();
}

var changeTime = () => {
    seconds++;
    var minutes = parseInt(seconds /  60 % 60);
    var hours =  parseInt(seconds / ( 60 * 60) % 24) + 1;

    if(hours <= 4 || hours >= 17)
        document.querySelector('html').setAttribute('dark-mode','')
    else
        document.querySelector('html').removeAttribute('dark-mode')


    hours = hours === 24 ? 0 : hours
    hours = hours >= 10 ? hours : "0" + hours
    minutes = minutes >= 10 ? minutes : "0" + minutes
    
    time.innerHTML = `${hours}:${minutes}`

}

input.onkeydown = (e) => {
    if(e.key == "Enter")
        inputRefresh()
}

input.addEventListener('focusout',inputRefresh)

setInterval(render,1000 * 60);
setInterval(changeTime,1000)


