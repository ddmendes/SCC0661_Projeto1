/**
 * Objeto de requisição HTTP.
 */
var req = null;

/**
 * Documento XML com os curriculos.
 */
var curriculosXML = null;

/**
 * Estados do objeto de requisição.
 */
var READY_STATE_UNINTIALIZED = 0;
var READY_STATE_LOADING      = 1;
var READY_STATE_LOADED       = 2;
var READY_STATE_INTERACTIVE  = 3;
var READY_STATE_COMPLETE     = 4;

/**
 * doXSL(xml, xsl)
 * Aplica uma transformação XSL a um documento XML.
 * @param xml Documento XML a ser processado pelo XSL.
 * @param xsl Documento XSL com a transformação a ser aplicada.
 * @return DocumentFragment com o resultado da transformação.
 */
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

/**
 * sendReaquest(url, callback, params, HttpMethod)
 * Envia requisição assíncrona ao servidor.
 * @param url Endereço invocado pela requisição.
 * @param callback Função de tratamento do retorno da requisição.
 * @param params Parâmetros a serem enviados (opcional).
 * @param HttpMethod Método HTTP a ser utilizado na requisição (opcional).
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
 * Instancia um objeto de requisição http.
 * @return Objeto de requisição http.
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
 * Salva o arquivo de currículo requisitado assíncronamente.
 */
function saveCurriculo() {
	if(req.readyState == READY_STATE_COMPLETE) {
		curriculosXML = req.responseXML;
		sendRequest("knownStudents.xsl", showKnownStudents);
	}
}

/**
 * showKnownStudents()
 * Popula o dropdown de estudantes com os dados do arquivo de currículos.
 */
function showKnownStudents() {
	if(req.readyState == READY_STATE_COMPLETE) {
		var fragment = doXSL(curriculosXML, req.responseXML);
		document.getElementById("studentSelector").appendChild(fragment);
	}
}
 
/**
 * onDocumentLoad()
 * onLoad listener da tag body.
 * Requisita assíncronamente o arquivo curriculos.xml.
 */
function onDocumentLoad() {
	sendRequest("curriculos.xml", saveCurriculo);
}

/**
 * formChangeListener()
 * onChange listener para o formulário de filtros.
 * Requisita o XSL de transformação conforme o filtro escolhido.
 */
function formChangeListener() {
	var history = document.getElementsByClassName("history");
	for(var h in history) {
		if(h.checked) {
			alert(h.value);
		}
	}
}