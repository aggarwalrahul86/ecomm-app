app.controller("CartController", function($scope,$http) {
	
	$scope.TabNumber = 0;
		
	$http.get("../json/CheckoutOptions.json").success(
			function(response) {
				$scope.tabs = response.tabs;
				$scope.nextPage = "."+$scope.tabs[1].tabName;
			});
	
	$scope.setUpTabs = function(index) {
        $scope.TabNumber = index;
    }
	
});