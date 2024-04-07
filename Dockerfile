# syntax=docker/dockerfile:1

# Prevents 403 errors in ghcr 

# This is the architecture you’re building for, which is passed in by the builder.
# Placing it here allows the previous steps to be cached across architectures.
ARG TARGETARCH

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

################################################################################
# Create a stage for building the static files.
FROM node:lts-alpine AS build_node
WORKDIR /src

COPY /react_app .
COPY buf.yaml ./buf.yaml
COPY buf.gen-node.yaml ./buf.gen.yaml
COPY /protos ./protos

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

RUN --mount=type=cache,target=/root/.npm \
    npx buf generate

RUN npx buf --version

RUN --mount=type=cache,target=/root/.npm \
    npm run build


################################################################################
# Create a stage for building the application.
FROM --platform=$BUILDPLATFORM golang:1.21 AS build_go
WORKDIR /src

COPY /go_app .
COPY buf.yaml ./buf.yaml
COPY buf.gen-go.yaml ./buf.gen.yaml
COPY /protos ./protos

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage bind mounts to go.sum and go.mod to avoid having to copy them into
# the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod download -x

RUN --mount=type=cache,target=/go/pkg/mod/ \
    go install github.com/bufbuild/buf/cmd/buf@latest
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest

RUN --mount=type=cache,target=/go/pkg/mod/ \ 
    buf generate
RUN --mount=type=cache,target=/go/pkg/mod/ \
    go generate ./...

RUN --mount=type=cache,target=/go/pkg/mod/ \
    go mod tidy

# Build the application.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage a bind mount to the current directory to avoid having to copy the
# source code into the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server .

################################################################################
# Create a new stage for running the application that contains the minimal
# runtime dependencies for the application. This often uses a different base
# image from the build stage where the necessary files are copied from the build
# stage.
#
# The example below uses the alpine image as the foundation for running the app.
# By specifying the "latest" tag, it will also use whatever happens to be the
# most recent version of that image when you build your Dockerfile. If
# reproducability is important, consider using a versioned tag
# (e.g., alpine:3.17.2) or SHA (e.g., alpine@sha256:c41ab5c992deb4fe7e5da09f67a8804a46bd0592bfdf0b1847dde0e0889d2bff).
FROM alpine:latest AS final

# Install any runtime dependencies that are needed to run your application.
# Leverage a cache mount to /var/cache/apk/ to speed up subsequent builds.
RUN --mount=type=cache,target=/var/cache/apk \
    apk --update add \
    ca-certificates \
    tzdata \
    && \
    update-ca-certificates

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
USER appuser

COPY --from=build_node /build /build
COPY --from=build_go /bin/server /bin/


# Expose the port that the application listens on.
EXPOSE 80

# What the container should run when it is started.
ENTRYPOINT [ "/bin/server" ]