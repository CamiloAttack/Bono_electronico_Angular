/*****************************************************************************\

 Javascript "SOAP Client" library
 
 @version: 2.1 - 2006.09.08
 @author: Matteo Casati - http://www.guru4.net/
 
\*****************************************************************************/

function SOAPClientParameters()
{
	var _pl = new Array();
	this.add = function(name, value) 
	{	
	
		_pl[name] = value; 
		return this;

	}

	this.toXml = function()
	{
		var xml = "";

		for(var p in _pl){

			var name_if_rut = p.substring(7,0); // busco el string =>urn:rut  en las llaves 
			 
			if(name_if_rut === "urn:rut"){ // si es urn:rut

				var mumer_dv = _pl[p].split("-"); // divido el valor 
				var numero = ("000" + mumer_dv[0]).slice(-10); // mumer_dv[0] = el numero => le agrego valores y lo limito en 10 caracteres
				var dv= mumer_dv[1];	//mumer_dv[1] = el digito verificador

				xml += "<" + p + "><urn:numero>" + numero + "</urn:numero><urn:dv>" + dv + "</urn:dv></" + p + ">";// agrego a la nueva structura los respectivos valores

			}else{
		 
				if(p =="urn:prestaciones"){ 
 
					$.each(_pl[p],function(k,v){ // recorro los objetos incluidos en el array "prestaciones"
					
						xml += "<" + p + ">" + SOAPClientParameters._serialize(v) + "</" + p + ">"// doy formato xml a cada variable del objeto 

					});	

				}else{

					xml += "<" + p + ">" + SOAPClientParameters._serialize(_pl[p]) + "</" + p + ">"; // si no toma los demas valores y los agrega a la extructura xml
				}

			
			}
	 
		
		}
 
		return xml;	
	}
}
SOAPClientParameters._serialize = function(o)
{
    var s = "";
    switch(typeof(o))
    {
        case "string":
            s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); break;
        case "number":
        case "boolean":
            s += o.toString(); break;
        case "object":
            // Date
            if(o.constructor.toString().indexOf("function Date()") > -1)
            {
        
                var year = o.getFullYear().toString();
                var month = (o.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
                var date = o.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
                var hours = o.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
                var minutes = o.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
                var seconds = o.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
                var milliseconds = o.getMilliseconds().toString();
                var tzminutes = Math.abs(o.getTimezoneOffset());
                var tzhours = 0;
                while(tzminutes >= 60)
                {
                    tzhours++;
                    tzminutes -= 60;
                }
                tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
                tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
                var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
                s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
            }
            // Array
            else if(o.constructor.toString().indexOf("function Array()") > -1)
            {
                for(var p in o)
                {
                    if(!isNaN(p))   // linear array
                    {
                        (/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
                        var type = RegExp.$1;
                        switch(type)
                        {
                            case "":
                                type = typeof(o[p]);
                            case "String":
                                type = "string"; break;
                            case "Number":
                                type = "int"; break;
                            case "Boolean":
                                type = "bool"; break;
                            case "Date":
                                type = "DateTime"; break;
                        }
                        s += "<" + type + ">" + SOAPClientParameters._serialize(o[p]) + "</" + type + ">"
                    }
                    else    // associative array
                        s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">"
                }
            }
            // Object or custom function
            else
                for(var p in o)
                    s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">";
            break;
        default:
            throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
    }
    return s;
}

function SOAPClient() {}

SOAPClient.invoke = function(url, method, parameters, async, callback)
{
	if(async)
		SOAPClient._loadWsdl(url, method, parameters, async, callback);
	else
		return SOAPClient._loadWsdl(url, method, parameters, async, callback);
}

// private: wsdl cache
SOAPClient_cacheWsdl = new Array();

// private: invoke async
SOAPClient._loadWsdl = function(url, method, parameters, async, callback)
{
	// load from cache?
	var wsdl = SOAPClient_cacheWsdl[url];
	if(wsdl + "" != "" && wsdl + "" != "undefined")
		return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
	// get wsdl
	var xmlHttp = SOAPClient._getXmlHttp();
	xmlHttp.open("GET", url + "?wsdl", async);
	if(async) 
	{
		xmlHttp.onreadystatechange = function() 
		{
			if(xmlHttp.readyState == 4)
				SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
		}
	}

	xmlHttp.send(null);
	if (!async)
		return SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
}
SOAPClient._onLoadWsdl = function(url, method, parameters, async, callback, req)
{
	var wsdl = req.responseXML;
	//	console.log(wsdl);
	SOAPClient_cacheWsdl[url] = wsdl;	// save a copy in cache
	return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
}
SOAPClient._sendSoapRequest = function(url, method, parameters, async, callback, wsdl)
{
	// get namespace
	var d = new Date();
  	var fecha = ""+("0" + d.getDate()).slice(-2)+("0" + d.getMonth()).slice(-2) + d.getFullYear()+"";
	var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
	var soapMessage ='<?xml version="1.0" encoding="UTF-8"?>';
	//soapMessage+='<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/>';
	soapMessage+='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="'+ns+'">';
	soapMessage+='<soapenv:Header/><soapenv:Body>';
	soapMessage+='<urn:'+method+'>';
	soapMessage+='<urn:request>';

	/*if(method == "buscarEntidadesRutBeneficiario"){

		soapMessage+='<urn:rutBeneficiario>'+parameters.toXml();
		soapMessage+='</urn:rutBeneficiario>';
		soapMessage+='<urn:fechaActual>'+("0" + d.getDate()).slice(-2)+("0" + d.getMonth()).slice(-2) + d.getFullYear()+'</urn:fechaActual>';
		
	}else{*/


	if(method == "buscarEntidadesRutBeneficiario"){

		soapMessage+=parameters.toXml();

	 //	soapMessage+='<urn:fechaActual>'+("0" + d.getDate()).slice(-2)+("0" + d.getMonth()).slice(-2) + d.getFullYear()+'</urn:fechaActual>';
	//	
		//soapMessage+='<urn:fechaActual>'+fecha+'</urn:fechaActual>';
		soapMessage+='<urn:fechaActual>04032016</urn:fechaActual>';
		
	}else{

		soapMessage+=parameters.toXml(); 
		
	}	

	//	soapMessage+=parameters.toXml(); 
		
	//}

	soapMessage+='</urn:request>';
	soapMessage+='</urn:'+method+'></soapenv:Body>';
	soapMessage+='</soapenv:Envelope>';


 
	var sr = soapMessage;


	// send request
	var xmlHttp = SOAPClient._getXmlHttp();
	xmlHttp.open("POST", url, async);
	var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
	xmlHttp.setRequestHeader("SOAPAction", soapaction);
	xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	if(async) 
	{
		xmlHttp.onreadystatechange = function() 
		{
			if(xmlHttp.readyState == 4)
				SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
		}
	}

	xmlHttp.send(sr);

	if (!async)

		return SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
}


SOAPClient._onSendSoapRequest = function(method, async, callback, wsdl, req) 
{

	var o = null;
	var nd = SOAPClient._getElementsByTagName(req.responseXML,"ns:"+ method + "Response");	 
	if(nd.length == 0)
	{

		if(req.responseXML.getElementsByTagName("faultcode").length > 0)
		{
		    if(async || callback)
		        o = new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
			else
			    throw new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);			
		}
	}
	else			 
	if(method == "consultaMensaje" || method == "valorizarPrestacion"){
    var currNode = nd[0];
	    removedNode = currNode.removeChild(currNode.childNodes[1]);
	   	removedNode = currNode.removeChild(currNode.childNodes[0]);

    	//removedNode = currNode.removeChild(currNode.childNodes[6]);
	   /*	removedNode = currNode.removeChild(currNode.childNodes[7]);
    	removedNode = currNode.removeChild(currNode.childNodes[8]);
	   	removedNode = currNode.removeChild(currNode.childNodes[9]);
	    removedNode = currNode.removeChild(currNode.childNodes[10]);
	    removedNode = currNode.removeChild(currNode.childNodes[10]); 
 
	    */



   	}
	o = SOAPClient._soapresult2object(nd[0], wsdl, method);

	if(callback)
		callback(o, req.responseXML); 
	if(!async)
		return o;
}
SOAPClient._soapresult2object = function(node, wsdl, method)
{	 

    var wsdlTypes = SOAPClient._getTypesFromWsdl(wsdl);
 
    return SOAPClient._node2object(node, wsdlTypes, method);
}

SOAPClient._node2object = function(node, wsdlTypes, method)
{

	 
	// null node
	if(node == null)
		return null;
	// text node
	if(node.nodeType == 3 || node.nodeType == 4)

		return SOAPClient._extractValue(node, wsdlTypes);
	// leaf node
	if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))

		return SOAPClient._node2object(node.childNodes[0], wsdlTypes);
	var isarray = SOAPClient._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
	//console.log(method);
// object node CREO EL OBJETO
	if(method == "consultaMensaje" || method == "valorizarPrestacion" || method == "solicitarFolio" ){
  		isarray = true;
  	}

	if(!isarray)
	
	{
	
	var obj = null;
		if(node.hasChildNodes())
			obj = new Object();
		for(var i = 0; i < node.childNodes.length; i++)
		{
			var p = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
			obj[node.childNodes[i].nodeName] = p;
		}
		return obj;
	}
	// list node
	else
	{  
		// create node ref
		var l = new Array();
		for(var i = 0; i < node.childNodes.length; i++)
			l[l.length] = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
		return l;
	}
	return null;
}
SOAPClient._extractValue = function(node, wsdlTypes)
{
	var value = node.nodeValue;
 //console.log(value );

	switch(SOAPClient._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase())
	{
		default:
		case "s:string":
			return (value != null) ? value + "" : "";  // ocupa esta opcion 
		case "s:boolean":
		 
			return value + "" == "true";
		case "s:int":
		case "s:long":
	 
			return (value != null) ? parseInt(value + "", 10) : 0;
		case "s:double":
	 
			return (value != null) ? parseFloat(value + "") : 0;
		case "s:datetime":
			if(value == null)
				return null;
			else
			{
				value = value + "";
				value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
				value = value.replace(/T/gi," ");
				value = value.replace(/-/gi,"/");
				var d = new Date();
				d.setTime(Date.parse(value));										
				return d;				
			}
	}
}
SOAPClient._getTypesFromWsdl = function(wsdl)
{
	
	var wsdlTypes = new Array();
	// IE
	var ell = wsdl.getElementsByTagName("s:element");	
	var useNamedItem = true;
	// MOZ
	if(ell.length == 0)
	{

		ell = wsdl.getElementsByTagName("element");	     
		useNamedItem = false;
	}
	for(var i = 0; i < ell.length; i++)
	{

		if(useNamedItem)
		{

			alert(useNamedItem);
			if(ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null) 
				wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
		}	
		else
		{
			//if(ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
			//	wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
		}
	}
	return wsdlTypes;
}
SOAPClient._getTypeFromWsdl = function(elementname, wsdlTypes)
{
    var type = wsdlTypes[elementname] + "";

    return (type == "undefined") ? "" : type;
}
// private: utils
SOAPClient._getElementsByTagName = function(document, tagName)
{

	try
	{
		// trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument);

		return document.selectNodes(".//*[local-name()=\""+ tagName +"\"]");
	}
	catch (ex) {}

	// old XML parser support
	return document.getElementsByTagName(tagName);
}
// private: xmlhttp factory
SOAPClient._getXmlHttp = function() 
{ 
	try
	{
		if(window.XMLHttpRequest) 
		{
			var req = new XMLHttpRequest();


			// some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
			if(req.readyState == null) 
			{
				req.readyState = 1;
				req.addEventListener("load", 
									function() 
									{
										req.readyState = 4;
										if(typeof req.onreadystatechange == "function")
											req.onreadystatechange();
									},
									false);
			}


			return req;
		}
		if(window.ActiveXObject) 

			return new ActiveXObject(SOAPClient._getXmlHttpProgID());
	}
	catch (ex) {}
	throw new Error("Your browser does not support XmlHttp objects");
}
SOAPClient._getXmlHttpProgID = function()
{
	
	if(SOAPClient._getXmlHttpProgID.progid)
		return SOAPClient._getXmlHttpProgID.progid;
	var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
	var o;
	for(var i = 0; i < progids.length; i++)
	{
		try
		{
			o = new ActiveXObject(progids[i]);
			return SOAPClient._getXmlHttpProgID.progid = progids[i];
		}
		catch (ex) {};
	}
	throw new Error("Could not find an installed XML parser");
}