
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

        it('should render ranks for Fri to Sun on first spot', function() {
            expect(element.all(by.css('.spotmate-ranking .rank')).get(0).element(by.binding('key')).getText())
                .toBe('Fri 27.05');
            expect(element.all(by.css('.spotmate-ranking .rank')).get(1).element(by.binding('key')).getText())
                .toBe('Sat 28.05');
            expect(element.all(by.css('.spotmate-ranking .rank')).get(2).element(by.binding('key')).getText())
                .toBe('Sun 29.05');
        });

        it('should render 8h to 17h for each rank', function() {
            element.all(by.css('.spotmate-ranking .rank')).each(function(element, index) {
                expect(element.getText()).toContain('8h');
                expect(element.getText()).toContain('11h');
                expect(element.getText()).toContain('14h');
                expect(element.getText()).toContain('17h');
            });
        });
    });

});
