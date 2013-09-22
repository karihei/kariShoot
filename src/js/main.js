requirejs.config({
    shim: {
        'box2d': {
            deps: ['box2dweb']
        },
        'jrumble' :{
            deps: ['jquery']
        }
    },
    paths: {
        'socketio': 'lib/socket.io',
        'jquery': 'lib/jquery-1.7.1.min',
        'jrumble': 'lib/jquery.jrumble.1.3.min',
        'enchant': 'lib/enchant.js/dev/enchant',
        'ui': 'lib/enchant.js/dev/plugins/ui.enchant',
        'box2dweb': 'lib/enchant.js/libs/Box2dWeb-2.1.a.3',
        'box2d': 'lib/enchant.js/dev/plugins/box2d.enchant',
        'index': 'view/index'
    }
});

require(['socketio', 'jquery', 'jrumble', 'enchant', 'box2dweb', 'box2d'], function() {
    /**
     * @constructor
     */
    kariShoot = function() {
    };

    // サーバ側設定
    SERVER_URI = 'http://localhost:8762';
    kariShoot.socket = io.connect(SERVER_URI);

    // kariShoot.socket.emit('signup', {'id': 1234, 'name': 'てすと太郎'});

    // 各種定数
    PLAYER_IMG_PATH = 'src/js/lib/enchant.js/images/chara1.png';
    STAGE_IMG_PATH = 'img/stage.png';
    CLOUD_MID_IMG_PATH = 'img/cloud_middle1.png';
    CLOUD_SMALL_IMG_PATH = 'img/cloud_small.png';

    GRID_SIZE = 16;
    BLOCK_SIZE = 32; // 土とか
    STAGE_GRID_WIDTH = 64;   // ステージのグリッド幅
    STAGE_GRID_HEIGHT = 24;  // ステージのグリッド高さ
    STAGE_WIDTH = 640;
    STAGE_HEIGHT = 480;
    WORLD_WIDTH = STAGE_GRID_WIDTH * BLOCK_SIZE;
    WORLD_HEIGHT = STAGE_GRID_HEIGHT * BLOCK_SIZE;


    // ゲーム開始
    var run = function() {
        // enchant.js 初期化
        enchant();
        core = new Core(STAGE_WIDTH, STAGE_HEIGHT);
        core.fps = 32;
        core.keybind(32, 'space');
        core.preload(PLAYER_IMG_PATH, STAGE_IMG_PATH, CLOUD_MID_IMG_PATH, CLOUD_SMALL_IMG_PATH);
        require(['ui', 'game', 'index']);
    };

    // ログインユーザをセット
    // とりあえずダミー
    kariShoot.LOGIN_USER = {
        'id': 1234,
        'name': 'dummy',
        'level': 1,
        'hp': 1000,
        'atk': 10,
        'def': 10,
        'agi': 1,
        'exp': 0,
        'skp': 0
    };


    kariShoot.socket.emit('getuser', {id: 1234});
    kariShoot.socket.on('getuser result', function(result) {
        if (result.length > 0) {
            kariShoot.LOGIN_USER = result[0];
            run();
        }
    });
});
