/*
	Title: GS_EndGame.js
	Author: Italo Di Renzo
	Description: Ending game state.
	Last Edit: 09/10/2015
	Notes: Splitting gamestates into multiple files.

	TODO:
	-----------------------
	
*/
var Asteroids = Asteroids || {};

Asteroids.EndGame = function (game) {};

Asteroids.EndGame.prototype.create = function () {
	this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

	this.gameOverText = this.add.text(this.world.centerX, this.world.centerY, "G A M E 	O V E R !", 
		{ font: "28pt Audiowide", fill: "#fff", align: "center" });
	this.gameOverText.anchor.setTo(0.5, 0.5);

	this.scoreText = this.add.text(this.world.centerX, this.world.centerY + 50, "SCORE: " + Asteroids.score,
		{ font: '20pt Audiowide', fill: '#fff', align: 'center' });
	this.scoreText.anchor.setTo(0.5, 0.5);

	var restartText = this.add.text(this.world.centerX, this.world.centerY + 100, "PRESS 'R' TO RESTART",
		{ font: '20pt Audiowide', fill: '#fff', align: 'center' });
	restartText.anchor.setTo(0.5,0.5);
};

Asteroids.EndGame.prototype.update = function () {
	this.bg.tilePosition.x -= 0.5;

	if (this.input.keyboard.isDown(Phaser.Keyboard.R)) {
		this.state.start('InGame');
	}
};