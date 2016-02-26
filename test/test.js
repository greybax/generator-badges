'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-badges:app', function () {
    before(function (done) {
        helpers.run(path.join( __dirname, '../app'))
        .withOptions({
            user: 'iamuser',
            project: 'generator-badges',
            badges: ['travis', 'dependencies'],
        })
        .on('end', done);
    });

    it('generates README.md file', function () {
      assert.file('README.md');
    });

    it('contains arguments in README.md', function () {
        assert.fileContent('README.md', 'iamuser');
        assert.fileContent('README.md', 'generator-badges');
    });
});
