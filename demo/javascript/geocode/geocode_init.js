GEOCODE.namespace("geoAutocompleteField");
GEOCODE.geoAutocompleteField = (function ($, app) {
	// initialize your private vars from the options object and app dependencies here
	var events = app.events,
	mapAuto = app.mapAuto,
	autoCompleteField,
	valid = false,

  ui_geocode_options = {
    	geocoder_region:  'Munich',
    	geocoder_types:   'street_address',
      geocoder_address: false, // true = use the full formatted address, false = use only the segment that matches the search term

      mapwidth:   100, // width of static map thumbnail
      mapheight:  100, // height of static map thumbnail
      maptype:    'terrain', // see http://code.google.com/apis/maps/documentation/staticmaps/#MapTypes
      mapsensor:  false, // see http://code.google.com/apis/maps/documentation/staticmaps/#Sensor

      minLength:  3, // see http://jqueryui.com/demos/autocomplete/#option-minLength
      delay:      300, // see http://jqueryui.com/demos/autocomplete/#option-delay

  		select: onSelect
  },
  
  otherOptions = {
  	geocoder_region:  'Munich',
  	geocoder_types:   'street_address',

  	mapwidth: 75,
  	mapheight: 75,
  	geocoder_address: true,
  	maptype: 'roadmap',
		notify: {
		  selector: '#notifier',
		  message: 'You must write a full street address'
	  },

  	select: function (_event, _ui) { 
  	  console.log('inside onSelect:', valid);
    }  		
  };  
	
	// call init here or remove this call, make init public and call it later
	function init(id) {
	  autoCompleteField = $("#" + id);
		// setup your autocomplete field here
		autoCompleteField.geo_autocomplete(otherOptions);  
	}

	// this is your select change handler which is attached to the autocomplete field
	function onSelect(_event, _ui) {
	  valid = true;
		// do some stuff and dispatch an event
		events.dispatch("geoAutocompleteFieldChange", isValid);
	}
	
	// create all your other internal functions
  function isValid() {
		return valid;
	}

	// return the functions you want to make public here
  return  {
    isValid: isValid,
    init : init
  }
}(jQuery, GEOCODE));


GEOCODE.namespace("geocoder");
GEOCODE.geocoder = function (options) {
  var callback = options.callback;
  
  function init(options) {
    callback = options.callback;
  }
}

GEOCODE.geocoder.instance = new google.maps.Geocoder();

GEOCODE.main = (function (app, $) {
    var courier = app.courier,
    map = app.map,
    mapAuto = app.mapAuto,
    events = app.events,
    geolocation = app.geolocation,
    pubsub = app.pubsub;

    function init() {
        map.init(); 
    }

    return {
        init: init
    }

}(GEOCODE, jQuery));

$(document).ready(function() {
  GEOCODE.main.init();    

  GEOCODE.geoAutocompleteField.init('search_street');
});



