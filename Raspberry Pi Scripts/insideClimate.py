
## Created by Ryan Fritsch

## This script reads temperature and humidity data from
## a connected Arduino UNO board. The temp and humidity
## data is parsed and sent to the server. The server
## then updates the AWS connected database.

import serial
import httplib, urllib
import requests
import time
import json

ser = serial.Serial('/dev/ttyACM0',9600)

def iftttAPI():
    try:
        r = requests.post("https://maker.ifttt.com/trigger/xxxxxxxxxxxxxxxxxxxxxxxxxxx")
    except requests.exceptions.RequestException as e:
        print e
    return;

print "Running temperature sensor."

trigger = 0

while True:

    dataIn=ser.readline();

    humidity, temperature = dataIn.split("-")

    temperature = temperature.strip("\n")
    temperature = temperature.strip("\r")

##    print ("{0}*F, {1}%".format(temperature, humidity))

    tLen = len(temperature)
    hLen = len(humidity)

    if(trigger >= 90):
        if(tLen == 2):
            if(hLen == 2):
                print "Attempting server update..."
                trigger = 0
                payload = {"id":"xxxxxxxxxxxxxxxxxxxxxx",
                           "humid":"%s" % humidity,
                           "temp":"%s" % temperature
                           }
                try:
                    r = requests.post("xxxxxxxxxxxxxxxxxxxxxx",
                                      data=json.dumps(payload),
                                      allow_redirects=False,
                                      timeout=10
                                      )
                    print "Weather server updated."
                except requests.exceptions.RequestException as x:
                    iftttAPI()

    trigger = trigger + 1

    time.sleep(10)
