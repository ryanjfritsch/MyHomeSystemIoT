

## Created by Ryan Fritsch

## This script uses OpenWeatherMap.com's weather
## API to get current outdoor weather data for
## my town. Temperature and humidity are the two
## data values gathered from the API call. After
## parsing the response from OpenWeatherMap, the
## data is sent to the server for a database update.


import serial
import httplib, urllib
import requests
import time
import json

print "Running outside weather API."


def iftttAPI():
    try:
        r = requests.post("https://maker.ifttt.com/trigger/xxxxxxxxxxxxxxxxxxxxxx")
    except requests.exceptions.RequestException as x:
        print x
    return;


t2 = 0

while True:


    if(t2 >= 100):

        t2 = 0;

        print "Getting outside weather..."

        try:
            w = requests.get("https://api.openweathermap.org/data/2.5/weather?zip=xxxxx,us&APPID=xxxxxxxxxxxxxxxxxxxx")
            json_data = w.json()

            outTemp = json_data["main"]["temp"]
            outTemp = (outTemp*1.8) - 459.67
            outTemp = str(outTemp)
            outTemp, burn = outTemp.split(".")

            outHumid = json_data["main"]["humidity"]
            outHumid = str(outHumid)

            lenOutt = len(outTemp)
            lenOuth = len(outHumid)

            if(lenOutt > 0):
                if(lenOuth > 0):
                    payload = {"id":"outsideweather",
                                   "humid":"%s" % outHumid,
                                   "temp":"%s" % outTemp
                                   }

                    r = requests.post("xxxxxxxxxxxxxxx",
                                        data=json.dumps(payload),
                                        allow_redirects=False,
                                        timeout=10
                                    )

                print "Outside weather updated."

        except requests.exceptions.RequestException as e:
            iftttAPI()



    t2 = t2 + 1

    time.sleep(10)
