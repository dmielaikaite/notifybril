angular.module("bril-notify", ['ui.router', 'ui.bootstrap', 'ngTable'])
    .controller("Controller", function ($rootScope, $http, $timeout) {

        var me = this;
        this.websocket_message = [];
        this.elasticsearch_message = [];
        this.msg = "";
        this.old_message = "";
        var endpoint = 'http://srv-s2d16-15-01.cms:9200/.notifications/_search?source={"from": 0,"size": 10,"query": {"match_all": {}},"sort": [{"timestamp": {"order": "desc"}}],"_source": ["type","class","message","user_timestamp","host","http_host", "timestamp"]}';
        // var endpoint = 'http://srv-s2d16-15-01.cms:9200/.notifications/_search?source={"from": 0,"size": 2,"query": {"match_all": {}},"sort": [{"timestamp": {"order": "desc"}}],"_source": ["type","class","message","user_timestamp","host","http_host"]}';

        function set_color(data) {
            if (data.type === "create") {
                data.color_class = "bg-info";
            }
            else if (data.type === "danger") {
                data.color_class = "bg-danger";
            }
        }

        function init() {
            connection();
        }

        function connection() {
            $http.get('config.json').then(function (response) {
                this.websocket_url = response.data.websocket_url;
                var connection = new WebSocket(this.websocket_url);


                connection.onopen = function () {
                    console.log('connection is open');
                };

                connection.onerror = function (e) {
                    console.log("error", e.message);
                };

                connection.onmessage = function (e) {
                    get_message(e);
                };

                connection.onclose = function (e) {
                    console.log('connection close, readyState: ' + e.target.readyState);
                };
            });
        }


        function get_message(e) {
            me.msg = JSON.parse(e.data);
            //$scope.$apply => try
            $timeout(function () {
                set_color(me.msg);
                me.websocket_message.push(me.msg);
            });
            console.log(me.msg);
        }


        this.request_messages = function () {
            $http.post(endpoint).then(function (response) {
                for (var i = 0; i < response.data.hits.hits.length; i++) {
                    me.old_message = response.data.hits.hits[i]._source;
                    set_color(me.old_message);
                    me.elasticsearch_message.push(me.old_message);
                }
                console.log(me.elasticsearch_message);
            });
            console.log("requesting to get message");
        };

        window.addEventListener("load", init, false);

    });