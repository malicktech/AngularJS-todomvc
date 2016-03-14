'use strict';

todomvc.directive("deferredCloak", function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$set("deferredCloak", undefined);
            element.removeClass("deferred-cloak");
        }
    };
});
