"use strict";

let yeoman = require("yeoman-generator");
let yosay = require("yosay");
let mergeAndConcat = require("merge-and-concat");
let ifEmpty = require('if-empty');
let R = require('ramda');

// splitAndTrimEach :: String -> [String]
let splitAndTrimEach = R.pipe(R.split(","), R.map(R.trim));

let badgesArr = {
  appveyor: {
    init: "[![Appveyor Status][appveyor-image]][appveyor-url]",
    url: "[appveyor-url]: https://ci.appveyor.com/api/projects/status/github/{user}/{project}?retina=true&svg=true",
    image: "[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/{user}/{project}?retina=true&svg=true",
  },
  codeship: {
    init: "[![Codeship Status][codeship-image]][codeship-url]",
    url: "[codeship-url]: https://codeship.com/projects/{project}/status?branch=master",
    image: "[codeship-image]: https://codeship.com/projects/{project}/status?branch=master",
  },
  coveralls: {
    init: "[![Coveralls Status][coveralls-image]][coveralls-url]",
    url: "[coveralls-url]: https://coveralls.io/r/{user}/{project}",
    image: "[coveralls-image]: https://img.shields.io/coveralls/{user}/{project}/master.svg?style=flat-square",
  },
  dependencies: {
    init: "[![Dependency Status][depstat-image]][depstat-url]",
    url: "[depstat-url]: https://david-dm.org/{user}/{project}",
    image: "[depstat-image]: https://david-dm.org/{user}/{project}.svg?style=flat-square",
  },
  devDependencies: {
    init: "[![DevDependency Status][depstat-dev-image]][depstat-dev-url]",
    url: "[depstat-dev-url]: https://david-dm.org/{user}/{project}#info=devDependencies",
    image: "[depstat-dev-image]: https://david-dm.org/{user}/{project}/dev-status.svg?style=flat-square",
  },
  npm: {
    init: "[![NPM version][npm-image]][npm-url]",
    url: "[npm-url]: https://npmjs.org/package/{project}",
    image: "[npm-image]: https://img.shields.io/npm/v/{project}.svg?style=flat-square",
  },
  scrunitizer: {
    init: "[![Scrunitizer Status][scrunitizer-image]][scrunitizer-url]",
    url: "[scrunitizer-url]: https://scrutinizer-ci.com/g/{user}/{project}/?branch=master",
    image: "[scrunitizer-image]: https://scrutinizer-ci.com/g/{user}/{project}/badges/quality-score.png?b=master",
  },
  travis: {
    init: "[![Build Status][travis-image]][travis-url]",
    url: "[travis-url]: https://travis-ci.org/{user}/{project}",
    image: "[travis-image]: https://img.shields.io/travis/{user}/{project}/master.svg?style=flat-square",
  },
  wercker: {
    init: "[![Wercker status][wercker-image]][wercker-url]",
    url: "[wercker-url]: https://app.wercker.com/status/c9652f41f3b2678656422c1570f54ac5/m/master/{project}",
    image: "[wercker-image]: ",
  }
}

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.argument("noPrompts", { type: String, required: false });
    this.option("user", {
      type: String, required: false, alias: "u",
      desc: "Username on github: yo badges -u greybax \n",
    });
    this.option("project", {
      type: String, required: false, alias: "p",
      desc: "Project: yo badges -p generator-badges \n",
    });
    this.option("badges", {
      type: Array, required: false, alias: "b",
      desc: "Badges list: yo badges -b npm travis,coveralls,dependencies,devDependencies",
    });
  },

  initializing: function initializing() {
    this.log(yosay("Welcome to the generator badges!"));
    this.props = {};
  },

  prompting: function prompting() {
    if (this.noPrompts) {
      return;
    }

    let prompts = [{
      name: "project",
      message: "Project name:",
      validate: ifEmpty('You need to provide a project name')
    }, {
        name: "user",
        message: "Github profile:",
        validate: ifEmpty('You need to provide a github username'),
        store: true
      }, {
        type: "checkbox",
        name: "badges",
        message: "Badges:",
        choices: [{
            name: 'appveyor',
            value: 'appveyor',
            checked: false
          }, {
            name: 'codeship',
            value: 'codeship',
            checked: false
          }, {
            name: 'coveralls',
            value: 'coveralls',
            checked: false
          }, {
            name: 'dependencies',
            value: 'dependencies',
            checked: false
          }, {
            name: 'devDependencies',
            value: 'devDependencies',
            checked: false
          }, {
            name: 'npm',
            value: 'npm',
            checked: false
          }, {
            name: 'scrunitizer',
            value: 'scrunitizer',
            checked: false
          }, {
            name: 'travis',
            value: 'travis',
            checked: false
          }, {
            name: 'wercker',
            value: 'wercker',
            checked: false
          }]
      }];

    return this.prompt(prompts)
      .then(function (inputAnswers) {
        this.props = Object.assign({}, inputAnswers);
      }.bind(this));
  },

  writing: function writing() {
    let cli = {};
    let optional = this.options.config || {};

    let badges = this.options.badges;
    if (typeof badges === "boolean") {
      this.log("Perhaps you forgot double dash: `-badges` instead of `--badges`");
    }

    if (badges) {
      cli.badges = (typeof badges === "string") ? splitAndTrimEach(badges) : badges;
    }

    cli.user = this.options.user;
    cli.project = this.options.project;
    let common = mergeAndConcat(cli, optional, this.props);

    let existing = this.fs.exists(this.destinationPath('README.md'))
      ? this.fs.read(this.destinationPath('README.md'))
      : {};

    let resultBadges = "";
    common.badges.forEach(function (b) {
      resultBadges += badgesArr[b].init + "\n"
        + badgesArr[b].url
          .replace("\{project\}", common.project)
          .replace("\{user\}", common.user) + "\n"
        + badgesArr[b].image
          .replace("\{project\}", common.project)
          .replace("\{user\}", common.user) + "\n";
    });

    let result = R.concat(resultBadges, existing);

    this.fs.write(
      this.destinationPath("README.md"),
      result
    )
  }
});