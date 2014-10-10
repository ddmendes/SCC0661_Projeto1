var req = null;
var console = null;
var lastChild = null;
var curriculosXML = null;
var knownStudentsXSL = null;
var READY_STATE_UNINTIALIZED = 0;
var READY_STATE_LOADING      = 1;
var READY_STATE_LOADED       = 2;
var READY_STATE_INTERACTIVE  = 3;
var READY_STATE_COMPLETE     = 4;

function doXSL(xml, xsl) {
	if(xml == null || xsl == null) {
		return null;
	} else if(window.ActiveXObject) {
		return xml.transformNode(xsl);
	} else {
		var xslProcessor = new XSLTProcessor();
		xslProcessor.importStylesheet(xsl);
		return xslProcessor.transformToFragment(xml, document);
	}
}

function sendRequest(url, callback, params = null, HttpMethod = null) {
	if(!HttpMethod) {
		HttpMethod = "GET";
	}
	req = initXMLHTTPRequest();
	if(req) {
		req.onreadystatechange = callback;
		req.open(HttpMethod, url, true);
		req.setRequestHeader("ContentType", "application/x-www-form-urlencoded");
		req.send(params);
	}
}

function initXMLHTTPRequest() {
	var xRequest = null;
	if(window.XMLHttpRequest) {
		xRequest = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		xRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xRequest;
}

function onReadyState() {
	var ready = req.readyState;
	var data = null;

	if(ready == READY_STATE_COMPLETE) {
		toConsole(req.responseText);
	}
}

function toConsole(data) {
	if(console != null) {
		var newChild = document.createElement("div");
		var txt = document.createTextNode(data);
		newChild.appendChild(txt);
		console.replaceChild(newChild, lastChild);
		lastChild = newChild;
	}
}

function saveCurriculo() {
	if(req.readyState == READY_STATE_COMPLETE) {
		curriculosXML = req.responseXML;
		sendRequest("knownStudents.xsl", saveKnownStudents);
	}
}

function saveKnownStudents() {
	if(req.readyState == READY_STATE_COMPLETE) {
		knownStudentsXSL = req.responseXML;
		showKnownStudents();
	}
}

function showKnownStudents() {
	if(curriculosXML != null && knownStudentsXSL != null) {
		var fragment = doXSL(curriculosXML, knownStudentsXSL);
		var ss = document.getElementById("studentSelector");
		ss.appendChild(fragment);
		knownStudentsXSL = fragment;
	}
}
 
function onDocumentLoad() {
	sendRequest("curriculos.xml", saveCurriculo);
}

function formChangeListener() {
	var history = document.getElementsByClassName("history");
	for(var h in history) {
		if(h.checked) {
			alert(h.value);
		}
	}
}