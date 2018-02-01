/*
	Title: GS_Preload.js
	Author: Italo Di Renzo
	Description: Preload game state.
	Last Edit: 09/10/2015
	Notes: Splitting gamestates into multiple files.

	TODO:
	-----------------------
	
*/
(function (Asteroids) {
	'use strict';

	Asteroids.PreloaderState = {
		preload: function () {
			// Create loading bar
			this.preloadBar = this.add.sprite(this.world.centerX - 150, this.world.centerY - 30, 'preloaderBar');
			this.add.text(this.world.centerX - 70, this.world.centerY + 30, 'LOADING', 
				{ font: '20pt Audiowide', fill: '#fff', align: 'center' });
			this.load.setPreloadSprite(this.preloadBar);

			// Load game content
			this.load.image('space', 'assets/img/space1.jpg');
			this.load.spritesheet('ship', 'assets/img/ship.png', 45, 40, 2);
			this.load.image('lasers', 'assets/img/lasers.png');
			this.load.image('asteroid', 'assets/img/asteroid.png');
			this.load.spritesheet('explosion', 'assets/img/explosion.png', 64, 64, 16);
			this.load.audio('sfx_laser1', 'assets/audio/laser1.mp3');
			this.load.audio('sfx_laser2', 'assets/audio/laser2.mp3');
			this.load.audio('sfx_explosion1', 'assets/audio/explosion1.mp3');
		},

		create: function () {
			this.state.start('InGame');
		}
	};

}(window.Asteroids = window.Asteroids || {}));