/*
	Title: GS_EndGame.js
	Author: Italo Di Renzo
	Description: Ending game state.
	Last Edit: 09/28/2017
*/
(function (Asteroids) {
	'use strict';
	
	Asteroids.EndGameState = {
		create: function () {
			this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
			
			var textStyle = {
				font: 'Audiowide',
				fill: '#fff',
				align: 'center'
			};
		
			textStyle.fontSize = '28pt';
			this.add.text(
				this.world.centerX,
				this.world.centerY,
				"G A M E 	O V E R !", 
				textStyle,
			).anchor.setTo(0.5, 0.5);
		
			textStyle.fontSize = '20pt';
			this.add.text(
				this.world.centerX,
				this.world.centerY + 50,
				"SCORE: " + Asteroids.score,
				textStyle
			).anchor.setTo(0.5, 0.5);
		
			textStyle.fontSize = '18pt';
			this.add.text(
				this.world.centerX,
				this.world.centerY + 100,
				"PRESS 'R' TO RESTART",
				textStyle
			).anchor.setTo(0.5, 0.5);
		},

		update: function () {
			this.bg.tilePosition.x -= 0.5;
			
			if (this.input.keyboard.isDown(Phaser.Keyboard.R)) {
				Asteroids.score = 0;
				this.state.start('InGame');
			}
		}
	};
}(window.Asteroids = window.Asteroids || {}));