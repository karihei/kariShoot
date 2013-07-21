requirejs.config({
    shim: {
        'box2d': {
            deps: ['box2dweb']
        }
    },
    paths: {
        'jquery': 'lib/jquery-1.7.1.min',
        'enchant': 'lib/enchant.js/dev/enchant',
        'box2dweb': 'lib/enchant.js/libs/Box2dWeb-2.1.a.3',
        'box2d': 'lib/enchant.js/dev/plugins/box2d.enchant'
    }
});

require(['jquery', 'enchant', 'box2dweb', 'box2d'], function() {
    // 各種定数
    PLAYER_IMG_PATH = '../js/lib/enchant.js/images/chara1.png';
    STAGE_IMG_PATH = '../../img/stage.png';
    // CLOUD_MID_IMG_PATH = '../../img/cloud_middle.png';
    // CLOUD_SMALL_IMG_PATH = '../../img/cloud_small.png';

    GRID_SIZE = 16;
    BLOCK_SIZE = 32; // 土とか
    STAGE_GRID_WIDTH = 64;   // ステージのグリッド幅
    STAGE_GRID_HEIGHT = 24;  // ステージのグリッド高さ
    STAGE_WIDTH = 640;
    STAGE_HEIGHT = 480;
    WORLD_WIDTH = STAGE_GRID_WIDTH * BLOCK_SIZE;

    // enchant.js 初期化
    enchant();
    core = new Core(STAGE_WIDTH, STAGE_HEIGHT);
    core.fps = 64;
    core.preload(PLAYER_IMG_PATH, STAGE_IMG_PATH);


    /**
     * @constructor
     */
    kariGolf = function() {
    };

    require(['game']);
});