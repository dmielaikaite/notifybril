angular.module('brilnotify').controller('TabCtrl', ["$scope", "CoolService", "$rootScope", '$http', "$timeout", function ($scope, CoolService, $rootScope, $http, $timeout) {

    var me = this;
    this.handler = null;
    this.messages = [];
    this.websocket_message = [];
    this.elasticsearch_message = [];
    this.tabs_array = [];
    this.msg = "";
    this.old_message = "";
    var endpoint = 'http://srv-s2d16-15-01.cms:9200/.notifications/_search?source={"from": 0,"size": 10,"query": {"match_all": {}},"sort": [{"timestamp": {"order": "desc"}}],"_source": ["type","class","message","user_timestamp","host","http_host", "timestamp"]}';
    $rootScope.CoolService = CoolService;
    var config = $rootScope.CoolService.tabArr;

    this.init = function (config) {
        console.log('init' + JSON.stringify(config));
        me.handler = CoolService.register(config);
        me.handler.acceptAll = config.accept_all;
        me.handler.subscriptions = [me.handler.type, ""];
        var arg = me.handler.type;
        console.log('arg' + arg);
        me.handler.onMessage = messageAction;
    };

    function get_message() {
        console.log('get_message');
        CoolService.get_message();
        // $http.get('config.json').then(function (response) {
        //     this.websocket_url = response.data.websocket_url;
        //     var connection = new WebSocket(this.websocket_url);
        //     connection.onmessage = function (e) {
        //         me.msg = JSON.parse(e.data);
        //         CoolService.get_message(me.msg.type);
        //     };
        // });
    }

// CoolService.get_message();
    function messageAction(message) {
        console.log("in action", message);
        me.messages.unshift(message);
    }

    $scope.$on("$destroy", function handler() {
        console.log("destroying", me.stuff);
        CoolService.deregister(me.handler);
    });

    $rootScope.$on("Update", function (event, newTab) {
        $rootScope.newTab = newTab;
        console.log('from tab-ctrl' + $rootScope.newTab);
    });


    function set_color(data) {
        if (data.type === "create") {
            data.color_class = "bg-info";
        }
        else if (data.type === "danger") {
            data.color_class = "bg-danger";
        }
    }

    // function connection(arg) {
    //     console.log('ARGUMENTS = ' + arg);
    //     $http.get('config.json', {params: arg}).then(function (response) {
    //         console.log(' config ARGUMENTS = ' + arg);
    //         this.websocket_url = response.data.websocket_url;
    //         var connection = new WebSocket(this.websocket_url);
    //
    //         connection.onmessage = function (e) {
    //             console.log(' onmessage ARGUMENTS = ' + arg);
    //             me.msg = JSON.parse(e.data);
    //             //$scope.$apply => try
    //             if (arg != null) {
    //                 console.log('inside connection arg length' + arg.length);
    //                 for (var i = 0; i < arg.length; i++) {
    //                     console.log('arg i' + arg[i]);
    //                     if (me.msg.type.toString() == arg[i]) {
    //                         $timeout(function () {
    //                             set_color(me.msg);
    //                             me.websocket_message.push(me.msg);
    //                         });
    //                     }
    //                     else {
    //                         console.log('aaaa');
    //                     }
    //                 }
    //             }
    //             else {
    //                 $timeout(function () {
    //                     set_color(me.msg);
    //                     me.websocket_message.push(me.msg);
    //                 });
    //             }
    //
    //
    //         };
    //
    //     });
    // }

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

    get_message();


    // get_message();
    // console.log('me.handler.acceptAll' + me.handler.acceptAll);
    // console.log('me.handler.type' + me.handler.type);
    // CoolService.send(me.msgType, me.msgContent);
    // change_acceptAll();
    // connection(config);
    // init(config);


    // console.log('me.handler.acceptAll' + me.handler.acceptAll);
    // console.log('me.handler.type' + me.handler.type);
    // CoolService.send(me.msgType, me.msgContent);
    // change_acceptAll();
    // connection(config);
    // init(config);

}]);