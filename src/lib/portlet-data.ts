
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
import './index.css';

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

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    "react-dom": "^18.3.1"
  },
  "scripts": {
    "start": "echo 'No build process configured in this IDE'",
    "build": "echo 'No build process configured in this IDE'",
    "test": "echo 'No build process configured in this IDE'"
  }
}
`;

const readmeMdContent = `# MyReactProject

This is a sample React project to get you started in the AI React Studio.

### Features
- **Modern Stack**: A simple, clean React setup.
- **Component-Based**: Includes a basic App and Header component.
- **AI-Ready**: Use Sasha, your AI assistant, to build upon this foundation. Ask her to create new components, add features, or write styles.

### How to Use
- Use the "Download Project" button to get a zip of the source.
- You can use this as a starting point for your own React projects.
- Ask Sasha to make changes. For example: "Create a login form component" or "Add a button to the header".`;


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
