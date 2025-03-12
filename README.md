# Weather Dashboard Application

This project is a Weather Dashboard application that provides real-time weather information and forecasts using the OpenWeather API. The application also features interactive charts, tables, and a chatbot for users to inquire about weather data.

## Project Structure

- `index.html`: The main dashboard page displaying the weather search functionality, current weather data, and charts for temperature, humidity, and weather conditions.
- `tables.html`: A separate page that displays the 5-day weather forecast in a tabular format, with options to sort and filter the data.
- `style.css`: Main stylesheet for the layout and design of the dashboard.
- `style2.css`: Additional stylesheet for the tables and chatbot functionalities.
- `script.js`: JavaScript file that handles fetching weather data, displaying weather details, and generating charts.
- `script2.js`: JavaScript file that manages the table, sorting, filtering, pagination, and chatbot interactions.

## Features

- **Weather Search**: Users can search for weather by entering a city name or using their current location.
- **Unit Toggle**: Allows switching between Celsius and Fahrenheit for temperature display.
- **Interactive Charts**: Displays temperature, humidity, and weather conditions through bar, doughnut, and line charts using Chart.js.
- **Weather Forecast Table**: Shows a 5-day weather forecast in a sortable and filterable table.
- **Pagination**: Provides pagination for viewing weather data across multiple pages.
- **Chatbot**: A chatbot powered by the Gemini API to answer weather-related queries.

## API Integration

This application integrates with the following APIs:
- **OpenWeather API**: Provides real-time and forecast weather data. You need to replace the `apiKey` in `script.js` and `script2.js` with your own API key.
- **Gemini API**: Used in the chatbot to generate responses for user queries related to weather data.

## Setup and Usage

1. Clone this repository to your local machine.
2. Open `index.html` to access the weather dashboard.
3. Open `tables.html` to view the weather forecast table.
4. Replace the placeholder `apiKey` in `script.js` and `script2.js` with your OpenWeather API key.
5. Replace the `geminiApiKey` in `script2.js` with your Gemini API key for chatbot functionality.

### Dependencies

- **Chart.js**: Used for generating interactive weather charts.
- **OpenWeather API**: Provides weather data.
- **Gemini API**: Used for chatbot functionality.

## How to Run

1. Open `index.html` in a browser to view the main dashboard.
2. Use the input field to search for weather data by city.
3. Navigate to `tables.html` to view weather forecasts in a table format.

## ignor this comment
