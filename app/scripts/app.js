'use strict';


var todomvc = angular.module('todomvc', [
    'ngAnimate',
    'ui.sortable',
    'LocalStorageModule'
]);

todomvc.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ls');
}])

todomvc.directive('ngBlur', function() {
    return function(scope, elem, attrs) {
        elem.bind('blur', function() {
            scope.$apply(attrs.ngBlur);
        });
    };
});


todomvc.controller('TodoCtrl', function TodoCtrl($scope, $filter, $http, $location, localStorageService) {

    $scope.todos = [];

    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.placeholder = "Loading ....";
    $scope.statusFilter = {};

    // load data
    // from json php
    $http.get('todos.php').success(function(data) {
            $scope.todos = data;
            $scope.placeholder = "What needs to be done?";
        })
        // from local storage
    var todosInStore = localStorageService.get('todos');
    $scope.todos = todosInStore || [];

    // Monitor the current route for changes and adjust the filter accordingly.
    if ($location.path() == '') {
        $location.path('/')
    }
    $scope.location = $location;
    $scope.$watch('location.path()', function(path) {
        $scope.statusFilter =
            (path === '/active') ? {
                completed: false
            } : (path === '/completed') ? {
                completed: true
            } : {};
    });

    // met à jour le nombre de tache restantes
    // ================================================
    $scope.$watch('todos', function() {
        $scope.remainingCount = $filter('filter')($scope.todos, {
            completed: false
        }).length;
        $scope.completedCount = $scope.todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
        localStorageService.set('todos', $scope.todos);
    }, true);


    // Ajout d'une nouvelle tâche
    // ================================================
    $scope.addTodo = function() {
        var newTodo = {
            title: $scope.newTodo.trim(),
            completed: false
        };

        $scope.todos.push(newTodo);

        $scope.newTodo = '';

    };

    // Editer une tâche
    // ================================================
    $scope.editTodo = function(todo) {
        // $scope.editedTodo = todo;
        todo.editing = false;
    };


    // Suppression d'une  tâche
    // ================================================
    $scope.removeTodo = function(index) {
        $scope.todos.splice(index, 1);
    };

    //Cocher toutes les tâche
    // ================================================
    $scope.markAll = function(allChecked) {
        $scope.todos.forEach(function(todo) {
            todo.completed = allChecked

        });
    };


});
