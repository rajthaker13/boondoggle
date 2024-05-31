# Boondoggle Contribution Guidelines + Instructions

## Overview

Welcome to the Boondoggle's repo! This repository contains the code for a dashboard designed to maintain the hygiene of data in business software, specifically Customer Relationship Management (CRM) systems. The dashboard provides insights into CRM data quality, detects issues, and offers solutions to resolve them. This project emphasizes Agile methodologies and follows a strict coding style guide to ensure consistency and maintainability.

## Features

- **CRM Integration:** Connect and manage data from various CRM systems.
- **Data Quality Scoring:** Evaluate the cleanliness and accuracy of CRM data.
- **Issue Detection:** Identify and report issues within the CRM data.
- **Issue Resolution:** Provide tools and workflows to resolve detected issues.
- **LinkedIn Integration:** Optional integration with LinkedIn for enhanced data insights.

## Agile Methodologies

This project follows Agile methodologies to ensure continuous improvement and adaptability through iterative development. Key practices include:

Scrum Framework: Regular sprints, daily stand-ups, sprint reviews, and retrospectives.
User Stories: Development driven by user stories that capture requirements from the user's perspective.
Continuous Integration: Regular integration of code changes to detect and fix issues early.
Test-Driven Development (TDD): Writing tests before developing features to ensure code reliability and functionality.

## Coding Style Guide

To maintain a high standard of code quality, this project adheres to the following coding style guide:

General Principles
Readability: Write clear and understandable code.
Consistency: Follow consistent patterns and conventions.
Modularity: Keep code modular and reusable.
JavaScript/React
Variable and Function Naming:

Use camelCase for variable and function names.
Use PascalCase for React components.
File Structure:

Organize components into a components directory.
Keep feature-specific files within their respective directories.
React Components:

Use functional components with hooks.
Prefer useState and useEffect for state management and side effects.
Styling: Tailwind CSS

## Example Code

```JSX
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Accounts from "./Accounts";
import Issues from "./Issues";
import Score from "./Score";
import LoadingOverlay from "react-loading-overlay";
import { Dialog, DialogPanel, Button } from "@tremor/react";

function Dashboard(props) {
  const [crmConnected, setCRMConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialization logic
  }, []);

  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          {/* Modal Content */}
        </DialogPanel>
      </Dialog>
      <div className="justify-center items-center w-[100vw] h-[100vh]">
        <Header selectedTab={0} db={props.db} />
        <Score crmConnected={crmConnected} setCRMConnected={setCRMConnected} setIsLoading={true} crmScore={crmScore} numIssues={numIssues} issuesResolved={issuesResolved} />
        <Accounts crmConnected={crmConnected} linkedInLinked={linkedInLinked} />
        {crmConnected && (
          <Issues crmConnected={crmConnected} setIsOpen={setIsOpen} setOpenCookieModal={setOpenCookieModal} issuesResolved={issuesResolved} linkedInLinked={linkedInLinked} />
        )}
      </div>
    </LoadingOverlay>
  );
}

export default Dashboard;

```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

Databse PassL 6aWxabeDEYbAqOOA

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
