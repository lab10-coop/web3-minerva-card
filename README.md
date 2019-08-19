# security2go

nodejs library for interacting with the Infineon Securiy2Go SmartCard for signing transactions for ethereum blockchain based systems on a nodejs server.
Since websites cannot directly interact with USB devices or NFC-Readers (web-nfc does NOT solve this issue in this case) this library works only for nodejs server instance. 

# Requirements

- A NFC Card reader that is supported by [PCSC lite](https://pcsclite.apdu.fr/)
- In order to install the package you need to have installed in the system the pcsclite libraries. For example, in Debian/Ubuntu: `apt-get install libpcsclite1 libpcsclite-dev`
- Access to an Ethereum compatible blockchain
- A [Security2Go NFC Card](https://github.com/Infineon/blockchain) 
- Linux OS - tested with Ubuntu 18 LTS - but most other common Linux distros should do as well
- libudev and libusb 1.0.8 or later
- [Node.js](https://nodejs.org/en/) v10 LTS (tested with v10.15.3)
- [NPM](https://www.npmjs.com/get-npm) (tested with v6.4.1)


#troubleshooting 

##Linux
There are known problems with PC/SC Smart Card Daemon (pcscd). Sometimes the cardreader stops working immediatly after plugging it in or booting up the computer. A restart of the daemon can help in this case `systemctl restart pcscd`

