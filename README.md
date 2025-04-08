# Tomorrow - Client

This is the client-side application for **Tomorrow**, a project management tool designed to help teams organize and track their tasks efficiently. The app is built using React and Vite, providing a fast and modern development experience.

## Features

- React-based frontend
- Vite for fast builds and HMR (Hot Module Replacement)
- ESLint for code linting
- Supports both Babel and SWC for Fast Refresh
- User authentication (Sign up and Log in)
- Interactive task boards for project management

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the Repository**  
   Clone the project repository to your local machine:

   ```bash
   git clone <repository-url>
   cd monday-e2e/client
   ```

2. **Install Dependencies**  
   Install the required dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server**  
   Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173` by default.

4. **Build for Production**  
   To create a production build of the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

5. **Preview the Production Build**  
   To preview the production build locally:

   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Accessing the Board

To access the task board, you can either sign up for a new account or log in using the following guest credentials:

- **Username:** guest
- **Password:** guest

## Project Structure

```
client/
├── public/         # Static assets
├── src/            # Source code
│   ├── components/ # React components
│   ├── pages/      # Application pages
│   ├── styles/     # CSS/SCSS files
│   └── main.jsx    # Application entry point
├── package.json    # Project metadata and dependencies
└── vite.config.js  # Vite configuration
```

## Contributing

If you wish to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## Contributors

This project was developed with contributions from:

- **Ofir**
- **Yuval**
- **Gal**

Feel free to contact any of us if you have any question about the project.