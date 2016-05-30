
describe('spots', function() {
    
    beforeEach(function() {
        browser.get('/#/spots');
    });

    describe('inital state', function() {

        it('should render spots', function() {
            expect(element.all(by.css('.list-group-item')).count()).toBe(3);
	    browser.sleep(1000);
        });

    });

});
