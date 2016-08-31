angular.module("bril-notify", ['ui.router'])
    .controller("Controller", function ($rootScope, $http, $timeout) {

        var me = this;
        this.websocket_message = [];
        this.msg = "";

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
                    console.log("error");
                };

                connection.onmessage = function (e) {
                    get_message(e);
                };

                connection.onclose = function (e) {
                    connection.close();
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

        window.addEventListener("load", init, false);

    });