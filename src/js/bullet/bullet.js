define([], function() {
    var IMAGE_PATH = '../../img/bullet.png';
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
            this.multipleAtk = 2; // 最大多段ヒット数

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
            this.attack = 1;

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
            this.addEventListener('enterframe', $.proxy(this.handleEnterframe, this));
        },

        /**
         * 発射する時はこれを呼ぶ
         */
        shot: function(x, y, shooter) {
            this.vX = x;
            this.vY = y;
            this.isShot_ = true;
            this.shooter = shooter;
        },

        isMove: function() {
            return this.isMove_;
        },

        handleMove: function() {
            this.contact($.proxy(function() {
                this.movingFrame_ = 0;
                if (this.destroyCount_ < 0) {
                    this.destroyCount_ = this.multipleAtk;
                }
            }, this));

            // 弾に合わせて画面をスクロール

            var x = Math.min((core.width / 2 - this.width) - this.x, 0);
            core.rootScene.mainStage.x = x;
            core.rootScene.mainStage.y = -1 * Math.min(this.y , 0);
        },


        handleEnterframe: function(e) {
            if (this.velocity.x < 5 && this.velocity.y < 5) {
                this.isMove_ = false;
            }

            if (this.isMove_) {
                this.handleMove();
            }

            if (this.isShot_ && !this.isMove_) {
                this.applyImpulse(this.calcVector(this.vX, this.vY, this.centerX, this.centerY));
                this.isShot_ = false;
                this.isMove_ = true;
            }

            this.contact($.proxy(function(sprite) {
                if (sprite instanceof kariShoot.Entity && sprite !== this.shooter) {
                    sprite.hit(this);
                }
            }, this));

            if (this.x < -1 * this.width || this.x > WORLD_WIDTH + this.width) {
                this.destroy()
            }

            if (this.destroyCount_ > 0) {
                this.destroyCount_--;
                if (this.destroyCount_ == 0) {
                    this.destroyEffect();
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

        destroyEffect: function() {
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
            //surface.context.arc(5, 5, 5, 0, Math.PI*2, false);
            surface.context.fillStyle = 'rgba(252, 0, 0, 0.2)';
            surface.context.fillRect(0,0,5,5);


            dot.image = surface;
            dot.x = this.centerX;
            dot.y = this.centerY;
            core.rootScene.mainStage.addChild(dot);
        }
    });
});
