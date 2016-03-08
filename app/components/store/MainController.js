app.controller("MainController", function($scope, $http, filters, productService, DataService, $location, $anchorScroll) {

					$scope.appStyle = "default";
					$scope.filters = filters;
					$scope.contextPath = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
					$scope.imagePath = $scope.contextPath + "assets/img/products/";
					$scope.imageExtension = ".jpg";
					$scope.bannerImagePath = $scope.contextPath + "assets/img/banners/";
					$scope.user = {};
					$scope.visitor ={
							"isCustomer" : "false",
							"message":"Welcome Guest"};
					
	
					$scope.logout = function(){
						$scope.visitor.isCustomer = "false" ;
						$scope.visitor.message = " Welcome Guest";
					}
					
					$scope.authenticate = function(){
						
						
						$http.post("/api/authenticate/ecommdb", $scope.user,{
					        headers: { 'Content-Type': 'application/json'}
					    })
							.success(function (data, status, headers, config) {
								console.log("Response Recieved",data.status);
								
								if(data.status == "Success"){
									$("#login-modal").modal('hide');
									$scope.visitor.isCustomer = "true" ;
									$scope.visitor.message = "Login Successful.Welcome "+ $scope.user.username;
									
								}else{
									$scope.visitor.isCustomer = "false" ;
									$scope.visitor.message = "Login is not successful. Welcome Guest";
								}
								
				        	})
					        .error(function (data, status, headers, config) {
					        	$scope.visitor.isCustomer = "false" ;
								$scope.visitor.message = "Login is not successful. Welcome Guest";
					        	 console.log("error Response ", data);
					        });
						
					}

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
					
				$scope.scrollTo = function(id) {
				      $location.hash(id);
				      $anchorScroll();
				   }

});
