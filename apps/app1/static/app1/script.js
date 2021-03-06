 		
	var map, infowindow, bounds, projection, zoom;

  	function initMap(callback) {
    	map = new google.maps.Map(document.getElementById('map'), {
      		zoom: 8,
      		center: {lat: 47.608013, lng: -122.335167}
      	// TODO: add infowindow to markers, add custom markers
    	});

    	var windowForm = "<table>" +
                 "<tr><td>Title:</td> <td><input type='text' name='title'> </td> </tr>" +
                 "<tr><td>Description:</td> <td><textarea name='description'></textarea> </td> </tr>" +
                 "<tr><td></td><td><input type='submit' value='Save'></td></tr>";
		
		infowindow = new google.maps.InfoWindow({
     		content: windowForm
    	});

    	google.maps.event.addListenerOnce(map, 'bounds_changed', function(){
    		bounds = (this.getBounds());
    		projection = (this.getProjection());
    		zoom = (this.getZoom());
			});

       	google.maps.event.addListenerOnce(map, 'idle', function(){
    		callback();
		});
  	}

	function pixelToLatLng (map, projection, x, y) {
		var topRight = projection.fromLatLngToPoint(map.getBounds().getNorthEast());
		var bottomLeft = projection.fromLatLngToPoint(map.getBounds().getSouthWest());
		var scale = 1 << map.getZoom();
		return projection.fromPointToLatLng(new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y));
	};

	$("#map").droppable({
	    accept: ".draggable",
	    drop: function(event,ui){
	    		var wrapper = $("#map");
	        	var map_div_pos = wrapper.offset();
	        	var map_div_border_left = parseInt(wrapper.css("border-left-width"),10);
	        	var map_div_border_top = parseInt(wrapper.css("border-top-width"),10);
	        	var mouse_pos = ui.helper.offset();
	        	var x = mouse_pos.left - map_div_border_left - map_div_pos.left;
	        	var y = mouse_pos.top - map_div_border_top - map_div_pos.top;
	        	lat_lng = pixelToLatLng(map, projection, x, y);

	   		ui.draggable[0].marker = new google.maps.Marker(
	        {
	            position: lat_lng,
	            draggable: true,
	            map: map,
	            icon: ui.draggable[0].dataset.icon,
	            zIndex: Math.round(lat_lng.lat()*-100000)<<5
	        });

			google.maps.event.addListener(ui.draggable[0].marker, "click", function() {
				infowindow.open(map, ui.draggable[0].marker);
			});
	    }
	});

    $(".draggable").draggable(
    {
        helper: "clone",
        appendTo: $('#map'),
        cursorAt: { left: 10, top: 0} //,
   //      stop: function(event, ui)
   //      {
 		// // TODO: make icon show after picking up and before getting to map div
   //      }
    });

 