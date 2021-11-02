# generate-next-routes

Creates a file called `routes.js` containing the available routes in your `/pages` folder in your [Next.js](https://github.com/vercel/next.js/) project.

## Install
```bash
npm i -D generate-next-routes
```

## Usage
```
TODO
```

## Stucture of routes.js structure
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
