define([
    'manage/manage',
    'util/util',
    'bullet/bullet',
    'bullet/gravity',
    'bullet/arc',
    'entity/enemy',
    'entity/slime',
    'entity/dragon',
    'entity/player',
    'structure/skpcoin'],
    function() {
        $(document).ready(function() {
            /**
             * ステージの構成要素
             * @enum {number}
             */
            kariShoot.EntityType = {
                GROUND: 0,
                BLOCK: 1,
                AIR: -1,
                SLIME: 2,
                DRAGON: 3
            };

            /**
             * ステージを作って返す
             * @return {Array}
             * TODO: 最終的にステージは外部ファイルに書いて読み込みたい
             */
            kariShoot.prototype.buildStage = function() {
                var stage = [];

                for (var i = 0;i < STAGE_GRID_HEIGHT;i++) {
                    var row = [];
                    for (var j = 0;j < STAGE_GRID_WIDTH;j++) {
                        if (i == 20 && j == 20) {
                            row[j] = kariShoot.EntityType.SLIME;
                        } else if ((i == 20 && j == 30) || (i == 20 && j == 60)) {
                            row[j] = kariShoot.EntityType.DRAGON;
                        } else if (i === STAGE_GRID_HEIGHT - 1) {
                            row[j] = kariShoot.EntityType.GROUND;
                        } else {
                            row[j] = kariShoot.EntityType.AIR;
                        }
                    }
                    stage.push(row);
                }

                return stage;
            };

            /**
             * てきとうに雲を並べる
             * @param {Group} stage
             */
            kariShoot.prototype.setClouds = function(stage) {
                var cloudSize = STAGE_GRID_WIDTH;

                for(var i = 0;i < cloudSize;i++) {
                    var midCloud = new Sprite(64, 30);
                    var smallCloud = new Sprite(32, 15);
                    midCloud.image = core.assets[CLOUD_MID_IMG_PATH];
                    midCloud.x = i * 100 + (Math.random() * 50);
                    midCloud.y = i * 2 + (Math.random() * 60) - 70;
                    midCloud.opacity = '0.5';
                    smallCloud.image = core.assets[CLOUD_SMALL_IMG_PATH];
                    smallCloud.x = i * 80 + (Math.random() * 50);
                    smallCloud.y = i * 2 + (Math.random() * 100) - 50;
                    smallCloud.opacity = '0.5';
                    stage.addChild(midCloud);
                    stage.addChild(smallCloud);
                }
            };

            kariShoot.prototype.run = function() {
                core.onload = $.proxy(function() {
                    core.physicsWorld = new PhysicsWorld(0, 9.8);
                    var stage = new Group();
                    var turn = kariShoot.manage.Turn.getInstance();

                    // ミニマップ設定
                    var miniMap = new kariShoot.manage.MiniMap();
                    miniMap.x = STAGE_WIDTH - miniMap.width;
                    core.rootScene.addChild(miniMap);

                    // mainStageよりも上に表示させたいものがあるときはこれにaddChildする
                    var upperLayer = new Group();
                    core.rootScene.addChild(upperLayer);
                    core.rootScene.upperLayer = upperLayer;

                    // ステージ設定
                    var tiles = this.buildStage();
                    core.rootScene.status = new kariShoot.manage.Status();

                    // 雲を配置
                    this.setClouds(stage, miniMap);

                    for (var i = 0; i < tiles.length; i++) {
                        for (var j = 0; j < tiles[i].length; j++) {
                            var tile;
                            switch(tiles[i][j]) {
                                case kariShoot.EntityType.GROUND:
                                    tile = new PhyBoxSprite(BLOCK_SIZE, BLOCK_SIZE, enchant.box2d.STATIC_SPRITE, 100, 1.0, 0, true);
                                    tile.image = core.assets[STAGE_IMG_PATH];
                                    tile.frame = 3; // 上草付きの土
                                    tile.position = {x: j * BLOCK_SIZE, y: i * GRID_SIZE + 105};
                                    stage.addChild(tile);
                                    miniMap.createTile(tile, 'green');
                                    break;
                                case kariShoot.EntityType.SLIME:
                                    //tile = new kariShoot.Entity.Slime();
                                    //tile.position = {x: j * GRID_SIZE + (GRID_SIZE / 2) + 100, y: i * GRID_SIZE + 5};
                                   // stage.addChild(tile);
                                    //tile.setMiniMapTile(miniMap.createTile(tile, 'red'));
                                    break;
                                case kariShoot.EntityType.DRAGON:
                                    tile = new kariShoot.Entity.Dragon();
                                    tile.position = {x: j * GRID_SIZE + (GRID_SIZE / 2) + 100, y: i * GRID_SIZE + 105};
                                    stage.addChild(tile);
                                    tile.setMiniMapTile(miniMap.createTile(tile, 'red'));
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    // 射幸心コインを仮配置
                    for (var i=0;i < 50; i++) {
                        var hoge = new kariShoot.structure.SkpCoin(16);
                        hoge.x = 200 + (hoge.width + 10) * i;
                        hoge.y = 100 + Math.random() * 100;
                        stage.addChild(hoge);
                    }

                    stage.y = 0;
                    var player = new kariShoot.Entity.Player();
                    player.setMiniMapTile(miniMap.createTile(player, 'yellow', true));
                    player.position = {x: 40, y: STAGE_HEIGHT - GRID_SIZE - player.height};
                    stage.addChild(player);

                    core.rootScene.miniMap = miniMap;
                    core.rootScene.player = player;
                    core.rootScene.insertBefore(stage, core.rootScene.upperLayer);
                    core.rootScene.mainStage = stage;
                    core.rootScene.addEventListener('enterframe', function() {
                        turn.tick();
                        core.physicsWorld.step(core.fps);
                    });
                }, this);
                core.start();
            };

            var golf = new kariShoot();
            golf.run();
        });
    });
