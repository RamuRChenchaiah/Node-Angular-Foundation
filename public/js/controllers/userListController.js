angular.module('mainApp.controllers')
.controller('userListController', ['$scope', '$modal', '$route', '$timeout', 'SessionService', 'userService', function($scope, $modal, $route, $timeout, Session, User){
  // check for session
  if (Session.info) {
    $scope.session = Session;

    // list users in table or log error
    User.list()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        angular.forEach(data.users, function(value, key) {
          value.updatedAt  = moment(value.updatedAt).format("YYYY-MM-DD hh:mm A");
        });
        $scope.users = data.users;
      }
    });

    // create a new user
    $scope.createUser = function() {
      // Sends null so that the modal will know to make a blank user to fill.
      $scope.open(null);
    };

    // edit user
    $scope.editUser = function(user) {
      $scope.open(user);
    };

    // delete user
    $scope.deleteUser = function(user) {
      if(user.id != $scope.session.info.id) {
        if(confirm("Deleting "+user.username+" cannot be undone. Are you sure?"))
        {
          User.delete(user.id)
          .then(function(data) {
            if (data !== undefined && data.meta.success) {
              $route.reload();
              Session.makeAlert("success","User was successfully deleted");
            }
          });
        }
      } else {
        alert("You cannot delete yourself!");
      }
    };

    $scope.open = function(user) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/userForm.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          user: function () { return user; },
          session: function () {return Session; },
          User: function () {return User; },
          $timeout: function () {return $timeout; }
        }
      });

      modalInstance.result.then(function() {
          $timeout(function() {
            $route.reload(); //To make sure the list is up to date.
          }, 500);
        }
      );
    };
  }
}]);