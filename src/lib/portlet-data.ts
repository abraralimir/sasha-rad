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

// New content for the files
const myPortletJavaContent = `package com.example.portlet;

import java.io.IOException;
import javax.portlet.GenericPortlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.PortletRequestDispatcher;

public class MyPortlet extends GenericPortlet {

    public void doView(RenderRequest request, RenderResponse response)
            throws PortletException, IOException {
        response.setContentType("text/html");
        PortletRequestDispatcher dispatcher =
            getPortletContext().getRequestDispatcher("/WEB-INF/jsp/view.jsp");
        dispatcher.include(request, response);
    }
}`;

const stylesCssContent = `/* Default styles for MyStaticPortlet */
body {
    font-family: sans-serif;
    padding: 1em;
}

.portlet-container {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 5px;
}`;

const scriptJsContent = `// Optional JavaScript for MyStaticPortlet
console.log("MyStaticPortlet script loaded.");`;

const viewJspContent = `<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-container">
    <h1>My Static Portlet</h1>
    <p>This is the default view of the portlet.</p>
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
        <supports>
            <mime-type>text/html</mime-type>
        </supports>
        <portlet-info>
            <title>My Static Portlet</title>
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
    <dependencies>
        <dependency>
            <groupId>javax.portlet</groupId>
            <artifactId>portlet-api</artifactId>
            <version>2.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <finalName>MyStaticPortlet</finalName>
    </build>
</project>`;

const readmeMdContent = `# MyStaticPortlet

This is a JSR 286 compliant static portlet project.

## Project Structure

- \`src/main/java\`: Contains the Java source code for the portlet class.
- \`src/main/webapp\`: Contains web application resources like JSPs, CSS, and JavaScript files.
- \`pom.xml\`: Maven project configuration file.

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
    return { ...node, children: updateRecursively(node.children) };
}
