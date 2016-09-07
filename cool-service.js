angular.module('brilnotify').service('CoolService', ["$timeout", function ($timeout) {
    var me = this;
    this.receivers = [];

    this.set_tabs = function (tabs) {
        console.log('service' + JSON.stringify(tabs));
        this.tabArr = tabs;
    };


    this.register = function (accept_all) {
        var newReceiver = {
            filters: [],
            acceptAll: accept_all,
            onMessage: null
        };
        console.log('register' + JSON.stringify(newReceiver));
        me.receivers.push(newReceiver);
        return newReceiver;
    };

    this.deregister = function (receiver) {
        var index = me.receivers.indexOf(receiver);
        while (index !== -1) {
            me.receivers.splice(index, 1);
            index = me.receivers.indexOf(receiver);
        }
    };

    this.send = function (type, content) {
        console.log("in send", me.receivers);
        var receiver;
        for (receiver of me.receivers) {
            if (typeof receiver.onMessage !== "function") {
                continue;
            }
            console.log("receiver has function");
            if (receiver.acceptAll) {
                sendMessage(receiver, type, content);
                continue;
            }
            if (receiver.subscriptions.indexOf(type) !== -1) {
                sendMessage(receiver, type, content);
            }
        }
    };

    function sendMessage(receiver, type, content) {
        console.log("doing send");
        // timeout in order not to block
        $timeout(function () {
            receiver.onMessage({
                type: type,
                content: content
            });
        });
    }
}]);