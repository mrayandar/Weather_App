document.getElementById('getWeather').addEventListener('click', function () {
  const city = document.getElementById('city-input').value.trim(); 
  fetchWeatherData(city); 
});

document.getElementById('useLocation').addEventListener('click', function () {
  getLocation(); 
});

document.querySelectorAll('input[name="unit"]').forEach(input => {
  input.addEventListener('change', function () {
    const city = document.getElementById('city-input').value.trim(); 
    if (city) {
      fetchWeatherData(city); 
    }
  });
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoordinates(latitude, longitude);
      },
      error => {
        console.error('Error getting location:', error.message);
        alert('Unable to retrieve your location. Please enter a city manually.');
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function fetchWeatherData(city) {
  const apiKey = '7cd58373aa284ca3905825d6a3cf0039'; 

  if (!city) {
    alert('Please enter a city!');
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('weather-details').innerHTML = `<p>Error: Unable to fetch data!</p>`;
      document.getElementById('weather-details').style.display = 'block'; 
    });
}

function fetchWeatherDataByCoordinates(lat, lon) {
  const apiKey = '7cd58373aa284ca3905825d6a3cf0039'; 

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Location not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('weather-details').innerHTML = `<p>Error: Unable to fetch data!</p>`;
      document.getElementById('weather-details').style.display = 'block'; 
    });
}

function setBackground(icon, widget) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; 
  widget.style.backgroundImage = `url('${iconUrl}')`; 
  widget.style.backgroundSize = 'contain'; 
  widget.style.backgroundRepeat = 'no-repeat'; 
  widget.style.backgroundPosition = 'center'; 
}

function displayWeatherData(data) {
  const weatherDetails = document.getElementById('weather-details');
  const weatherWidget = document.getElementById('weather-widget');
  const isCelsius = document.getElementById('unit-celsius').checked;

  const currentTemperature = isCelsius ? data.list[0].main.temp : convertToFahrenheit(data.list[0].main.temp);
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;
  const cityName = data.city.name;
  const weatherDescription = data.list[0].weather[0].description;
  const weatherIcon = data.list[0].weather[0].icon; 
  setBackground(weatherIcon, weatherDetails);

  weatherDetails.innerHTML = `
    <p>City: ${cityName}</p>
    <p>Temperature: ${currentTemperature.toFixed(1)}°${isCelsius ? 'C' : 'F'}</p>
    <p>Weather: ${weatherDescription}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  weatherDetails.style.display = 'block';
  const temperatures = [];
  const humidities = [];
  const dates = [];
  const weatherConditions = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000); 
    const day = date.toLocaleDateString(); 
    if (!dates.includes(day)) {
      dates.push(day);
      temperatures.push(isCelsius ? item.main.temp : convertToFahrenheit(item.main.temp));
      humidities.push(item.main.humidity);

      const condition = item.weather[0].main;
      if (weatherConditions[condition]) {
        weatherConditions[condition]++;
      } else {
        weatherConditions[condition] = 1;
      }
    }
  });

  const doughnutData = Object.values(weatherConditions);
  const doughnutLabels = Object.keys(weatherConditions);

  updateCharts(temperatures.slice(0, 5), humidities.slice(0, 5), dates.slice(0, 5), doughnutData, doughnutLabels, isCelsius);
}

function convertToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

let barChart, doughnutChart, lineChart;

function updateCharts(temperatures, humidities, dates, doughnutData, doughnutLabels, isCelsius) {
  if (barChart) barChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  if (lineChart) lineChart.destroy();

  const ctxBar = document.getElementById('barChart').getContext('2d');
  barChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: dates, 
      datasets: [{
        label: 'Temperature (' + (isCelsius ? '°C' : '°F') + ')',
        data: temperatures,
        backgroundColor: '#ffeb3b',
        borderColor: '#000',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      animation: {
        onComplete: function() {
          this.ctx.font = 'bold 12px Arial'; 
          this.ctx.fillStyle = '#000';
          this.data.datasets[0].data.forEach((value, index) => {
            const x = this.scales.x.getPixelForValue(index);
            const y = this.scales.y.getPixelForValue(value);
            this.ctx.fillText(value.toFixed(1), x, y - 5); 
          });
        }
      }
    }
  });

  const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
  doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: doughnutLabels,
      datasets: [{
        label: 'Weather Conditions',
        data: doughnutData,
        backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#007bff', '#6f42c1'], 
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      }
    }
  });

  const ctxLine = document.getElementById('lineChart').getContext('2d');
  lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Temperature (' + (isCelsius ? '°C' : '°F') + ')',
        data: temperatures,
        borderColor: '#ffeb3b',
        backgroundColor: 'rgba(255, 235, 59, 0.2)',
        borderWidth: 2,
        fill: true,
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      animation: {
        onComplete: function() {
          this.ctx.font = 'bold 12px Arial';
          this.ctx.fillStyle = '#000'; 
          this.data.datasets[0].data.forEach((value, index) => {
            const x = this.scales.x.getPixelForValue(index);
            const y = this.scales.y.getPixelForValue(value);
            this.ctx.fillText(value.toFixed(1), x, y - 5); 
          });
        }
      }
    }
  });
}
