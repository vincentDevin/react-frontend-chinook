
# React Final Project

**Note:** This project requires the backend to be set up and running for full functionality. You can find the backend project [here](https://github.com/vincentDevin/chinook-backend). Please ensure the backend is running before starting the frontend.

This project is a frontend web application built with React, Vite, and several other libraries, including Bootstrap for styling, React Hook Form for form handling, and Axios for making HTTP requests. This README provides the necessary instructions to set up and run the project.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Project Setup

### 1. Clone the Repository

First, clone the project repository:

```bash
git clone https://github.com/vincentDevin/react-final-project.git
cd react-final-project
```

### 2. Install Dependencies

After navigating into the project directory, install the necessary dependencies using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

or

```bash
yarn run dev
```

This will start the Vite development server and launch the app in your default browser at `http://localhost:3000`. The page will reload automatically whenever you make changes to the source files.

### 4. Building for Production

To build the application for production, run:

```bash
npm run build
```

or

```bash
yarn build
```

This will generate the production-ready files in the `dist/` directory.

### 5. Previewing the Production Build

To preview the production build locally, use:

```bash
npm run preview
```

or

```bash
yarn preview
```

This will serve the content from the `dist/` folder and allow you to preview the optimized production build.

### 6. Linting the Code

The project uses ESLint for code linting. To run the linter and check for code style issues, use:

```bash
npm run lint
```

or

```bash
yarn run lint
```

### 7. Running the Tests

To run the tests with Vitest, use the following command:

```bash
npm run test
```

or

```bash
yarn run test
```

This will execute the test suite and display the results in the terminal.

### 8. JSON Server (for Mock Data)

The project includes a script for running a mock JSON server with sample data from `chinook-data.json`. You can run this server locally to simulate the backend API:

```bash
npm run json-server
```

or

```bash
yarn run json-server
```

This will start the JSON server at `http://localhost:8080`.

## Dependencies

### Main Libraries

- **React**: Frontend library for building the user interface.
- **React Router DOM**: Handles routing and navigation within the app.
- **Axios**: For making HTTP requests to the backend API.
- **Bootstrap**: For responsive and modern UI design.
- **Yup**: Schema builder for form validation.
- **React Hook Form**: Simplifies form handling and validation in React apps.

### Developer Tools

- **Vite**: A fast build tool that serves as the bundler and development server.
- **Vitest**: A testing framework integrated with Vite for running tests.
- **ESLint**: Ensures code consistency and enforces best practices.

## Contributing

If you'd like to contribute to the project, feel free to fork the repository, submit a pull request, or open an issue for discussion.
