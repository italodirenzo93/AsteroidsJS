/*
	Title: GS_InGame.js
	Author: Italo Di Renzo
	Description: Playing game state.
	Last Edit: 09/10/2015
	Notes: Splitting gamestates into multiple files.

	TODO:
	-----------------------
	
*/
var Asteroids = Asteroids || {};

Asteroids.InGame = function (game) {
	Asteroids.score = 0;
	Asteroids.fontStyle = { font: '18pt Audiowide', fill: '#fff', align: 'center' };

	this.shotTimer = 0;
	this.shotDelay = 190;
	this.shotSpeed = 550;
};

Asteroids.InGame.prototype.create = function () {
	// Start physics system
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	// Insert and initialize assets
	this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

	this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship', 0);
	this.ship.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this.ship);
	this.ship.animations.add('fly', [0, 1], 10, true);
	this.ship.animations.play('fly');
	
	this.lasers = this.game.add.group();
	this.lasers.enableBody = true;
	this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
	this.lasers.createMultiple(10, 'lasers');
	this.lasers.setAll('checkWorldBounds', true);
	this.lasers.setAll('outOfBoundsKill', true);

	this.sfx_laser1 = this.add.audio('sfx_laser1', 0.5);

	this.asteroidGroup = this.add.group();
	this.asteroidGroup.enableBody = true;
	this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
	this.asteroidGroup.createMultiple(20, 'asteroid');
	this.asteroidGroup.setAll('checkWorldBounds', true);
	this.asteroidGroup.setAll('outOfBoundsKill', true);

	this.explosionGroup = this.add.group();
	this.explosionGroup.createMultiple(20, 'explosion');
	this.explosionGroup.forEach(function (explosion) {
		explosion.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 30, false);
	}, this);

	this.sfx_explosion1 = this.add.audio('sfx_explosion1');
	
	/*this.scoreText = this.game.add.text(this.game.world.centerX, 30, 'SCORE: ' + Asteroids.score,
		{ font: '18pt Audiowide', fill: '#fff', align: 'center' });*/
	this.scoreText = this.game.add.text(this.game.world.centerX, 30, 'SCORE: ' + Asteroids.score, Asteroids.fontStyle);
	this.scoreText.anchor.setTo(0.5, 0.5);
};


Asteroids.InGame.prototype.update = function () {
	// Scroll the background
	this.bg.tilePosition.x -= 0.5;

	this.scoreText.setText('SCORE: ' + Asteroids.score);

	if(this.asteroidGroup.countLiving() === 0) {
		var spawnTimer = this.time.create(true);
		spawnTimer.add(5000, this.spawnAsteroids, this);
		spawnTimer.start();
	}

	// Adjust ship's speed relative to its distance from the mouse cursor
	var shipSpeed = Phaser.Point.distance(this.ship, this.game.input.activePointer, true);
	this.game.physics.arcade.moveToPointer(this.ship, shipSpeed);

	// Rotate the ship toward the mouse cursor
	var targetAngle = (360 / (2 * Math.PI)) * this.game.math.angleBetween(
			this.ship.x, this.ship.y,
			this.game.input.x,
			this.game.input.y) + 90;
		this.ship.body.rotation = targetAngle;

	// If the ship reaches the mouse cursor, stop moving
	if(Phaser.Rectangle.contains(this.ship.body, this.game.input.x, this.game.input.y)) {
		this.ship.body.velocity.setTo(0, 0);
	}

	// On left-mouse button down, activate the the "lasers". Muahahahaha!!!
	if(this.game.input.activePointer.isDown) {
		if(this.shotTimer < this.game.time.now) {
			this.shotTimer = this.game.time.now + this.shotDelay;

			var shot = this.lasers.getFirstDead();
			shot.reset(this.ship.x, this.ship.y);
			shot.rotation = this.ship.rotation;	// this is a problem
			shot.anchor.setTo(0.5, 2); 
			this.game.physics.arcade.moveToPointer(shot, this.shotSpeed);
			this.sfx_laser1.play();
		}
	}

	// Collision masks
	this.physics.arcade.collide(this.asteroidGroup);
	this.physics.arcade.overlap(this.ship, this.asteroidGroup, function (asteroid, ship) { this.state.start('EndGame') }, null, this);
	this.physics.arcade.overlap(this.asteroidGroup, this.lasers, this.destroyAsteroid, null, this);
};

Asteroids.InGame.prototype.spawnAsteroids = function () {
	while(this.asteroidGroup.countDead() !== 0) {
		var asteroid = this.asteroidGroup.getFirstDead();
		asteroid.body.setSize(30, 30);
		var x = Math.floor(Math.random() * 750) + 10;
		var y = Math.floor(Math.random() * 550) + 10;
		asteroid.reset(x, y);
	}
};

Asteroids.InGame.prototype.destroyAsteroid = function (asteroid, shot) {
	var explosion = this.explosionGroup.getFirstDead();
	explosion.reset(asteroid.x, asteroid.y);
	explosion.animations.play('explode', null, false, true);
	this.sfx_explosion1.play();

	asteroid.kill();
	shot.kill();

	Asteroids.score += 10;
};


Asteroids.InGame.prototype.render = function () {
	// debug stuff
	this.game.debug.text('Asteroids Living: ' + this.asteroidGroup.countLiving(), 30, 40);
	this.game.debug.text('Asteroids Dead: ' + this.asteroidGroup.countDead(), 30, 60);
	this.game.debug.text('Explosions Living: ' + this.explosionGroup.countLiving(), 30, 80);
	this.game.debug.text('Explosions Dead: ' + this.explosionGroup.countDead(), 30, 100);
};
