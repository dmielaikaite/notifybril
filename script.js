  angular.module("bril-notify", ['ui.router'])
    .controller("Controller", function($rootScope, $http) {

        var me = this;
        this.websocket_message = "";
        this.connection = null;
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
                    pre.innerHTML = me.websocket_message;
                    // output.appendChild(pre.innerHTML.class);
                    // var pre = document.createElement("p");
                    // me.websocket_message = JSON.parse(e.data);

                    console.log(me.websocket_message);
                    console.log(me.websocket_message.class);
                    console.log(me.websocket_message.message);
                    console.log(me.websocket_message.type);
                    console.log(me.websocket_message.user_timestamp);
                    // output.appendChild(pre);
                };

                connection.onclose = function(e)
                {
                    console.log('connection close, readyState: ' + e.target.readyState);
                };
            });
        };

        me.init();

  });