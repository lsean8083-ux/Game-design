# Phaser 4 - Basic JS Template

![License](https://img.shields.io/badge/license-MIT-green)

A barebones project template for getting started with [Phaser 4](https://github.com/photonstorm/phaser) using JavaScript.

**Phaser Version:** `4.0.0 RC4`

## Requirements

- A modern web browser
- A local web server

## Running Locally

You need to run a local web server to see the game running. Here are a few options:

- **Python:** If you have Python 3 installed, you can use the built-in http.server. From the root of the project, run: `python3 -m http.server 8080`. This will start a local web server on port 8080. Visit `http://localhost:8080/` in your browser to see the game.
- **Node.js:** If you have Node.js installed, you can use the `http-server` npm package. From the root of the project, run: `npx http-server`. This will start a local web server on port 8080. Visit `http://localhost:8080/` to see the game.
- **VS Code Extension:** If you use VS Code, you can install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension to run a local web server.

## Writing Code

This template is set up for a modern JavaScript development workflow without any build tools. Simply start your local web server and begin editing the files in the `src` folder. Your changes will be reflected when you refresh your browser.

The main entry point for the application is `src/main.js`.

## Deploying Code

This template includes a bundle script to gather all the necessary files for deployment into a `dist` folder.

To create a distributable bundle, run the following command from the root of the project:

```sh
bash scripts/bundle.sh
```

This will create a `dist` folder containing your game. The contents of this folder can then be uploaded to any static web hosting service. The script will exclude the `src/types` directory from the final bundle.

## Customizing Template

### VS Code Settings

The `.vscode` folder contains recommended extensions and settings for this project. You can customize or remove these as you see fit.

### Static Assets

Any static assets like images or audio files should be placed in the `assets` folder. They can then be loaded into your game.

## Changelog

This project uses the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format. You can view the changelog here: [Changelog](CHANGELOG.md).

## Issues

If you encounter any issues, please open a new [GitHub Issue](https://github.com/devshareacademy/phaser-4-basic-js-template/issues) on your project's repository.

## Questions, Comments, and Suggestions

If you have any questions, comments, or suggestions, please feel free to open a new [GitHub Discussion](https://github.com/devshareacademy/phaser-4-basic-js-template/discussions) on your project's repository.
