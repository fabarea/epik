

jQuery.fn.initCronTab = function (options) {
    var intervalOptions = jQuery.extend ({
		    dayObj : $(":input[name=day]"),
		    monthObj : $(":input[name=month]"),
		    weekdayObj : $(":input[name=weekday]"),
		    defaultWeekly : "* * 1",
		    defaultMonthly : "L * *",
		    defaultQuarterly : "L */3 *",
		    defaultSemestral : "L */6 *",
		    defaultYearly : "L 12 *",
		    callBackRP: function() {}}, options);
		
    intervalOptions.dayObj.initjQueryDayObject({callBackRP: intervalOptions.callBackRP});
    intervalOptions.monthObj.initjQueryMonthObject({callBackRP: intervalOptions.callBackRP});
    intervalOptions.weekdayObj.initjQueryWeekdayObject({callBackRP: intervalOptions.callBackRP});
    
    var resetObj = function(obj) {
	obj.each(function() {
	    if($(this).is(":radio") || $(this).is(":checkbox")) {
		$(this).attr("disabled", "disabled");
		$(this)[0].checked = false;
	    } else {
		$(this).val("");
		$(this).find(":selected").each(function() {
		    $(this).removeAttr("selected");
		});
		$(this).attr("disabled", "disabled");
	    }
	});
    };
    
    var setValue = function(obj, val) {
	obj.each(function() {
	    if($(this).is(":radio") || $(this).is(":checkbox")) {
		if($(this).val() == val) {
		    $(this)[0].checked = true;
		}
	    } else {
		$(this).val(val);
		
	    }
	});
    };
    
    var reset = function() {
	RPUtils.day ="*";
	RPUtils.month ="*";
	RPUtils.weekday ="*";

	resetObj(intervalOptions.dayObj);
	resetObj(intervalOptions.monthObj);
	resetObj(intervalOptions.weekdayObj);
    }
    
    $(this).bind("change", function() {
	reset();
	if($(this).val() == "weekly") {
	    intervalOptions.weekdayObj.removeAttr("disabled");
	    var v = intervalOptions.defaultWeekly.split(" ");	
	    setValue(intervalOptions.weekdayObj, v[2]);
	    
	    intervalOptions.callBackRP(RPUtils.generateCronTab(undefined, undefined, v[2]));
	} else if($(this).val() == "daily"){
	    intervalOptions.callBackRP(RPUtils.generateCronTab("*", undefined, undefined));
	} else if($(this).val() == "monthly" || $(this).val() == "quarterly" 
	    || $(this).val() == "semestral" || $(this).val() == "yearly") {

	    intervalOptions.dayObj.removeAttr("disabled");
	    
	    if($(this).val() == "monthly") {
		var v = intervalOptions.defaultMonthly.split(" ");
		setValue(intervalOptions.dayObj, v[0]);
		RPUtils.day = v[0];
	    } else if($(this).val() == "quarterly") {
		var v = intervalOptions.defaultQuarterly.split(" ");
		
		setValue(intervalOptions.dayObj, v[0]);
		RPUtils.day = v[0];
		
		RPUtils.month ="*/3";
		
	    } else if($(this).val() == "semestral") {
		
		var v = intervalOptions.defaultSemestral.split(" ");
		
		setValue(intervalOptions.dayObj, v[0]);
		RPUtils.day = v[0];
		
		RPUtils.month ="*/6";
	    } else if($(this).val() == "yearly") {
		
		var v = intervalOptions.defaultYearly.split(" ");
		
		setValue(intervalOptions.monthObj, v[1]);
		RPUtils.month = v[1];
		
		setValue(intervalOptions.dayObj, v[0]);
		RPUtils.day =v[0];
		intervalOptions.monthObj.removeAttr("disabled");
	    }
	    intervalOptions.callBackRP(RPUtils.generateCronTab(undefined, undefined, undefined));
	} 
    });
}

jQuery.fn.initjQueryDayObject = function (options) {
    var dayOptions = jQuery.extend ({
		    callBackRP: function() {}}, options);
    $(this).bind("change", function() {
	var day = $(this).val();
	if(parseInt($(this).val()) > 28) {
	    day= "L";
	} 
	dayOptions.callBackRP(RPUtils.generateCronTab(day, undefined, undefined));
    });
}

jQuery.fn.initjQueryMonthObject = function (options) {
    var monthOptions = jQuery.extend ({
		    callBackRP: function() {}}, options);
    $(this).bind("change", function() {
	RPUtils.generateCronTab(undefined, $(this).val(), undefined);
	monthOptions.callBackRP(RPUtils.generateCronTab(undefined, $(this).val(), undefined));
    });	
		
}

jQuery.fn.initjQueryWeekdayObject = function (options) {
    var weekdayOptions = jQuery.extend ({
		    callBackRP: function() {}}, options);
   $(this).bind("change", function() {
	RPUtils.generateCronTab(undefined, undefined, $(this).val());
	weekdayOptions.callBackRP(RPUtils.generateCronTab(undefined, undefined, $(this).val()));
    });	
}

function RPUtils() {}

RPUtils.day ="*";
RPUtils.month ="*";
RPUtils.weekday ="*";


RPUtils.generateCronTab = function(updatedDay, updatedMonth, updatedWeekday) {

  if(updatedDay) {
      RPUtils.day = updatedDay;
  }
  if(updatedMonth) {
      RPUtils.month = updatedMonth;
  }
  if(updatedWeekday) {
      RPUtils.weekday = updatedWeekday;
  }
  RPUtils.crontab =  RPUtils.day + " " + RPUtils.month + " " + RPUtils.weekday
  return RPUtils.crontab;
}