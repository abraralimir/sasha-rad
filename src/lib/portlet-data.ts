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
import javax.portlet.GenericPortlet;
import javax.portlet.PortletException;
import javax.portlet.PortletRequestDispatcher;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

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
        response.setContentType("text/html");
        PortletRequestDispatcher dispatcher =
            getPortletContext().getRequestDispatcher("/WEB-INF/jsp/view.jsp");
        dispatcher.include(request, response);
    }
}`;

const viewJspContent = `<%@ page contentType="text/html" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div>
    <h1>My Simple Portlet</h1>
    <p>This is the default view. You can ask Sasha to add features!</p>
</div>`;

const portletXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<portlet-app xmlns="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd"
             version="2.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd">
    <portlet>
        <portlet-name>MySimplePortlet</portlet-name>
        <display-name>My Simple Portlet</display-name>
        <portlet-class>com.example.portlet.MyPortlet</portlet-class>
        <init-param>
            <name>view-template</name>
            <value>/WEB-INF/jsp/view.jsp</value>
        </init-param>
        <expiration-cache>0</expiration-cache>
        <supports>
            <mime-type>text/html</mime-type>
            <portlet-mode>view</portlet-mode>
        </supports>
        <portlet-info>
            <title>My Simple Portlet</title>
        </portlet-info>
    </portlet>
</portlet-app>`;

const webXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">
    <display-name>MySimplePortlet Project</display-name>
</web-app>`;

const readmeMdContent = `# MySimplePortlet

This is a minimal JSR 286 portlet project.

Use the Sasha AI assistant to build out features. For example, try asking:

- "Build a feedback form with a text area and a submit button"
- "Add an edit mode to configure a welcome message"

This project was bootstrapped with Portlet Plus.`;

const rootPath = "MySimplePortlet";

export const initialProject: PortletFolder = {
  id: rootPath,
  name: "MySimplePortlet",
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
