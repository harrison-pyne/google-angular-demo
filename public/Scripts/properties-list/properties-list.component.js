"use strict";
angular.
	module("propertiesList", ["googleMap"]).
	component("propertiesList", {
		"templateUrl": "Scripts/properties-list/properties-list.template.html",
		"controller": ["$scope", "googleMapService", function propertiesListController($scope, googleMapService) {
			var self = this;

			self.select = function (property) {
				var marker = googleMapService.mapMarkers[property.id];
				
				google.maps.event.trigger(marker, "click");

				if ($scope.selectedProperty) {
					$scope.selectedProperty.isSelected = false;
				}

				property.isSelected = true;
				$scope.selectedProperty = property;

				$("html, body").animate({
					scrollTop: $("#map").offset().top
				}, 500);
			};

			var assignElementsToMarkers = function (markers) {
				for (var i = 0; i < markers.length; i++) {
					var marker = markers[i];

					marker.addListener("click", function () {
						updateCorrespondingElementToActive(this);
					});
				}
			}

			//TAKEN FROM https://coderwall.com/p/ngisma/safe-apply-in-angular-js
			//DUE TO DIGEST CYCLE ERROR
			$scope.safeApply = function (fn) {
				var phase = this.$root.$$phase;

				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof (fn) === 'function')) {
						fn();
					}
				} else {
					this.$apply(fn);
				}
			};

			var updateCorrespondingElementToActive = function (marker) {
				var property = self.properties[marker.index];

				if ($scope.selectedProperty) {
					$scope.selectedProperty.isSelected = false;
				}

				property.isSelected = true;
				$scope.selectedProperty = property;

				//UPDATES THE NG-CLASSES, BECAUSE THE MARKER EVENTS DO NOT TRIGGER THE UPDATE ON THEIR OWN.
				$scope.safeApply();
			};

			self.properties = window.mapData.markers;


			angular.element(document).ready(function () {
				assignElementsToMarkers(googleMapService.getMapMarkers());
			});
			
		}]
	}
);