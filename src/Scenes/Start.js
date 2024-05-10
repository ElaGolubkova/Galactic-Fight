class Start extends Phaser.Scene {
    constructor() {
        super("Start");
        this.my = { sprite: {} };
    }

    preload() {
        //https://kenney.nl/assets/kenney-fonts
        this.load.bitmapFont('Game2Font', 'assets/Game2Font.png', 'assets/Game2Font.xml');    
    }

    create() {
        let my = this.my;   
        
        this.add.bitmapText(500, 300, 'Game2Font', 'Welcome to the game', 64).setOrigin(0.5);
        this.add.bitmapText(500, 400, 'Game2Font', 'Galactic   Fight!', 150).setOrigin(0.5);
        this.add.bitmapText(500, 700, 'Game2Font', 'Made by: Ela Golubkova', 50).setOrigin(0.5);

        document.getElementById('description').innerHTML = '<h2>Press ENTER to start</h2>';

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
          this.scene.start('Galaxy'); 
        }
        
    }
}