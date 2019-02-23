(function () {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.message = '';
    $scope.users = [];
    $scope.messages = [];
    $scope.likes = [];
    $scope.mynickname = $localStorage.nickname;
    var nickname = $scope.mynickname;

    // Show all users when first logged on
    socket.emit('get-users');

    $scope.joinPrivate = function () {
      socket.emit('join-private', {
        nickname: nickname
      });
    }

    $scope.groupPm = function () {
      socket.emit('private-chat', {
        message: 'hello everybody!'
      });
    }

    // send message
    $scope.sendMessage = function (data) {
      var newMessage = {
        message: $scope.message,
        from: nickname
      }
      socket.emit('send-message', newMessage);
      $scope.message = '';
    };
    
    // send like
    $scope.sendLike = function (user) {
      var id = lodash.get(user, 'socketid');
      var likeObj = {
        from: nickname,
        like: id
      }
      socket.emit('send-like', likeObj);
    }

    socket.on('show-message', function (data) {
      console.log(data);
    });
    
    // get list of all users connected
    socket.on('all-users', function (data) {
      $scope.users = data.filter(function (item) {
        return item.nickname !== nickname;
      });
    });

    socket.on('user-liked', function (data) {
      $scope.likes.push(data.from);
    });

    socket.on('message-received', function (data) {
      $scope.messages.push(data);
    });

    socket.on('update', function (data) {
      $scope.users = [];
      $scope.users = data.filter(function (item) {
        return item.nickname !== nickname;
      });
    });
  };
})();