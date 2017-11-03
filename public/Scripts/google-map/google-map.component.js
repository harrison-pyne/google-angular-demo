"use strict";
angular.
	module("googleMap").
	service("googleMapService", function () {
		var service = this;
		var mapOptions = {
			"zoom": 13,
			"minZoom": 13,
			"center": {
				"lat": 34.198021,
				"lng": -119.177444
			},
			"mapTypeId": "hybrid",
			"fullscreenControl": false
		};
		var initMapMarkers = function (map, markerData) {
			var mapMarkers = [];

			for (var i = 0, markersLength = markerData.length; i < markersLength; i++) {
				var markerObj = markerData[i];

				if (markerObj) {
					var marker = new google.maps.Marker({
						"position": markerObj.position,
						"map": map,
						"title": markerObj.title,
						"address": markerObj.address,
						"image": markerObj.image,
						"rent" : markerObj.rent,
						"available": markerObj.available,
						"index": i
					});

					var infoWindow = new google.maps.InfoWindow();

					google.maps.event.addListener(marker, "click", function () {
						infoWindow.setContent(generateInfoWindowContent(this));
						infoWindow.open(map, this);
						map.panTo(this.getPosition());
					});

					mapMarkers.push(marker);
				}
			}

			service.mapMarkers = mapMarkers;
		};
		var generateInfoWindowContent = function (marker) {
			var contentString = 
				'<div class="info-window">' +
				'	<div><h2>' + marker.title + '</h2></div>' +
				'	<div><img src="' + marker.image + '"></img></div>' +
				'	<div><p class="info-data"><span class="label">Address: </span> ' + marker.address + '</p></div>' +
				'	<div><p class="info-data"><span class="label">Rent: </span>' + marker.rent + '</p></div>' +
				'	<div><p class="info-data-datael"><span class="label">Available From: </span>' + marker.available + '</p></div>' +
				'</div>';

			return contentString;
		};
		var initMap = function () {
			service.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		};
		var getMapMarkers = function () {
			if (!service.mapMarkers) {
				var map = getMap();
				initMapMarkers(map, window.mapData.markers);
			}

			return service.mapMarkers;
		};
		var getMap = function () {
			if (!service.map) {
				initMap();
			}

			return service.map;
		};
		var getPropertyById = function (id) {
			if (!service.markers) {
				var map = getMap();
				initMapMarkers(map, window.mapData.markers);
			}

			return service.markers[id]
		};

		service.getMap = getMap;
		service.getMapMarkers = getMapMarkers;
	}).
	component("googleMap", {
		"templateUrl": "Scripts/google-map/google-map.template.html",
		"controller": ["$scope", "googleMapService", function googleMapController($scope, googleMapService) {
			
			$scope.map = googleMapService.getMap();
			$scope.markers = googleMapService.getMapMarkers();
		}]
	}
);