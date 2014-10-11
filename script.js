/**
 * Objeto de requisi��o HTTP.
 */
var req = null;

/**
 * Documento XML com os curriculos.
 */
var curriculosXML = null;

/**
 * Id do estudante a se exibir o hist�rico.
 */
var student = null;

/**
 * Estados do objeto de requisi��o.
 */
var READY_STATE_UNINTIALIZED = 0;
var READY_STATE_LOADING      = 1;
var READY_STATE_LOADED       = 2;
var READY_STATE_INTERACTIVE  = 3;
var READY_STATE_COMPLETE     = 4;

/**
 * doXSL(xml, xsl)
 * Aplica uma transforma��o XSL a um documento XML.
 * @param xml Documento XML a ser processado pelo XSL.
 * @param xsl Documento XSL com a transforma��o a ser aplicada.
 * @return DocumentFragment com o resultado da transforma��o.
 */
function doXSL(xml, xsl, passStudent = false) {
	if(xml == null || xsl == null) {
		return null;
	} else if(window.ActiveXObject) {
		return xml.transformNode(xsl);
	} else {
		var xslProcessor = new XSLTProcessor();
		if(passStudent)
			xslProcessor.setParameter(null, "student", student);
		xslProcessor.importStylesheet(xsl);
		return xslProcessor.transformToFragment(xml, document);
	}
}

/**
 * sendRequest(url, callback, params, HttpMethod)
 * Envia requisi��o ass�ncrona ao servidor.
 * @param url Endere�o invocado pela requisi��o.
 * @param callback Fun��o de tratamento do retorno da requisi��o.
 * @param params Par�metros a serem enviados (opcional).
 * @param HttpMethod M�todo HTTP a ser utilizado na requisi��o (opcional).
 */
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

/**
 * initXMLHTTPRequest()
 * Instancia um objeto de requisi��o http.
 * @return Objeto de requisi��o http.
 */
function initXMLHTTPRequest() {
	var xRequest = null;
	if(window.XMLHttpRequest) {
		xRequest = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		xRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xRequest;
}

/**
 * saveCurriculo()
 * Salva o arquivo de curr�culo requisitado ass�ncronamente.
 */
function saveCurriculo() {
	if(req.readyState == READY_STATE_COMPLETE) {
		curriculosXML = req.responseXML;
		sendRequest("knownStudents.xsl", showKnownStudents);
	}
}

/**
 * showKnownStudents()
 * Popula o dropdown de estudantes com os dados do arquivo de curr�culos.
 */
function showKnownStudents() {
	if(req.readyState == READY_STATE_COMPLETE) {
		var fragment = doXSL(curriculosXML, req.responseXML);
		document.getElementById("studentSelector").appendChild(fragment);
	}
}

/**
 * showHistory()
 * Exibe o hist�rico escolhido.
 */
function showHistory() {
	if(req.readyState == READY_STATE_COMPLETE) {
		var hist = req.responseXML;
		hist = doXSL(curriculosXML, hist, true);
		document.getElementById("page-content").innerHTML = "";
		document.getElementById("page-content").appendChild(hist);
	}
}
 
/**
 * onDocumentLoad()
 * onLoad listener da tag body.
 * Requisita ass�ncronamente o arquivo curriculos.xml.
 */
function onDocumentLoad() {
	sendRequest("curriculos.xml", saveCurriculo);
}

/**
 * formChangeListener()
 * onChange listener para o formul�rio de filtros.
 * Requisita o XSL de transforma��o conforme o filtro escolhido.
 */
function formChangeListener() {
	student = document.getElementById("studentSelector").value;
	var history = document.getElementById("hFull").checked;
	if(history) {
		sendRequest("fullHistory.xsl?student=" + student, showHistory);
	} else {
		sendRequest("cleanHistory.xsl?student=" + student, showHistory);
	}
}