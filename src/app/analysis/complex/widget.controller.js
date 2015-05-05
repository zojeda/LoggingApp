'use strict';
angular.module('analysis').controller('WidgetController', ['$scope', '$modal',
  function($scope, $modal) {

    $scope.widgetFullWidth = 0;
		$scope.widgetFullHeight = 0;
		$scope.widgetContentWidth = 0;
		$scope.widgetContentHeight = 0;

		$scope.$on('gridster-item-initialized', function(item) {
			$scope.syncWidgetSize(item.targetScope.gridsterItem);
		});

    $scope.$on('gridster-item-resized', function(item) {
			$scope.syncWidgetSize(item.targetScope.gridsterItem);
    });


    $scope.syncWidgetSize = function(gridsterItem) {
			$scope.widgetFullWidth = gridsterItem.getElementSizeX();
			$scope.widgetFullHeight = gridsterItem.getElementSizeY();
			$scope.widgetContentWidth = $scope.widgetFullWidth - 27;
			$scope.widgetContentHeight = $scope.widgetFullHeight - 50;
    }

    $scope.remove = function(widget) {
      $scope.model.widgets.splice($scope.model.widgets.indexOf(widget), 1);
    };

    $scope.openSettings = function(widget) {
      console.log($scope.gridsterItem);
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
