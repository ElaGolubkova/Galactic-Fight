class Galaxy extends Phaser.Scene {
    constructor() {
        super("Galaxy");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 3;           // Don't create more than this many bullets
        
        this.my.sprite.enemyBullet = []; 
        
        this.score = 0;
        this.winningScore = 100;
        this.life = 3;
    }

    preload() {
        //The assets are taken from Kenny assets packs
        //https://kenney.nl/assets/platformer-art-extended-enemies
        //https://kenney.nl/assets/alien-ufo-pack
        //https://kenney.nl/assets/smoke-particles
        this.load.setPath("./assets/");
        this.load.image("alien", "alienGreen.png");
        this.load.image("alienBullet", "alienGreen_badge1.png");
        this.load.image("shipPink", "shipPink_manned.png");
        this.load.image("explosion00", "explosion00.png");
        this.load.image("explosion01", "explosion01.png");
        this.load.image("explosion02", "explosion02.png");
        this.load.image("explosion03", "explosion03.png");
        this.load.image("enemyBullet", "alienPink_badge2.png");
        this.load.image("shipBlue", "shipBlue_manned.png");
        this.load.image("enemyBullet2", "alienBlue_badge1.png");
        this.load.image("heart", "heart.png");

        //https://kenney.nl/assets/sci-fi-sounds
        this.load.audio("shipBoom", "laserRetro_000.ogg");
        this.load.audio("alienBoom", "laserRetro_003.ogg");

        //https://kenney.nl/assets/kenney-fonts
        this.load.bitmapFont('Game2Font', 'Game2Font.png', 'Game2Font.xml');
    }

    create() {
        let my = this.my;

        this.scoreText = this.add.bitmapText(900, 40, 'Game2Font', 'S C O R E :  ' + this.score, 50).setOrigin(0.5);

        my.sprite.alien = this.add.sprite(game.config.width/2, game.config.height - 50, "alien");
        my.sprite.alien.setScale(0.8);

        my.sprite.heart1 = this.add.sprite(30, 30, "heart");
        my.sprite.heart2 = this.add.sprite(60, 30, "heart");
        my.sprite.heart3 = this.add.sprite(90, 30, "heart");

        this.points = [
            3, 435,
            42, 440,
            228, 415,
            360, 378,
            518, 243,
            624, 141,
            801, 123,
            909, 142,
            995, 171
        ];

        this.points2 = [
            995, 161,
            907, 134,
            644, 68,
            386, 59,
            258, 224,
            408, 417,
            645, 465,
            786, 369,
            785, 178,
            635, 119,
            490, 83,
            205, 112,
            6, 101
        ]

        this.curve = new Phaser.Curves.Spline(this.points);
        this.curve2 = new Phaser.Curves.Spline(this.points2);
    
        my.sprite.shipPink = this.add.follower(this.curve, 10, 10, "shipPink");
        my.sprite.shipPink.setScale(0.6);

        my.sprite.shipPink.x = this.curve.points[0].x
        my.sprite.shipPink.y = this.curve.points[0].y

        my.sprite.shipBlue = this.add.follower(this.curve2, 10, 10, "shipBlue");
        my.sprite.shipBlue.setScale(0.6);

        my.sprite.shipBlue.x = this.curve2.points[0].x
        my.sprite.shipBlue.y = this.curve2.points[0].y
       
        this.followConfig = {
            from: 0,
            to: 1,
            delay: 0,
            duration: 6000,
            ease: 'Sine.easeInOut',
            repeat: 100,
            yoyo: true,
            rotateToPath: false,
            rotationOffset: 0
        }

        my.sprite.shipPink.startFollow(this.followConfig);
        my.sprite.shipBlue.startFollow(this.followConfig);

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
                { key: "explosion02" },
                { key: "explosion03" },
            ],
            framerate: 30,
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.enemyBulletFrequency = 100
        this.enemyBulletNumber = 5

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Galactic Fight.js</h2><br>A: left // D: right // Space: fire/emit'

        this.add.bitmapText(60, 70, 'Game2Font', 'L i v e s', 40).setOrigin(0.5);

        this.resetGameVariables();
    }

    // Function to reset game variables (score and lives)
    resetGameVariables() {
        this.score = 0;
        this.life = 3;
        this.updateScoreText();
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.alien.x > (my.sprite.alien.displayWidth/2)) {
                my.sprite.alien.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.alien.x < (game.config.width - (my.sprite.alien.displayWidth/2))) {
                my.sprite.alien.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.alien.x, my.sprite.alien.y-(my.sprite.alien.displayHeight/2), "alienBullet")
                );
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // Enemy bullets - generater it with given frequency
        const randomNumber = Math.floor(Math.random() *  this.enemyBulletFrequency)
        if (randomNumber == 13 && my.sprite.enemyBullet.length < this.enemyBulletNumber) {  
            my.sprite.enemyBullet.push(this.add.sprite(
                my.sprite.shipPink.x, my.sprite.shipPink.y+(my.sprite.shipPink.displayHeight/2), "enemyBullet")
            );
        }
        else if (randomNumber == 25 && my.sprite.enemyBullet.length < this.enemyBulletNumber) {  
            my.sprite.enemyBullet.push(this.add.sprite(
                my.sprite.shipBlue.x, my.sprite.shipBlue.y+(my.sprite.shipBlue.displayHeight/2), "enemyBullet2")
            );
        }

        // Make all of the enemy bullets move
        for (let bullet of my.sprite.enemyBullet) {
            bullet.y += this.bulletSpeed;
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((bullet) => bullet.y < 1000);

        // Check for collision with the shipPink
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.shipPink, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.shipPink.x, my.sprite.shipPink.y, "explosion03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.shipPink.visible = false;
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.shipPink.visible = true;
                }, this);

                this.sound.play("shipBoom", {
                    volume: 0.1 
                 });

                 this.score += 25;
                 this.updateScoreText();
                 console.log('Score: ' + this.score);
                if (this.score >= this.winningScore) {
                    console.log("You won!!!")
                    this.scene.start('Win');
                }    
            }
            else if (this.collides(my.sprite.shipBlue, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.shipBlue.x, my.sprite.shipBlue.y, "explosion03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.shipBlue.visible = false;
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.shipBlue.visible = true;
                }, this);

                this.sound.play("shipBoom", {
                    volume: 0.1 
                 });

                 this.score += 25;
                 this.updateScoreText();
                 console.log('Score: ' + this.score);
                if (this.score >= this.winningScore) {
                    console.log("You won!!!")
                    this.scene.start('Win');
                }    
            }
        }
            
        // Check enemy bullet collision with player
        for (let bullet of my.sprite.enemyBullet) {
            if (this.collides(my.sprite.alien, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.alien.x, my.sprite.alien.y, "explosion03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = 2000;
                my.sprite.alien.visible = false;
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.alien.visible = true;
                }, this);

                this.sound.play("alienBoom", {
                    volume: 0.1 
                 });


                this.life -= 1
                console.log("Lives: " + this.life)
                if (this.life <= 0) {
                    console.log("You lost!!!")
                    this.scene.start('Lose');
                }    
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("fixedArrayBullet");
        }

        if (this.life == 2) {
            my.sprite.heart1.visible = true; 
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = false;
        }

        if (this.life == 1) {
            my.sprite.heart1.visible = true; 
            my.sprite.heart2.visible = false;
            my.sprite.heart3.visible = false;
        }

        if (this.life == 0) {
            my.sprite.heart1.visible = false; 
            my.sprite.heart2.visible = false;
            my.sprite.heart3.visible = false;
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    
    updateScoreText() {
        this.scoreText.setText('S C O R E :  ' + this.score);
    }
}
         