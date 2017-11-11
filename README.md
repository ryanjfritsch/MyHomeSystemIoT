# MyHomeSystemIoT

MyHomeSystem.online is my personal IoT website. I am hosting this website via a node.js server in my home. With this website, I can monitor the temperature inside and outside my home, as well as turn on/off my WeMo wifi power outlet switch.

#### Devices running on MyHomeSystem:
- server running node.js
- Raspberry Pi running weather data scripts
- Arduino UNO connected to Pi, gathering temperature data from thermometer
- WeMo wifi power outlet switch

#### Languages used:
- Javascript for node.js and web pages
- HTML/CSS for web pages
- SQL used when making queries to AWS database
- Python for weather scripts that send updated weather information to server
- C++ on Arduino for gathering inside temperature data

#### Current Features:
- Turn on/off wifi switch
  - Wifi switch status indicated with illuminated power button
- View local weather data
- View indoor weather data

#### Future Features to be Implemented:
- Custom location weather data by zip code using OpenWeatherMap.org API
- Log temperatures over time and generate graph
  - Show graph in drop down menu in table
- Cleaner UI; more features means more buttons/options

