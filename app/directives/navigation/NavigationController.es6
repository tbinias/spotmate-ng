'use strict';

class NavigationController {

    constructor($location, userService) {
        this.userService = userService;
        this.$location = $location;
    }

    isActiveNav(navEntry) {
          return navEntry.path === this.$location.path();
    }

    isPermitted(navEntry) {
         if (navEntry.name === 'Search locations') {
             return this.userService.isLoggedIn();
         }
         if (navEntry.name === 'Spots') {
             return this.userService.isLoggedIn();
         }
         return true;
    }

    isLoggedIn() {
        return this.userService.isLoggedIn();
    }

    logout() {
        this.userService.logout();
    }

}

NavigationController.$inject = [ '$location', 'UserService' ];
export default NavigationController;
