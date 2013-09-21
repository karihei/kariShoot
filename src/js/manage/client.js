define([], function() {

    /**
     * サーバとの通信役
     */
    kariShoot.manage.Client = function() {

        /**
         * 射幸心ポイント
         * @type {number}
         * @private
         */
        this.skp_ = 0;

        setInterval($.proxy(this.polling_, this), 1000);
    };

    /**
     * 各種ポイントで0以外のものがあればそれをサーバに送信する
     * @private
     */
    kariShoot.manage.Client.prototype.polling_ = function() {
        if (this.skp_ != 0) {
            this.sendSkp_();
        }
    };

    /**
     * 射幸心ポイントを加算する
     * @param {number} skp
     */
    kariShoot.manage.Client.prototype.addSkp = function(skp) {
        this.skp_ += skp;
    };

    /**
     * 射幸心ポイントをサーバに送信する
     * @private
     */
    kariShoot.manage.Client.prototype.sendSkp_ = function() {
        kariShoot.socket.emit('addskp', {'id': kariShoot.LOGIN_USER.id, 'value': this.skp_});
        this.skp_ = 0;
    };

    /**
     * singleton
     * @type {kariShoot.manage.Client}
     * @private
     */
    kariShoot.manage.Client.instance_ = new kariShoot.manage.Client();

    /**
     * @const
     * @return {kariShoot.manage.Client}
     */
    kariShoot.manage.Client.getInstance = function() {
        return kariShoot.manage.Client.instance_;
    };
});