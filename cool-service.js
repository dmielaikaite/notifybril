angular.module('brilnotify').service('CoolService', ["$timeout", '$http', function ($timeout, $http) {

    var me = this;
    this.receivers = [];
    this.msg = "";
    this.websocket_message = [];
    var endpoint = 'http://srv-s2d16-15-01.cms:9200/.notifications/_search?source={"from": 0,"size": 10,"query": {"match_all": {}},"sort": [{"timestamp": {"order": "desc"}}],"_source": ["type","class","message","user_timestamp","host","http_host", "timestamp"]}';
    this.elasticsearch_message = [];


    this.set_tabs = function (tabs) {
        console.log('service' + JSON.stringify(tabs));
        this.tabArr = tabs;
    };

    this.register = function (config) {
        var newReceiver = {
            filters: [],
            acceptAll: config.accept_all,
            onMessage: null,
            onOldMessage: null,
            type: config.runcontrol
        };
        console.log('register' + JSON.stringify(newReceiver));
        me.receivers.push(newReceiver);
        return newReceiver;
    };

    this.get_message = function () {
        var receiver;
        for (receiver of me.receivers) {
            if (typeof receiver.onMessage !== "function") {
                continue;
            }
            if (receiver != null) {
                getMessage(receiver, receiver.subscriptions);
                continue;
            }
            console.log('receiver vidujeeee' + JSON.stringify(receiver));
            console.log('receiver.subscriptions.indexOf(1)' + receiver.subscriptions);
        }
    };
    
    this.deregister = function (receiver) {
        var index = me.receivers.indexOf(receiver);
        while (index !== -1) {
            me.receivers.splice(index, 1);
            index = me.receivers.indexOf(receiver);
        }
    };


    function set_color(data) {
        if (data.type === "create") {
            data.color_class = "bg-info";
        }
        else if (data.type === "danger") {
            data.color_class = "bg-danger";
        }
    }

    function send_websocket_messaget(receiver) {
        $timeout(function () {
            receiver.onMessage({
                type: me.msg.type,
                timestamp: me.msg.timestamp,
                message: me.msg.message,
                class: me.msg.class
            });
        });
    }


    function getMessage(receiver, subscriptions) {
        console.log("doing send");
        $http.get('config.json').then(function (response) {
            this.websocket_url = response.data.websocket_url;
            var connection = new WebSocket(this.websocket_url);
            connection.onmessage = function (e) {
                me.msg = JSON.parse(e.data);
                console.log('receiver.type' + JSON.stringify(receiver));
                console.log(receiver.subscriptions[0]);
                if (subscriptions[0] != null) {
                    var array = receiver.subscriptions[0].toString().split(',');
                    for (var i in receiver.subscriptions) {
                        if (me.msg.type.toString() == array[i]) {
                            send_websocket_messaget(receiver);
                        }
                    }
                }
                if (receiver.acceptAll) {
                    send_websocket_messaget(receiver);
                }
            };
        });
    }

}]);