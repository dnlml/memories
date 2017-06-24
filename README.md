# MEMORIES
_A simple node app to create a realtime mosaic of photos uploaded_

## REQUIREMENTS
- Node.js(v4.2.4) and Npm

## HOW TO
-  Open the terminal and run `npm i` to install the required packages.
-  Then run `sudo npm run memories` to start the app.
-  Go to `localhost:80` to see the upload interface and got to `localhost:80/gallery` to show the mosaic.
-  [*Only for dev purpose*] Run `npm run cleanAll` to empty the `/uploads` and `/thumbs` folders.

## TODO
- check multiple upload from differente devices

## Instructions for clients (smartphones)
- Connect smartphone to WiFi with SSID : MEMORIES
- Go with browser to http://pics.com

## Router WiFi todo
- Disable WiFi password
- Rename SSID
- DHCP Map 48:ee:0c:22:dc:b2  ---> 192.168.1.125   (raspi)
- DHCP Map e4:ce:8f:20:86:68  ---> 192.168.1.126  (dan's mpb)


## Raspberry Pi todo

### Install and configure DNS Server
- `sudo apt-get install -y dnsmasq`
- `sudo service dnsmasq stop`
- edit `/etc/dnsmasq.conf` adding rule : `address=/#/192.168.1.126`
- `service dnsmasq start`

## Hardware to bring at wedding day
- Schermo Nico con Cavo alimentazione e minidisplayport
- Raspberry pi con cavo alimentazione e dongle wifi
- Tastiera Rpi
- Mouse usb per rpi
- Router Wifi moviestar casa nico  con alimentatore
- Prolunga elettrica
- Ciabatta minimo 4 slots
- Cavo ethernet
- Cavo HDMI
