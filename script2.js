const apiKey = '7cd58373aa284ca3905825d6a3cf0039'; 
const geminiApiKey = 'AIzaSyADrSY6U1vx8vxOmr38T4UoqQ3I5QHIagQ'; 

let weatherData = [];
let currentPage = 1;
const itemsPerPage = 10;

document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city-input').value.trim(); 
    if (city) {
        fetchWeatherData(city); 
    } else {
        alert('Please enter a city!'); 
    }
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found. Status: ${response.status}`); 
            }
            return response.json();
        })
        .then(data => {
            weatherData = data.list.map(item => ({
                date: new Date(item.dt * 1000).toLocaleDateString(),
                temperature: item.main.temp,
                humidity: item.main.humidity,
                weather: item.weather[0].description
            }));
            currentPage = 1; 
            displayWeatherData(); 
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weather-details').innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

function displayWeatherData(data = weatherData) {
    const tableBody = document.querySelector('#forecast-table tbody');
    tableBody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    for (let i = startIndex; i < endIndex; i++) {
        const row = `
            <tr>
                <td>${data[i].date}</td>
                <td>${data[i].temperature} °C</td>
                <td>${data[i].humidity} %</td>
                <td>
                    <img src="${getWeatherIcon(data[i].weather)}" alt="${data[i].weather} icon" />
                    ${data[i].weather}
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row); 
    }

    updatePagination(data); 
}

function updatePagination(data) {
    const pageInfo = document.getElementById('page-info');
    pageInfo.innerText = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage * itemsPerPage >= data.length;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayWeatherData();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * itemsPerPage < weatherData.length) {
        currentPage++;
        displayWeatherData();
    }
});

document.getElementById('sort-asc').addEventListener('click', () => {
    const sortedData = [...weatherData].sort((a, b) => a.temperature - b.temperature);
    displayWeatherData(sortedData);
});

document.getElementById('sort-desc').addEventListener('click', () => {
    const sortedData = [...weatherData].sort((a, b) => b.temperature - a.temperature);
    displayWeatherData(sortedData);
});

document.getElementById('filter-rain').addEventListener('click', () => {
    const filteredData = weatherData.filter(item => item.weather.toLowerCase().includes('rain'));
    displayWeatherData(filteredData);
});

document.getElementById('max-temp').addEventListener('click', () => {
    const highestTempData = weatherData.reduce((max, item) => (item.temperature > max.temperature ? item : max), weatherData[0]);
    displayWeatherData([highestTempData]); 
});

function getWeatherIcon(weatherDescription) {
    const iconMapping = {
        'clear sky': 'https://openweathermap.org/img/wn/01d.png',
        'few clouds': 'https://openweathermap.org/img/wn/02d.png',
        'scattered clouds': 'https://openweathermap.org/img/wn/03d.png',
        'broken clouds': 'https://openweathermap.org/img/wn/04d.png',
        'shower rain': 'https://openweathermap.org/img/wn/09d.png',
        'rain': 'https://openweathermap.org/img/wn/10d.png',
        'thunderstorm': 'https://openweathermap.org/img/wn/11d.png',
        'snow': 'https://openweathermap.org/img/wn/13d.png',
        'mist': 'https://openweathermap.org/img/wn/50d.png'
    };
    return iconMapping[weatherDescription.toLowerCase()] || 'https://openweathermap.org/img/wn/01d.png';
}

const GEMINI_API_KEY = 'AIzaSyADrSY6U1vx8vxOmr38T4UoqQ3I5QHIagQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const userInput = document.getElementById('user-input');
const askButton = document.getElementById('ask-button');
const chatbotResponse = document.getElementById('chatbot-response');

function getTableContext() {
    if (!weatherData.length) return 'No weather data available yet.';
    
    const tableDataSummary = weatherData.map(day => {
        return `- Date: ${day.date}, Temperature: ${day.temperature}°C, Weather: ${day.weather}, Humidity: ${day.humidity}%`;
    }).join('\n');

    const temperatures = weatherData.map(day => day.temperature);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    return `Available weather forecast data:\n${tableDataSummary}\n
Summary Statistics:
- Highest temperature: ${maxTemp.toFixed(1)}°C
- Lowest temperature: ${minTemp.toFixed(1)}°C
- Average temperature: ${avgTemp.toFixed(1)}°C
- Forecast available for ${weatherData.length} time periods`;
}

function findWeatherForDate(dateQuery) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return weatherData.find(day => {
        const dayDate = new Date(day.date);
        if (dateQuery === 'tomorrow') {
            return dayDate.toDateString() === tomorrow.toDateString();
        }
        return dayDate.toLocaleDateString() === dateQuery;
    });
}

async function generateResponse(userMessage) {
    const tableContext = getTableContext();
    
    const functions = {
        getTomorrowWeather: () => {
            const tomorrowData = findWeatherForDate('tomorrow');
            return tomorrowData ? 
                `Tomorrow's forecast: Temperature: ${tomorrowData.temperature}°C, Weather: ${tomorrowData.weather}, Humidity: ${tomorrowData.humidity}%` :
                'Tomorrow\'s forecast is not available yet.';
        },
        
        getSpecificDateWeather: (dateStr) => {
            const dateData = findWeatherForDate(dateStr);
            return dateData ?
                `Forecast for ${dateStr}: Temperature: ${dateData.temperature}°C, Weather: ${dateData.weather}, Humidity: ${dateData.humidity}%` :
                `No forecast data available for ${dateStr}`;
        }
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('tomorrow')) {
        return functions.getTomorrowWeather();
    }
    
    const dateMatch = userMessage.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}\/\d{2}/);
    if (dateMatch) {
        return functions.getSpecificDateWeather(dateMatch[0]);
    }

    const prompt = {
        contents: [{
            parts: [{
                text: `You are a helpful weather assistant with access to the following weather forecast data:

${tableContext}

User question: ${userMessage}

Please provide a specific, accurate response based on the available forecast data. If the user asks about a specific date or time period, look up that information in the forecast data provided. If the information isn't available in the data, please say so clearly.`
            }]
        }]
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prompt)
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
}

async function handleUserInteraction() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('User: ' + message, 'user-message');
    userInput.value = '';

    appendMessage('Thinking...', 'loading-message');

    const response = await generateResponse(message);
    
    chatbotResponse.removeChild(chatbotResponse.lastChild);
    appendMessage('Assistant: ' + response, 'assistant-message');
}

function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.textContent = message;
    chatbotResponse.appendChild(messageElement);
    chatbotResponse.scrollTop = chatbotResponse.scrollHeight;
}

askButton.addEventListener('click', handleUserInteraction);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInteraction();
    }
});

const styles = `
.user-message {
    background-color: #e3f2fd;
    padding: 8px;
    margin: 4px;
    border-radius: 8px;
}

.assistant-message {
    background-color: #f5f5f5;
    padding: 8px;
    margin: 4px;
    border-radius: 8px;
}

.loading-message {
    color: #666;
    font-style: italic;
    padding: 8px;
    margin: 4px;
}

#chatbot-response {
    max-height: 300px;
    overflow-y: auto;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);