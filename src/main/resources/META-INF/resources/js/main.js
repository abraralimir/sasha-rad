import React from 'react';
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
}
