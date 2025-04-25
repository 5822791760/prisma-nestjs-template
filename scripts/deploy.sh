#!/bin/bash

# Exit script on any error
set -e

DOCKER_IMAGE_NAME="your-dockerhub-username/your-image-name"
DOCKER_TAG="latest"
DOCKERFILE_PATH="../dockerfile"

check_dependencies() {
    if ! command -v docker &> /dev/null; then
        echo "Error: Docker is not installed. Please install Docker."
        exit 1
    fi
}

build_image() {
    echo "Building Docker image from $DOCKERFILE_PATH..."
    docker build -t $DOCKER_IMAGE_NAME:$DOCKER_TAG -f $DOCKERFILE_PATH ..
    echo "Docker image built successfully: $DOCKER_IMAGE_NAME:$DOCKER_TAG"
}

push_image() {
    echo "Pushing Docker image to Docker Hub..."

    # Ensure user is logged into Docker Hub
    docker login || { echo "Docker login failed"; exit 1; }

    docker push $DOCKER_IMAGE_NAME:$DOCKER_TAG
    echo "Docker image pushed successfully to Docker Hub."
}

cleanup() {
    echo "Cleaning up old unused images..."
    docker image prune -f
}

main() {
    check_dependencies
    build_image
    push_image
    cleanup
}

# Run the deployment
main
