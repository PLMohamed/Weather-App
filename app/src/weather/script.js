var country = localStorage.getItem('country');
var oldCountry = localStorage.getItem('oldCountry');
const area = document.getElementById("location");
const statusArea = document.getElementById("status");
const temp_c = document.getElementById("temp_c");
const temp_f = document.getElementById("temp_f");
const img = document.getElementById("img");
const time = document.getElementById("time");
const input = document.querySelector("input");
input.value = country || localStorage.getItem('oldCountry') || "Algeria";


if(country)
    render();
else{
    localStorage.setItem('country',oldCountry||"Algeria");
    render();
}


function render() {
    country = localStorage.getItem('country') || localStorage.getItem('oldCountry') || "Algeria";
    location.innerHTML = country;
    fetch(`https://api.weatherapi.com/v1/current.json?key=${config.apikey()}&q=${country}&aqi=no`,{
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
        time.innerHTML = data.location.localtime.split(" ")[1];
        img.src = "https:"+data.current.condition.icon;
        statusArea.innerHTML = data.current.condition.text;
        temp_c.innerHTML = data.current.temp_c;
        temp_f.innerHTML = data.current.temp_f;
    }).catch(error => {
        console.error('Error fetching weather data:', error);
    })
            
}

input.onkeydown = (e) => {
    if(e.key == "Enter"){
        localStorage.setItem('country',input.value);
        render();
    }
}

setInterval(render,5000);

