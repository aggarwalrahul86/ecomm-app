app.controller("MainController", function($scope, $http, filters, productService, DataService,$location) {

					$scope.appStyle = "default";
					$scope.filters = filters;
					$scope.contextPath = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));

					$scope.myModel = {
						Url : 'http://jasonwatmore.com/post/2014/08/01/AngularJS-directives-for-social-sharing-buttons-Facebook-Like-GooglePlus-Twitter-and-Pinterest.aspx',
						Name : "Rahul",
						ImageUrl : 'http://www.jasonwatmore.com/pics/jason.jpg'
					};
					
					$http.get($location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) +"app/shared/json/CategoryConfig.json")
						.success(function(response) {
								$scope.categories = response;
					});

					// get store and cart from service
					//$scope.store = DataService.store;
					$scope.cart = DataService.cart;

					// use routing to pick the selected product
					/*if ($stateParams.productSku != null) {
						$scope.product = $scope.store
								.getProduct($stateParams.productSku);
					}*/
					
					$http.get($location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) +"app/shared/json/ApplicationProperties.json")
						.success(function(response) {
							$scope.title = response.title;
							$scope.appStyle = response.appStyle;
					});
					
					$http.get($location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) +"app/shared/json/PageProperties.json")
					.success(function(response) {
						$scope.mainSliders = response.mainSliders;
				});

				});
