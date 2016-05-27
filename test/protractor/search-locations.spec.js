
describe('search-locations', function() {

        beforeEach(function() {
            browser.get('/#/search-locations');
        });

        describe('inital state', function() {

            it('should render search field', function() {
                expect($('#query').isDisplayed()).toBeTruthy();
            });

        });

        describe('search for "solingen"', function() {

            it('should render results', function() {
                $('#query').clear().sendKeys('solingen');
                element(by.buttonText('Go')).click();
                expect(element.all(by.css('.list-group-item')).count()).toBe(3);
            });

        });

});
