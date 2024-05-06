// Fetching The Data
const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorImage = document.querySelector(".api-error-container");


// Variables
let currentTab = userTab;
const API_KEY = "98d7c40d687147cb7ebc781110663fdd";
currentTab.classList.add("current-tab");
// Just To Check Whether The Coordinates Are Present In Machine Already
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){

        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if (!searchForm.classList.contains("active")) {
            // When Searh Form Container Is Invisible We Have To Make It Visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // When Search Tab Is Visible (We Make Search Tab Invisible) And We Have To Make Your Weather Tab Visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // To Display Weather, Below Function Is The Function Which Will Return Device Coordinates IF They Are Stored In Local Storage
            getfromSessionStorage();
        }

    }
}


userTab.addEventListener("click",() => {
    // Passing Clicked Tab As Input Parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
});

function getfromSessionStorage(){
    // Checks Whether The Coordinates Are Stored In Local Storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // If Local Coordinates Are Not Found Then Show Grant Access Screen
        grantAccessContainer.classList.add("active");
    }
    else{
        // IF Local Coordinates Are Found Then Show The Weather
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // Make Grant Access Container Invisible
    grantAccessContainer.classList.remove("active");
    // Make Loader Visible
    loadingScreen.classList.add("active");
    // Error Part Handling
    errorImage.classList.remove("active");
    // API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        // Converting Response from api call Into JSon Format 
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // RenderinG The Data Into  UI
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    // First We Have To Fetch The Data That Is Required
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values and update it into us dynamically ("?."" is an optional chaining operator used To access nested json objects)
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} M/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}

// Getting Current Position

function getlocation(){
    // Using The GeoLocation API
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Not GeoLocation Support Available");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getlocation);


// Handling Search Input
const searchInput = document.querySelector("[data-searchInput]");
// After Submitting Following Function is Gonna Run
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    // Check For City Name Entered Or Not
    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city) {
    errorImage.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        // Checking The Response IF Its Not Found Then Error Has Occured And We Diplay An Error Message On The Screen 
        if(response.status == 404) {
            console.log(error);
        }
        else{
            // If EveryThing Is Fine Then We Have To Render The Data Into The UI 
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
            errorImage.classList.remove("active");
        }
    }
    catch(error) {
        console.log("Error occured: " + error);
        errorImage.classList.add("active");
        loadingScreen.classList.remove("active");
    }
}


// Data.sys
// It tests if the Sys property of the object in the data variable evaluates as a false value.
// This is usually shorthand for "Has something already defined data.Sys?"