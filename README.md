# generate-next-routes

Generates a `routes.js` file containing the available routes in `/pages` folder in [Next.js](https://github.com/vercel/next.js/) project.

## Install
```bash
npm install --save-dev generate-next-routes
```
or
```bash
yarn add -D generate-next-routes
```

## Generation
Add `generate-next-routes` as a script to `package.json` (not necessary when using yarn)
``` jsonc
"scripts": {
  /* existing scripts */
  "generate-next-routes": "generate-next-routes"
}
```
Run command
``` bash
npm run generate-next-routes
```
or
```bash
yarn generate-next-routes
```

## Usage

### Old way
``` javascript
<Link href="/about-us">
  About us
</Link>
```
### New way
``` javascript
import { routes } from '../routes'; // path can be aliased in your jsconfig for easier imports

<Link href={routes.aboutUs}>
  About us
</Link>
```
[How to implement path alias](https://code.visualstudio.com/docs/languages/jsconfig#_using-webpack-aliases)
## Stucture of routes.js file
Given a directory structured like this:

```
pages
├── news
│   └── articles
│       └── [article]
│           ├── edit.js
│           └── index.js
├── user
│   └── [user].js
├── _app.js
├── about-us.js
├── blog.js
└── index.js
```

Generates a `routes.js` file that looks like this:

``` javascript
export const routes = {
  _app: '/_app',
  aboutUs: '/about-us',
  blog: '/blog',
  home: '/',
  news: {
    articles: {
      article: {
        edit: {
          getRoute: (article) => `/news/articles/${article}/edit}`
        },
        home: {
          getRoute: (article) => `/news/articles/${article}}`
        }
      },
      home: '/news/articles'
    }
  },
  user: { user: { getRoute: (user) => `/user/${user}}` } }
}
```
