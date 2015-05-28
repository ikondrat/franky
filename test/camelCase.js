describe("camelCase", function () {

    it("converts dashed syntax to camelCase", function () {

        expect(
            x.camelCase("hello-world")
        ).toBe("helloWorld");

        expect(
            x.camelCase("hello")
        ).toBe("hello");

        expect(
            x.camelCase("hello-world-again-and-again")
        ).toBe("helloWorldAgainAndAgain");

    });

});