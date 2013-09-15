define(['entity/entity'], function() {
    var IMAGE_PATH = 'img/entity/player.png';
    core.preload(IMAGE_PATH);

    /**
     * 自機クラス
     * SPが100％の時に行動できる「SP制」で行動する
     * @constructor
     */
    kariShoot.Entity.Player = Class.create(kariShoot.Entity, {
        initialize: function() {
            var status = {
                hp: 30000,
                deffence: 1
            };
            kariShoot.Entity.call(this, 32, 64, status, IMAGE_PATH);

            this.name = 'プレイヤー';

            /**
             * 自弾グループ
             * @type {Array.<kariShoot.Bullet>}
             */
            this.bullets_ = [];

            /**
             * スタミナ的なパラメータの最大値
             * @type {number}
             */
            this.maxSp = 1000;

            this.agi = 10;

            /**
             * スタミナ的なパラメータ
             * @type {number}
             */
            this.sp = this.maxSp;

            /**
             * 前フレームのHP
             * @type {number}
             * @private
             */
            this.prevHp_ = this.maxHp;
            this.prevSp_ = this.maxSp;

            this.acount = 0;
            this.spcount = 0;

            /**
             * 自然回復中ならtrue
             * @type {boolean}
             * @private
             */
            this.isHeal_ = false;

            core.rootScene.addEventListener('touchend', $.proxy(this.handleTouchEnd, this));
        },

        onenterframe: function() {
            kariShoot.Entity.prototype.onenterframe.call(this);
            // フレームアニメーション設定
            if (this.acount++ > (core.fps / 7)) {
                this.frame = this.frameCount++;
                this.acount = 0;
            }

            // 何もせずに3秒待てばSPが回復する的な
            if (!this.isHeal_ && (this.prevSp_ == this.sp) && (this.spcount++ > core.fps * 3)) {
                this.spcount = 0;
                this.isHeal_ = true;
            }

            if (this.isHeal_) {
                if (this.sp > this.maxSp) {
                    this.sp = this.maxSp;
                    this.isHeal_ = false;
                } else {
                    this.sp += 10;
                }
            }

            if (core.input.right && this.sp > 0) {
                this.x += 10;
                this.sp -= 10;
                this.isHeal_ = false;
                if (this.scaleX < 0) {
                    this.scaleX *= -1;
                }
            }

            if (core.input.left && this.sp > 0) {
                this.x -= 1;
                this.sp -= 10;
                this.isHeal_ = false;
                if (this.scaleX > 0) {
                    this.scaleX *= -1;
                }
            }

            this.showStatus();
        },

        handleTouchEnd: function(e) {
            if (this.bullets_.length > 0) {
                $.each(this.bullets_, function(index, bullet) {
                    core.rootScene.mainStage.removeChild(bullet.getLineGroup());
                    bullet.destroy();
                });
                this.bullets_ = [];
            }
            this.drawGideLine(e);

            setTimeout($.proxy(function() {this.shot(e.localX, e.localY+10, true);}, this), 0);
            setTimeout($.proxy(function() {this.shot(e.localX, e.localY);}, this), 300);
            setTimeout($.proxy(function() {this.shot(e.localX, e.localY-10);}, this), 600);

        },

        shot: function(x, y, needScroll) {
            var bullet = new kariShoot.Bullet();
            bullet.position = {x: this.centerX + 30 , y: this.centerY - 10};
            bullet.lineDraw = true;
            core.rootScene.mainStage.addChild(bullet);

            bullet.shot(x, y, this, needScroll);
            this.bullets_.push(bullet);
            bullet.addEventListener('scrollend', $.proxy(function() {
                setTimeout($.proxy(function() {
                    kariShoot.manage.Turn.getInstance().scrollTo(this);
                }, this), 1000);
            }, this));
        },

        /**
         * ガイドラインを引く
         */
        drawGideLine: function(e) {
            this.line && core.rootScene.removeChild(this.line);
            this.line = new Sprite(STAGE_WIDTH, STAGE_HEIGHT);
            var surface = new Surface(STAGE_WIDTH, STAGE_HEIGHT);
            var context = surface.context;
            this.line.image = surface;

            context.strokeStyle = 'rgb(255, 0, 0)';
            context.beginPath();
            context.moveTo(this.centerX + 30, this.centerY - 10);
            context.lineTo(e.localX, e.localY);

            context.closePath();
            context.stroke();
            core.rootScene.addChild(this.line);
            this.line.tl.fadeIn(5).fadeOut(20).removeFromScene();
        },


        /**
         * 画面上にステータスを表示する
         */
        showStatus: function() {
            // HPに変動があったらHPバーを増減させる
            if (this.hp != this.prevHp_) {
                var hpBar = $('#hp-bar-value');
                var hpWidth = $('#hp-bar').width();
                var hpRatio = this.hp / this.maxHp;
                hpBar.width(hpWidth * hpRatio);
                this.prevHp_ = this.hp;
            }

            // SPに変動があったらSPバーを増減させる
            if (this.sp != this.prevSp_) {
                var spBar = $('#sp-bar-value');
                var spWidth = $('#sp-bar').width();
                var spRatio = this.sp / this.maxSp;
                spBar.width(spWidth * spRatio);
                this.prevSp_ = this.sp;
            }

        }
    });
});
