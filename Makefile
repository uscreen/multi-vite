install:
	yarn install
	service install

start: start.services start.vite

stop: stop.vite stop.services

start.vite:
	tmuxinator start vite

stop.vite:
	tmuxinator stop vite

start.services:
	service start

stop.services:
	service stop