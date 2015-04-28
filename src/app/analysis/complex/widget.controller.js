'use strict';
angular.module('analysis').controller('WidgetController', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.model.widgets.splice($scope.model.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			$modal.open({
				scope: $scope,
				templateUrl: 'demo/dashboard/widget_settings.html',
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
