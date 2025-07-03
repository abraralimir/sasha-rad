# Liferay React Portlet

This is a sample React portlet project built for Liferay DXP.

## Overview

This project demonstrates how to set up a modern React development workflow within a Liferay portlet. It uses `liferay-npm-bundler` to package the JavaScript application into an OSGi bundle that can be deployed to Liferay.

## Building the Portlet

1.  **Install JS Dependencies**:
    Before building, you need to install the Node.js dependencies.
    ```sh
    npm install
    ```

2.  **Build the OSGi Bundle**:
    Use a Liferay Workspace's Gradle wrapper to build the project.
    ```sh
    ./gradlew build
    ```

## Deployment

After a successful build, a `.jar` file will be generated in the `build/libs/` directory. Deploy this JAR file to your Liferay server's `deploy` folder.

Once deployed, you can add the "My React Portlet" from the "Sample" category to a page.
