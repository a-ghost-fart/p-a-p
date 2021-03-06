module.exports = {
    'preload': function () {
        'use strict';
        // Test assets
        this.load.image('test', 'assets/sprites/test_player.png');
        this.load.image('test_arms', 'assets/sprites/test_arms.png');
        this.load.image('test_bg', 'assets/backgrounds/test_galaxy.jpg');
        this.load.image('test_tiles', 'assets/tilesets/test_tileset.png');
        this.load.image('test_item', 'assets/sprites/test_item.png');
        this.load.image('test_projectile', 'assets/sprites/test_projectile.png');
        this.load.spritesheet('test_button', 'assets/ui/test_button.png', 64, 32);
        this.load.tilemap('test_map', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('base_player', 'assets/sprites/base_player.png');
        this.load.spritesheet('idle_anim', 'assets/sprites/idle_animation.png', 14, 48, 12);
        this.load.bitmapFont('bitmap_font', 'assets/ui/font.png', 'assets/ui/font.xml');
        this.load.image('dust', 'assets/sprites/dust.png');

    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};
