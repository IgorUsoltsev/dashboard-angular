(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupAccountConfigurations')
        .controller('GroupAccountConfigurationsCtrl', GroupAccountConfigurationsCtrl);

    /** @ngInject */
    function GroupAccountConfigurationsCtrl($scope,$http,environmentConfig,cookieManagement,serializeFiltersService,
                                          $stateParams,$location,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.groupAccountConfigurationsList = [];

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;

                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editGroupObj = res.data.data;
                        $scope.editGroupObj.prevName = res.data.data.name;
                        vm.getGroupUsers($scope.editGroupObj);
                    }
                }).catch(function (error) {

                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            if(vm.token) {
                $scope.loadingGroup = true;
                $http.get(environmentConfig.API + '/admin/users/?group=' + group.name, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.totalUsersCount = res.data.data.count;
                        $scope.loadingGroup = false;
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.groupAccountConfigurationNameToLowercase = function () {
            if($scope.groupAccountConfigurationParams.name){
                $scope.groupAccountConfigurationParams.name = $scope.groupAccountConfigurationParams.name.toLowerCase();
            }
        };

        vm.getGroupAccountConfigurationsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getGroupAccountConfigurations = function(fromModalDelete){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;

                if ($scope.groupAccountConfigurationsList.length > 0) {
                    $scope.groupAccountConfigurationsList.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var groupAccountConfigurationsUrl = vm.getGroupAccountConfigurationsUrl();

                $http.get(groupAccountConfigurationsUrl,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroupAccountConfigurations = false;
                    if (res.status === 200) {
                        $scope.groupAccountConfigurationsData = res.data.data;
                        $scope.groupAccountConfigurationsList = res.data.data.results;
                        console.log($scope.groupAccountConfigurationsList[2])
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroupAccountConfigurations();
        
        $scope.updateAccountConfig = function (accountConfig,type) {
            var updateObj = {};
            if(type == 'default'){
                updateObj.default = accountConfig.default;
            } else {
                $scope.loadingGroupAccountConfigurations = true;
                updateObj.primary = accountConfig.primary;
            }

            $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + accountConfig.name + '/',updateObj,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Account configuration updated successfully');
                    if(type == 'primary'){
                        $scope.getGroupAccountConfigurations();
                    }
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }





    }
})();
