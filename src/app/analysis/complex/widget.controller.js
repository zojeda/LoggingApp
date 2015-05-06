'use strict';
angular.module('analysis').controller('WidgetController', ['$scope', '$modal',
  function($scope, $modal) {

    $scope.widgetUI = {
      fullWidth: 0,
  		fullHeight: 0,
  		contentWidth: 0,
  		contentHeight: 0
    };

		$scope.$on('gridster-item-initialized', function(item) {
			$scope.syncWidgetSize(item.targetScope.gridsterItem);
		});

    $scope.$on('gridster-item-resized', function(item) {
			$scope.syncWidgetSize(item.targetScope.gridsterItem);
    });


    $scope.syncWidgetSize = function(gridsterItem) {
			$scope.widgetUI.fullWidth = gridsterItem.getElementSizeX();
			$scope.widgetUI.fullHeight = gridsterItem.getElementSizeY();
			$scope.widgetUI.contentWidth = $scope.widgetUI.fullWidth - 27;
			$scope.widgetUI.contentHeight = $scope.widgetUI.fullHeight - 60;
      $scope.$broadcast('widgetResize', $scope.widgetUI);
    }

    $scope.remove = function(widget) {
      $scope.model.widgets.splice($scope.model.widgets.indexOf(widget), 1);
    };

    $scope.openSettings = function(widget) {
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
