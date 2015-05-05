'use strict';
angular.module('analysis').controller('WidgetController', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.model.widgets.splice($scope.model.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			console.log(widget);
			$modal.open({
				scope: $scope,
				templateUrl: widget.settingsTemplate,
				controller: 'WidgetSettingsCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

	}
])
