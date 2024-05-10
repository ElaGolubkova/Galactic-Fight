class Win extends Phaser.Scene {
    constructor() {
        super("Win");
        this.my = { sprite: {} };
    }

    preload() {
        //https://kenney.nl/assets/kenney-fonts
        this.load.bitmapFont('Game2Font', 'assets/Game2Font.png', 'assets/Game2Font.xml');
    }

    create() {
        let my = this.my;   

        this.add.bitmapText(500, 300, 'Game2Font', 'Thank you for playing Galactic Fight!', 64).setOrigin(0.5);
        this.add.bitmapText(500, 400, 'Game2Font', 'You Won!', 150).setOrigin(0.5);
        this.add.bitmapText(500, 700, 'Game2Font', 'Made by: Ela Golubkova', 50).setOrigin(0.5);
        
        document.getElementById('description').innerHTML = '<h2>Press ENTER to play again</h2>';

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
          this.scene.start('Start'); 
        }
        
    }
}