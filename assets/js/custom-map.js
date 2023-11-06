var themap;

function mobile_check() {
	if ($( window ).width() <= 767) {
		themap.setOptions({
			draggable: false				
		});
	} else if ($( window ).width() > 767) {
		themap.setOptions({
			draggable: true
		});
	}
}

function map_init() {
	"use strict";
	
	//var mapIcon = '/wp-content/themes/WellstonStation/assets/images/location-marker.png';
	var i = 0;
	
	// Get info
	// map_info is provided dynamically
	var p_total = map_info.length ;
	
	
	// Create javascript arrays
	var j_latLng = [];
	var j_content = [];
	var j_marker = [];
	var j_infoWindow = [];
	
	// All map points and bounds for the map, and related content for its infoWindow
	var bound = new google.maps.LatLngBounds();
	for( i=0; i < p_total ; i++ ) {
		j_latLng.push(new google.maps.LatLng( map_info[i]['lat'], map_info[i]['lng'] ));
		j_content.push('<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<p id="firstHeading" class="firstHeading">'+
			map_info[i]['title']+
			'<p>'+
			'<div id="bodyContent">'+
			'<p>'+
			'<a href="https://www.google.com/maps/place/'+
			map_info[i]['address']+
			'" target="_blank">'+
			'<b>Address:</b> '+
			map_info[i]['address']+
			'</a>'+
			'</p>'+
			'</div>'+
			'</div>');
		bound.extend( j_latLng[i] );
	}
	
	var boundCenter = bound.getCenter();

	// Build map options
	var mapOptions = {
		center: boundCenter,
		draggable: true,
		scrollwheel: false,				
		zoom: 15,
		minZoom: 4,
		maxZoom: 22,
		streetViewControl: false,
		panControl: true,
		zoomControl: true,					  
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
		}, 
        // Build out at https://snazzymaps.com/
		styles: [
            {
              stylers: [
                { },
                { },
                { }
              ]
            },{
              featureType: "all",
              elementType: "geometry",
              stylers: [
                { lightness: 22 },
                { visibility: "simplified" }
              ]
            },{
              featureType: "road",
              elementType: "labels",
              stylers: [
                { visibility: "on" }
              ]
            }
            ]
	}; 
	
 	
	// Build map
	themap = new google.maps.Map(document.getElementById("contact-map"),mapOptions);
	
    // Mobile check on Load
    mobile_check();
	
	google.maps.event.addDomListener(window, 'resize', function() {
		themap.setCenter(boundCenter);
        //themap.fitBounds(bound);
	});
	
	// Set the marker/s, infoWindows, and infoWindow click events
	function googleClickHandler(i) {
		return function() {
			j_infoWindow[i].open(themap,j_marker[i]);
		};
	}
	
	for( i=0; i < p_total; i++ ) {
		j_marker.push(new google.maps.Marker({
			position: j_latLng[i],
			map: themap,
			//icon: mapIcon,
			title: map_info[i]['title']
		}));
		
		j_infoWindow.push(new google.maps.InfoWindow({
			content: j_content[i]
		}));
		
		google.maps.event.addListener(j_marker[i], 'click', googleClickHandler(i));
		//google.maps.event.addListener(j_infoWindow[i], 'closeclick', infoWindowCloseHandler(i));
	}
	

	google.maps.visualRefresh = true;					 
}

google.maps.event.addDomListener(window, 'load', map_init);	

google.maps.event.addDomListener(window, 'resize', mobile_check);