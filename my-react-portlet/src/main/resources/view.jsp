<%@ include file="/init.jsp" %>

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
/>