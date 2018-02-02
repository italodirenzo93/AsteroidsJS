/*
	Title: state_boot.js
	Author: Italo Di Renzo
	Description: Boot game state.
	Last Edit: 09/10/2015
*/
(function (Asteroids) {
	'use strict';

	Asteroids.BootState = {
		init: function () {
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	// Maintain aspect ratio
		},

		preload: function () {
			this.load.image('preloaderBar', 'assets/img/loading-bar.png');
		},

		update: function () {
			this.state.start('Preloader');
		}
	};
}(window.Asteroids = window.Asteroids || {}));