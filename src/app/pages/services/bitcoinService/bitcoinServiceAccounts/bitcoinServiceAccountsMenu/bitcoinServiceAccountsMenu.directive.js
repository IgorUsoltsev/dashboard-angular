(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('bitcoinServiceAccountsMenu', bitcoinServiceAccountsMenu);

    /** @ngInject */
    function bitcoinServiceAccountsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinServiceAccountsMenu/bitcoinServiceAccountsMenu.html'
        };
    }
})();
