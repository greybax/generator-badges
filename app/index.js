'use strict';

var objectAssign = require('object-assign');
var yeoman = require('yeoman-generator');
var fs = require("fs")
var R = require('ramda');

// splitAndTrimEach :: String -> [String]
var splitAndTrimEach = R.pipe(R.split(' '), R.map(R.trim));

var badgesArr = {
    npm: {
        "init"  : `[![NPM version][npm-image]][npm-url]`,
        "url"   : `[npm-url]: https://npmjs.org/package/{project}`,
        "image" : `[npm-image]: https://img.shields.io/npm/v/{project}.svg?style=flat-square`
    },
    travis: {
        "init"  : `[![Build Status][travis-image]][travis-url]`,
        "url"   : `[travis-url]: https://travis-ci.org/{user}/{project}`,
        "image" : `[travis-image]: https://img.shields.io/travis/{user}/{project}/master.svg?style=flat-square`
    },
    coveralls: {
        "init"  : `[![Coveralls Status][coveralls-image]][coveralls-url]`,
        "url"   : `[coveralls-url]: https://coveralls.io/r/{user}/{project}`,
        "image" : `[coveralls-image]: https://img.shields.io/coveralls/{user}/{project}/master.svg?style=flat-square`
    },
    dependencies: {
        "init"  : `[![Dependency Status][depstat-image]][depstat-url]`,
        "url"   : `[depstat-url]: https://david-dm.org/{user}/{project}`,
        "image" : `[depstat-image]: https://david-dm.org/{user}/{project}.svg?style=flat-square`
    },
    devDependencies : {
        "init"  : `[![DevDependency Status][depstat-dev-image]][depstat-dev-url]`,
        "url"   : `[depstat-dev-url]: https://david-dm.org/{user}/{project}#info=devDependencies`,
        "image" : `[depstat-dev-image]: https://david-dm.org/{user}/{project}/dev-status.svg?style=flat-square`
    },
}

module.exports = yeoman.Base.extend({
    constructor: function() {
        yeoman.Base.apply(this, arguments);
        this.argument('user', { type: String, required: true,
            desc: 'Username on github: "yo badges greybax"\n',
        });
        this.argument('project', { type: String, required: true,
            desc: 'Project: "yo badges generator-badges"\n',
        });
        this.option('badges', { type: Array, required: false, alias: 'b',
            desc: 'Badges list: "yo badges -b npm travis coveralls dependencies devDependencies"',
        });
    },
    writing: {
        app: function() {
            var cli = {};

            var badges = this.options.badges;
            if (typeof badges === 'boolean') {
                this.log('Perhaps you forgot double dash: `-badges` instead of `--badges`');
            }

            if (badges) {
                cli.badges = (typeof badges === 'string') ? splitAndTrimEach(badges) : badges;
            }
            
            var result = "";
            cli.badges.forEach((b) => {
                result += badgesArr[b].init + '\n' 
                + badgesArr[b].url
                    .replace("\{project\}", this.project)
                    .replace("\{user\}", this.user) + '\n'
                + badgesArr[b].image
                    .replace("\{project\}", this.project)
                    .replace("\{user\}", this.user) + '\n';
            });

            fs.open("README.md", 'w', (err, fd) => {
                if (err) {
                    throw 'error opening file: ' + err;
                }
                var buffer = new Buffer(result);
                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) {
                        throw 'error writing file: ' + err;
                    }
                    
                    fs.close(fd);
                });
            });
        }
  },
  
  install: function() {
    this.npmInstall();
  }
});