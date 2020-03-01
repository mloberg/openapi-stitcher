# OpenAPI Stitcher

Stitch together OpenAPI files into a single file.

## Requirements

* NodeJS (>= 10)

## Usage

See help for all commands and options

    npx openapi-stitcher --help
    npx openapi-stitcher build --help

Stitch together files matching a pattern.

    npx openapi-stitcher build "spec/**/*.{yaml,yml}" openapi.yaml

Watch for changes and rebuild the file.

    npx openapi-stitcher build --watch "spec/**/*.{yaml,yml}" openapi.yaml

Serve the specification using [Swagger UI](https://github.com/swagger-api/swagger-ui).

    npx openapi-stitcher serve "spec/**/*.{yaml,yml}"

See _example/spec_ for an example of how to organize your files to best work
with this tool.
