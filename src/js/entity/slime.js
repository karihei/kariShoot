define(['entity/enemy'], function() {
    var IMAGE_PATH = 'img/entity/slime.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Slime = Class.create(kariShoot.Entity, {
        initialize: function() {
            var status = {
                hp: 3000,
                deffence: 10
            };
            kariShoot.Entity.call(this, 48, 48, status, IMAGE_PATH);
            this.account = 0;
            this.name = 'スライム';
            this.addEventListener('enterframe', this.handleEnterframe_);
        },

        handleEnterframe_: function() {
            if (this.account++ > (core.fps / 20)) {
                this.frame = this.frameCount++;
                this.account = 0;
            }
        },

        /**
         * @override
         */
        action: function() {
            kariShoot.Entity.prototype.action.call(this);
            this.nothingToDo();
            setTimeout($.proxy(function() {
                kariShoot.manage.Turn.getInstance().end();
            }, this), 1000);
        }
    });
});
