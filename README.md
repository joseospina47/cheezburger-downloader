# Cheezburger Downloader

Cheezburger Downloader is a Node.js command-line application that allows you to download images from the popular website Cheezburger (https://icanhas.cheezburger.com/).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install Cheezburger Downloader, you must first have Node.js v18.0.0 or greater and NPM (Node Package Manager) installed on your machine. Once you have these prerequisites installed, follow these steps:

1. Clone the repository: `git clone https://github.com/joseospina47/cheezburger-downloader.git`
2. Navigate to the project directory: `cd cheezburger-downloader`
3. Install the tool: `npm install -g`

## Usage

To use Cheezburger Downloader, run the following command in the terminal:

```bash

cheezburger

```

The terminal will prompt the following info:

```bash
? How many images do you want to download? 100
? How many threads do you want to use? 5
? What is the output folder? /Users/<User>/<Directory>/<Sub-directory>/output
```

This case will download 100 images using 5 worker threads from Cheezburger and save them in the `/Users/<User>/<Directory>/<Sub-directory>/output` directory.

## Contributing

Contributions to Cheezburger Downloader are welcome and encouraged! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b new-feature`
3. Make your changes and commit them: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request

Please make sure your code follows the project's code style and passes all tests before submitting a pull request.

## License

Cheezburger Downloader is licensed under the MIT License. See LICENSE file for more details.




