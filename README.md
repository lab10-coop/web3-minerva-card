# security2go

nodejs library for interacting with the Infineon Securiy2Go SmartCard for signing transactions for ethereum blockchain based systems.

#troubleshooting 

##Linux
There are known problems with PC/SC Smart Card Daemon (pcscd). Sometimes the cardreader stops working immediatly after plugging it in or booting up the computer. A restart of the daemon can help in this case `systemctl restart pcscd`

