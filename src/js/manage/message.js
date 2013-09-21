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
                this.addMsg_(msg);
            }, this));
        }, this));

        setInterval($.proxy(this.updateRelativeTime_, this), 5000);
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
     * @param {Object} msgData
     * @private
     */
    kariShoot.manage.Message.prototype.addMsg_ = function(msgData) {
        var el = $('<div/>');
        var time = $('<span/>').addClass('msg-time').attr('time', msgData.created);
        var body = $('<span/>').addClass('msg-body').text(msgData.body);
        el.append(time);
        el.append(body);
        this.box_.prepend(el);

        this.updateRelativeTime_();
    };

    /**
     * 全メッセージの相対時間を現在時刻に合わせる
     * @param {Date} now
     * @private
     */
    kariShoot.manage.Message.prototype.updateRelativeTime_ = function() {
        var now = new Date();
        $('.msg-time', this.box_).each($.proxy(function(index, el) {
            var time = parseInt($(el).attr('time'), 10);
            $(el).text(this.getRelativeTime_(now, new Date(time)));
        },this));
    };

    /**
     * 相対時間を返す 参考: http://qiita.com/rev84/items/2a14a804857de27e9c44
     * @param {Date} from Date(ここに指定できるやつ)
     * @param {Date} to Date(ここに指定できるやつ)
     * @return {string}
     * @private
     */
    kariShoot.manage.Message.prototype.getRelativeTime_ = function(from, to) {
        var baseDate = from;
        var targetDate = to;

        var elapsedTime = Math.ceil((baseDate.getTime() - targetDate.getTime())/1000);
        var message = null;

        if (elapsedTime < 5) { //  5 秒未満
            message =  'たった今';
        } else if (elapsedTime < 10) { // 10秒未満
            message =  '約5秒前';
        } else if (elapsedTime < 20) {
            message =  '約10秒前';
        } else if (elapsedTime < 30) {
            message =  '約20秒前';
        } else if (elapsedTime < 40) {
            message =  '約30秒前';
        } else if (elapsedTime < 120) { //  2 分未満
            message =  '約1分前';
        } else if (elapsedTime < (60*60)) { //  1 時間未満
            message =  '約' + Math.floor(elapsedTime / 60) + '分前';
        } else if (elapsedTime < (120*60)) { //  2 時間未満
            message =  '約1時間前';
        } else if (elapsedTime < (24*60*60)) { //  1 日未満
            message =  '約' + Math.floor(elapsedTime / 3600) + '時間前';
        } else if (elapsedTime < (7*24*60*60)) { // 1 週間未満
            message =  '約' + Math.floor(elapsedTime / 86400) + '日前';
        } else { // 1 週間以上
            message =  '約' + Math.floor(elapsedTime / 604800) + '週間前';
        }

        return message;
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