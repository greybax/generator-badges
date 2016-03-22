'use strict';

var yeoman = require('yeoman-generator');
var mergeAndConcat = require('merge-and-concat');
var R = require('ramda');

// splitAndTrimEach :: String -> [String]
var splitAndTrimEach = R.pipe(R.split(' '), R.map(R.trim));

var badgesArr = {
    npm: {
        "init"  : "[![NPM version][npm-image]][npm-url]",
        "url"   : "[npm-url]: https://npmjs.org/package/{project}",
        "image" : "[npm-image]: https://img.shields.io/npm/v/{project}.svg?style=flat-square",
    },
    travis: {
        "init"  : "[![Build Status][travis-image]][travis-url]",
        "url"   : "[travis-url]: https://travis-ci.org/{user}/{project}",
        "image" : "[travis-image]: https://img.shields.io/travis/{user}/{project}/master.svg?style=flat-square",
    },
    coveralls: {
        "init"  : "[![Coveralls Status][coveralls-image]][coveralls-url]",
        "url"   : "[coveralls-url]: https://coveralls.io/r/{user}/{project}",
        "image" : "[coveralls-image]: https://img.shields.io/coveralls/{user}/{project}/master.svg?style=flat-square",
    },
    dependencies: {
        "init"  : "[![Dependency Status][depstat-image]][depstat-url]",
        "url"   : "[depstat-url]: https://david-dm.org/{user}/{project}",
        "image" : "[depstat-image]: https://david-dm.org/{user}/{project}.svg?style=flat-square",
    },
    devDependencies : {
        "init"  : "[![DevDependency Status][depstat-dev-image]][depstat-dev-url]",
        "url"   : "[depstat-dev-url]: https://david-dm.org/{user}/{project}#info=devDependencies",
        "image" : "[depstat-dev-image]: https://david-dm.org/{user}/{project}/dev-status.svg?style=flat-square",
    },
}

module.exports = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);
        this.option('user', { type: String, required: false, alias: 'u',
            desc: 'Username on github: "yo badges -u greybax"\n',
        });
        this.option('project', { type: String, required: false, alias: 'p',
            desc: 'Project: "yo badges -p generator-badges"\n',
        });
        this.option('badges', { type: Array, required: false, alias: 'b',
            desc: 'Badges list: "yo badges -b npm travis coveralls dependencies devDependencies"',
        });
    },
    writing: {
        app: function() {
            var cli = {};
            var optional =  this.options.config || {};
            var done = this.async();

            var badges = this.options.badges;
            if (typeof badges === 'boolean') {
                this.log('Perhaps you forgot double dash: `-badges` instead of `--badges`');
            }

            if (badges) {
                cli.badges = (typeof badges === 'string') ? splitAndTrimEach(badges) : badges;
            }
            
            cli.user = this.options.user;
            cli.project = this.options.project;
            var common = mergeAndConcat(cli, optional);
            
            var result = "";
            common.badges.forEach(function(b) {
                result += badgesArr[b].init + '\n'
                + badgesArr[b].url
                    .replace("\{project\}", common.project)
                    .replace("\{user\}", common.user) + '\n'
                + badgesArr[b].image
                    .replace("\{project\}", common.project)
                    .replace("\{user\}", common.user) + '\n';
            });
            
            this.fs.write(
                this.destinationPath('README.md'),
                result
            )
        },
    },
    install: function() {
        if (!this.options['skip-install']) {
            this.npmInstall();
        }
    },
});