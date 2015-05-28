describe("decamelCase", function () {

    it("converts camelCase syntax to dashed", function () {

        expect(
            x.decamelCase("hello")
        ).toBe("hello");

        expect(
            x.decamelCase("helloWorld")
        ).toBe("hello-world");

        expect(
            x.decamelCase("helloWorldAgainAndAgain")
        ).toBe("hello-world-again-and-again");

    });

});