module.exports = {
    'preload': function () {
        'use strict';
        this.load.image('test', 'assets/sprites/test_player.png');
        this.load.image('test_bg', 'assets/backgrounds/test_galaxy.jpg');
        this.load.image('test_tiles', 'assets/tilesets/test_tileset.png');
        this.load.image('test_item', 'assets/sprites/test_item.png');

        this.load.spritesheet('test_button', 'assets/ui/test_button.png', 64, 32);

        this.load.bitmapFont('bitmap_font', 'assets/ui/font.png', 'assets/ui/font.xml');

        this.load.tilemap('test_map', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
    },
    'create': function () {
        'use strict';
        this.state.start('play');
    }
};
