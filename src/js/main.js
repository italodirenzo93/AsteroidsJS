var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
game.state.add('Boot', new Asteroids.Boot());
game.state.add('Preloader', new Asteroids.Preloader());
game.state.add('TitleScreen', new Asteroids.TitleScreen());
game.state.add('InGame', new Asteroids.InGame());
game.state.add('EndGame', new Asteroids.EndGame());
game.state.start('Boot');