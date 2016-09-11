'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var generator = function() {
  return helpers.run(path.join(__dirname, '../app'));
};

it('creates README.md', function (done) {
    assert.file('README.md');
    done();
});

it('contains arguments in README.md', function (done) {
    assert.fileContent('README.md', 'greybax');
    assert.fileContent('README.md', 'generator-badges');
    done();
});