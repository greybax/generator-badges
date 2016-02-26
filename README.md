# generator-badges

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![DevDependency Status][depstat-dev-image]][depstat-dev-url]

> [Yeoman](http:\\yeoman.io) generator for adding badges to your README.md
> Works great as cli and with other generators too.

## Install

    npm install --global yo generator-badges

## Usage

```bash
yo badges i-am-user my-awesome-project -b travis npm
```
This command creates ```README.md``` (if doesn't exist) or created existing and put there follow rows:

```
[![Build Status][travis-image]][travis-url]
[travis-url]: https://travis-ci.org/i-am-user/my-awesome-project
[travis-image]: https://img.shields.io/travis/i-am-user/my-awesome-project/master.svg?style=flat-square

[![NPM version][npm-image]][npm-url]
[npm-url]: https://npmjs.org/package/my-awesome-project
[npm-image]: https://img.shields.io/npm/v/my-awesome-project.svg?style=flat-square
```

Now supports follow badges in options:

- ```npm``` — NPM version
- ```travis``` — Travis CI
- ```coveralls``` — coveralls.io
- ```dependencies``` — dependency status
- ```devDependencies``` — devDependency status

## Composability

> Composability is a way to combine smaller parts to make one large thing. Sort of [like Voltron®](http://25.media.tumblr.com/tumblr_m1zllfCJV21r8gq9go11_250.gif)

> — Yeoman docs

Just plug in for generates badges into your README.md into your generator.

### Install

    npm install --save generator-badges
    
### Compose

```js
this.composeWith('badges', { options: {
    user: "i-am-user",
    project: "my-awesome-project",
    badges: ['travis', 'npm']
  }
}, {
  local: require.resolve('generator-badges')
});
```

```user``` and ```project``` are **required** arguments.

## License

MIT © Aleksandr Filatov <greybax@gmail.com>

[npm-url]: https://npmjs.org/package/generator-badges
[npm-image]: https://img.shields.io/npm/v/generator-badges.svg?style=flat-square

[travis-url]: https://travis-ci.org/greybax/generator-badges
[travis-image]: https://img.shields.io/travis/greybax/generator-badges/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/greybax/generator-badges
[coveralls-image]: https://img.shields.io/coveralls/greybax/generator-badges/master.svg?style=flat-square

[depstat-url]: https://david-dm.org/greybax/generator-badges
[depstat-image]: https://david-dm.org/greybax/generator-badges.svg?style=flat-square

[depstat-dev-url]: https://david-dm.org/greybax/generator-badges#info=devDependencies
[depstat-dev-image]: https://david-dm.org/greybax/generator-badges/dev-status.svg?style=flat-square