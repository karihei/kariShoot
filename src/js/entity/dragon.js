define(['entity/enemy'], function() {
    var IMAGE_PATH = '../../img/entity/dragon.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Dragon = Class.create(kariShoot.Entity.Enemy, {
        initialize: function() {
            var status = {
                hp: 3000,
                deffence: 10
            };
            kariShoot.Entity.Enemy.call(this, 128, 128, status, IMAGE_PATH);
            this.account = 0;
            this.addEventListener('enterframe', this.handleEnterframe_);
        },

        handleEnterframe_: function() {
            if (this.account++ > (core.fps / 9)) {
                this.frame = this.frameCount++;
                this.account = 0;
            }
        }
    });
});
