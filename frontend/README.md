# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `sudo ./run.sh`

Spins up the backend in the docker mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
Runs the app in the development mode. Open [http://localhost:3005](http://localhost:3005) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `sudo ./run.sh --test`

Spins up the backend in the docker mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.\
Runs the app in the production mode. Open [http://localhost:3005](http://localhost:3005) to view it in your browser.\
Runs all tests from `.\tests` and displays the result on the terminal.

The command `npx playwright test` can be run afterwards to re-test modified test cases.\
The pages will NOT reload when you make changes.

### `npm start`

Runs the app in the development mode. Open [http://localhost:3005](http://localhost:3005) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
