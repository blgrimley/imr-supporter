mainApp.controller('createTaskController', function($scope, $location, $http, $filter) {
    console.log("create task Controller");

    $('.selectpicker').selectpicker({
    });

    $scope.formData = {
        users: [],
        steps: [""]
    }

    $scope.months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    $scope.days = [];
    for(var i=1;i<32;i++){
        $scope.days.push(i);
    }

    $scope.years = ["2016" ,"2017" ,"2018" ,"2019"];

    $scope.hours = [];
    for (var i=1; i<25;i++) {
        $scope.hours.push(i);
    }

    $scope.minutes = [];
    for (var i=0; i<60; i++) {
        var s = i.toString();
        if (s.length == 1) {
            s = "0" + s
        }
        $scope.minutes.push(s)
    }

    var ureq = {
        url: "http://iamready.herokuapp.com/users/user/all/",
        data: {
            pk: 1,
            mode: "simple"
        },
        method: "POST",
        headers: {
            Authorization: 'JWT ' + localStorage.getItem('authToken')
        },
    }

    $http(ureq).success(function(data){
        $scope.users = data
    })

    $scope.isActive = function (routes) {
        angular.forEach(routes, function(route){
            if(route === $location.path()) {
                return true;
            }
        });
    }
    // 
    // $scope.open = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.opened = true;
    // };
    //
    // $scope.startPopover = {
    //     templateUrl: 'templates/includes/startTime.html'
    // };
    //
    // $scope.endPopover = {
    //     templateUrl: 'templates/includes/endTime.html'
    // };

    $('.form-active-basic').on('focus blur', function() {
        $('#adding').removeClass("form-active-blue");
        $('#basic').toggleClass("form-active-blue");
    });

    $('.form-active-special').on('focus blur', function() {
        $('#adding').removeClass("form-active-blue");
        $('#special').toggleClass("form-active-blue");
    });

    $scope.activeForm = function() {
        $('#adding').addClass("form-active-blue");
    }

    // $('.fa-calendar-o').datepicker('show');

    $scope.createTask = function () {

        // Get all of the easy stuff in first

        var data = {}
        data.owner_pk = 1;

        fields = ['title', 'video', 'category', 'help_text']

        for (i in fields) {
            if (fields[i] in $scope.formData) {
                data[fields[i]] = $scope.formData[fields[i]]
            }
        }

        // Now the harder stuff

        // Add the steps
        if ($scope.formData.steps.length > 0) {
            steps = []
            for (i in $scope.formData.steps) {
                s = i + "::" + $scope.formData.steps[i];
                steps.push(s)
            }
            data.steps = steps.join(":::")
        }

        var req = {
            url: "http://iamready.herokuapp.com/events/mastertask/create/",
            data: data,
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        console.log(req)

        $http(req).success(function(data){
            console.log("Created!")
            $location.path('/tasks');
        })
        .error(function(data){
        })
    }


});
