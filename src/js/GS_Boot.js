/*
	Title: GS_Boot.js
	Author: Italo Di Renzo
	Description: Boot game state.
	Last Edit: 09/10/2015
*/
var Asteroids = Asteroids || {};

Asteroids.Boot = function (game) {};

// Methods
Asteroids.Boot.prototype.preload = function () {
	this.load.image('preloaderBar', 'assets/img/loading-bar.png');
};

Asteroids.Boot.prototype.create = function () {
	this.input.maxPointers = 1;
	this.state.start('Preloader');
};