app.controller("ProductController", function($scope,$http,filters,productService,$location) {
	
	$scope.filters = filters;
	$scope.rowsPerPage = 50;
	$scope.contextPath = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
	
	
	$scope.colorsSelected = [];
	
	$scope.categories = productService.getProductCategories().success(
			function(response) {
				$scope.categories = response;
			});
	
	$scope.colors = productService.getProductColors().success(
			function(response) {
				$scope.colors = response.colors;
			});
	
	$scope.createFilter = function($event, colorName) {

		var colorExist = false;

		if ($scope.filters.color.length != 0) {

			$scope.filters.color.forEach(function(color, index) {
				if (colorName in color) {
					colorExist = true;
					$scope.filters.color[index][colorName] = $event;
				}
			});
		}

		if (!colorExist) {
			colorObj = {};
			colorObj[colorName] = $event;
			$scope.filters.color.push(colorObj);
		}

	}
	
	$scope.colorFilter=function(categoryName){		
		
		if (filters.category == '' && categoryName == ''){
			
			$scope.colors = productService.getProductColors().success(
					function(response) {
						$scope.colors = response.colors;
			});
			
		}else{
			
			$scope.colorFilter = productService.getFilterCountbyCategory(categoryName,'color', function(colorFilter) {
				$scope.colorFilter = colorFilter;
			});
			
		}
	            
	    }
	
	
	$scope.viewDetails=function(param){			
	       $location.path("/detail/"+param)       
	    }
    
    $http.get("app/shared/json/ProductConfig.json").success( function(response) {
    	console.log("Checking Prod",response);
        $scope.products = response;
     });
    
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	 animations();
         productDetailGallery(4000);
         carousels();
         utils();
         demo();
    });
 
    
 });