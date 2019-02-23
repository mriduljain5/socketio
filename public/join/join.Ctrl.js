(function () {
  'use strict';

  angular
    .module('app')
    .controller('JoinCtrl', JoinCtrl);

  JoinCtrl.$inject = ['$location', '$scope', '$localStorage', 'socket'];

  function JoinCtrl($location, $scope, $localStorage, socket) {
    $scope.name = '';
    let nickname = '';

    $scope.join = function () {
      nickname = $scope.name;
      $localStorage.nickname = $scope.name;

      // emit an event whenever a new user joins
      socket.emit('join', {
        nickname: nickname
      });

      $location.path('/main');
    };
  }
})();