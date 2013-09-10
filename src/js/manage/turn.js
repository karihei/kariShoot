define(['manage/manage'], function() {
    /**
     * ActiveTurnを管理するクラス
     * @constructor
     */
    kariShoot.manage.Turn = function() {
        /**
         * ターン順のキュー
         * @type {Array.<kariShoot.Entitiy>}
         * @private
         */
        this.queue_ = [];

        /**
         * 行動中のEntity
         * @type {kariShoot.Entity}
         * @private
         */
        this.activeEntity_ = null;

        /**
         * このEntityが画面中央にくるようスクロールする
         * @type {kariShoot.Entity}
         * @private
         */
        this.scrollTarget_ = null;

        core.rootScene.addEventListener('enterframe', $.proxy(function() {
            if (this.scrollTarget_) {
                this.scrollTo(this.scrollTarget_);
            }
        }, this));
    };

    /**
     * 各EntityのActiveGaugeがこれ以上になったら行動開始
     * @const {number}
     */
    kariShoot.manage.Turn.MAX_ACTIVE_GAUGE = 100;

    kariShoot.manage.Turn.TargetType = {
        PLAYER: 'player',
        ENEMY: 'enemy'
    };

    /**
     * @param {Sprite} entity
     */
    kariShoot.manage.Turn.prototype.addEntity = function(entity) {
        this.queue_.push(entity);
    };

    /**
     * @param {Sprite} entity
     */
    kariShoot.manage.Turn.prototype.removeEntity = function(entity) {
        var newEntities = [];
        $.each(this.queue_, $.proxy(function(index, e) {
            if (e != entity) {
                newEntities.push(e);
            }
        }, this));
        this.queue_ = newEntities;
    };

    /**
     * ターンキューにつまれているやつを処理する
     */
    kariShoot.manage.Turn.prototype.tick = function() {
        if (!this.activeEntity_ && this.queue_.length > 0) {
            this.activeEntity_ = this.queue_.shift();
            this.activeEntity_.action();
            //this.scrollTo(this.activeEntity_);
        }
    },

    /**
     * ターンを終了する
     * ターンが終わったSpriteがこれを呼ぶイメージ。
     */
    kariShoot.manage.Turn.prototype.end = function() {
        this.activeEntity_.isAction = false;
        this.activeEntity_ = null;
    };

    /**
     * entityのもとへスクロールする
     * @param {Sprite} entity
     */
    kariShoot.manage.Turn.prototype.scrollTo = function(entity) {
        var x = Math.min((core.width / 2 - entity.width) - entity.x, 0);
        var mainStageX = core.rootScene.mainStage.x;
        var mainStageY = core.rootScene.mainStage.y;
        var direction = 1;
        if (mainStageX + core.width < entity.x) {
            direction = -1;
        }

        var dx = 100 * direction;
        var dy = 50;// * direction;
        if ((direction > 0 && (mainStageX + dx > x) || (direction < 0 && (mainStageX + dx < x)))) {
            core.rootScene.mainStage.x = x;
            this.scrollFinishX_ = true;
        } else if (mainStageX < entity.x) {
            core.rootScene.mainStage.x += dx;
        }

        if (mainStageY + dy > 0) {
            core.rootScene.mainStage.y = 0;
            this.scrollFinishY_ = true;
        } else if (mainStageY < entity.y) {
            core.rootScene.mainStage.y += dy;
        }

        if (this.scrollFinishX_ && this.scrollFinishY_) {
            this.scrollTarget_ = null;
            this.scrollFinishX_ = false;
            this.scrollFinishY_ = false;

            // スクロール後はデフォで1秒くらい待ってから行動開始するようにする
            setTimeout(function() {
                entity.action();
            }, 1000);
        }
    };

    /**
     * singleton
     * @type {kariShoot.manage.Turn}
     * @private
     */
    kariShoot.manage.Turn.instance_ = new kariShoot.manage.Turn();

    kariShoot.manage.Turn.getInstance = function() {
        return kariShoot.manage.Turn.instance_;
    }
});