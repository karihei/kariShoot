define([], function() {
    var IMAGE_PATH = 'img/entity/slime.png';
    var HIT_EFFECT_PATH = 'img/hiteffect.png';
    core.preload([IMAGE_PATH, HIT_EFFECT_PATH]);
    /**
     * キャラクラス
     * @param {number} width
     * @param {number} height
     * @param {kariShoot.Entity.Status=} opt_status
     * @param {string=} opt_imagePath
     * @constructor
     */
    kariShoot.Entity = Class.create(PhyBoxSprite, {
        initialize: function(width, height, opt_status, opt_imagePath) {
            PhyBoxSprite.call(this, width, height, enchant.box2d.DYNAMIC_SPRITE, 1.0, 1, 0.6, true);
            var imagePath = opt_imagePath || IMAGE_PATH;
            this.image = core.assets[imagePath];

            /**
             * 名前
             * @type {String}
             */
            this.name = 'Entity';

            /**
             * レベル
             * @type {number}
             */
            this.level = 1;

            /**
             * 最大体力
             * @type {number}
             */
            this.maxHp = opt_status ? opt_status.hp : 2000;

            /**
             * 残り体力
             * @type {number}
             */
            this.hp = this.maxHp;

            /**
             * 攻撃力
             * @type {number}
             */
            this.atk = 1;

            /**
             * 防御力 ( ダメージ = 弾の速さ * 弾の攻撃力 / deffence )
             * @type {number}
             */
            this.deffence = opt_status ? opt_status.deffence : 1;

            /**
             * すばやさ
             * 大きいほどターン順が早く回ってくる
             * @type {number}
             */
            this.agi = 1;

            /**
             * フレームアニメーションのウェイト。大きいほどゆっくりになる
             * @type {number}
             */
            this.animWait = 5;

            /**
             * HPバーの枠
             * @type {Sprite}
             * @private
             */
            this.hpBarOuter_;


            /**
             * HPバーの可変部分
             * @type {Sprite}
             * @private
             */
            this.hpBarInner_;

            /**
             * ダメージカウンタのY位置
             * @type {number}
             * @private
             */
            this.damegeLabelY_ = 0;

            /**
             * ダメージ総数
             * @type {number}
             * @private
             */
            this.totalDamage_ = 0;

            /**
             * ダメージ総数ラベル
             * @type {Label}
             * @private
             */
            this.totalDamaleLabel_;

            /**
             * アニメーションのフレーム番号
             * @type {number}
             */
            this.frameCount = 0;

            /**
             * ミニマップに表示するタイル
             * @type {kariShoot.manage.MiniMap.Tile}
             * @private
             */
            this.miniMapTile_ = null;
        },

        onenterframe: function() {
            if (this.hp <= 0) {
                this.handleDestroy_();
            }
            if (this.miniMapTile_) {
                this.miniMapTile_.reposition(this);
            }

            if (core.frame % this.animWait == 0) {
                this.frame++;
            }
        },

        /**
         * 何かが衝突した時
         * @param {Sprite} entity
         */
        hit: function(entity) {
            var velocity = entity.velocity;
            //  ダメージ計算 = 弾の速さ * 弾の攻撃力 / 敵の防御力
            var damage = Math.ceil((Math.abs(velocity.x) + Math.abs(velocity.y) * entity.attack ) / this.deffence);

            if (damage > 0) {
                var label = new Label(damage);
                var labelX = this.position.x;
                this.damageLabelY_ = this.damageLabelY_ ? this.damageLabelY_ - 16 : this.position.y - this.height;
                label.moveTo(labelX, this.damageLabelY_);
                label.color = 'red';
                label.font = '8px famania';
                core.rootScene.mainStage.addChild(label);
                label.tl.moveTo(labelX, this.damageLabelY_ - 10, 10).fadeOut(30).then($.proxy(function() {
                    this.damageLabelY_ = this.position.y - this.height;
                    core.rootScene.mainStage.removeChild(label);
                }, this));

                this.hp = this.hp - damage > 0 ? this.hp - damage : 0;
                this.totalDamage_ += damage;
                this.totalDamageLabel_ && core.rootScene.mainStage.removeChild(this.totalDamageLabel_);
                this.totalDamageLabel_ = new Label('Total: ' + this.totalDamage_ + ' Damage!');
                this.totalDamageLabel_.moveTo(labelX + 20, this.position.y-100);
                this.totalDamageLabel_.font = '14px famania'
                this.totalDamageLabel_.color = 'black';
                core.rootScene.mainStage.addChild(this.totalDamageLabel_);
                this.totalDamageLabel_.tl.fadeIn(10).delay(10).fadeOut(10).then($.proxy(this.handleTotalDamage_, this, entity));

                this.showHpBar_();

                if (core.frame % 3 == 0) {
                    this.hitEffect_(entity);
                }
            }
        },

        /**
         * 連続ヒットダメージが落ち着いた頃に実行される
         * @param {Sprite} entity
         * @private
         */
        handleTotalDamage_: function(entity) {
            var msg = entity.shooter.name + ' Lv' + entity.shooter.level + ' が ' +
                this.name + ' Lv' + this.level +' に ' +
                this.totalDamage_ + ' ポイントのダメージを与えた！';
            kariShoot.manage.Message.getInstance().sendGrobalMsg(msg);
            this.totalDamage_ = 0;
        },

        /**
         * @param {Sprite} tile
         */
        setMiniMapTile: function(tile) {
            this.miniMapTile_ = tile;
        },

        /**
         * ターンが回ってきた時の行動を書く
         * @protected
         */
        action: function() {
            console.log(this.name + 'のターン');
        },

        /**
         * HPバーを表示
         * @private
         */
        showHpBar_: function() {
            var hpRatio = this.hp / this.maxHp;
            var barWidth = 100;
            var barHeight = 10;
            var borderSize = 1;
            var innerWidth = hpRatio > 0 ? barWidth * hpRatio - (borderSize * 2) : 0;
            var innerHeight = hpRatio > 0 ? barHeight - (borderSize * 2) : 0;

            if (this.hpBarOuter_) {
                core.rootScene.mainStage.removeChild(this.hpBarOuter_);
                delete this.hpBarOuter_;
            }
            if (this.hpBarInner_) {
                core.rootScene.mainStage.removeChild(this.hpBarInner_);
                delete this.hpBarInner_;
            }

            // HPバーの外側の描写
            this.hpBarOuter_ = new Sprite(barWidth, barHeight);
            var surfaceOuter = new Surface(barWidth, barHeight);
            var contextOuter = surfaceOuter.context;
            this.hpBarOuter_.image = surfaceOuter;
            contextOuter.strokeStyle = 'rgb(0, 0, 0)';
            contextOuter.beginPath();
            contextOuter.strokeRect(0, 0, barWidth, barHeight);

            // HPバーの可変部分の描写
            this.hpBarInner_ = new Sprite(barWidth, barHeight);
            var surfaceInner = new Surface(barWidth, barHeight);
            var contextInner = surfaceInner.context;
            this.hpBarInner_.image = surfaceInner;
            contextInner.fillStyle = 'rgb(255, 0, 0)';
            contextInner.beginPath();
            contextInner.fillRect(borderSize, borderSize, innerWidth, innerHeight);

            this.hpBarOuter_.x = this.x - 100;
            this.hpBarOuter_.y = this.centerY;
            this.hpBarInner_.x = this.x - 100;
            this.hpBarInner_.y = this.centerY;

            core.rootScene.mainStage.addChild(this.hpBarOuter_);
            core.rootScene.mainStage.addChild(this.hpBarInner_);
            this.hpBarOuter_.tl.fadeIn(5).delay(50).fadeOut(30);
            this.hpBarInner_.tl.fadeIn(5).delay(50).fadeOut(30);
        },

        /**
         * ヒット時のエフェクト
         * @param {Sprite} entity
         * @private
         */
        hitEffect_: function(entity) {
            var effect = new Sprite(16, 16);
            var frameCount = 0;
            effect.image = core.assets[HIT_EFFECT_PATH];
            effect.x = this.centerX - (this.centerX - entity.centerX);
            effect.y = this.centerY - (this.centerY - entity.centerY);

            effect.addEventListener('enterframe', function() {
                if (Math.floor(core.getTime()) % 3 == 0) {
                    this.frame = frameCount++;
                }
                if (frameCount > 4) {
                    core.rootScene.mainStage.removeChild(this);
                }
            });
            core.rootScene.mainStage.addChild(effect);
        },

        handleDestroy_: function() {
            core.rootScene.status.removeItem(this);
            kariShoot.manage.Turn.getInstance().removeEntity(this);
            this.tl.fadeOut(30).then($.proxy(function() {
                core.rootScene.mainStage.removeChild(this);
                this.destroy();
            }, this));
            this.miniMapTile_.remove();
        }
    });

    /**
     * @typedef{{
     *     hp: number,      // 最大HP
     *     deffence: number // 防御力 min=1, max=100
     * }}
     */
    kariShoot.Entity.Status;
});
