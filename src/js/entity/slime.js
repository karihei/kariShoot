define(['entity/enemy'], function() {
    var IMAGE_PATH = 'img/entity/slime.png';
    core.preload(IMAGE_PATH);

    kariShoot.Entity.Slime = Class.create(kariShoot.Entity.Enemy, {
        initialize: function() {
            var status = {
                hp: 3000,
                deffence: 10
            };
            kariShoot.Entity.Enemy.call(this, 48, 48, status, IMAGE_PATH);
            this.name = 'スライム';
            this.agi = 2;
            this.animWait = 5;
        },

        /**
         * @override
         */
        action: function() {
            kariShoot.Entity.prototype.action.call(this);
            this.nothingToDo();
            kariShoot.manage.Turn.getInstance().end();
        }
    });
});
