'use strict';


var todomvc = angular.module('todomvc', [
    'ngAnimate'

]);

todomvc.directive('ngBlur', function() {
    return function(scope, elem, attrs) {
        elem.bind('blur', function() {
            scope.$apply(attrs.ngBlur);
        });
    };
});


todomvc.controller('TodoCtrl', function TodoCtrl($scope, $filter, $http, $location) {


    $scope.todos = [];

    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.placeholder = "Loading ....";
    $scope.statusFilter = {};


    // load data

    $http.get('todos.php').success(function(data) {
        $scope.todos = data;
        $scope.placeholder = "What needs to be done?";
    })

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
