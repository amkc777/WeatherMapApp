const API_KEY = 'Replace with your actual API key';  // Replace with your actual API key

const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

function fetchWeather(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
    const locationName = document.getElementById('locationName');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const description = document.getElementById('description');
    
    if (data.main) {
        locationName.innerText = data.name;
        temperature.innerText = `Temperature: ${data.main.temp}°C`;
        humidity.innerText = `Humidity: ${data.main.humidity}%`;
        windSpeed.innerText = `Wind Speed: ${data.wind.speed} m/s`;
        description.innerText = `Description: ${data.weather[0].description}`;
        
        // Create or update the chart
        updateWeatherChart(data.main.temp, data.main.humidity);
    } else {
        locationName.innerText = "Could not retrieve weather data.";
        temperature.innerText = '';
        humidity.innerText = '';
        windSpeed.innerText = '';
        description.innerText = '';
    }
}

// Chart.js configuration
const ctx = document.getElementById('weatherChart').getContext('2d');
let weatherChart;

function updateWeatherChart(temp, humidity) {
    const labels = ['Temperature', 'Humidity'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Weather Data',
            data: [temp, humidity],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
        }]
    };

    if (weatherChart) {
        weatherChart.data.datasets[0].data = [temp, humidity];
        weatherChart.update();
    } else {
        weatherChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    fetchWeather(lat, lng);
});
