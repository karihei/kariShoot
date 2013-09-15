define([], function() {
    kariShoot.util.canvas = function() {};

    /**
     * 吹き出しっぽいのをつくる
     * @param {number} w
     * @param {number} h
     * @param {string} text
     * @return {Group}
     */
    kariShoot.util.canvas.makeBalloon = function(w, h, text) {
        var group = new Group();
        var balloon = new Sprite(w, h)
        var surface = new Surface(w, h);
        var context = surface.context;

        var label = new Label(text);
        label.font = '8px famania';
        label.x = 10;
        label.y = 7;

        context.shadowBlur = 2.0;
        context.shadowOffsetX = 1.0;
        context.shadowOffsetY = 1.0;
        context.shadowColor = 'rgba(0, 0, 0, 0.6)';
        context.fillStyle = '#FFF';
        context.clearRect(0, 0, w, h);
        context.beginPath();
        roundRect(context, 0, 0, w-10, h-5, 12);
        context.moveTo(w-15, 7);
        context.lineTo(w-15, 20);
        context.lineTo(w, h/2);
        context.closePath();
        context.fill();
        balloon.image = surface;

        group.addChild(balloon);
        group.addChild(label);

        function roundRect(context, x, y, w, h, r) {
            context.moveTo(x, y + r);
            context.lineTo(x, y + h - r);
            context.quadraticCurveTo(x, y + h, x + r, y + h);
            context.lineTo(x + w - r, y + h);
            context.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
            context.lineTo(x + w, y + r);
            context.quadraticCurveTo(x + w, y, x + w - r, y);
            context.lineTo(x + r, y);
            context.quadraticCurveTo(x, y, x, y + r);
        }

        return group;
    }
});