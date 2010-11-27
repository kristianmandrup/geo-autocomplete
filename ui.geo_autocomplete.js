/*
 * jQuery geo_autocomplete plugin 2.0.1
 *
 * Copyright (c) 2010 Bob Hitching
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Requires jQuery UI Autocomplete
 * 
 */
$.widget( "ui.geo_autocomplete", {
	// setup the element as an autocomplete widget with some geo goodness added
	
	_init: function() {	  
	  var self = this;
	  
		this.options._geocoder = new google.maps.Geocoder, // geocoder object
		this.options._cache = {}; // cache of geocoder responses
		
		if (this.options.pinDrop) {		  
		  this.element.bind( "autocompleteselect", function(event, ui){
		    self.options.pinDropSelect(event, ui);
		  });
		}
		
		this.element.autocomplete(this.options);
		
		// _renderItem is used to prevent the widget framework from escaping the HTML required to show the static map thumbnail
		this.element.data('autocomplete')._renderItem = function(_ul, _item) {
			return $('<li></li>').data('item.autocomplete', _item).append(this.options.getItemHTML(_item)).appendTo(_ul);
		};
	},
	
  /*  default values
   *    geocoder_region  - filter to a specific region, e.g. 'Europe'
   *    geocoder_types   - array of acceptable location types, see http://code.google.com/apis/maps/documentation/javascript/services.html#GeocodingAddressTypes
   *    geocoder_address - true: use full formatted address; false: use the segment that matches the search term
   *    mapwidth         - width of static map thumbnail
   *    mapheight        - height of static map thumbnail
   *    maptype          - see http://code.google.com/apis/maps/documentation/staticmaps/#MapTypes
   *    mapsensor        - see http://code.google.com/apis/maps/documentation/staticmaps/#Sensor
   *    pinDrop          - true: adds pinDrop option to end of results list, default false, if true, requires map
   *    map              - google maps map object, eg: new google.maps.Map(document.getElementById("map_canvas"), {})
   *    minLength        - see http://jqueryui.com/demos/autocomplete/#option-minLength
   *    delay            - see http://jqueryui.com/demos/autocomplete/#option-delay
   */
	options: {
		geocoder_region : '', 
		geocoder_types  : 'street_address,route,intersection,political,country,' +           
      'administrative_area_level_1,administrative_area_level_2,' + 
      'administrative_area_level_3,colloquial_area,locality,sublocality,' + 
      'neighborhood,premise,subpremise,postal_code,natural_feature,airport,park,' + 
      'establishment', 
		geocoder_address : false,
		mapwidth         : 100, 
		mapheight        : 100, 
		maptype          : 'terrain', 
		mapsensor        : false, 
		pinDrop          : false,
		map              : null,
		minLength        : 3, 
		delay            : 300,
		
		// callback function to get autocomplete results
		source: function(_request, _response) {
			if (_request.term in this.options._cache) {
				_response(this.options._cache[_request.term]);
			} else {
				var self = this;
				var _address = _request.term + (this.options.geocoder_region ? ', ' + this.options.geocoder_region : '');
				this.options._geocoder.geocode({'address': _address}, function(_results, _status) {
					var _parsed = [];
					if (_results && _status && _status == 'OK') {
						var _types = self.options.geocoder_types.split(',');
						$.each(_results, function(_key, _result) {
							// if this is an acceptable location type with a viewport, it's a good result
							if ($.map(_result.types, function(_type) {
								return $.inArray(_type, _types) != -1 ? _type : null;
							}).length && _result.geometry && _result.geometry.viewport) {

								if (self.options.geocoder_address) {
									_place = _result.formatted_address;
								} else {
									// place is first matching segment, or first segment
									var _place_parts = _result.formatted_address.split(',');
									var _place = _place_parts[0];
									$.each(_place_parts, function(_key, _part) {
										if (_part.toLowerCase().indexOf(_request.term.toLowerCase()) != -1) {
											_place = $.trim(_part);
											return false; // break
										}
									});
								}
							
								_parsed.push({
									value: _place,
									label: _result.formatted_address,
									viewport: _result.geometry.viewport
								});
							}
						});
            
						if (self.options.pinDrop) {
						  // Drop a pin option
              row = ['Drop a pin', null];
              _parsed.push({
                viewport: row,
                value: row[0],
                label: _request.term
              });
						}
					}
					self.options._cache[_request.term] = _parsed;
					_response(_parsed);
				});
			}
		},
		
		// returns the HTML used for each autocomplete list item
		getItemHTML: function(_item) {
		  if (typeof _item.viewport.getSouthWest != "undefined") {
		    var _src = 'http://maps.google.com/maps/api/staticmap?visible=' + 
  			  _item.viewport.getSouthWest().toUrlValue() + '|' + 
  			  _item.viewport.getNorthEast().toUrlValue() + '&size=' + this.mapwidth + 
  			  'x' + this.mapheight + '&maptype=' + this.maptype + '&sensor=' + 
  			  (this.mapsensor ? 'true' : 'false');
  			
  			return '<a><img style="float:left;margin-right:5px;" src="' + _src + 
  			  '" width="' + this.mapwidth + '" height="' + this.mapheight + '" /> ' + 
  			  _item.label.replace(/,/gi, ',<br/>') + '<br clear="both" /></a>'
		  } else if (this.pinDrop) {
		    return '<a style="padding-left:' + (this.mapwidth + 5) + 'px;">' + _item.value + '</a>'; 
		  }			  
		},
		
		// handler for click on results
		pinDropSelect: function(_event, _ui) {
		  if (this.map) {
  			if (typeof _ui.item.viewport.getSouthWest == "function" ){
  			  this.map.fitBounds(_ui.item.viewport);
  			} else {
  			  var self = this;
  			  
  			  google.maps.event.addListener(this.map, 'click', function() {
            if (self.infowindow) self.infowindow.close();
          });

          google.maps.event.addListener(this.map, 'click', function(event) {
            if (self.marker) {
              self.marker.setMap(null);
              self.marker = null;
            }
            
            self.marker = new google.maps.Marker({
              position: event.latLng,
              map: self.map,
              zIndex: Math.round(event.latLng.lat()*-100000)<<5
            });

            google.maps.event.addListener(self.marker, 'click', function() {
              if (!self.infowindow) {
                self.infowindow = new google.maps.InfoWindow({ 
                  size: new google.maps.Size(150,50)
                });
              }
              
              self.infowindow.setContent("<b>Location</b><br>"+event.latLng); 
              self.infowindow.open(self.map,self.marker);
            });
            
            google.maps.event.trigger(self.marker, 'click');
          });
  			}
		  }
		}
	}
});