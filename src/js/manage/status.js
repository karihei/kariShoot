define(['manage/manage'], function() {
    /**
     * ステータスのコンテナクラス
     * @constructor
     */
    kariShoot.manage.Status = Class.create(Group, {
        initialize: function() {
            Group.call(this);

            /**
             * @type {Array.<kariShoot.manage.Status.Item>}
             * @private
             */
            this.items_ = [];
        },

        /**
         * @param {kariShoot.Entity} entity
         * @return {kariShoot.manage.Status.Item}
         */
        createAndAddItem: function(entity) {
            var status = new kariShoot.manage.Status.Item(entity);
            core.rootScene.addChild(status);
            this.items_.push(status);
            status.x = STAGE_WIDTH - 150; // TODO: しかるべきとこに配置
            this.repositionY_();
            return status;
        },

        /**
         * 指定Entityのstatusを削除する
         * @param {kariShoot.Entity} entity
         */
        removeItem: function(entity) {
            var result = [];
            $.each(this.items_, $.proxy(function(index, item) {
                if (entity != item.getEntity()) {
                    result.push(item);
                } else {
                    item.remove();
                }
            }, this));
            this.items_ = result;
            this.repositionY_();
        },

        /**
         * よいy座標に再配置する
         * @return {number}
         * @private
         */
        repositionY_: function() {
            $.each(this.items_, function(index, item) {
                item.y = STAGE_HEIGHT / 4 + (50 * index);
            });
        }
    });


    /**
     * ステータス
     */
    kariShoot.manage.Status.Item = Class.create(Group, {
        /**
         * @param {!kariShoot.Entity} entity
         * @constructor
         */
        initialize: function(entity) {
            Group.call(this);

            /**
             * @type {!kariShoot.Entity}
             * @private
             */
            this.entity_ = entity;

            /**
             * 顔アイコン
             * @type {Sprite}
             * @private
             */
            this.icon_ = null;

            /**
             * HPバー
             * @type {Sprite}
             * @private
             */
            this.hpBar_ = null;

            /**
             * AG
             * @type {Sprite}
             * @private
             */
            this.activeGauge_ = null;

            /**
             * 吹き出し
             * @type {Group}
             * @private
             */
            this.balloon_ = null;

            this.create_();
        },

        /**
         * Entityをもとにステータスをつくる
         * @private
         */
        create_: function() {
            this.icon_ = this.createIcon_();
            this.addChild(this.icon_);
            this.hpBar_ = this.createHpBar_();
            this.addChild(this.hpBar_);
            this.activeGauge_ = this.createActiveGauge_();
            this.addChild(this.activeGauge_);
        },

        /**
         * アイコンをつくる
         * @return {Sprite}
         * @private
         */
        createIcon_: function() {
            var icon = new Sprite(this.entity_.width, this.entity_.height);
            icon.image = this.entity_.image;
            icon.scale(32 / this.entity_.width);
            icon.x = this.entity_.width * -0.35;
            icon.y = this.entity_.width * -0.35;
            return icon;
        },

        /**
         * HPバーをつくる
         * @return {Sprite}
         * @private
         */
        createHpBar_: function() {
            var bar = new Sprite(kariShoot.manage.Status.Item.HP_BAR_WIDTH, kariShoot.manage.Status.Item.HP_BAR_HEIGHT);
            bar.backgroundColor = '#f00';
            bar.x = 40;
            bar.y =  0;
            return bar;
        },

        /**
         * AGをつくる
         * @return {Sprite}
         * @private
         */
        createActiveGauge_: function() {
            var bar = new Sprite(kariShoot.manage.Status.Item.AG_WIDTH, kariShoot.manage.Status.Item.AG_HEIGHT);
            bar.backgroundColor = '#00f';
            bar.x = 40;
            bar.y =  8;
            return bar;
        },

        /**
         * HPバーを反映させる
         */
        updateHp: function() {
            var ratio = this.entity_.hp / this.entity_.maxHp;
            this.hpBar_.width = kariShoot.manage.Status.Item.HP_BAR_WIDTH * ratio;
        },
        /**
         * AGを反映させる
         */
        updateActiveGauge: function() {
            if (!this.entity_.activeGauge) {
                return;
            }

            var ratio = this.entity_.activeGauge / kariShoot.manage.Turn.MAX_ACTIVE_GAUGE;
            this.activeGauge_.width = kariShoot.manage.Status.Item.AG_WIDTH * ratio;
        },

        /**
         * 吹出し的なサムシングを表示する
         * @param {number} text
         * @param {number=} opt_autoHideTime
         */
        showBalloon: function(text, opt_autoHideTime) {
            if (this.balloon_) {
                this.removeBalloon();
            }

            var width = 15 * text.length;
            this.balloon_ = kariShoot.util.canvas.makeBalloon(width, 30, text);
            this.balloon_.x = -1 * width - 10;
            this.addChild(this.balloon_);

            var autoHideTime = opt_autoHideTime || 3000;
            setTimeout($.proxy(function(){
                this.removeBalloon();
            }, this), autoHideTime);
        },

        removeBalloon: function() {
            if (this.balloon_) {
                this.removeChild(this.balloon_);
                this.balloon_ = null;
            }
        },

        /**
         * @return {!kariShoot.Entity}
         */
        getEntity: function() {
            return this.entity_;
        }
    });

    /**
     * @const {number}
     */
    kariShoot.manage.Status.Item.HP_BAR_WIDTH = 100;

    /**
     * @const {number}
     */
    kariShoot.manage.Status.Item.HP_BAR_HEIGHT = 5;

    /**
     * @const {number}
     */
    kariShoot.manage.Status.Item.AG_WIDTH = 100;

    /**
     * @const {number}
     */
    kariShoot.manage.Status.Item.AG_HEIGHT = 3;
});