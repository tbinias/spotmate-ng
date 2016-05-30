
describe('spots', function() {

    beforeEach(function() {
        browser.get('/#/spots');
    });

    describe('inital state', function() {

        it('should render spots', function() {
            expect(element.all(by.css('.list-group-item')).count()).toBe(3);
        });

        it('should render three ranks for each spot', function() {
            expect(element.all(by.css('.spotmate-ranking .rank')).count()).toBe(9);
        });

    });

});
