define(['entity/entity'], function() {
    var IMAGE_PATH = '../../img/entity/player.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Player = Class.create(kariShoot.Entity, {
        initialize: function() {
            var status = {
                hp: 30000,
                deffence: 1
            };
            kariShoot.Entity.call(this, 32, 64, status, IMAGE_PATH);

            /**
             * 自弾
             * @type {kariShoot.Bullet}
             */
            this.bullet_;

            /**
             * スタミナ的なパラメータの最大値
             * @type {number}
             */
            this.maxSp = 1000;

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

            this.addEventListener('enterframe', this.handleEnterframe_);
            core.rootScene.addEventListener('touchend', $.proxy(this.handleTouchEnd, this));
        },

        handleEnterframe_: function() {
            if (this.acount++ > (core.fps / 20)) {
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
                this.x += 1;
                this.sp -= 10;
                this.isHeal_ = false;
            }
            if (core.input.left && this.sp > 0) {
                this.x -= 1;
                this.sp -= 10;
                this.isHeal_ = false;
            }

            this.showStatus();
        },

        handleTouchEnd: function(e) {
            if (this.bullet_) {
                this.bullet_.destroy();
                this.bullet_ = null;
            }
            this.bullet_ = new kariShoot.Bullet();
            this.bullet_.position = {x: this.centerX + 30 , y: this.centerY - 10};
            core.rootScene.mainStage.addChild(this.bullet_);
            this.drawGideLine(e);
            this.bullet_.shot(e.localX, e.localY, this);
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
            context.moveTo(this.centerX, this.centerY);
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
