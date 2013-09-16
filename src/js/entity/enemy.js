define(['entity/entity'], function() {

    /**
     * 敵クラス
     * ActiveTurn制で行動をする。いわゆるFFのATBのパクリ。
     * @constructor
     */
    kariShoot.Entity.Enemy = Class.create(kariShoot.Entity, {
        initialize: function(width, height, status, imagePath) {
            kariShoot.Entity.call(this, width, height, status, imagePath);

            /**
             * フレーム管理用変数
             * @type {Number}
             */
            this.acount = 0;

            /**
             * @type {kariShoot.manage.Turn}
             * @private
             */
            this.turn_ = kariShoot.manage.Turn.getInstance();

            /**
             * ATB的なパラメータ。100で行動開始
             * @type {number}
             */
            this.activeGauge = Math.random() * 10;

            /**
             * 行動中か
             * @type {boolean}
             */
            this.isAction = false;

            /**
             * AGとかHPバーとか
             * @type {kariShoot.manage.Status.Item}
             */
            this.status = core.rootScene.status.createAndAddItem(this);
        },

        onenterframe: function() {
            kariShoot.Entity.prototype.onenterframe.call(this);
            this.processActiveGauge_();
            if (this.acount++ > core.fps) {
                this.acount = 0;
            }
        },

        /**
         * @override
         */
        hit: function(entity) {
            kariShoot.Entity.prototype.hit.call(this, entity);
            this.status.updateHp();
        },

        /**
         * AGをすすめる
         * @private
         */
        processActiveGauge_: function() {
            if (!this.isAction) {
                this.activeGauge += this.agi * 0.5;
            }

            if (this.activeGauge >= kariShoot.manage.Turn.MAX_ACTIVE_GAUGE) {
                this.activeGauge = 0;
                this.turn_.addEntity(this);
                this.isAction = true;
            }

            this.status.updateActiveGauge();
        },

        /**
         * @override
         */
        action: function() {
            kariShoot.Entity.prototype.action.call(this);
            this.isAction = true;
        },

        /**
         * 指定したentityに攻撃する
         * @param {Sprite} entity
         */
        attack: function(entity) {
            var bullet = new kariShoot.Bullet();
            bullet.lineDraw = false;
            bullet.position = {x: this.centerX - 100 , y: this.centerY};
            core.rootScene.mainStage.addChild(bullet);

            bullet.shot(entity.x+100, entity.y, this);

        },

        /**
         * ようすをみる
         */
        nothingToDo: function() {
            var consoleWindow = new Group();
            var windowOuter = new Sprite(WORLD_WIDTH, WORLD_HEIGHT);
            var outer = new Surface(WORLD_WIDTH, WORLD_HEIGHT);
            var context = outer.context;
            var windowWidth = 128;
            var windowHeight = 35;
            windowOuter.image = outer;

            var windowRect = {
                x: this.x - ((this.x + windowWidth / 2) - this.centerX),
                y: this.y - windowHeight
            };

            context.strokeStyle = 'rgb(0, 0 ,0)';
            context.beginPath();
            context.fillRect(windowRect.x, windowRect.y, windowWidth, windowHeight);

            var windowInner = new Sprite(WORLD_WIDTH, WORLD_HEIGHT);
            var inner = new Surface(WORLD_WIDTH, WORLD_HEIGHT);
            var innerContext = inner.context;
            windowInner.image = inner;

            innerContext.strokeStyle = 'rgb(255, 255, 255)';
            innerContext.lineWidth = 2;
            innerContext.beginPath();
            innerContext.strokeRect(windowRect.x+5, windowRect.y+5, windowWidth-10, windowHeight-10);

            var text = new Label('ようすをみている');
            var fontSize = 12;
            text.font = fontSize + 'px';
            text.color = 'white';
            text.font = '10px famania';
            text.x = windowRect.x + 10;
            text.y = windowRect.y + windowHeight / 2 - fontSize / 2 + 1;

            consoleWindow.addChild(windowOuter);
            consoleWindow.addChild(windowInner);
            consoleWindow.addChild(text);
            core.rootScene.mainStage.addChild(consoleWindow);
            setTimeout(function() {
                core.rootScene.mainStage.removeChild(consoleWindow);
            }, 3000);

            this.status.showBalloon('ようすをみる');
        }
    });
});
