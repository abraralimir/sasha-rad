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

const myPortletJavaContent = `package com.example.portlet;

import java.io.IOException;
import java.util.logging.Logger;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.GenericPortlet;
import javax.portlet.PortletException;
import javax.portlet.PortletPreferences;
import javax.portlet.PortletRequestDispatcher;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.PortletMode;
import javax.portlet.WindowState;

/**
 * A sample portlet based on GenericPortlet
 */
public class MyPortlet extends GenericPortlet {

	private static final String JSP_FOLDER    = "/WEB-INF/jsp/"; 
	private static final String VIEW_JSP      = "view.jsp";
	private static final String EDIT_JSP      = "edit.jsp";
	private static final String HELP_JSP      = "help.jsp";
    private static final String PREF_GREETING = "greeting";
    private static final String PARAM_GREETING = "greeting";

	private final Logger logger = Logger.getLogger(MyPortlet.class.getName());

	/**
	 * @see javax.portlet.GenericPortlet#doView(javax.portlet.RenderRequest,
	 *      javax.portlet.RenderResponse)
	 */
	public void doView(RenderRequest request, RenderResponse response) throws PortletException, IOException {
		// Set the MIME type for the render response
		response.setContentType("text/html");
		
        // Get the greeting from the portlet preferences
        PortletPreferences prefs = request.getPreferences();
        String greeting = prefs.getValue(PREF_GREETING, "Hello! This is the default greeting.");
        request.setAttribute("greeting", greeting);

		// Invoke the JSP to render
		PortletRequestDispatcher dispatcher = getPortletContext().getRequestDispatcher(JSP_FOLDER + VIEW_JSP);
		dispatcher.include(request, response);
	}

	/**
	 * @see javax.portlet.GenericPortlet#doEdit(javax.portlet.RenderRequest,
	 *      javax.portlet.RenderResponse)
	 */
	public void doEdit(RenderRequest request, RenderResponse response) throws PortletException, IOException {
		// Set the MIME type for the render response
		response.setContentType("text/html");

        // Get the greeting from the portlet preferences
        PortletPreferences prefs = request.getPreferences();
        String greeting = prefs.getValue(PREF_GREETING, "Hello! This is the default greeting.");
        request.setAttribute("greeting", greeting);

		// Invoke the JSP to render
		PortletRequestDispatcher dispatcher = getPortletContext().getRequestDispatcher(JSP_FOLDER + EDIT_JSP);
		dispatcher.include(request, response);
	}

	/**
	 * @see javax.portlet.GenericPortlet#doHelp(javax.portlet.RenderRequest,
	 *      javax.portlet.RenderResponse)
	 */
	public void doHelp(RenderRequest request, RenderResponse response) throws PortletException, IOException {
		// Set the MIME type for the render response
		response.setContentType("text/html");
		// Invoke the JSP to render
		PortletRequestDispatcher dispatcher = getPortletContext().getRequestDispatcher(JSP_FOLDER + HELP_JSP);
		dispatcher.include(request, response);
	}
    
    /**
     * @see javax.portlet.GenericPortlet#processAction(javax.portlet.ActionRequest, 
     *      javax.portlet.ActionResponse)
     */
    public void processAction(ActionRequest request, ActionResponse response) throws PortletException, IOException {
        String greeting = request.getParameter(PARAM_GREETING);
        if (greeting != null) {
            PortletPreferences prefs = request.getPreferences();
            prefs.setValue(PREF_GREETING, greeting);
            prefs.store();
            logger.info("Greeting preference updated.");
        }
        // Set the portlet mode back to view
        response.setPortletMode(PortletMode.VIEW);
    }
}`;

const viewJspContent = `<%@ page session="false" contentType="text/html" %>
<%@ page import="javax.portlet.*" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-body">
    <link rel="stylesheet" type="text/css" href="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/css/styles.css") %>" />
    <script type="text/javascript" src="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/js/script.js") %>"></script>
    
    <h1>MyStandardPortlet</h1>
    <p>\${greeting}</p> <%-- Note: Using EL to display the greeting --%>

    <div class="portlet-actions">
        <a href="<portlet:renderURL portletMode="edit" />">Edit Portlet</a> |
        <a href="<portlet:renderURL portletMode="help" />">Help</a>
    </div>
</div>`;

const editJspContent = `<%@ page session="false" contentType="text/html" %>
<%@ page import="javax.portlet.*" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-body">
    <link rel="stylesheet" type="text/css" href="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/css/styles.css") %>" />
    
    <h2>Edit Mode</h2>
    
    <portlet:actionURL var="saveActionURL" />
    
    <form action="\${saveActionURL}" method="post">
        <div class="form-group">
            <label for="greeting">Welcome Message:</label>
            <input id="greeting" type="text" name="greeting" value="\${greeting}" size="50">
        </div>
        <div class="form-actions">
            <input type="submit" value="Save">
        </div>
    </form>
</div>`;

const helpJspContent = `<%@ page session="false" contentType="text/html" %>
<%@ page import="javax.portlet.*" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<div class="portlet-body">
    <link rel="stylesheet" type="text/css" href="<%= renderResponse.encodeURL(renderRequest.getContextPath() + "/css/styles.css") %>" />
    
    <h2>Help</h2>
    <p>This is the help page for MyStandardPortlet. In View mode, you can see the configured greeting. In Edit mode, you can change the greeting message.</p>
</div>`;

const portletXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<portlet-app xmlns="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd"
             version="2.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd http://java.sun.com/xml/ns/portlet/portlet-app_2_0.xsd">
    <portlet>
        <portlet-name>MyStandardPortlet</portlet-name>
        <display-name>My Standard Portlet</display-name>
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
            <title>My Standard Portlet</title>
            <short-title>Standard Portlet</short-title>
            <keywords>portlet, example, standard</keywords>
        </portlet-info>
    </portlet>
</portlet-app>`;

const webXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">
    <display-name>MyStandardPortlet Project</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>`;

const pomXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.example</groupId>
	<artifactId>MyStandardPortlet</artifactId>
	<packaging>war</packaging>
	<version>1.0</version>
	<name>MyStandardPortlet</name>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<maven.compiler.source>1.8</maven.compiler.source>
		<maven.compiler.target>1.8</maven.compiler.target>
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
	</dependencies>

	<build>
		<finalName>\${project.name}</finalName>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-war-plugin</artifactId>
				<version>3.2.3</version>
			</plugin>
		</plugins>
	</build>
</project>`;

const stylesCssContent = `/* General Portlet Styles */
.portlet-body {
    font-family: Arial, sans-serif;
    padding: 10px;
    background-color: #f4f4f4;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Form Styles */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-actions input[type="submit"] {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.form-actions input[type="submit"]:hover {
    background-color: #0056b3;
}

/* Action links */
.portlet-actions {
    margin-top: 20px;
    font-size: 0.9em;
}
`;

const scriptJsContent = `// You can add JavaScript functionality here.
// This script will be loaded in the view.jsp.
console.log("MyStandardPortlet script loaded.");
`;

const readmeMdContent = `# MyStandardPortlet

This is a JSR 286 portlet project structured similarly to one created by IBM Rational Application Developer.

### Features
- **View, Edit, and Help Modes**: The portlet supports multiple modes, each with its own JSP.
- **Portlet Preferences**: The Edit mode allows you to set a custom greeting message that is stored in portlet preferences.
- **Maven Ready**: A \`pom.xml\` is included to allow you to build the project into a WAR file using Maven.

### How to Use
- Use the "Download Project" button to get a zip of the source.
- Unzip the project.
- From the project's root directory, run \`mvn clean install\` to build the WAR file.
- Deploy the generated \`MyStandardPortlet.war\` file to your portal server.`;


const rootPath = "MyStandardPortlet";

export const initialProject: PortletFolder = {
  id: rootPath,
  name: "MyStandardPortlet",
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
                            content: stylesCssContent
                        }
                    ]
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
                            content: scriptJsContent
                        }
                    ]
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

    return newProject;
}