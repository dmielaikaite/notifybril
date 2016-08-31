  angular.module("bril-notify", ['ui.router'])
    .controller("Controller", function($rootScope, $http) {

        var me = this;
        this.websocket_message = "";
        this.message = {};
        this.msg = "";
        var output = document.getElementById("output");

        this.init = function(){

            $http.get('config.json').then(function(response) {

                this.websocket_url = response.data.websocket_url;
                var connection = new WebSocket(this.websocket_url);

                connection.onopen = function()
                {
                    connection.send("Message to send");
                    console.log('connection is open');
                };

                connection.onerror = function(e)
                {
                    console.log(e);
                    connection.send("error");
                };

                connection.onmessage = function(e)
                {
                    var pre = document.createElement("p");
                    pre.style.wordWrap = "break-word";
                    me.websocket_message = JSON.parse(e.data);
                    pre.innerHTML = "class=" + me.websocket_message.class + ", message=" + me.websocket_message.message + ", type=" + me.websocket_message.type + ", user_timestamp=" + me.websocket_message.user_timestamp + ", timestamp=" + me.websocket_message.timestamp;
                    output.appendChild(pre);
                    console.log(me.websocket_message);
                };

                connection.onclose = function(e)
                {
                    console.log('connection close, readyState: ' + e.target.readyState);
                };
            });
        };

        me.init();

  });