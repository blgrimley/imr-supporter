mainApp.controller('schedulesController', function($scope, $http, $stateParams) {
    console.log("schedules Controller");
    console.log($stateParams)

    var ureq = {
        url: "http://iamready.herokuapp.com/users/user/all/",
        data: {
            pk: $stateParams.pk,
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

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.dynamicPopover = {
        templateUrl: 'templates/includes/startTime.html'
    };

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.mytime = d;
    };

    $scope.changed = function () {
        console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
        $scope.mytime = null;
    };

    $(function () {
        $('#check').webuiPopover({trigger:'manual', placement:'bottom', type:'html', arrow:false});
        $('#check').on("click", function (event) {
            var self = $('#check');
            if (self.is(':checked')) {
                self.webuiPopover('show');
            }
            else {
                self.webuiPopover('hide');
            }
        });
    })

    var req = {
        url: "http://iamready.herokuapp.com/users/user/all/",
        data: {
            pk: localStorage.getItem('pk')
        },
        method: "POST",
        headers: {
            Authorization: 'JWT ' + localStorage.getItem('authToken')
        },
    }
    $http(req).success(function(data) {
        $scope.users = data;
    })

});

mainApp.controller('dailyScheduleController', function($scope, $http, $stateParams) {
    
    $scope.pk = $stateParams.pk;
    $scope.target = new Date();
    console.log("Starting target date",$scope.target)
    var m = $scope.target.getMonth() + 1;
    $scope.date = $scope.target.getFullYear() + "-" + m + "-" + $scope.target.getDate();

    $scope.nextDay = function() {
        $scope.schedule = {}
        var d = new Date();
        d.setDate($scope.target.getDate() + 1);
        $scope.target = d;
        var m = $scope.target.getMonth() + 1;
        $scope.date = $scope.target.getFullYear() + "-" + m + "-" + $scope.target.getDate();

        var req = {
            url: "http://iamready.herokuapp.com/events/all/day/",
            data: {
                user_pk: $stateParams.pk,
                date: $scope.date
            },
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        console.log(req)

        $http(req).success(function(data) {
            $scope.schedule = data
        })
    }

    $scope.prevDay = function() {
        $scope.schedule = {}
        var d = new Date();
        d.setDate($scope.target.getDate() - 1);
        $scope.target = d;
        var m = $scope.target.getMonth() + 1;
        $scope.date = $scope.target.getFullYear() + "-" + m + "-" + $scope.target.getDate();

        var req = {
            url: "http://iamready.herokuapp.com/events/all/day/",
            data: {
                user_pk: $stateParams.pk,
                date: $scope.date
            },
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        $http(req).success(function(data) {
            $scope.schedule = data
        })
    }

    $scope.deleteEvent = function (pk) {
        console.log("Deleting")

        var req = {
            url: "http://iamready.herokuapp.com/events/event/delete",
            data: {
                pk: pk
            },
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        $http(req).success(function(data){
            console.log("Deleted!")
        })
    }

    var req = {
        url: "http://iamready.herokuapp.com/events/all/day/",
        data: {
            user_pk: $stateParams.pk,
            date: $scope.date
        },
        method: "POST",
        headers: {
            Authorization: 'JWT ' + localStorage.getItem('authToken')
        },
    }

    console.log(req)

    $http(req).success(function(data) {
        $scope.schedule = data;
    })
    .error(function(data) {
        console.log(data);
    })
})

mainApp.controller('weeklyScheduleController', function($scope, $http, $stateParams) {
    $scope.pk = $stateParams.pk;

    $scope.target = new Date();
    $scope.date = $scope.target.getFullYear() + "-" + ($scope.target.getMonth() + 1) + "-" + $scope.target.getDate();
    $scope.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday']
    $scope.times_of_day = ['morning', 'afternoon', 'evening']

    var req = {
        url: "http://iamready.herokuapp.com/events/all/week/",
        data: {
            user_pk: $stateParams.pk,
            date: $scope.date
        },
        method: "POST",
        headers: {
            Authorization: 'JWT ' + localStorage.getItem('authToken')
        },
    }

    $http(req).success(function(data){
        $scope.schedule=data;
    })

    $scope.nextWeek = function() {
        $scope.schedule = {};
        $scope.target.setDate($scope.target.getDate() + 7);
        $scope.date = $scope.target.getFullYear() + "-" + ($scope.target.getMonth() + 1) + "-" + $scope.target.getDate();
        var req = {
            url: "http://iamready.herokuapp.com/events/all/week/",
            data: {
                user_pk: $stateParams.pk,
                date: $scope.date
            },
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        $http(req).success(function(data){
            $scope.schedule=data;
        })
    }

    $scope.prevWeek = function() {
        $scope.schedule = {};
        $scope.target.setDate($scope.target.getDate() - 7);
        $scope.date = $scope.target.getFullYear() + "-" + ($scope.target.getMonth() + 1) + "-" + $scope.target.getDate();
        var req = {
            url: "http://iamready.herokuapp.com/events/all/week/",
            data: {
                user_pk: $stateParams.pk,
                date: $scope.date
            },
            method: "POST",
            headers: {
                Authorization: 'JWT ' + localStorage.getItem('authToken')
            },
        }

        $http(req).success(function(data){
            $scope.schedule=data;
        })
    }


})
