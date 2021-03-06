(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('EthereumServiceAccountsCtrl', EthereumServiceAccountsCtrl);

    /** @ngInject */
    function EthereumServiceAccountsCtrl($scope) {
        $scope.ethereumAccountSettingView = 'hotwallet';

        $scope.goToEthereumAccountSetting = function (setting) {
            console.log(setting)
            $scope.ethereumAccountSettingView = setting;
        };
    }

})();
