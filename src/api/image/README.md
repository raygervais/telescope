# Image Service

The Image Service provides optimized images for backgrounds.

## Install

```
npm install
```

## Usage

By default the server is running on http://localhost:4444/.

You can use any/all the following optional query params:

1. `w` - the desired width. Must be between `200` and `2000`. Defaults to `800` if missing.
1. `t` - the desired image type. Must be one of `jpeg`, `jpg`, `webp`, `png`. Defaults to `jpeg`.

### Examples

- `GET /` - returns the default background JPEG with width = 800px
- `GET /?w=1024`- returns the default background JPEG with width = 1024px
- `GET /?t=png`- returns the default background JPEG with width = 800px as a PNG
  example.com/image as a WebP at 500px

## Docker

- To build and tag: `docker build . -t telescope_img_svc:latest`
- To run locally: `docker run -p 4444:4444 telescope_img_svc:latest`
