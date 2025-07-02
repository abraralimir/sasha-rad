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

// New content for the files, inspired by IBM RAD boilerplate
const myPortletJavaContent = `package com.example.portlet;

import java.io.IOException;
import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.GenericPortlet;
import javax.portlet.PortletException;
import javax.portlet.PortletRequestDispatcher;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.WindowState;

/**
 * A sample portlet based on GenericPortlet
 */
public class MyPortlet extends GenericPortlet {

    /**
     * @see javax.portlet.GenericPortlet#doView(javax.portlet.RenderRequest,
     *      javax.portlet.RenderResponse)
     */
    public void doView(RenderRequest request, RenderResponse response)
            throws PortletException, IOException {
        // Set the content type for the response
        response.setContentType("text/html");
        // Get the dispatcher for the view
        PortletRequestDispatcher dispatcher =
            getPortletContext().getRequestDispatcher("/WEB-INF/jsp/view.jsp");
        dispatcher.include(request, response);
    }

    /**
     * @see javax.portlet.GenericPortlet#doEdit(javax.portlet.RenderRequest,
     *      javax.portlet.RenderResponse)
     */
    public void doEdit(RenderRequest request, RenderResponse response)
            throws PortletException, IOException {
        // Set the content type for the response
        response.setContentType("text/html");
        // Get the dispatcher for the edit
        PortletRequestDispatcher dispatcher =
            getPortletContext().getRequestDispatcher("/WEB-INF/jsp/edit.jsp");
        dispatcher.include(request, response);
    }

    /**
     * @see javax.portlet.GenericPortlet#doHelp(javax.portlet.RenderRequest,
     *      javax.portlet.RenderResponse)
     */
    public void doHelp(RenderRequest request, RenderResponse response)
        throws PortletException, IOException {
        // Set the content type for the response
        response.setContentType("text/html");
        // Get the dispatcher for the help
        PortletRequestDispatcher dispatcher =
            getPortletContext().getRequestDispatcher("/WEB-INF/jsp/help.jsp");
        dispatcher.include(request, response);
    }

    /**
     * @see javax.portlet.Portlet#processAction(javax.portlet.ActionRequest,
     *      javax.portlet.ActionResponse)
     */
    public void processAction(ActionRequest request, ActionResponse response)
            throws PortletException, IOException {
        // Set the window state to normal after processing an action
        response.setWindowState(WindowState.NORMAL);
    }
}`;

const stylesCssContent = `/* Default styles for MyStaticPortlet, inspired by typical RAD projects */
.portlet-container {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 4px;
    background-color: #f9f9f9;
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
}

.portlet-container h1 {
    font-size: 1.2em;
    color: #005a9c;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-top: 0;
}

.portlet-container p {
    line-height: 1.6;
}

.portlet-container a {
    color: #0066cc;
    text-decoration: none;
}

.portlet-container a:hover {
    text-decoration: underline;
}

.portlet-container form {
    margin-top: 15px;
}

.portlet-container form input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: calc(100% - 20px);
}

.portlet-container form input[type="submit"] {
    padding: 8px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.portlet-container form input[type="submit"]:hover {
    background-color: #0056b3;
}`;

const scriptJsContent = `// Optional JavaScript for MyStaticPortlet
console.log("MyStaticPortlet script loaded.");`;

const viewJspContent = `<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-container view-mode">
    <h1>My Static Portlet - View Mode</h1>
    <p>This is the default view of the portlet.</p>
    <p>
        <portlet:renderURL portletMode="edit">
            <a href="<% out.print(renderResponse.createRenderURL()); %>">Switch to Edit Mode</a>
        </portlet:renderURL>
    </p>
    <p>
        <portlet:renderURL portletMode="help">
             <a href="<% out.print(renderResponse.createRenderURL()); %>">Get Help</a>
        </portlet:renderURL>
    </p>
</div>`;

const editJspContent = `<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-container edit-mode">
    <h1>My Static Portlet - Edit Mode</h1>
    <p>This is the edit view. Use this page to configure the portlet.</p>
    
    <portlet:actionURL var="formActionURL" />
    <form action="<%= formActionURL %>" method="POST">
        <div>
            <label for="preference">Setting:</label>
            <input type="text" name="preference" id="preference" />
        </div>
        <br/>
        <div>
            <input type="submit" value="Save" />
        </div>
    </form>
    
    <p>
        <portlet:renderURL portletMode="view">
            <a href="<% out.print(renderResponse.createRenderURL()); %>">Back to View Mode</a>
        </portlet:renderURL>
    </p>
</div>`;

const helpJspContent = `<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-container help-mode">
    <h1>My Static Portlet - Help</h1>
    <p>This is the help page for the portlet.</p>
    <p>It provides instructions and support information.</p>
    
    <p>
        <portlet:renderURL portletMode="view">
            <a href="<% out.print(renderResponse.createRenderURL()); %>">Back to View Mode</a>
        </portlet:renderURL>
    </p>
</div>`;


const portletXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<portlet-app xmlns="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd"
             version="2.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd">
    <portlet>
        <portlet-name>MyStaticPortlet</portlet-name>
        <display-name>My Static Portlet</display-name>
        <portlet-class>com.example.portlet.MyPortlet</portlet-class>
        <init-param>
            <name>view-template</name>
            <value>/WEB-INF/jsp/view.jsp</value>
        </init-param>
        <init-param>
            <name>edit-template</name>
            <value>/WEB-INF/jsp/edit.jsp</value>
        </init-param>
        <init-param>
            <name>help-template</name>
            <value>/WEB-INF/jsp/help.jsp</value>
        </init-param>
        <expiration-cache>0</expiration-cache>
        <supports>
            <mime-type>text/html</mime-type>
            <portlet-mode>view</portlet-mode>
            <portlet-mode>edit</portlet-mode>
            <portlet-mode>help</portlet-mode>
        </supports>
        <portlet-info>
            <title>My Static Portlet</title>
            <short-title>My Portlet</short-title>
            <keywords>example, static, portlet</keywords>
        </portlet-info>
    </portlet>
</portlet-app>`;

const webXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">
    <display-name>MyStaticPortlet Project</display-name>
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>`;

const pomXmlContent = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>MyStaticPortlet</artifactId>
    <packaging>war</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>MyStaticPortlet Maven Webapp</name>
    <url>http://maven.apache.org</url>
    
    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>javax.portlet</groupId>
            <artifactId>portlet-api</artifactId>
            <version>2.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <finalName>MyStaticPortlet</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.2.3</version>
            </plugin>
        </plugins>
    </build>
</project>`;

const readmeMdContent = `# MyStaticPortlet

This is a JSR 286 compliant static portlet project, with boilerplate code similar to what is generated by enterprise IDEs like IBM RAD.

## Project Structure

- \`src/main/java\`: Contains the Java source code for the portlet class.
- \`src/main/webapp\`: Contains web application resources like JSPs, CSS, and JavaScript files.
- \`pom.xml\`: Maven project configuration file.

### Features
- Supports VIEW, EDIT, and HELP portlet modes.
- Includes separate JSP files for each mode.
- Basic form handling in EDIT mode.

This project was bootstrapped with Portlet Plus.`;

const rootPath = "MyStaticPortlet";

export const initialProject: PortletFolder = {
  id: rootPath,
  name: "MyStaticPortlet",
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
                          id: `${rootPath}/src/main/java/com/example/portlet`,
                          name: 'portlet',
                          type: 'folder',
                          path: `${rootPath}/src/main/java/com/example/portlet`,
                          children: [
                            {
                              id: `${rootPath}/src/main/java/com/example/portlet/MyPortlet.java`,
                              name: 'MyPortlet.java',
                              type: 'file',
                              path: `${rootPath}/src/main/java/com/example/portlet/MyPortlet.java`,
                              content: myPortletJavaContent,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: `${rootPath}/src/main/webapp`,
              name: 'webapp',
              type: 'folder',
              path: `${rootPath}/src/main/webapp`,
              children: [
                {
                  id: `${rootPath}/src/main/webapp/css`,
                  name: 'css',
                  type: 'folder',
                  path: `${rootPath}/src/main/webapp/css`,
                  children: [
                    {
                      id: `${rootPath}/src/main/webapp/css/styles.css`,
                      name: 'styles.css',
                      type: 'file',
                      path: `${rootPath}/src/main/webapp/css/styles.css`,
                      content: stylesCssContent,
                    },
                  ],
                },
                {
                  id: `${rootPath}/src/main/webapp/js`,
                  name: 'js',
                  type: 'folder',
                   path: `${rootPath}/src/main/webapp/js`,
                  children: [
                    {
                      id: `${rootPath}/src/main/webapp/js/script.js`,
                      name: 'script.js',
                      type: 'file',
                      path: `${rootPath}/src/main/webapp/js/script.js`,
                      content: scriptJsContent,
                    },
                  ],
                },
                {
                  id: `${rootPath}/src/main/webapp/WEB-INF`,
                  name: 'WEB-INF',
                  type: 'folder',
                  path: `${rootPath}/src/main/webapp/WEB-INF`,
                  children: [
                    {
                        id: `${rootPath}/src/main/webapp/WEB-INF/jsp`,
                        name: 'jsp',
                        type: 'folder',
                        path: `${rootPath}/src/main/webapp/WEB-INF/jsp`,
                        children: [
                            {
                                id: `${rootPath}/src/main/webapp/WEB-INF/jsp/view.jsp`,
                                name: 'view.jsp',
                                type: 'file',
                                path: `${rootPath}/src/main/webapp/WEB-INF/jsp/view.jsp`,
                                content: viewJspContent,
                            },
                            {
                                id: `${rootPath}/src/main/webapp/WEB-INF/jsp/edit.jsp`,
                                name: 'edit.jsp',
                                type: 'file',
                                path: `${rootPath}/src/main/webapp/WEB-INF/jsp/edit.jsp`,
                                content: editJspContent,
                            },
                            {
                                id: `${rootPath}/src/main/webapp/WEB-INF/jsp/help.jsp`,
                                name: 'help.jsp',
                                type: 'file',
                                path: `${rootPath}/src/main/webapp/WEB-INF/jsp/help.jsp`,
                                content: helpJspContent,
                            },
                        ]
                    },
                    {
                      id: `${rootPath}/src/main/webapp/WEB-INF/portlet.xml`,
                      name: 'portlet.xml',
                      type: 'file',
                      path: `${rootPath}/src/main/webapp/WEB-INF/portlet.xml`,
                      content: portletXmlContent,
                    },
                    {
                      id: `${rootPath}/src/main/webapp/WEB-INF/web.xml`,
                      name: 'web.xml',
                      type: 'file',
                      path: `${rootPath}/src/main/webapp/WEB-INF/web.xml`,
                      content: webXmlContent,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: `${rootPath}/pom.xml`,
      name: 'pom.xml',
      type: 'file',
      path: `${rootPath}/pom.xml`,
      content: pomXmlContent,
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

    // Also update the active file if it's the one being changed
    // This logic is handled in the page component state, but good to be mindful of.
    
    return newProject;
}
