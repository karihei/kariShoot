define([], function() {
    kariShoot.manage.Message = function() {

        /**
         * @type {Array.<string>}
         * @private
         */
        this.messages_ = [];

        /**
         * @type {jQuery}
         * @private
         */
        this.box_ = $('#message-window');

        this.init_();
    };

    /**
     * @private
     */
    kariShoot.manage.Message.prototype.init_ = function() {
        kariShoot.socket.emit('listmessage', {'size': 10});

        kariShoot.socket.on('listmessage result', $.proxy(function(data) {
            $.each(data, $.proxy(function(index, msg) {
                this.addMsg_(msg.body);
            }, this));
        }, this));
    };

    /**
     * プレイヤーのみに表示するメッセージを追加
     * @param {string} msg
     */
    kariShoot.manage.Message.prototype.sendLocalMsg = function(msg) {

    };

    /**
     * 全ユーザに向けてのメッセージを追加
     * @param {string} msg
     */
    kariShoot.manage.Message.prototype.sendGrobalMsg = function(msg) {
        kariShoot.socket.emit('sendmessage', {'value': msg});
    };

    /**
     * @param {string} msg
     * @private
     */
    kariShoot.manage.Message.prototype.addMsg_ = function(msg) {
        var el = $('<div/>').text(msg);
        this.box_.prepend(el);
    };

    /**
     * singleton
     * @type {kariShoot.manage.Message}
     * @private
     */
    kariShoot.manage.Message.instance_ = new kariShoot.manage.Message();

    /**
     * @const
     * @return {kariShoot.manage.Message}
     */
    kariShoot.manage.Message.getInstance = function() {
        return kariShoot.manage.Message.instance_;
    };
});