define(['structure/itembase'], function() {
    var IMAGE_PATH = 'img/skp.png';
    core.preload(IMAGE_PATH);
    kariShoot.structure.SkpCoin = Class.create(kariShoot.structure.ItemBase, {
        initialize: function(w) {
            kariShoot.structure.ItemBase.call(this, w);
            this.image = core.assets[IMAGE_PATH];
        },

        onenterframe: function() {
            if (core.frame % 5 == 0) {
                this.frame++;
            }
        }
    });


});