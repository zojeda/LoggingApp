'use strict';
angular.module('analysis').controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
	function($scope, $timeout, $rootScope, $modalInstance, widget) {


		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.remove = function() {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			$modalInstance.close();
		};

		$scope.submit = function() {
			angular.extend(widget, $scope.form);

			$modalInstance.close(widget);
		};

	}
])
