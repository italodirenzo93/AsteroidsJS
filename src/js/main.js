(function (Asteroids) {
	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
	game.state.add('Boot', Asteroids.BootState);
	game.state.add('Preloader', Asteroids.PreloaderState);
	game.state.add('TitleScreen', Asteroids.TitleScreenState);
	game.state.add('InGame', Asteroids.InGameState);
	game.state.add('EndGame', Asteroids.EndGameState);
	game.state.start('Boot');
}(window.Asteroids = window.Asteroids || {}));