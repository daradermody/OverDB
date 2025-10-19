# OverDB

Follow directors, screenwriters, cinematographers, and others to find films you love!

## Project structure

OverDB's frontend uses the following technologies:

- Typescript
- React
- Material UI
- React Router
- Bun
- tRPC+Tanstack Query

This project is composed of two workspaces:

- [Frontend](./packages/frontend)
- [Backend](./packages/backend)

These two communicate almost entirely in GraphQL, and uses cookies for session authentication. All movie data is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

All workspaces can be built and deployed using `yarn build` and `yarn deploy` (though backend deployment requires extra steps). Both are deployed to AWS services (S3 and EC2) and delivered through AWS CloudFront (which also provides HTTPS), so deployment requires access setup.

## Usage

[Create an issue](https://github.com/daradermody/OverDB/issues/new?title=Create%20an%20account%20for%20%27tom%27%20please!) requesting an account to be created to start using the website! It's still alpha, so all passwords are provided and unsecure for now.

## Contributing

You can contribute merely by using the website and [reporting](https://github.com/daradermody/OverDB/issues) issues and feature requests or by helping to code!
