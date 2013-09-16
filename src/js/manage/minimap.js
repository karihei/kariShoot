define([], function() {
    kariShoot.manage.MiniMap = Class.create(Group, {
        initialize: function() {
            Group.call(this);

            /**
             * @type {number}
             * @private
             */
            this.width = WORLD_WIDTH * kariShoot.manage.MiniMap.RATIO;

            /**
             * @type {number}
             * @private
             */
            this.height = 60; //WORLD_HEIGHT * kariShoot.manage.MiniMap.RATIO;

            this.init_();
        },

        /**
         * @private
         */
        init_: function() {
            var backGround = new Sprite(this.width, this.height);
            backGround.backgroundColor = '#000';
            backGround.opacity = '0.8';
            this.addChild(backGround);
        },

        /**
         * ステージを構成するタイルを追加
         * @param {Node} node
         * @param {string} color タイル色
         * @param {boolean=} opt_blink 点滅させるか
         * @return {kariShoot.manage.MiniMap.Tile}
         */
        createTile: function(node, color, opt_blink) {
            var tile = new kariShoot.manage.MiniMap.Tile(node.width * kariShoot.manage.MiniMap.RATIO,
                node.height * kariShoot.manage.MiniMap.RATIO, opt_blink);
            tile.backgroundColor = color;
            tile.x = node.x * kariShoot.manage.MiniMap.RATIO;
            tile.y = node.y * kariShoot.manage.MiniMap.RATIO;
            this.addChild(tile);
            return tile;
        }
    });

    /**
     * 全体ステージに対するマップの拡大率
     * @const {number}
     */
    kariShoot.manage.MiniMap.RATIO = 0.1;


    /**
     * ミニマップを構成するタイル
     */
    kariShoot.manage.MiniMap.Tile = Class.create(Sprite, {
        initialize: function(w, h, opt_blink) {
            Sprite.call(this, w, h);

            /**
             * 点滅させるか
             * @type {boolean}
             * @private
             */
            this.blink_ = !!opt_blink;
        },

        onenterframe: function() {
            //点滅
            if (this.blink_) {
                if (this.opacity == 1) {
                    this.tl.fadeOut(10);
                } else if (this.opacity == 0) {
                    this.tl.fadeIn(10);
                }
            }
        },

        /**
         * nodeの位置とミニマップ上での位置を同期する
         * @param {Node} node
         */
        reposition: function(node) {
            this.x = node.x * kariShoot.manage.MiniMap.RATIO;
            this.y = node.y * kariShoot.manage.MiniMap.RATIO;
        }
    });
});