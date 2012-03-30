# Example app configuration

module GeoCodeApp  
  class << self
    # returns hash: [:google_key => 'sdgdsdsg']
    def map_keys
			YAML.load_file("#{Rails.root}/config/geo_keys.yml")[Rails.env]
		end

    # see demo/addresses.de.yml  - move to /config of app
    def load_streets city
      country_code = country_code_of(city)
      city = city.to_s
      
      @streets ||= {}
      @streets[city] ||= begin
        yml = YAML.load_file("#{Rails.root}/config/addresses.#{country_code}.yml")
        yml[country_code.to_s][city.to_s]
      rescue
        puts "No key found for city: #{city} in addresses.#{country_code}.yml"
        []
      end
    end    
  
    def country_code_of city = :munich
      COUNTRY_CODES[city.to_s.downcase.to_sym]
    end      
  
    COUNTRY_CODES = {
      :munich     => :de
    }  	
  end
end
