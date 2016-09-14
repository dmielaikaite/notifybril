angular.module('brilnotify').controller('TabCtrl', ["$scope", "CoolService", "$rootScope", '$http', "$timeout", function ($scope, CoolService, $rootScope, $http, $timeout) {

    var me = this;
    this.handler = null;
    this.messages = [];
    this.old_messages = [];
    this.websocket_message = [];
    this.elasticsearch_message = [];
    this.tabs_array = [];
    this.msg = "";
    this.old_message = "";
    $rootScope.CoolService = CoolService;
    var config = $rootScope.CoolService.tabArr;

    this.init = function (config) {
        console.log('init' + JSON.stringify(config));
        me.handler = CoolService.register(config);
        me.handler.acceptAll = config.accept_all;
        me.handler.subscriptions = [me.handler.type, ""];
        me.handler.onMessage = messageAction;
        me.handler.onOldMessage = oldMessageAction;
        get_message();
    };

    function get_message() {
        console.log('get_message');
        CoolService.get_message();
    }

    function oldMessageAction(old_message) {
        console.log("in action", old_message);
        me.old_messages.unshift(old_message);
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

    this.request_messages = function (type) {
        console.log('requesting to get_old_message');
        var array = type.toString().split(',');
        console.log(array.length);
        var endpoint = null;
        endpoint = 'http://srv-s2d16-15-01.cms:9200/.notifications/_search?source={"size": 10,"query": {"term": { "type": "' + type + '" }},"sort": [{"timestamp": {"order": "desc"}}],"_source": ["type","class","message","user_timestamp","host","http_host", "timestamp"]}';
        $http.post(endpoint).then(function (response) {
            me.elasticsearch_message = [];
            for (var i = 0; i < response.data.hits.hits.length; i++) {
                me.old_message = response.data.hits.hits[i]._source;
                set_color(me.old_message);
                me.elasticsearch_message.push(me.old_message);
            }
            if (me.elasticsearch_message == null || me.elasticsearch_message == "") {
                alert('We can not find this type of message in our database, please try again :)');
            }
        });


    };

}]);