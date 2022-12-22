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
