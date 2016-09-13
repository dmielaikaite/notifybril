angular.module('brilnotify').controller('MainCtrl', ["$timeout", "CoolService", "$http", "$rootScope", function ($timeout, CoolService, $http, $rootScope) {

    var me = this;
    var lastID = -1;
    this.activeTabIndex = 0;
    this.tabs = [];
    this.msgType = "type";
    this.msgContent = "content";
    this.tabs_obj = "";
    this.tabs_array = [];
    var newTab;

    $http.get('config.json').then(function (response) {

        for (var i = 0; i < response.data.tabs.length; i++) {
            me.tabs_obj = response.data.tabs[i];
            me.tabs_array.push(me.tabs_obj);
        }
        for (var i = 0; i < response.data.tabs.length; i++) {
            newTab = {
                id: i,
                title: me.tabs_array[i].name,
                accept_all: me.tabs_array[i].accept_all,
                runcontrol: me.tabs_array[i].subscriptions.runcontrol
            };

            me.tabs.push(newTab);
        }

        var tab_service_array;
        tab_service_array = me.tabs;
        CoolService.set_tabs(tab_service_array);

    });


    this.addTab = function () {
        var newID = me.tabs.length -1 ;
        newID = newID + 1;

        newTab = {
            id: newID,
            title: "tab" + newID ,
            accept_all: true,
            runcontrol: ""
        };

        me.tabs.push(newTab);
        $timeout(function () {
            me.activeTabIndex = (newID);
        }, 100);


    };

    this.removeTab = function (tabid) {
        var i;
        for (i = me.tabs.length - 1; i >= 0; i--) {
            if (me.tabs[i].id === tabid) {
                me.tabs.splice(i, 1);
            }
        }
    };


    function messageAction(message) {
        console.log("in action", message);
        me.messages.unshift(message.content);
    }

    $rootScope.$on("$destroy", function handler() {
        console.log("destroying", me.stuff);
        CoolService.deregister(me.handler);
    });

    // init();

    // this.sendMessage = function () {
    //     CoolService.send(me.msgType, me.msgContent);
    // };


}]);