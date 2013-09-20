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
            var windowWidth = 128;
            var windowHeight = 35;
            var windowOuter = new Sprite(windowWidth, windowHeight);
            var outer = new Surface(windowWidth, windowHeight);
            var context = outer.context;

            windowOuter.image = outer;

            context.strokeStyle = 'rgb(0, 0 ,0)';
            context.beginPath();
            context.fillRect(0, 0, windowWidth, windowHeight);

            var windowInner = new Sprite(windowWidth, windowHeight);
            var inner = new Surface(windowWidth, windowHeight);
            var innerContext = inner.context;
            windowInner.image = inner;

            innerContext.strokeStyle = 'rgb(255, 255, 255)';
            innerContext.lineWidth = 2;
            innerContext.beginPath();
            innerContext.strokeRect(5, 5, windowWidth-10, windowHeight-10);

            var text = new Label('ようすをみている');
            var fontSize = 12;
            text.font = fontSize + 'px';
            text.color = 'white';
            text.font = '10px famania';
            text.x = 10;
            text.y = windowHeight / 2 - fontSize / 2 + 1;

            consoleWindow.addChild(windowOuter);
            consoleWindow.addChild(windowInner);
            consoleWindow.addChild(text);
            consoleWindow.x = this.x - ((this.x + windowWidth / 2) - this.centerX);
            consoleWindow.y = this.y - windowHeight;
            core.rootScene.mainStage.addChild(consoleWindow);
            setTimeout(function() {
                core.rootScene.mainStage.removeChild(consoleWindow);
            }, 3000);

            this.status.showBalloon('ようすをみる');
        }
    });
});
