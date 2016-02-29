app.controller("ProductDetailController", function($scope,$routeParams,productService,$sce,$location) {
	
	$scope.scopeVar = $routeParams.productID;
	$scope.product = {};
	$scope.contextPath = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
	
	$scope.categories = productService.getProductCategories().success(
			function(response) {
				$scope.categories = response;
			});
	
	$scope.colors = productService.getProductColors().success(
			function(response) {
				$scope.colors = response.colors;
			});
	
	productService.getProductbyId($routeParams.productID, function(product) {
		$scope.product = product;
	});
	
/*	 productService.getProducts().success(function(productsArray){
			productsArray.forEach(function(obj) {
				if(obj.id == $routeParams.productID ){
					 product = obj;
					 $scope.product = product; 		 
				 }
			});
			
		});*/
	
	
    $scope.myModel = {
            Url: 'http://jasonwatmore.com/post/2014/08/01/AngularJS-directives-for-social-sharing-buttons-Facebook-Like-GooglePlus-Twitter-and-Pinterest.aspx',
            Name: "Rahul", 
            ImageUrl: 'http://www.jasonwatmore.com/pics/jason.jpg'
        };
    
    
    $scope.zoomLvl = 4;
    $scope.src = $scope.contextPath+"/assets/img/detailbig1.jpg";

    this.images = [{
      name: "Duck.jpg",
      url: './img/duck.jpg'
    },{
      name: "Moon.jpg",
      url: "./img/moon.jpg"
    }];

    this.addImage = function(){
      this.url = $sce.trustAsResourceUrl(this.url);
      
      this.images.push({
        name: this.name,
        url: this.url
      });

      this.name = '';
      this.url = '';
    }
    
 // get store and cart from service
	//$scope.store = DataService.store;
	//$scope.cart = MainController.cart;
	    
 });