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
    var quit = false;

    this.init = function (config) {
        console.log('init' + JSON.stringify(config));
        me.handler = CoolService.register(config);
        me.handler.acceptAll = config.accept_all;
        me.handler.subscriptions = [me.handler.type, ""];
        me.handler.onMessage = messageAction;
        get_message();
    };

    function get_message() {
        console.log('get_message');
        CoolService.get_message();
    }

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

}]);