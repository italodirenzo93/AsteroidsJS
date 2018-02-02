(function (Asteroids) {
	// Create game object
	var game = new Phaser.Game(1920, 1080, Phaser.AUTO);

	// Add game states
	game.state.add('Boot', Asteroids.BootState);
	game.state.add('Preloader', Asteroids.PreloaderState);
	game.state.add('TitleScreen', Asteroids.TitleScreenState);
	game.state.add('InGame', Asteroids.InGameState);
	game.state.add('EndGame', Asteroids.EndGameState);

	// Start the game
	game.state.start('Boot');
}(window.Asteroids = window.Asteroids || {}));