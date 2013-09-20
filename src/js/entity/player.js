define(['entity/entity'], function() {
    var IMAGE_PATH = 'img/entity/player.png';
    var WAITING_IMAGE_PATH = 'img/waitingforshot.png';
    core.preload([IMAGE_PATH, WAITING_IMAGE_PATH]);

    /**
     * 自機クラス
     * SPが100％の時に行動できる「SP制」で行動する
     * @constructor
     */
    kariShoot.Entity.Player = Class.create(kariShoot.Entity, {
        initialize: function() {
            var status = {
                hp: kariShoot.LOGIN_USER.hp,
                deffence: kariShoot.LOGIN_USER.def
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

            this.spcount = 0;

            /**
             * 自然回復中ならtrue
             * @type {boolean}
             * @private
             */
            this.isHeal_ = false;
            this.animWait = 7;

            /**
             * SP回復中に表示されるリング
             * @type {Sprite}
             * @private
             */
            this.waitingRing_;

            core.rootScene.addEventListener('touchend', $.proxy(this.handleTouchEnd, this));
        },

        onenterframe: function() {
            kariShoot.Entity.prototype.onenterframe.call(this);

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
                    this.sp += 20;
                }
            }

            if (this.sp < this.maxSp) {
                this.waitingForShot_();
            } else {
                this.readyToShot_();
            }

            if (core.input.right && this.sp > 0) {
                this.x += 3;
                this.sp -= 10;
                this.isHeal_ = false;
                if (this.scaleX < 0) {
                    this.scaleX *= -1;
                }
            }

            if (core.input.left && this.sp > 0) {
                this.x -= 3;
                this.sp -= 10;
                this.isHeal_ = false;
                if (this.scaleX > 0) {
                    this.scaleX *= -1;
                }
            }

            this.showStatus();
        },

        handleTouchEnd: function(e) {
            if (this.sp < this.maxSp) {
                return;
            } else {
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
            }
        },

        shot: function(x, y, needScroll) {
            var bullet = new kariShoot.Bullet();
            bullet.position = {x: this.centerX + 30 , y: this.centerY - 10};
            bullet.lineDraw = true;
            core.rootScene.mainStage.addChild(bullet);
            bullet.shot(x, y, this, needScroll);
            this.bullets_.push(bullet);
            this.sp -= bullet.sp;
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
        },

        /**
         * 息切れ中に表示されるリングを作る
         * @private
         */
        createWaitingRing_: function() {
            var ring = new Sprite(128, 128);
            ring.image = core.assets[WAITING_IMAGE_PATH];
            ring.opacity = 0;
            ring.tl.clear().fadeTo(0.7, 20).and().rotateBy(180, 100).rotateBy(180, 100).loop();

            var reposition = $.proxy(function() {
                ring.x = this.x - 50;
                ring.y = this.y - 30;
            }, this);
            reposition();
            ring.addEventListener('enterframe', reposition);

            return ring;
        },

        /**
         * SPが足りない時とかに息切れしちゃう
         * @private
         */
        waitingForShot_: function() {
            if (!this.waitingRing_) {
                this.waitingRing_ = this.createWaitingRing_();
                core.rootScene.mainStage.addChild(this.waitingRing_);
            }
        },

        /**
         * SPが100％になったらこれを呼ぶ
         * @private
         */
        readyToShot_: function() {
            if (this.waitingRing_) {
                this.waitingRing_.tl.clear().fadeOut(10).removeFromScene();
                this.waitingRing_ = null;

                var ok = new Label('じゅんびOK');
                ok.color = 'red';
                ok.font = '12px famania';
                ok.x = this.centerX - 40;
                ok.y = this.centerY - 40;
                ok.tl.moveTo(ok.x, ok.y - 20, 20).and().delay(30).fadeOut(10).removeFromScene();
                core.rootScene.mainStage.addChild(ok);
            }
        }
    });
});
