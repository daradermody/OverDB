# OverDB server

## Project structure

OverDB's backend uses the following technologies:

- Typescript
- Apollo Server
- Plain JSON files (as database)
- Nexe

Almost all requests go through [these resolvers](./src/resolvers/index.ts) (the exception being `/loginWithPassword`) which then user [services](./src/services) to fetch or manipulate data. The registered list of users is [hardcoded](./src/services/users.ts) and user information is stored in the cookie.

`ts-node` is used as the dev server, and a combination of `esbiuld` and `nexe` is used to create an executable that is pushed to AWS EC2. The EC2 server is then hidden behind CloudFront. To start the server, a `TMDB_TOKEN` environment variable needs to be set (e.g. in your `~/.bashrc`).

## Data

Movie data is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/), with some review information scraped from [Rotten Tomatoes](https://www.rottentomatoes.com/). To make user experience faster and to reduce the number of requests being sent to TMDB, we cache movie information in memory (with no limit!). This is also stored into a JSON file so it can be reloaded on a restart.

All user data (favourite people, movies, watchlist, etc.) is also stored in a single JSON file, keyed by user ID.

These data files are located in `./data` when running the dev environment, or in `/var/lib/overdb` on production.

