angular.module('brilnotify').controller('TabCtrl', ["$scope", "CoolService", "$rootScope", function ($scope, CoolService, $rootScope) {

    var me = this;
    this.handler = null;
    this.messages = [];

    $rootScope.CoolService = CoolService;
    var config = $rootScope.CoolService.tabArr;

    this.init = function (config) {
        console.log('init' + JSON.stringify(config));
        me.handler = CoolService.register(config.accept_all);
        me.handler.subscriptions = ["", ""];
        me.handler.acceptAll = config.accept_all;
        me.handler.onMessage = messageAction;
    };

    function messageAction(message) {
        console.log("in action", message);
        me.messages.unshift(message.content);
    }

    $scope.$on("$destroy", function handler() {
        console.log("destroying", me.stuff);
        CoolService.deregister(me.handler);
    });

    $rootScope.$on("Update", function (event, newTab) {
        $rootScope.newTab = newTab;
        console.log('from tab-ctrl' + $rootScope.newTab);
    });

}]);