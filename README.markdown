Geo autocomplete for Rails 3
============================

A jQuery UI widget to turn a text field into a google maps autosuggest field. 

The original version of this code can be located at [geo-autocomplete on Google Code](http://code.google.com/p/geo-autocomplete/).

In addition to the functionality provided by the original widget, this widget allows for a pinDrop callback, which appends a "drop a pin" option to the autocomplete list.

Rails 3.1+ Installation
-----------------------

In your application.js manifest file

// require ui.geoautocomplete

Or for the alternative version

// require ui.geoautocomplete_alt

Or with some debug statements to the console included

// require ui.geoautocomplete_alt.debug

Usage
-----

    var map = new google.maps.Map(document.getElementById("map_canvas"), {
      center: new google.maps.LatLng(40.7143528,-74.0059731)
    });
    
    $('#search_term').geo_autocomplete({
    	maptype: 'roadmap',
    	map: map,
    	
    	// Callback on pin drop
    	pinDrop: function(event) {
    	  console.log("lat: " + event.latLng.lat());
    	  console.log("lng: " + event.latLng.lng());
      }
    });

Or simply:

    $().ready(function() {
      var inputElem = $('#search_street');  
      console.log('add autocomplete', inputElem)
      inputElem.geo_autocomplete();  
    });

Demo
------

You can also see the demo folder for some examples of use and some extra javascript functionality that could be of use.

The demo folder contains some Rails 3 code that shows how to set up a GeoCode app. In this case it is from a courier scenario taken from a real-world case. You can use this for inspiration or as a "baseline" for your app.

Copyright (c) 2010 Bob Hitching, Julia West; Dual licensed under the MIT and GPL licenses.