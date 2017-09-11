(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.viewIco.quotes')
        .controller('QuotesCtrl', QuotesCtrl);

    /** @ngInject */
    function QuotesCtrl($scope,$http,cookieManagement,errorToasts,$location,toastr,$uibModal,$stateParams) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.loadingQuotes = false;
        $scope.searchQuoteParams = {
            searchId: '',
            searchCurrency: {code: 'Currency'}
        };
        $scope.currencyOptions = [];

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.getCurrenciesList = function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                        $scope.currencyOptions.splice(0,0,{code: 'Currency'});
                    }
                }).catch(function (error) {
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        $scope.getCurrenciesList();

        vm.getIco =  function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/icos/' + $stateParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.icoObj = res.data.data;
                    }
                }).catch(function (error) {
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getIco();

        vm.getQuoteListUrl = function(){
            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
                +  '&id=' + ($scope.searchQuoteParams.searchId ? $scope.searchQuoteParams.searchId : '')
                +  '&deposit_currency__code=' + ($scope.searchQuoteParams.searchCurrency.code == 'Currency' ? '' : $scope.searchQuoteParams.searchCurrency.code);

            return vm.serviceUrl + 'admin/icos/' + $stateParams.id + '/quotes/' + vm.filterParams;
        };

        $scope.getIcoQuotes =  function (applyFilter) {
            $scope.loadingQuotes = true;

            $scope.icoQuotes = [];

            if (applyFilter) {
                // if function is called from filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.icoQuotes.length > 0) {
                $scope.icoQuotes.length = 0;
            }

            var quoteListUrl = vm.getQuoteListUrl();

            if(vm.token) {
                $http.get(quoteListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.icoQuotesData = res.data.data;
                        $scope.icoQuotes = res.data.data.results;
                        $scope.loadingQuotes =  false;
                    }
                }).catch(function (error) {
                    $scope.loadingQuotes =  false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        $scope.getIcoQuotes();

        $scope.openQuotesModal = function (page, size,quote) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'QuotesModalCtrl',
                resolve: {
                    quote: function () {
                        return quote;
                    },
                    icoObj: function () {
                        return $scope.icoObj;
                    }
                }
            });

        };

    }
})();