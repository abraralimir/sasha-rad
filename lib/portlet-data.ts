
export type PortletFile = {
  id: string;
  name: string;
  type: 'file';
  path: string;
  content: string;
};

export type PortletFolder = {
  id: string;
  name: string;
  type: 'folder';
  path: string;
  children: PortletEntry[];
};

export type PortletEntry = PortletFile | PortletFolder;

// --- File Contents ---

const buildGradleContent = `dependencies {
	compileOnly group: "com.liferay.portal", name: "com.liferay.portal.kernel"
	compileOnly group: "javax.portlet", name: "portlet-api"
	compileOnly group: "org.osgi", name: "osgi.cmpn"
    compileOnly group: "com.liferay.portlet.bridges", name: "com.liferay.portlet.bridges.mvc"
    compileOnly group: "org.osgi.service.component.annotations", name: "org.osgi.service.component.annotations"

    // JSP Taglib dependencies
    compileOnly group: "com.liferay", name: "com.liferay.asset.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.comment.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.frontend.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.journal.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.layout.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.portlet.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.site.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.trash.taglib"
    compileOnly group: "com.liferay", name: "com.liferay.wiki.taglib"
}

task npmBuild(type: Exec) {
    commandLine 'npm', 'run', 'build'
}

jar.dependsOn(npmBuild)
`;

const bndBndContent = `Bundle-Name: My React Portlet
Bundle-SymbolicName: com.example.my.reactportlet
Bundle-Version: 1.0.0
-ds-annotations-options: inherit
Web-ContextPath: /my-react-portlet`;

const npmBundlerRcContent = `{
	"config": {
		"imports": {
			"react": "React",
			"react-dom": "ReactDOM"
		}
	},
	"webpack": "webpack.config.js"
}`;

const packageJsonContent = `{
  "name": "my-react-portlet",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.24.1",
    "@babel/core": "^7.24.4",
    "@babel/preset-env": "^7.24.4",
    "@babel/preset-react": "^7.24.1",
    "babel-loader": "^9.1.3",
    "liferay-npm-bundler": "^2.31.0",
    "liferay-npm-scripts": "^31.0.0",
    "webpack": "^5.91.0",
    "webpack-cli": "^5.1.4"
  },
  "scripts": {
    "build": "babel --source-maps -d build/resources/main/META-INF/resources/js src/main/resources/META-INF/resources/js && liferay-npm-bundler"
  }
}`;

const readmeMdContent = `# My React Portlet

This project is a Liferay portlet built with React.

## Overview

This is a sample project that demonstrates how to create a client-side portlet using React and Liferay's tooling.

## Build & Deploy

1.  **Prerequisites**: You need a Liferay Workspace set up.
2.  **Move Folder**: Move this \`my-react-portlet\` folder into your Liferay Workspace's \`modules\` directory.
3.  **Build**: From the root of your Liferay Workspace, run the Gradle \`deploy\` task:
    \`\`\`bash
    ./gradlew deploy
    \`\`\`
4.  **Deploy**: The generated \`.jar\` file will be in the \`build/libs\` directory inside this project. It will be automatically deployed to your running Liferay bundle.
5.  **Add to Page**: You can find "My React Portlet" in the "Sample" category when adding portlets to a Liferay page.
`;

const webpackConfigContent = `const path = require('path');

module.exports = {
  entry: {
    main: './src/main/resources/META-INF/resources/js/main.js',
  },
  output: {
    path: path.resolve(
      __dirname,
      'build/resources/main/META-INF/resources/js'
    ),
    filename: '[name].js',
    library: 'MyReactPortlet',
    libraryTarget: 'global'
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
};`;

const reactPortletJavaContent = `package com.example.reactportlet;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import javax.portlet.Portlet;

import org.osgi.service.component.annotations.Component;

@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.header-portlet-css=/css/main.css",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.display-name=My React Portlet",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=com_example_reactportlet_ReactPortlet",
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class ReactPortlet extends MVCPortlet {
}`;

const viewJspContent = `<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />-root"></div>

<liferay-frontend:require
    modules="my-react-portlet@1.0.0/js/main"
    onResolved="
        Liferay.Loader.require('my-react-portlet@1.0.0/js/main').then(
            main => {
                main.default({
                    portletElementId: '<portlet:namespace />-root'
                });
            }
        )
    "
/>`;

const initJspContent = `<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ taglib uri="http://liferay.com/tld/frontend" prefix="liferay-frontend" %>

<liferay-theme:defineObjects />
<portlet:defineObjects />
`;

const mainCssContent = `#<portlet-namespace />-root {
  min-height: 200px;
}
`;

const languagePropertiesContent = `javax.portlet.title=My React Portlet
`;

const appJsContent = `import React from 'react';

export default function App() {
  const containerStyles = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyles = {
    color: '#333'
  };

  const paragraphStyles = {
    color: '#555'
  };

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Hello from My React Portlet!</h1>
      <p style={paragraphStyles}>This component is rendered by React within a Liferay portlet.</p>
    </div>
  );
}`;

const mainJsContent = `import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

/**
 * This is the main entry point of the portlet.
 *
 * @param {string} portletElementId The ID of the DOM element which
 *                                  acts as the root of the portlet
 */
export default function main({portletElementId}) {
    const portletElement = document.getElementById(portletElementId);

    ReactDOM.render(<App />, portletElement);
}`;


const rootPath = "my-react-portlet";

export const initialProject: PortletFolder = {
  id: rootPath,
  name: "my-react-portlet",
  type: 'folder',
  path: rootPath,
  children: [
    {
        id: `${rootPath}/src`,
        name: 'src',
        type: 'folder',
        path: `${rootPath}/src`,
        children: [
            {
                id: `${rootPath}/src/main`,
                name: 'main',
                type: 'folder',
                path: `${rootPath}/src/main`,
                children: [
                    {
                        id: `${rootPath}/src/main/java`,
                        name: 'java',
                        type: 'folder',
                        path: `${rootPath}/src/main/java`,
                        children: [
                            {
                                id: `${rootPath}/src/main/java/com`,
                                name: 'com',
                                type: 'folder',
                                path: `${rootPath}/src/main/java/com`,
                                children: [
                                    {
                                        id: `${rootPath}/src/main/java/com/example`,
                                        name: 'example',
                                        type: 'folder',
                                        path: `${rootPath}/src/main/java/com/example`,
                                        children: [
                                            {
                                                id: `${rootPath}/src/main/java/com/example/reactportlet`,
                                                name: 'reactportlet',
                                                type: 'folder',
                                                path: `${rootPath}/src/main/java/com/example/reactportlet`,
                                                children: [
                                                    {
                                                        id: `${rootPath}/src/main/java/com/example/reactportlet/ReactPortlet.java`,
                                                        name: 'ReactPortlet.java',
                                                        type: 'file',
                                                        path: `${rootPath}/src/main/java/com/example/reactportlet/ReactPortlet.java`,
                                                        content: reactPortletJavaContent,
                                                    },
                                                ]
                                            }
                                        ]
                                    }

                                ]
                            }
                        ]
                    },
                    {
                        id: `${rootPath}/src/main/resources`,
                        name: 'resources',
                        type: 'folder',
                        path: `${rootPath}/src/main/resources`,
                        children: [
                            {
                                id: `${rootPath}/src/main/resources/content`,
                                name: 'content',
                                type: 'folder',
                                path: `${rootPath}/src/main/resources/content`,
                                children: [
                                    {
                                        id: `${rootPath}/src/main/resources/content/Language.properties`,
                                        name: 'Language.properties',
                                        type: 'file',
                                        path: `${rootPath}/src/main/resources/content/Language.properties`,
                                        content: languagePropertiesContent,
                                    },
                                ]
                            },
                            {
                                id: `${rootPath}/src/main/resources/META-INF`,
                                name: 'META-INF',
                                type: 'folder',
                                path: `${rootPath}/src/main/resources/META-INF`,
                                children: [
                                    {
                                        id: `${rootPath}/src/main/resources/META-INF/resources`,
                                        name: 'resources',
                                        type: 'folder',
                                        path: `${rootPath}/src/main/resources/META-INF/resources`,
                                        children: [
                                            {
                                                id: `${rootPath}/src/main/resources/META-INF/resources/css`,
                                                name: 'css',
                                                type: 'folder',
                                                path: `${rootPath}/src/main/resources/META-INF/resources/css`,
                                                children: [
                                                    {
                                                        id: `${rootPath}/src/main/resources/META-INF/resources/css/main.css`,
                                                        name: 'main.css',
                                                        type: 'file',
                                                        path: `${rootPath}/src/main/resources/META-INF/resources/css/main.css`,
                                                        content: mainCssContent,
                                                    },
                                                ]
                                            },
                                            {
                                                id: `${rootPath}/src/main/resources/META-INF/resources/js`,
                                                name: 'js',
                                                type: 'folder',
                                                path: `${rootPath}/src/main/resources/META-INF/resources/js`,
                                                children: [
                                                    {
                                                        id: `${rootPath}/src/main/resources/META-INF/resources/js/App.js`,
                                                        name: 'App.js',
                                                        type: 'file',
                                                        path: `${rootPath}/src/main/resources/META-INF/resources/js/App.js`,
                                                        content: appJsContent,
                                                    },
                                                    {
                                                        id: `${rootPath}/src/main/resources/META-INF/resources/js/main.js`,
                                                        name: 'main.js',
                                                        type: 'file',
                                                        path: `${rootPath}/src/main/resources/META-INF/resources/js/main.js`,
                                                        content: mainJsContent,
                                                    },
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: `${rootPath}/src/main/resources/init.jsp`,
                                name: 'init.jsp',
                                type: 'file',
                                path: `${rootPath}/src/main/resources/init.jsp`,
                                content: initJspContent,
                            },
                            {
                                id: `${rootPath}/src/main/resources/view.jsp`,
                                name: 'view.jsp',
                                type: 'file',
                                path: `${rootPath}/src/main/resources/view.jsp`,
                                content: viewJspContent,
                            },

                        ]
                    },
                    {
                        id: `${rootPath}/src/main/webpack.config.js`,
                        name: 'webpack.config.js',
                        type: 'file',
                        path: `${rootPath}/src/main/webpack.config.js`,
                        content: webpackConfigContent,
                    }
                ]
            }
        ]
    },
    {
      id: `${rootPath}/package.json`,
      name: 'package.json',
      type: 'file',
      path: `${rootPath}/package.json`,
      content: packageJsonContent,
    },
    {
      id: `${rootPath}/bnd.bnd`,
      name: 'bnd.bnd',
      type: 'file',
      path: `${rootPath}/bnd.bnd`,
      content: bndBndContent,
    },
    {
      id: `${rootPath}/build.gradle`,
      name: 'build.gradle',
      type: 'file',
      path: `${rootPath}/build.gradle`,
      content: buildGradleContent,
    },
    {
      id: `${rootPath}/.npmbundlerrc`,
      name: '.npmbundlerrc',
      type: 'file',
      path: `${rootPath}/.npmbundlerrc`,
      content: npmBundlerRcContent,
    },
    {
      id: `${rootPath}/README.md`,
      name: 'README.md',
      type: 'file',
      path: `${rootPath}/README.md`,
      content: readmeMdContent,
    },
  ],
};


export function findFileById(node: PortletEntry, id: string): PortletFile | null {
  if (node.type === 'file' && node.id === id) {
    return node;
  }
  if (node.type === 'folder') {
    for (const child of node.children) {
      const found = findFileById(child, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function updateFileContent(node: PortletFolder, id: string, content: string): PortletFolder {
    const updateRecursively = (entries: PortletEntry[]): PortletEntry[] => {
        return entries.map(entry => {
            if (entry.type === 'file' && entry.id === id) {
                return { ...entry, content };
            }
            if (entry.type === 'folder') {
                return { ...entry, children: updateRecursively(entry.children) };
            }
            return entry;
        });
    };
    
    const newProject = { ...node, children: updateRecursively(node.children) };

    return newProject;
}

    

    