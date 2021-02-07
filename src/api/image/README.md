# Image Service

The Image Service provides optimized images for backgrounds.

## Install

```
npm install
```

## Usage

By default the server is running on http://localhost:4444/.

You can use any/all the following optional query params:

1. `t` - the desired image type. Must be one of `jpeg`, `jpg`, `webp`, `png`. Defaults to `jpeg`.
1. `w` - the desired width. Must be between `200` and `2000`. Defaults to `800` if missing.
1. `h` - the desired height. Must be between `200` and `3000`.

NOTE: if both `w` and `h` are used, the image will be resized/cropped to cover those dimensions

### Examples

- `GET /` - returns the default background JPEG with width = 800px. If requested from a browser or
  another agent that wants HTML, a gallery page will be returned of all backgrounds
- `GET /?w=1024`- returns the default background JPEG with width = 1024px
- `GET /?h=1024`- returns the default background JPEG with height = 1024px
- `GET /?w=1024&h=1024`- returns the default background JPEG with width = 1024px and height = 1024px
- `GET /?t=png`- returns the default background JPEG with width = 800px as a PNG

## Docker

- To build and tag: `docker build . -t telescope_img_svc:latest`
- To run locally: `docker run -p 4444:4444 telescope_img_svc:latest`
