define(['entity/enemy'], function() {
    var IMAGE_PATH = 'img/entity/dragon.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Dragon = Class.create(kariShoot.Entity.Enemy, {
        initialize: function() {
            var status = {
                hp: 3000,
                deffence: 10
            };
            kariShoot.Entity.Enemy.call(this, 128, 128, status, IMAGE_PATH);
            this.account = 0;
            this.name = 'ドラゴン';
            this.agi = 1;
        },

        onenterframe: function() {
            kariShoot.Entity.Enemy.prototype.onenterframe.call(this);
            if (this.account++ > (core.fps / 9)) {
                this.frame = this.frameCount++;
                this.account = 0;
            }
        },

        /**
         * @override
         */
        action: function() {
            kariShoot.Entity.prototype.action.call(this);

            this.selectAction_();
            kariShoot.manage.Turn.getInstance().end();
        },

        selectAction_: function() {
            var p = Math.floor(Math.random() * 100);
            if (p > 50) {
                this.attack(core.rootScene.player);
                this.status.showBalloon('かえんだま')
            } else {
                this.nothingToDo();
            }
        }
    });
});
