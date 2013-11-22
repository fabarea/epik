
if (String.prototype.decode == null) {
	
    String.prototype.decode = function() {
		
	var newstring = this;
	var match = this.match(/_[0-9]+_/g);

	if(match) {
	    for(var i = 0; i < match.length; i++) {
		regexp = new RegExp(match[i], "g");
		newstring = newstring.replace(regexp,String.fromCharCode(match[i].replace(/_/g,'')));
	    }
	}
	return newstring.toString();
    }
}

if (String.prototype.encode == null) {
	
    String.prototype.encode = function(type) {
	var newstring = '';
		
	for(var i = 0; i < this.length; i++) {
	    if(this.charAt(i).search(/[-A-Za-z0-9]/) == -1) {
		newstring += "_" + this.charCodeAt(i) + "_";
	    } else {
		newstring += this.charAt(i);
	    }
	}
	return newstring.toString();
    }		
}

if (String.prototype.endsWith == null) {
    String.prototype.endsWith = function(str){
	return (this.match(str+"$")==str);
    }
}

function EPIK(formId, options) {
    
    if (typeof(console) == "object" && typeof(console.log) == "function") {
	this.log = function(msg) {
	    console.log("EPIK: " + msg);
	};
    } else {
	this.log = function(msg) {};
    }
    
    //constants used in EPIK
    this.CONSTANTS = new Object();
    
    this.CONSTANTS.CONFIG = new Object();
    this.CONSTANTS.CONFIG.SECURE_COOKIE = "secure_cookie";
    this.CONSTANTS.CONFIG.ENABLE_JQUERY = "enable_jquery";
    this.CONSTANTS.CONFIG.IFRAME_CONTAINER = "iframe_container";
    this.CONSTANTS.CONFIG.AUTO_SUBMIT = "auto_submit";
    this.CONSTANTS.CONFIG.IFRAME_LOADING_PAGE = "iframe_loading_page";
    this.CONSTANTS.CONFIG.TRIGGER_EVENT = "trigger_event";
    
    this.CONSTANTS.PAYMENT_METHODS = new Object();
    this.CONSTANTS.PAYMENT_METHODS.SMS = "sms";
    this.CONSTANTS.PAYMENT_METHODS.VISA = "visa";
    this.CONSTANTS.PAYMENT_METHODS.ECA = "eca";
    this.CONSTANTS.PAYMENT_METHODS.AMX = "amx";
    this.CONSTANTS.PAYMENT_METHODS.PEX = "pex";
    this.CONSTANTS.PAYMENT_METHODS.EZS = "ezs";
    this.CONSTANTS.PAYMENT_METHODS.ES = "es";
    this.CONSTANTS.PAYMENT_METHODS.POS = "pos";
    this.CONSTANTS.PAYMENT_METHODS.PFC = "pfc";
    this.CONSTANTS.PAYMENT_METHODS.PEF = "pef";
    
    this.CONSTANTS.FORM_FIELD = new Object();
    this.CONSTANTS.FORM_FIELD.AMOUNT = "amount";
    this.CONSTANTS.FORM_FIELD.CURRENCY = "currency";
    this.CONSTANTS.FORM_FIELD.SUCCESS_URL = "success_url";
    this.CONSTANTS.FORM_FIELD.ERROR_URL = "error_url";
    this.CONSTANTS.FORM_FIELD.CANCEL_URL = "cancel_url";
    this.CONSTANTS.FORM_FIELD.TEST_MODE = "test_mode";
    this.CONSTANTS.FORM_FIELD.MOBILE_MODE = "mobile_mode";
    
    this.CONSTANTS.FORM_FIELD.POLLSTATUS_URL = "pollstatus_url";
    this.CONSTANTS.FORM_FIELD.PAYMENT_METHOD = "payment_method";
    this.CONSTANTS.FORM_FIELD.LANGUAGE = "language";
    this.CONSTANTS.FORM_FIELD.TRANSACTION_ID = "transaction_id";
    this.CONSTANTS.FORM_FIELD.REFNO = "refno";
    this.CONSTANTS.FORM_FIELD.MSISDN = "msisdn";
    this.CONSTANTS.FORM_FIELD.ES_MESSAGE = "es_message";
    this.CONSTANTS.FORM_FIELD.POPUP = "popup";
    this.CONSTANTS.FORM_FIELD.CARD_HOLDER_NAME = "card_holder_name";
    this.CONSTANTS.FORM_FIELD.RECURRING = "recurring";
    this.CONSTANTS.FORM_FIELD.RECURRING_INTERVAL = "recurring_interval";
    this.CONSTANTS.FORM_FIELD.PAYER_LINE_PREFIX = "payer_line";
    
    this.CONSTANTS.HTTP_METHOD = new Object();
    this.CONSTANTS.HTTP_METHOD.POST = "POST";
    this.CONSTANTS.HTTP_METHOD.GET = "GET";
    
    //set config of default fields;
    var configOfFields = new Object();
    configOfFields.currency = {hidden: false, mandatory: true, sendToEpp: true};
    configOfFields.amount = {hidden: false, mandatory: true, sendToEpp: true};
    configOfFields.error_url = {hidden: true, mandatory: true, sendToEpp: true};
    configOfFields.cancel_url = {hidden: true, mandatory: true, sendToEpp: true};
    configOfFields.success_url = {hidden: true, mandatory: true, sendToEpp: true};
    configOfFields.payment_method = {hidden: false, mandatory: true, sendToEpp: true};
    configOfFields.test_mode = {hidden: true, mandatory: true, sendToEpp: true};
    configOfFields.pollstatus_url = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.mobile_mode = {hidden: true, mandatory: true, sendToEpp: true};
    configOfFields.language = {hidden: false, mandatory: true, sendToEpp: true};
    configOfFields.transaction_id = {hidden: true, mandatory: false, sendToEpp: true};
    configOfFields.msisdn = {hidden: false, mandatory: false, sendToEpp: true};
    configOfFields.es_message = {hidden: false, mandatory: false, sendToEpp: true};
    configOfFields.recurring = {hidden: false, mandatory: false, sendToEpp: true};
    configOfFields.recurring_interval = {hidden: false, mandatory: false, sendToEpp: true};
    configOfFields.stored_customer_email = {hidden: false, mandatory: false, sendToEpp: true};
    configOfFields.secure_cookie = {hidden: true, mandatory: false, sendToEpp: false};
    
    configOfFields.method = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.addmerchantparameter_url = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.setfinalstatus_url = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.apiendpoint = {hidden: true, mandatory: false, sendToEpp: false};
    
    configOfFields.enable_jquery = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.iframe_container = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.trigger_event = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.auto_submit = {hidden: true, mandatory: false, sendToEpp: false};
    configOfFields.iframe_loading_page = {hidden: true, mandatory: false, sendToEpp: false};
    
    this.log("Config parameters initialized");
    
    //init BrowerDetect. TBD: replace with jquery jQuery.browser?
    var BrowserDetect = {
	    init: function () {
		    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		    this.version = this.searchVersion(navigator.userAgent)
			    || this.searchVersion(navigator.appVersion)
			    || "an unknown version";
		    this.OS = this.searchString(this.dataOS) || "an unknown OS";
	    },
	    searchString: function (data) {
		    for (var i=0;i<data.length;i++)	{
			    var dataString = data[i].string;
			    var dataProp = data[i].prop;
			    this.versionSearchString = data[i].versionSearch || data[i].identity;
			    if (dataString) {
				    if (dataString.indexOf(data[i].subString) != -1)
					    return data[i].identity;
			    }
			    else if (dataProp)
				    return data[i].identity;
		    }
	    },
	    searchVersion: function (dataString) {
		    var index = dataString.indexOf(this.versionSearchString);
		    if (index == -1) return;
		    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	    },
	    dataBrowser: [
		    {
			    string: navigator.userAgent,
			    subString: "Chrome",
			    identity: "Chrome"
		    },
		    {string: navigator.userAgent,
			    subString: "OmniWeb",
			    versionSearch: "OmniWeb/",
			    identity: "OmniWeb"
		    },
		    {
			    string: navigator.vendor,
			    subString: "Apple",
			    identity: "Safari",
			    versionSearch: "Version"
		    },
		    {
			    prop: window.opera,
			    identity: "Opera"
		    },
		    {
			    string: navigator.vendor,
			    subString: "iCab",
			    identity: "iCab"
		    },
		    {
			    string: navigator.vendor,
			    subString: "KDE",
			    identity: "Konqueror"
		    },
		    {
			    string: navigator.userAgent,
			    subString: "Firefox",
			    identity: "Firefox"
		    },
		    {
			    string: navigator.vendor,
			    subString: "Camino",
			    identity: "Camino"
		    },
		    {		// for newer Netscapes (6+)
			    string: navigator.userAgent,
			    subString: "Netscape",
			    identity: "Netscape"
		    },
		    {
			    string: navigator.userAgent,
			    subString: "MSIE",
			    identity: "Explorer",
			    versionSearch: "MSIE"
		    },
		    {
			    string: navigator.userAgent,
			    subString: "Gecko",
			    identity: "Mozilla",
			    versionSearch: "rv"
		    },
		    { 		// for older Netscapes (4-)
			    string: navigator.userAgent,
			    subString: "Mozilla",
			    identity: "Netscape",
			    versionSearch: "Mozilla"
		    }
	    ],
	    dataOS : [
		    {
			    string: navigator.platform,
			    subString: "Win",
			    identity: "Windows"
		    },
		    {
			    string: navigator.platform,
			    subString: "Mac",
			    identity: "Mac"
		    },
		    {
			       string: navigator.userAgent,
			       subString: "iPhone",
			       identity: "iPhone/iPod"
		    },
		    {
			    string: navigator.platform,
			    subString: "Linux",
			    identity: "Linux"
		    }
	    ]

    };
    BrowserDetect.init();
    this.log("Check Browser and Browser Version.");
    //Detect Browser and Browser version 
    if ((BrowserDetect.browser == "Firefox" && BrowserDetect.version < 3.4) ||
	    (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 8) ||
	    (BrowserDetect.browser == "Chrome" && BrowserDetect.version < 6) ||
	    (BrowserDetect.browser == "Safari" && BrowserDetect.version < 4) ||
	    (BrowserDetect.browser == "Opera" && BrowserDetect.version < 8)) {
	    this.log("NotSupportedBrowser");
    } 
    
    //to use instance methods and arguments inside of other objects
    var that = this;
    this.options = new Object();
    // define callback method
    var beforeSubmitCallBack = function(){};
    
    /**
     * Adds Callback function which will be exectued before submitted. Return false 
     * if submit should be prefented.
     *
     * @params Callback
     */
    this.beforeSubmit = function(callback) {
	beforeSubmitCallBack = callback;
	that.options.before_submit = callback;	
    };
    
    /**
     * Sets the submit handler for the epayment form. 
     *
     * @params handler
     */
    this.setSubmitHandler = function(handler) {
	that.options.submit_handler = handler;	
    };
    
    if(typeof jQuery == "undefined" && typeof EPIK.jq == "undefined") {
	throw "NojQueryException";
    } else if(typeof EPIK.jq == "undefined") {
	//TBD should always be a dedicated jquery version be loaded or one for the page
	var enablejQuery = "true";
	if(typeof formId == "string" && typeof options == "object") {
	    if(options.enable_jquery) {
		enablejQuery = options.enable_jquery;
	    }
	    
	} else if(typeof formId == "object" && !options) {
	    if(formId.enable_jquery) {
		enablejQuery = formId.enable_jquery;
	    }
	}
	if(enablejQuery == "false") {
	    EPIK.jq = jQuery.noConflict(true);
	} else {
	    EPIK.jq = jQuery;
	}
    }
    if(EPIK.jq().jquery < "1.4") {
	throw "NotSupportedjQueryVersionException : Version greater than 1.4 is needed";
    }
    var retrieveForm = function() {
	var existingForm = null;
	if(document.forms.length == 1) {
	    existingForm = EPIK.jq(document.forms[0]);
	} else if(document.forms.length > 1){
	    throw "MoreThanOneFormFoundException";
	} else {
	    throw "FormNotFoundException";
	}
	return existingForm;
    };
    
    //check if form is defined correctly
    var form = null;
    
    this.formKey = "";
    if(!formId) {
	form = retrieveForm();
    } else if(typeof formId == "string") {
	form = EPIK.jq("#" + formId);
	this.formKey = formId;
	if(options) {
	    this.options = options;
	}
    } else if(typeof formId == "object" && !options) {
	form = retrieveForm();
	this.options = formId;
    }
    
    if(this.options.iframe_container != "") {
	var iFrameContainer = EPIK.jq("#" + this.options.iframe_container);
	if(iFrameContainer.length == 0) {
	    this.options.iframe_container = "";
	}
    }
    
    if(this.options.before_submit) {
	beforeSubmitCallBack = this.options.before_submit;
    }
    
    var updateValueOfField = function(parameterName, value) {
	var fields = form.find(":input[name=" + parameterName + "]")
	var fieldType = "";
	if(fields.attr("type")) {
	    fieldType = fields.attr("type").toLowerCase();
	}
	var event = "click";
	if(that.options.trigger_event) {
	    event = that.options.trigger_event;
	}
	if(fieldType != "radio" && fieldType != "checkbox") {
	    fields.val(value);
	    //Simulate a klick on the button
	    fields.trigger(event, true);
	} else {
	    fields.each(function() {
		if(EPIK.jq(this).val() == value) {
		    //Simulate a klick on the button
		    EPIK.jq(this).trigger(event, true);
		    EPIK.jq(this)[0].checked = true;
		} else {
		    EPIK.jq(this)[0].checked = false;
		}
	    });
	}

    };
    
    var retrieveValueFromField = function(parameterName) {
	var fields = form.find(":input[name=" + parameterName + "]")
	var fieldType = "";
	if(fields.attr("type")) {
	    fieldType = fields.attr("type").toLowerCase();
	}
	//button and submit should no be checked. but if so, empty string is returned.
	if(fieldType != "radio" && fieldType != "checkbox" &&
	    fieldType != "submit" && fieldType != "button") {
	    return fields.val();
	} else {
	    return EPIK.jq(fields.selector + ":checked").val() ? EPIK.jq(fields.selector + ":checked").val() : "";
	} 

    };   
    
    /**
     * Checks whether a cookie with name=uri is set.
     * If it is not set, the function returns null. Otherwise it returns the value
     * which is a list of encoded uris of menu nodes.
     * 
     * @params prefix which identifies the epayment formular
     * 
     * @returns the cookie string
     * 
     */
    this.readCookie = function(prefix) {
	var params = "epik_" +  prefix + "=";
	var cookies = document.cookie.split(';');
	for(var i = 0; i < cookies.length; i++) {
	    var cookie = EPIK.jq.trim(cookies[i]);
	    if(cookie.indexOf(params) == 0) {
		return cookie.substring(params.length, cookie.length);
	    }
	}

	return null;
    };
    
   /**
    * Returns a value from the input field or option
    * 
    * @param name specifies the name of the input field
    * @param prefix which identifies the epayment formular 
    *	    if it is a merchant parameter "_merchantparameter" has to be added. 
    * 
    * @returns A parameter string
    */
    this.readValueFromCookie = function(name, prefix) {
	var data = this.readCookie(prefix);
	if(data != null){
	    var list = data.split("&");
	    for(var entry in list) {
		if(list[entry].indexOf(name.encode() +":") != -1) {
		    var values = list[entry].split(":");
		    if(values.length == 2) {
			return values[1].decode();
		    }
		}
	    }
	}

	return null;
    };
    
   /**
    * Removes parameter form the cookie value
    * 
    * @param name specifies the name of the input field
    * @param prefix which identifies the epayment formular 
    *	    if it is a merchant parameter "_merchantparameter" has to be added. 
    * 
    * @returns the cookie value without the specified parameter
    */
    this.removeFromCookieString = function(name, prefix) {
	var data = that.readCookie(prefix);
	var paramName = name.encode();
	if(data != null) {
	    var from =  data.indexOf(paramName + ":");
	    if(from != -1) {
		var to = data.indexOf("&", from);
		//check if it is at the end of the cookie string.
		if(to == -1) {
		    data = data.substring(0, from - 1);
		} else {
		   data = data.substring(0, from) + data.substring(to + 1, data.length); 
		}
			
	    }
	} else {
	    data = "";
	}
	return data;
    };
    
   /**
    * Removes parameter form the cookie
    * 
    * @param name specifies the name of parameter/input field
    * @param prefix which identifies the epayment formular 
    *	    if it is a merchant parameter "_merchantparameter" has to be added. 
    * 
    */
    this.removeFromCookie = function(name, prefix) {
	document.cookie = "epik_" + prefix + "=" + this.removeFromCookieString(name, prefix) + "; ; path=/";
    };
    
   /**
    * Deletes the cookie
    * 
    * @param prefix which identifies the epayment formular 
    *	    if it is a merchant parameter "_merchantparameter" has to be added. 
    * 
    */
    this.deleteCookie = function(prefix) {
	var date = new Date();
	date.setTime(date.getTime() - (24*60*60*1000));
        var secure = "";
        if(that.options.secure_cookie && that.options.secure_cookie == "true") {
            secure = "secure;";
        }
	document.cookie = "epik_" + prefix + "=" + "null" + "; expires=" + date.toGMTString() + "; path=/;" + secure;
    };

   /**
    * Updates the cookie
    * 
    * @param name of the parameter/input field
    * @param value of the parameter/input field
    * @param prefix which identifies the epayment formular 
    *	    if it is a merchant parameter "_merchantparameter" has to be added. 
    * 
    */
    this.updateCookie = function(name, value, prefix) {
	var data = that.readCookie(prefix);
	var paramName = name.encode();
	var paramValue = null;
	if(typeof value == "number" || typeof value == "object" 
            || typeof value == "undefined") {
	    paramValue = value + "";
	} else if(typeof value == "boolean") {
            paramValue = value ? "1" : "0";
        } else {
	    paramValue = value.encode();
	}
	var literal = paramName + ":" + paramValue;
	if(data == null) {
	    data = "";
	}
	if(data.indexOf(paramName + ":") != -1 && ((data.indexOf(literal) == -1 && paramValue != "") || (paramValue == ""))) {
	    data = that.removeFromCookieString(name, prefix);
	}
	if(data.indexOf(paramName + ":") == -1 && data.indexOf(literal) == -1) {
	    if(data != "") {
		data += "&"
	    }
	    data += literal;
	}
        var secure = "";
        if(that.options.secure_cookie && that.options.secure_cookie == "true") {
            secure = "secure;";
        }
	document.cookie =  "epik_" + prefix + "=" + data + "; ; path=/;" + secure;
    };

    var storedInCookieList = this.readCookie(this.formKey) ? this.readCookie(this.formKey).split("&") : new Array();
    for(var entry in storedInCookieList) {
	var storedEntries = storedInCookieList[entry].split(":");
	if(storedEntries.length == 2) {
	    var storedName = storedEntries[0].decode();
	    var storedValue = storedEntries[1].decode();
	    if(!this.options[storedName]) {
		this.options[storedName] = storedValue;
	    }
	}
    }

    var storedInCookieMerchantParameterList = this.readCookie(this.formKey + "_merchantparameter") ? this.readCookie(this.formKey + "_merchantparameter").split("&") : new Array();
    for(var entry in storedInCookieMerchantParameterList) {
	var storedMerchantParameterEntries = storedInCookieMerchantParameterList[entry].split(":");
	if(storedMerchantParameterEntries.length == 2) {
	    var storedMerchantParameterName = storedMerchantParameterEntries[0].decode();
	    var storedMerchantParameterValue = storedMerchantParameterEntries[1].decode();
	    if(!this.options[storedMerchantParameterName]) {
		this.options[storedMerchantParameterName] = storedMerchantParameterValue;
	    }
	}
    }
    
    form.find(":input:not(:button):not(:submit):not(:radio):not(:checkbox),:input:checkbox:checked,:input:radio:checked").each(function() {
	var field = EPIK.jq(this);
	var inputFieldName = field.attr("name");
	if(inputFieldName) {
	    var inputFieldValue = retrieveValueFromField(inputFieldName);
	    if(inputFieldValue != "") {
		var cookiePrefix = this.formKey;
		if(!configOfFields[inputFieldName]) {
		    cookiePrefix = cookiePrefix + "_merchantparameter";
		}
		//Check amount
		if(inputFieldName == "amount") {
		    inputFieldValue = parseFloat(inputFieldValue);
		}
		//Only if not set in options, value will be updated.
		if(!that.options[inputFieldName] || that.options[inputFieldName] == "") {
		    that.options[inputFieldName] = inputFieldValue;
		    that.updateCookie(inputFieldName, inputFieldValue, cookiePrefix);
		}
	    }
	};
    });
    
    form.find(":input:not(:button):not(:submit)").live("change", function(event, triggered) {
	var field = EPIK.jq(this);
	var inputFieldName = field.attr("name");
	if(inputFieldName && !triggered) {
	    var inputFieldValue = retrieveValueFromField(inputFieldName);
	    var cookiePrefix = that.formKey;
	    if(!configOfFields[inputFieldName]) {
		cookiePrefix = cookiePrefix + "_merchantparameter";
	    }
	    //Check amount
	    if(inputFieldName == "amount") {
		inputFieldValue = parseFloat(inputFieldValue);
	    }
	    that.options[inputFieldName] = inputFieldValue;
	    that.updateCookie(inputFieldName, inputFieldValue, cookiePrefix);
	};
    });
    
     //init default parameter
    if(!this.options.method) {
	this.options.method = "POST";
	if(form.attr("method") == "") {
	    form.attr("method", this.options.method);
	}
    }
    if(!this.options.mobile_mode) {
	this.options.mobile_mode = false;
    }
    if(!this.options.delete_data_after_submit) {
	this.options.delete_data_after_submit = false;
    }
    
    var setParamsToFields = function() {
	var tmpThat = that;
	var tmpConfigOfFields = configOfFields;
	try {
	    form.find(":input:not(:button):not(:submit):not(:radio):not(:checkbox),:input:checkbox:checked,:input:radio:checked").each(function() {
		var field = EPIK.jq(this);
		var inputFieldName = field.attr("name");
		if(inputFieldName) {
		    var inputFieldValue = retrieveValueFromField(inputFieldName);
		    var cookiePrefix = tmpThat.formKey;
		    //stored_email_address is added to default cookie
                    if(!tmpConfigOfFields[inputFieldName]) {
			cookiePrefix = cookiePrefix + "_merchantparameter";
		    }
		    //Check and reformat amount to correct format
		    if(inputFieldName == "amount") {
			inputFieldValue = parseFloat(inputFieldValue);
		    }
		    tmpThat.updateCookie(inputFieldName, inputFieldValue, cookiePrefix);
		}
	    });
	} catch (err) {
	    
	}
    }
    
    var autoSubmitEpaymentForm = function() {
	that.log("auto submit form called");
	setParamsToFields();
	var isAllowedToSubmit = true;
	try {

	    if(form.attr("action") == "") {
		if(that.getApiEndpoint() && that.getApiEndpoint() != "") {
		    form.attr("action", that.getApiEndpoint()); 
		} else {    
		    throw "NotDefinedApiEndpointException";
		}
	    }
	    isAllowedToSubmit = beforeSubmitCallBack();
	    if(typeof isAllowedToSubmit != "undefined" && !isAllowedToSubmit) {
		return false;
	    }
	    if(form.attr("action") == that.getApiEndpoint()) {
		that.updateForm(true);
		that.validateForm();
		if(!that.options.submit_handler) {
		    //this.options.auto_submit must be undefined or true otherwise this function may not be called
		    //Don't submit the current page instead submit the iframe
		    if(that.options.iframe_container && that.options.iframe_container != "") {
			that.createAndSubmitIFrame();
			isAllowedToSubmit = false;
		    } else {
			isAllowedToSubmit = true;
		    }
		    if(typeof that.options.delete_data_after_submit != "undefined" && 
			that.options.delete_data_after_submit && that.options.delete_data_after_submit != "false") {
			that.deleteData();
		    }
		    if(!isAllowedToSubmit) {
			return isAllowedToSubmit;
		    }
		} else {
		    that.log("submit handler called");
		    that.options.submit_handler();
		    return false;
		}
	    } else {
		if(typeof that.options.submit_handler == "function") {
		    that.options.submit_handler();
		    return false;
		}
	    }

	} catch(err) {
	    that.log(err);
	    return false;
	}
	return true;
    }
    
    /**
     * If auto_submit == false is set, this method has to be called before submitted. If
     * response should be rendered in an iframe createAndSubmitIFrame
     *
     * @returns true if no error occured.
     */
    this.makeReadyToSubmit = function() {
	that.log("make ready to submit called");
	setParamsToFields();
	var isAllowedToSubmit = true;
	try {

	    if(form.attr("action") == "") {
		form.attr("action", that.getApiEndpoint()); 
	    }
	    isAllowedToSubmit = beforeSubmitCallBack();
	    if(typeof isAllowedToSubmit != "undefined" && !isAllowedToSubmit) {
		return false;
	    }
	    if(form.attr("action") == that.getApiEndpoint()) {
		that.updateForm(true);
		that.validateForm();
		if(typeof that.options.submit_handler == "function") {
		    that.options.submit_handler();
		}
	    } else {
		if(typeof that.options.submit_handler == "function") {
		    that.options.submit_handler();
		}
	    }

	} catch(err) {
	    return false;
	}
	return true;
    }
    
    if(typeof this.options.auto_submit == "undefined" || this.options.auto_submit == "true") {
	form.submit(function() {
	    return autoSubmitEpaymentForm();
	});
    } else {
	form.submit(function() {
	    return false;
	});
    }
   
   /**
    * Updates the form. Mandatory, hidden or merchant parameters/input fields
    * which are not created yet will be added
    * 
    * @params hidden boolean if newly created fields should be hidden.
    *
    */
    this.updateForm = function(hidden){
	that.log("update form called");
	this.createMandatoryAndNotHiddenFormFields(hidden);
	this.createHiddenFormFields();
	this.createMerchantParameterFields();
	
    };
    
   /**
    * Creates mandatory and not hidden parameters/input fields which are not set yet will be added
    *
    * @params hidden boolean if newly created fields should be hidden.
    *
    */
    this.createMandatoryAndNotHiddenFormFields = function(hidden){
	if(!hidden) {
	    hidden = false;
	}
	var tempField; 
	var label;
	
	for(var config in configOfFields) {
	    if(!configOfFields[config].hidden && configOfFields[config].mandatory) {
		tempField = form.find(":input[name=" + config + "]");
		if(tempField.length == 0) {
		    var tmpValue = that.options[config];
		    if(config == "amount" && tmpValue) {
			tmpValue = parseFloat(tmpValue);
		    }
		    var typeOfField = "hidden";
		    if(!hidden) {
			label = EPIK.jq("<label/>").text(config);
			form.append(label);
			typeOfField = "text";
		    }
		    that.createFormField(config, typeOfField, tmpValue);
		} 
	    }
	}
    };
    
   /**
    * Creates Hidden parameters/input fields. fields which are not set yet will be added
    * 
    */
    this.createHiddenFormFields = function(){
	for(var config in configOfFields) {
	    if(configOfFields[config].hidden && configOfFields[config].sendToEpp) {
		that.createFormField(config, "hidden", that.options[config]);
	    }
	}
	
    };
    
   /**
    * Creates parameters/input fields, fields which are not set yet will be added
    * 
    */
    this.createFormField = function(name, typeOfField, value) {
	var tempField; 
	var field;
	
	tempField = form.find(":input[name=" + name + "]");
	if(typeof value != "function") {
	    if(tempField.length == 0) {
		field = EPIK.jq("<input/>").attr({
		    type: typeOfField,
		    value: (value ? value : ""),
		    name: name
		});
		form.append(field);
	    } else {
		if(tempField.val() == "") {
		    tempField.val(value ? value : "");
		}
	    }
	}
    }
    
   /**
    * Creates merchant parameters/input fields which are not set yet will be added
    *
    */
    this.createMerchantParameterFields = function(){
	var tempField; 

	for(var entry in that.options) {
	    tempField = form.find(":input[name=" + entry + "]");
	    if(!configOfFields[entry] && tempField.length == 0 && that.options[entry]) {
		that.createFormField(entry, "hidden", that.options[entry]);
	    }
	}	
    };
    
   /**
    * Checks if mandatory input fields are set
    *
    */
    this.validateForm = function() {
	that.log("validate form called");	
	var tempField; 

	for(var config in configOfFields) {
	    if(configOfFields[config].mandatory) {
		tempField = form.find(":input[name=" + config + "]");
		if(tempField.length == 0) {
		    throw "MandatoryFieldNotFoundException: Form field " + config + " is missing.";
		} else {
		    var fieldType = ""
		    if(tempField.attr("type")) {
			fieldType = tempField.attr("type");
		    }
		    if(fieldType != "radio" && fieldType != "checkbox") {
			if(!EPIK.jq.trim(tempField.val())) {
			    throw "MandatoryFieldNotFoundException: Form field " + config + " is missing.";
			}
		    } else {
			if(EPIK.jq(tempField.selector + ":checked").length < 1) {
			    throw "MandatoryFieldNotFoundException: Form field " + config + " is missing.";
			}
		    }
		}
	    }
	}
	if(that.getRecurring() == "true") {
	    if(!that.options.stored_customer_email) {
		throw ("Parameter stored_customer_email not defined");
	    }
	    if(!that.options.recurring_interval) {
		throw ("Parameter recurring_interval not defined");
	    }
	}
    };
    
   /**
    * Deletes all data from the epayment cookie
    *
    */
    this.deleteData = function(){
	that.deleteCookie(that.formKey);
	that.deleteCookie(that.formKey + "_merchantparameter");
	
    };
    
   /**
    * Adds all available data which have a corresponding input field and 
    * are not set yet to the epayment form
    * 
    * @param force true if already manually set data will be overwritten
    *
    */
    this.fillOutForm = function(force){
	that.log("fill out form called");
	if(!force) {
	    force = false;
	}
	var tempField; 
	for(var entry in that.options) {
	    tempField = form.find(":input[name=" + entry + "]");
	    if(tempField.length != 0) {
		var typeOfField = tempField.attr("type");
		if(!typeOfField) {
		    typeOfField = "";
		}
		if(force || (tempField.val() == "" || (tempField.is("select") || typeOfField == "radio" || typeOfField == "checkbox"))) {
		    //if entry is amount change format
		    if(entry == "amount") {
			updateValueOfField(entry, parseFloat(that.options[entry]));
		    } else {
		       updateValueOfField(entry, that.options[entry]); 
		    }
		}
	    }
	}
    };
    
    
   /**
    * Adds a merchant field to the epayment form which value will be stored. Spike purpose only
    * 
    * @param options object
    * 
    * options.name = name of the field. stored_ prefix will be added.
    * options.label = label of the field. If not set name is used
    * options.value = value of the field. If not set empty string is used
    * options.parent_container = jquery object which is the parent container of this field. if not set epayment form is used
    * options.hidden = indicates if field is hidden
    * options.classes = assigned classes to the input field
    *
    */
    this.addStoredMerchantParameterField = function(options){
	if(!options.name) {
	    throw "StoredMerchantFieldNameIsMissingException";
	}
	if(!options.label) {
	    options.label = options.name;
	} 
	if(!options.value) {
	    options.value = "";
	}
	if(!options.parent_container) {
	    options.parent_container = form;
	} 
	var typeOfField = "text";
	if(!options.hidden) {
	    options.hidden = false;
	    typeOfField = "hidden";
	}
	if(!options.classes) {
	    options.classes = "";
	}
	//TODO style and html should be defined
	var label = "";
	if(!options.hidden) {
	    label = '<label>' + options.label + '</label>';
	}
	options.parent_container.append(label + '<input name="stored_' + options.name + '" type="' + typeOfField + '" class="' + options.classes + '" value="' + options.value + '"/>');
	that.setStoredMerchantParameter(options.name, options.value);
    };
    
   /**
    * Adds a merchant field to the epayment form which value will not be stored. Spike purpose only
    * 
    * @param options object
    * 
    * options.name = name of the field
    * options.label = label of the field. If not set name is used
    * options.value = value of the field. If not set empty string is used
    * options.parent_container = jquery object which is the parent container of this field. if not set epayment form is used
    * options.hidden = indicates if field is hidden
    * options.classes = assigned classes to the input field
    *
    */
    this.addMerchantParameterField = function(options){
	if(!options.name) {
	    throw "MerchantFieldNameIsMissingException";
	}
	if(!options.label) {
	    options.label = options.name;
	} 
	if(!options.value) {
	    options.value = "";
	}
	if(!options.parent_container) {
	    options.parent_container = form;
	} 
	var typeOfField = "text";
	if(!options.hidden) {
	    options.hidden = false;
	    typeOfField = "hidden";
	}
	if(!options.classes) {
	    options.classes = "";
	}
	//TODO style and html should be defined
	var label = "";
	if(!options.hidden) {
	    label = '<label>' + options.label + '</label>';
	}
	options.parent_container.append(label + '<input name="'+ options.name + '" type="' + typeOfField + '" class="' + options.classes + '" value="' + options.value + '"/>');
	that.setMerchantParameter(options.name, options.value);
    };

   /**
    * Sets currency and adds this input to the input field
    * 
    * @param currency string
    */ 
    this.setCurrency = function(currency){
	currency = currency.toLowerCase();
	that.options.currency = currency;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.CURRENCY, currency, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.CURRENCY, currency);
    };
    
   /**
    * Sets amount in rappen and adds this input to the input field
    * 
    * @param amount as string or number
    */ 
    this.setAmount = function(amount){
	var amountAsNumber = 0;
	amountAsNumber  = parseFloat(amount);
	that.options.amount = amountAsNumber;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.AMOUNT, amountAsNumber, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.AMOUNT, amountAsNumber);
    };
    
   /**
    * Sets error url and adds this input to the input field
    * 
    * @param errorUrl as string not encoded
    */
    this.setErrorUrl = function(errorUrl){
	that.options.error_url = errorUrl;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.ERROR_URL, errorUrl, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.ERROR_URL, errorUrl);
    };
    
   /**
    * Sets cancel url and adds this input to the input field
    * 
    * @param cancelUrl as string not encoded
    */
    this.setCancelUrl = function(cancelUrl){
	that.options.cancel_url = cancelUrl;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.CANCEL_URL, cancelUrl, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.CANCEL_URL, cancelUrl);
    };
    
   /**
    * Sets success url and adds this input to the input field
    * 
    * @param successrUrl as string not encoded
    */
    this.setSuccessUrl = function(successUrl){
	that.options.success_url = successUrl;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.SUCCESS_URL, successUrl, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.SUCCESS_URL, successUrl);
    };
    
   /**
    * Sets API end point and adds value to the epayment form attribute action
    * 
    * @param apiEndpoint as string not encoded
    */
    this.setApiEndpoint = function(apiEndpoint){
	that.options.apiendpoint = apiEndpoint;
	that.updateCookie("apiendpoint", apiEndpoint, that.formKey);
	form.attr("action", apiEndpoint);
    };
    
   /**
    * Sets http methode to the epayment form attribute method
    * 
    * @param method is either POST or GET. Currently only POST is supported
    */
    this.setMethod = function(method){
	that.options.method = method;
	that.updateCookie("method", method, that.formKey);
	form.attr("method", method);
    };
    
   /**
    * Sets poll status url and adds this input to the input field
    * 
    * @param pollStatusUrl as string not encoded
    */
    this.setPollStatusUrl = function(pollStatusUrl){
	that.options.pollstatus_url = pollStatusUrl;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.POLLSTATUS_URL, pollStatusUrl, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.POLLSTATUS_URL, pollStatusUrl);
    };
    
   /**
    * Sets payment method and adds this input to the input field. num
    * 
    * @param paymentMethod
    */
    this.setPaymentMethod = function(paymentMethod){
	paymentMethod = paymentMethod.toLowerCase();
	that.options.payment_method = paymentMethod;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.PAYMENT_METHOD, paymentMethod, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.PAYMENT_METHOD, paymentMethod);
    };
    
   /**
    * Sets test mode. if true no payment will be forced.
    * 
    * @param testMode as string true or false
    */
    this.setTestMode = function(testMode){
	testMode = testMode.toLowerCase();
	that.options.test_mode = testMode;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.TEST_MODE, testMode, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.TEST_MODE, testMode);
    };
    
   /**
    * Sets mobile mode. if true mobile opimized version of epayment forms will be returned
    * 
    * @param mobileMode as string true or false
    */
    this.setMobileMode = function(mobileMode){
	mobileMode = mobileMode.toLowerCase();
	that.options.mobile_mode = mobileMode;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.MOBILE_MODE, mobileMode, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.MOBILE_MODE, mobileMode);
    };
    
   /**
    * Sets language. 
    * 
    * @param iso code is used
    */
    this.setLanguage = function(iso){
	iso = iso.toLowerCase();
	that.options.language = iso;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.LANGUAGE, iso, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.LANGUAGE, iso);
    };
    
   /**
    * Sets a merchant parameter which is stored. 
    * 
    * @param parameterName
    * @param value
    */
    this.setStoredMerchantParameter = function(parameterName, value){
	if(parameterName.indexOf("stored_") != 0) {
	    throw "ParameterNameException : Parameter has to start with stored_"
	}
	that.options[parameterName] = value;
	that.updateCookie(parameterName, value, that.formKey + "_merchantparameter");
	updateValueOfField(parameterName, value);
    };
    
   /**
    * Sets a merchant parameter which is NOT stored. 
    * 
    * @param parameterName
    * @param value
    */
    this.setMerchantParameter = function(parameterName, value){
	if(parameterName.indexOf("stored_") == 0) {
	    throw "ParameterNameException : Parameter may not start with stored_"
	}
	that.options[parameterName] = value;
	that.updateCookie(parameterName, value, that.formKey + "_merchantparameter");
	updateValueOfField(parameterName, value);
    };
    
   /**
    * Sets transactionId
    * 
    * @param transactionId
    */
    this.setTransactionId = function(transactionId){
	that.options.transaction_id = transactionId;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.TRANSACTION_ID, transactionId, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.TRANSACTION_ID, transactionId);
    };
   
   /**
    * Sets reference number if it is a payement slip this info is mandatory
    * 
    * @param refNo
    */
    this.setRefNo = function(refNo){
	that.options.refno = refNo;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.REFNO, refNo, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.REFNO, refNo);
    };
    
   /**
    * Sets ES message to a payement slip
    * 
    * @param esMessage
    */
    this.setESMessage = function(esMessage){
	that.options.es_message = esMessage;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.ES_MESSAGE, esMessage, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.ES_MESSAGE, esMessage);
    };
    
   /**
    * Sets msisdn of customer
    * 
    * @param msisdn
    */
    this.setMSISDN = function(msisdn){
	that.options.msisdn = msisdn;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.MSISDN, msisdn, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.MSISDN, msisdn);
    };
    
   /**
    * Sets payer_line
    * 
    * @param num, num 1 - 4 will be considered for the payment slip.
    * @param val
    * 
    * @returns payer_line
    */
    this.setPayerLine = function(num, val){
	var payerLine = that.CONSTANTS.FORM_FIELD.PAYER_LINE_PREFIX + num;
	this.createFormField(payerLine, "hidden", val);
	that.options[payerLine] = val;
	that.updateCookie(payerLine, val, that.formKey);
	updateValueOfField(payerLine, val);
    };
    
   /**
    * Sets popup state
    * 
    * @param popup
    */
    this.setPopUp = function(popup){
	that.options.popup = popup;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.POPUP, popup, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.POPUP, popup);
    };
    
   /**
    * Sets card holder name
    * 
    * @param card_holder_name
    */
    this.setCardHolderName = function(cardHolderName){
	that.options.card_holder_name = cardHolderName;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.CARD_HOLDER_NAME, cardHolderName, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.CARD_HOLDER_NAME, cardHolderName);
    };
    
   /**
    * Sets recurrent payment
    * 
    * @param true|false
    */
    this.setRecurring = function(recurring){
	that.options.recurring = recurring;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.RECURRING, recurring, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.RECURRING, recurring);
    };
    
   /**
    * Sets recurrent payment interval
    * 
    * @param recurring_interval
    */
    this.setRecurringInterval = function(recurring_interval){
	that.options.recurring_interval = recurring_interval;
	that.updateCookie(that.CONSTANTS.FORM_FIELD.RECURRING_INTERVAL, recurring_interval, that.formKey);
	updateValueOfField(that.CONSTANTS.FORM_FIELD.RECURRING_INTERVAL, recurring_interval);
    };
    
    /**
    * Sets secure state of the cookie
    * 
    * @param secure_cookie
    */
    this.setSecureCookie = function(secure_cookie){
	that.options.secure_cookie = secure_cookie;
	that.updateCookie(this.CONSTANTS.CONFIG.SECURE_COOKIE, secure_cookie, that.formKey);
    };
    
   /**
    * Gets currency
    * 
    * @returns currency
    */
    this.getCurrency = function(){
	return that.options.currency;
    };
   
   /**
    * Gets amount
    * 
    * @returns amount
    */
    this.getAmount = function(){
	return that.options.amount;
    };
   
   /**
    * Gets error url
    * 
    * @returns error_url
    */
    this.getErrorUrl = function(){
	return that.options.error_url;
    };
    
   /**
    * Gets cancel url
    * 
    * @returns cancel_url
    */
    this.getCancelUrl = function(){
	return that.options.cancel_url;
    };
    
   /**
    * Gets success url
    * 
    * @returns success_url
    */
    this.getSuccessUrl = function(){
	return that.options.success_url;
    };
    
   /**
    * Gets API end point
    * 
    * @returns apiendpoint
    */
    this.getApiEndpoint = function(){
	return that.options.apiendpoint;
    };
    
   /**
    * Gets http method
    * 
    * @returns method
    */
    this.getMethod = function(){
	return that.options.method;
    };
    
   /**
    * Gets poll status url
    * 
    * @returns pollstatus_url
    */
    this.getPollStatusUrl = function(){
	return that.options.pollstatus_url;
    };
    
   /**
    * Gets payment method
    * 
    * @returns payment_method
    */
    this.getPaymentMethod = function(){
	return that.options.payment_method;
    };
    
   /**
    * Gets test mode state
    * 
    * @returns test_mode
    */
    this.getTestMode = function(){
	return that.options.test_mode;
    };
   
   /**
    * Gets mobile mode state
    * 
    * @returns mobile_mode
    */
    this.getMobileMode = function(){
	return that.options.mobile_mode;
    };
   
   /**
    * Gets language iso code
    * 
    * @returns language
    */
    this.getLanguage = function(){
	return that.options.language;
    };
    
   /**
    * Gets merchant parameter which is not stored
    * 
    * @param parameterName
    * 
    * @returns value
    */
    this.getMerchantParameter = function(parameterName){
	if(parameterName.indexOf("stored_") == 0) {
	    throw "ParameterNameException : Parameter may not start with stored_"
	}
	return that.options[parameterName];
    };
    
   /**
    * Gets merchant parameter which is stored
    * 
    * @param parameterName
    * 
    * @returns value
    */
    this.getStoredMerchantParameter = function(parameterName){
	if(parameterName.indexOf("stored_") != 0) {
	    throw "ParameterNameException : Parameter has to start with stored_"
	}
	return that.options[parameterName];
    };
   
   /**
    * Gets transaction id
    * 
    * @returns transaction_id
    */
    this.getTransactionId = function(){
	return that.options.transaction_id;
    };
    
   /**
    * Gets reference number of a payment slip
    * 
    * @returns refno
    */
    this.getRefNo = function(){
	return that.options.refno;
    };
    
   /**
    * Gets ES message a payment slip
    * 
    * @returns es_message
    */
    this.getESMessage = function(){
	return that.options.es_message;
    };
    
   /**
    * Gets payer_line
    * 
    * @param line number
    * 
    * @returns payer_line
    */
    this.getPayerLine = function(num){
	return that.options[that.CONSTANTS.FORM_FIELD.PAYER_LINE_PREFIX + num];
    };
    
   /**
    * Gets msisdn of customer
    * 
    * @returns msisdn
    */
    this.getMSISDN = function(){
	return that.options.msisdn;
    };
    
   /**
    * Pop up state. If true paypal response will be open in a popup
    * 
    * @returns popop
    */
    this.getPopUp = function(){
	return that.options.popup;
    };
    
   /**
    * Gets the card holder name
    * 
    * @returns card_holder_name
    */
    this.getCardHolderName = function(){
	return that.options.card_holder_name;
    };
    
    /**
    * Recurrent payment is activated or not 
    * 
    * @returns true if the payment is a recurrent payment
    */
    this.getRecurring = function(){
	return that.options.recurring;
    };
    
    /**
    * Gets the recurrent payment interval
    * 
    * @@returns recurring_interval
    */
    this.getRecurringInterval = function(){
        return that.options.recurring_interval;
    }
    
    /**
    * Retrieves secure state of cookie
    * 
    * @@returns true if cookie is secure
    */
    this.getSecureCookie = function(){
        return that.options.secure_cookie;
    }
    
   /**
    * Creates an iframe and submits the content to epayment
    * 
    */
    this.createAndSubmitIFrame = function() {
	var containerId = that.options.iframe_container;
	var container = form;
	if(containerId) {
	    container = EPIK.jq("#" + containerId);
	    if(container.length == 0) {
		throw "NoElementFoundException";
	    }
	}
	var waitingPage = "#";
	if(that.options.iframe_loading_page) {
	    waitingPage = that.options.iframe_loading_page
	}
	var iFrame = EPIK.jq("<iframe/>").attr({
		"width": "100%",
		"height": "100%",
		"name" : "epp_iframe",
		"frameborder" : 0,
		"src" : waitingPage
	    });
	

	var iFrameForm = EPIK.jq("<form/>").attr({
		"action": that.getApiEndpoint(),
		"method": that.getMethod()
	    });
	form.find(":input:not(:button):not(:submit):not(:radio):not(:checkbox),:input:checkbox:checked,:input:radio:checked").each(function() {
		var field = EPIK.jq(this);
		var inputFieldName = field.attr("name");
		if(inputFieldName) {
		    var inputFieldValue = retrieveValueFromField(inputFieldName);

		    if(inputFieldName == "amount" && inputFieldValue) {
			inputFieldValue = parseFloat(inputFieldValue);
		    }
		    if(that.options.iframe_landing_url && that.options.iframe_landing_url != "") {
			if((inputFieldName == "success_url" || inputFieldName == "cancel_url" || inputFieldName == "error_url") 
				&& inputFieldValue) {
			//TODO success, error and cancel url are overwritten. original values are not available.
			    /*var inputOrig = EPIK.jq("<input/>").attr({
				"type": "hidden",
				"name": inputFieldName + "_orig",
				"value": inputFieldValue
				});
			    iFrameForm.append(inputOrig);*/
				
			    inputFieldValue = that.options.iframe_landing_url;		
			}
		    }
		    var input = EPIK.jq("<input/>").attr({
			"type": "hidden",
			"name": inputFieldName,
			"value": inputFieldValue
			});
		    iFrameForm.append(input);
		}
		
	    });
	    
	container.find("iframe[name=epp_iframe]").remove();
	container.append(iFrame);
	that.waitUntilLoaded(iFrame, iFrameForm, waitingPage);
	/*iFrame.load(function() {
	    iFrame.contents().find("body").append(iFrameForm);
	    iFrame.contents().find("body form").submit();
	});*/
	//
	
    };
    
    this.waitUntilLoaded = function(iFrameO, iFrameFormO, waitingPageO) {
	var iFrame = iFrameO;
	var iFrameForm = iFrameFormO;
	var waitingPage = waitingPageO;
	if(that.options.iframe_loaded) {
	    iFrame.contents().find("body").append(iFrameForm);
	    iFrame.contents().find("body form").submit();
	} else if(waitingPage == "#") {
	    setTimeout(function() {
		iFrame.contents().find("body").append(iFrameForm);
		iFrame.contents().find("body form").submit();
	    }, 1000);
	} else {
	    setTimeout(function() {
		that.waitUntilLoaded(iFrame, iFrameForm, waitingPage);
	    }, 250);
	}
    }
    
   /**
    * Redirects to parent of the current container.
    * 
    */
    this.redirectToParent = function() {
	var state = that.getQueryParamValueFromUrl("epayment_status");
	var errorMessage = that.getQueryParamValueFromUrl("error-0");
	var search = self.location.search;
	
	that.addQueryParamsToEpikOptions();
	
	if(state == "success") {
	    self.parent.location.href = that.getSuccessUrl() + search;
	    return;
	} else if(state == "aborted_by_user") {
	    self.parent.location.href = that.getCancelUrl() + search;
	    return;
	} 
	if(errorMessage && errorMessage != "") {
	    self.parent.location.href = that.getErrorUrl() + search;
	    return;
	}
	
    };
    
    
   /**
    * Init the Count-Down-Widget for SMS double opt in.
    * 
    * options.start_minutes = start count down minutes
    * options.start_seconds = start count down seconds
    * options.container_id = container id of the dom element which should contain the Count-Down-Widget 
    * options.timedout = callback function which will be called when time is up
    * options.transaction_id = transaction id
    * options.confirmed = callback function which will be called when confirmed
    * options.declined = callback function which will be called when transaction is cancelled
    * options.interval = interval to ping the server
    *
    */
    this.waitForConfirmation = function (options){

	that.countDown(options.start_minutes, options.start_seconds, options.container_id, options.timedout);
	that.pollStatus(options.merchant_transaction_id, options.epp_transaction_id, options.confirmed, options.declined, options.interval);	
    };
   
   /**
    * set count down. Don't use it. Don't use it
    *
    */
    this.countDown = function (min, sec, counterElement, timedOutFunction){
	if (sec == 0) {
		min = min-1;
		sec = 59;
	} else {
		sec = sec-1;
	}
	that.showSMSCounter(min, sec, counterElement);
	if (min > 0 || sec > 0) {
		if(!that.stopCounter) {
			setTimeout(function() {
				that.countDown(min,sec, counterElement, timedOutFunction);
			}, 1000);
		}
	} else {
		if (!that.stopCounter) {
			that.stopPolling=true;
			timedOutFunction();
		}
	}
    };
    
   /**
    * Render the SMS Counter. Don't use it
    *
    */
    this.showSMSCounter = function (min, sec, counterContainerId){
	if (min < 10) {
        	min = "0" + min;
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	$("#" + counterContainerId).html(min +":" + sec);
    };

   /**
    * Retrieves information about the state of an SMS payment from the server. Don't use it
    *
    */
    this.pollStatus = function (merchantTransactionId, transactionId, confirmedFunction, declinedFunction , interval) {
	var url = that.options[that.CONSTANTS.FORM_FIELD.POLLSTATUS_URL] + "?merchant-trx-id=" + merchantTransactionId;
	if(transactionId) {
	    url = that.options[that.CONSTANTS.FORM_FIELD.POLLSTATUS_URL] + "?transaction-id=" + transactionId;
	}

	EPIK.jq.ajax({
		url: url,
                cache: false,
		dataType: "json",
		success: function(data) {
			that.parseStatusResponse(data, merchantTransactionId, transactionId, confirmedFunction, declinedFunction, interval);
		},
		error: function(jqXhr, status, code) {
			
		}
	});
    };
    
   /**
    * Parses the status response. Don't use it
    *
    */
    this.parseStatusResponse = function(data, merchantTransactionId, transactionId, confirmedFunction, declinedFunction, interval) {
	// confirmation is still pending
	if (data["status"] == "pending") {
		if (!that.stopPolling) {
			setTimeout(function () {that.pollStatus(merchantTransactionId, transactionId, confirmedFunction, declinedFunction, interval);}, interval * 1000);
		}
	} else if (data["status"] == "confirmed") {
		that.stopCounter = true;
		confirmedFunction();
	} else {
		that.stopCounter = true;
		declinedFunction();
	}
    };
    
   /**
    * Add all query parameters from the getunik's epayment response to the epik options.
    * 
    *
    */
    this.addQueryParamsToEpikOptions = function() {
	var queryObj = that.getQueryParams();
	
	for(var p in queryObj) {
	    if(that.options[p]) {
		if(that.options[p] != queryObj[p]) {
		    //TODO params are not the same!
		}
	    } else {
		//if(p == "success_url_orig" || p == "cancel_url_orig" || p == "error_url_orig") {
		//    that.options[p.substring(0, p.length - 5)] = queryObj[p];
		//    that.updateCookie(p.substring(0, p.length - 5), queryObj[p], that.formKey);
		//} else {
		    that.options[p] = queryObj[p];
		    that.updateCookie(p, queryObj[p], that.formKey);
		//}
	    }
	}
    };
    
   /**
    * Retrieves all query params from the url of getunik's epayment response
    * 
    * @returns object containing all parameter.
    *
    */
    this.getQueryParams = function() {
	// get the current URL
	var url = self.location.href;
	if (url.endsWith("#")) {
		url = url.substring(0, url.length - 1)
	}
	//get the parameters
	url.match(/\?(.+)$/);
	var params = RegExp.$1;
	// split up the query string and store in an
	// associative array
	params = params.split("&");
	var queryStringList = {};

	for(var i=0;i<params.length;i++)
	{
		var tmp = params[i].split("=");
		queryStringList[tmp[0]] = decodeURIComponent(tmp[1]);
	}
	return queryStringList;
    }
    
   /**
    * Retrieves info from the url of getunik's epayment response
    * 
    * @param key is the name of the query parameter
    * 
    * @returns value of the query parameter
    *
    */
    this.getQueryParamValueFromUrl = function(key) {
	
	return that.getQueryParams()[key];
    }
    
    var modulo10 = function(number) {
	var table = Array(0,9,4,6,8,2,7,1,3,5);
	var next = 0;
	for (var i=0; i<number.length; i++) {
		next = table[(next + parseInt(number.substr(i, 1))) % 10];
	}		
	return (10 - next) % 10;
    }
    
    /**
     * Creates a complete reference number
     * 
     * copied from www.sprain.ch, Manuel Reinhard
     * 
     * @param bankingCustomerIdentification specifies the banking customer identification 
     * @param code specifies a part of the reference number
     * 
     * @returns complete reference number
     */
    this.createCompleteRefNo = function(bankingCustomerIdentification, code) {
	if(!bankingCustomerIdentification || (bankingCustomerIdentification + "").length != 6) {
	    throw "BankingCustomerIdentificationException";
	}
	if(!code) {
	    code = "";
	}
	if(typeof code != "string" ) {
	    throw "FormatException: Code must be a string";
	}
	var refNoLength = (bankingCustomerIdentification + "").length + (code + "").length
	var refNo = "000000000000000000000000000";
	if(refNoLength > 27) {
	    throw "OutOfRangeException: Only 20 digits are allowed for the code";
	} else if(refNoLength == 27) {
	    var tmp = (bankingCustomerIdentification + "") + (code + "");
	    if(modulo10(tmp.substr(0, tmp.length - 1)) == tmp.substr(tmp.length - 1)) {
		throw "CheckDigitException";
	    } else {
		refNo = tmp;
	    }
	} else {
	    var delta = 27 - refNoLength - 1;
	    var fillUp = "";
	    if(delta > 0) {
		fillUp = (Math.pow(10, delta) + "").substr(1);
	    }
	    refNo = (bankingCustomerIdentification + "") + fillUp + (code + "");
	    refNo = refNo + modulo10(refNo);
	}
	return refNo;
    }
    
    this.getBaseUri = function() {
        var url = that.options.apiendpoint;
        if(url.indexOf("http") == 0) {
            url = url.substring(0, url.indexOf("/", 8) + 1);
        } else {
            url = "";
        }
        return url;
    }
    
    this.getMerchantConfigId = function() {
        var url = that.options.apiendpoint;
        var merchantConfigId = "";
        var lastIndex = url.lastIndexOf("/");
        if(url.length - 1 > lastIndex) {
            merchantConfigId = url.substr(lastIndex + 1);
        } else {
            url = url.substring(0, lastIndex);
            merchantConfigId = url.substr(url.lastIndexOf("/") + 1);
        }
        return merchantConfigId;
    }
    
    this.sendMerchantParameter = function(transactionId, name, value, callBackSuccess, callBackError) {
        var callBackSuccessFnct = callBackSuccess;
        var callBackErrorFnct = callBackError;
        
        var url = that.options.addmerchantparameter_url;
        if(url.length > 0) {
            EPIK.jq.ajax({
                    url: url,
                    type: "POST",
                    data: "transaction-id=" + transactionId + "&parameter-name=" + encodeURIComponent(name) + "&parameter-value=" + encodeURIComponent(value),
                    success: function(data) {
                        if(typeof callBackSuccessFnct == "function") {
                            callBackSuccessFnct(data);
                        }
                    },
                    error: function(jqXhr, status, code) {
                        if(typeof callBackSuccessFnct == "function") {
                            callBackErrorFnct(jqXhr, status, code);
                        }
                    }
            });
            
        } 
    }
    
    this.sendFinalSuccessStatus = function(transactionId, callBackSuccess, callBackError) {
        var callBackSuccessFnct = callBackSuccess;
        var callBackErrorFnct = callBackError;
        var url = that.options.setfinalstatus_url;
        if(url.length > 0) {

            EPIK.jq.ajax({
                    url: url,
                    type: "POST",
                    data: "transaction-id=" + transactionId,
                    success: function(data) {
                        if(typeof callBackSuccessFnct == "function") {
                            callBackSuccessFnct(data);
                        }
                    },
                    error: function(jqXhr, status, code) {
                        if(typeof callBackSuccessFnct == "function") {
                            callBackErrorFnct(jqXhr, status, code);
                        }
                    }
             });
        }
    }
    
}
