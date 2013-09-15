define([], function() {
    var IMAGE_PATH = 'img/bullet.png';
    core.preload(IMAGE_PATH);
    /**
     * 弾の基底クラス
     * @constructor
     */
    kariShoot.Bullet = Class.create(PhyCircleSprite, {
        initialize: function() {
            PhyCircleSprite.call(this, GRID_SIZE/2, enchant.box2d.DYNAMIC_SPRITE, 0.9, 1.0, 0, true);
            // 自弾設定
            this.image = core.assets[IMAGE_PATH];
            this.frame = 1;
            this.speed = 1;
            this.direction = 0;
            this.multipleAtk = 5; // 最大多段ヒット数

            /**
             * 発射済みか
             * @type {boolean}
             * @private
             */
           this.isShot_ = false

            /**
             * 弾が動いているか
             * @type {Boolean}
             * @private
             */
            this.isMove_ = false;

            /**
             * moveしてからの経過フレーム数
             * @type {number}
             * @private
             */
            this.movingFrame_ = 0;

            /**
             * 攻撃力 ( ダメージ計算 = 弾の速さ * attack )
             * @type {number}
             */
            this.attack = 20;

            /**
             * 弾を飛ばす方向
             * @type {number}
             */
            this.vX = 0;
            this.vY = 0;

            /**
             * 弾からクリック位置までの線
             * @type {Sprite}
             */
            this.line;

            /**
             * 弾を撃った人
             * @type {kariShoot.Entity}
             */
            this.shooter;

            /**
             * 衝突してから弾が消えるまでのフレーム数カウントダウン
             * @type {number}
             * @private
             */
            this.destroyCount_ = -1;

            /**
             * 弾を中心にスクロールするか
             * @type {Boolean}
             */
            this.needScroll = false;

            /**
             * 軌跡のドット集合
             * @type {Group}
             */
            this.lineGroup = new Group();
            core.rootScene.mainStage.addChild(this.lineGroup);
        },

        /**
         * 発射する時はこれを呼ぶ
         * @param {number} x
         * @param {number} y
         * @param {Sprite} shooter 撃った人
         * @param {boolean=} opt_needScroll
         */
        shot: function(x, y, shooter, opt_needScroll) {
            this.vX = x;
            this.vY = y;
            this.isShot_ = true;
            this.shooter = shooter;
            this.needScroll = !!opt_needScroll;
        },

        isMove: function() {
            return this.isMove_;
        },

        getLineGroup: function() {
            return this.lineGroup;
        },

        handleMove: function() {
            this.contact($.proxy(function(sprite) {
                if (sprite !== this.shooter) {
                    this.movingFrame_ = 0;
                    if (this.destroyCount_ < 0) {
                        // 多段ヒット回数分contactしたら弾を消す
                        this.destroyCount_ = this.multipleAtk;
                    }
                }
            }, this));

            // 弾に合わせて画面をスクロール
            // IIWAKE: 弾クラスが画面スクロールを管理するのは微妙
            if (this.needScroll) {
                var x = Math.min((core.width / 2 - this.width) - this.x, 0);
                core.rootScene.mainStage.x = x;
                core.rootScene.mainStage.y = -1 * Math.min(this.y , 0);
            }
        },

        /**
         * 球の軌道を決める。
         * 継承クラスはこれを実装する
         */
        handleShot: function(shooter) {
            this.applyImpulse(this.calcVector(this.vX, this.vY, this.centerX, this.centerY));
        },

        onenterframe: function(e) {
            if (this.velocity.x < 1 && this.velocity.y < 1) {
                this.isMove_ = false;
            }

            if (this.isMove_) {
                this.handleMove();
            }

            if (this.isShot_ && !this.isMove_) {
                this.handleShot(this.shooter);
                this.isShot_ = false;
                this.isMove_ = true;
            }

            this.contact($.proxy(function(sprite) {
                if (sprite instanceof kariShoot.Entity && sprite !== this.shooter) {
                    sprite.hit(this);
                }
            }, this));

            if (this.x < -1 * this.width || this.x > WORLD_WIDTH + this.width) {
                this.handleDestroy()
            }

            if (this.destroyCount_ > 0) {
                this.destroyCount_--;
                if (this.destroyCount_ == 0) {
                    this.handleDestroy();
                }
            }

            if (this.movingFrame_++ % 3 == 0) {
                this.drawLine_();
            }
        },

        /**
         * 飛び過ぎないように弾速に制限をかけてベクトルを返す
         * @return {b2Vec2}
         * @private
         */
        calcVector: function(touchX, touchY, bulletX, bulletY) {
            var maxX = 150;
            var maxY = 75;
            var fy = function(x) {
                var y = (bulletY - touchY) / (touchX - bulletX) * x;
                return y;
            }

            var fx = function(y) {
                var x = y / ((bulletY - touchY) / (touchX - bulletX));
                return x;
            }

            var vX = ( touchX - bulletX );
            var vY = ( bulletY - touchY );
            if (vX > maxX) {
                vX = maxX;
                vY = fy(vX);
            } else if (vY > maxY) {
                vY = maxY;
                vX = fx(vY);
            }
            var shotXv = vX * 0.03;
            var shotYv = vY * -0.03;
            return new b2Vec2(shotXv, shotYv);
        },

        handleDestroy: function() {
            if (this.needScroll) {
                var evt = new enchant.Event('scrollend');
                this.dispatchEvent(evt);
            }
            this.destroy();
        },

        /**
         * 軌跡を描く
         * @private
         */
        drawLine_: function() {
            var dot = new Sprite(5, 5);
            var surface = new Surface(5, 5);
            surface.context.beginPath();
            surface.context.fillStyle = 'rgba(252, 0, 0, 0.2)';
            surface.context.fillRect(0,0,5,5);


            dot.image = surface;
            dot.x = this.centerX;
            dot.y = this.centerY;
            this.lineGroup.addChild(dot);
        }
    });
});
