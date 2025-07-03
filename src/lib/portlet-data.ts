
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

const appJsxContent = `import React from 'react';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header title="Welcome to Your React App" />
      <main>
        <p>
          Start building your application by editing <code>src/App.jsx</code>.
        </p>
        <p>
          You can ask Sasha to create new components, add styling, or implement features!
        </p>
      </main>
    </div>
  );
}

export default App;
`;

const headerJsxContent = `import React from 'react';

function Header({ title }) {
  return (
    <header className="App-header">
      <h1>{title}</h1>
    </header>
  );
}

export default Header;
`;

const indexCssContent = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
  color: #333;
}

.App {
  text-align: center;
  padding: 2em;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  border-radius: 8px;
  margin-bottom: 2em;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
}
`;

const indexJsContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

const packageJsonContent = `{
  "name": "my-react-project",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
`;

const readmeMdContent = `# MyReactProject

This is a sample React project to get you started in the AI React Studio. It's bootstrapped with a setup similar to Create React App.

### How to Run Locally
- Use the "Download Project" button to get a zip of the source code.
- Unzip the file.
- Open your terminal, navigate into the project directory, and run:
\`\`\`
npm install
\`\`\`
- Then, to start the development server, run:
\`\`\`
npm start
\`\`\`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### How to Use the Studio
- Ask Sasha, your AI assistant, to build upon this foundation. 
- For example: "Create a login form component" or "Add a button to the header".
- Sasha will generate the code in the chat. You can then ask her to apply it directly to the files in the IDE.
`;


const rootPath = "MyReactProject";

export const initialProject: PortletFolder = {
  id: rootPath,
  name: "MyReactProject",
  type: 'folder',
  path: rootPath,
  children: [
    {
      id: `${rootPath}/public`,
      name: 'public',
      type: 'folder',
      path: `${rootPath}/public`,
      children: [
        {
          id: `${rootPath}/public/index.html`,
          name: 'index.html',
          type: 'file',
          path: `${rootPath}/public/index.html`,
          content: indexHtmlContent,
        },
      ],
    },
    {
      id: `${rootPath}/src`,
      name: 'src',
      type: 'folder',
      path: `${rootPath}/src`,
      children: [
        {
          id: `${rootPath}/src/components`,
          name: 'components',
          type: 'folder',
          path: `${rootPath}/src/components`,
          children: [
            {
              id: `${rootPath}/src/components/Header.jsx`,
              name: 'Header.jsx',
              type: 'file',
              path: `${rootPath}/src/components/Header.jsx`,
              content: headerJsxContent,
            },
          ],
        },
        {
          id: `${rootPath}/src/App.jsx`,
          name: 'App.jsx',
          type: 'file',
          path: `${rootPath}/src/App.jsx`,
          content: appJsxContent,
        },
        {
          id: `${rootPath}/src/index.css`,
          name: 'index.css',
          type: 'file',
          path: `${rootPath}/src/index.css`,
          content: indexCssContent,
        },
        {
          id: `${rootPath}/src/index.js`,
          name: 'index.js',
          type: 'file',
          path: `${rootPath}/src/index.js`,
          content: indexJsContent,
        },
      ],
    },
    {
      id: `${rootPath}/package.json`,
      name: 'package.json',
      type: 'file',
      path: `${rootPath}/package.json`,
      content: packageJsonContent,
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
