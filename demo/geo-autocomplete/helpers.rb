module GeoAutocomplete
	module Helpers

	  def map_key
	    GeoCodeApp.google_key
	  end

	  def draw_courier_location loc, text = 'I am the greatest!'
	    javascript_tag courier_location_script(loc, text)
	  end

	  def center_map_on_your_location # loc, text = 'You'
	    javascript_tag your_location_script #(loc, text)
	  end

	  def geo_autocomplete_for *fields
	    javascript_tag %Q{
	$().ready(function() {  
	  #{inner_js(fields)} 
	});
}
	  end

	  def inner_js fields
	    fields.flat_uniq.inject('') do |res, field|
	  	  res << geo_autocomplete_js(field)
	    end
	  end
	      
	  def geo_autocomplete_js field        
	    "GEOCODE.geoAutocompleteField.init('#{field}');\n" 
	  end
	  
	  def courier_location_script loc, text = ''
	    return if !location || !location.lat || !location.lng
	    %Q{jQuery(function(){
	    GEOCODE.map.setCourierLocation({
	      latitude: #{location.lat}, 
	      longitude: #{location.lng}, 
	      text: '#{text}'
	  });
	});
} 
	  end

	  def showDeliveryRoute booking
	    javascript_tag showDeliveryRoute_script booking
	  end
	  
	  # Possible use better JSON encoder?
	  def js_encode(obj)
	    ActiveSupport::JSON.encode(obj)
	  end

	  # booking.pickup.location
	  # booking.dropoff.location

	  # example booking hash
	  # {:pickup => {:location => {:lat => 1, :lng => 7}}, :dropoff => {:location => {:lat => 3, :lng => 5}}}
	  def showDeliveryRoute_script booking
	    return if !booking.pickup || !booking.dropoff
	    popPosition = js_encode(booking.pickup.location.for_json)
	    podPosition = js_encode(booking.dropoff.location.for_json)
	    %Q{jQuery(function(){
		GEOCODE.map.showRoute(GEOCODE.route(#{popPosition}, #{podPosition}))
	});
}    
	  end

	  def set_pickup_location location
	    return if !location
	    javascript_tag pickup_location_script(location, 'Pickup')
	  end

	  # location - {:lat => 1, :lng => 7}}
	  def pickup_location_script location, text = ''
	    return if !location || !location.lat || !location.lng
	    %Q{jQuery(function(){
	    GEOCODE.map.setPickupLocation({
	      latitude: #{location.lat}, 
	      longitude: #{location.lng}, 
	      text: '#{text}'
	  });
	});
}  
	  end

	  # location - {:lat => 1, :lng => 7}}
	  def set_dropoff_location location
	    return if !location
	    javascript_tag dropoff_location_script(location, 'Dropoff')
	  end

	  def dropoff_location_script location, text = ''
	    return if !location || !location.lat || !location.lng
	    %Q{jQuery(function(){
	    GEOCODE.map.setDropoffLocation({
	      latitude: #{location.lat}, 
	      longitude: #{location.lng}, 
	      text: '#{text}'
	  });
	});
} 
	  end


	  def your_location_script
	    %Q{jQuery(function(){
	  GEOCODE.map.init();
	  GEOCODE.mapAuto.init();
	});
	} 
	  end
	end
end