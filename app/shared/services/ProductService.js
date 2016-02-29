app.service('productService', function($http,$location){	
	
	var contextPath = $location.absUrl().substr(0, $location.absUrl().lastIndexOf("#"));
	
	this.getProductCategories = function(){
		return $http.get(contextPath+"app/shared/json/CategoryConfig.json");
	};
	
	this.getProductColors = function(){
		return $http.get(contextPath+"app/shared/json/FiltersData.json");
	}
	
	this.getProducts = function(){
		return $http.get(contextPath+"app/shared/json/ProductConfig.json");
	};
	
	this.getProductbyId = function(productId, callback){
		var productsArray = [];
		var product = {};
		$http.get(contextPath+"app/shared/json/ProductConfig.json").success(function(data){
			productsArray = data;
			
			productsArray.forEach(function(obj) {
				if(obj.id == productId ){
					 console.log(obj.id);
					 product = obj;
					 callback(product);	 
				 }
				
			});
		});
	};
	
	this.getFilterCountbyCategory = function(categoryId,filerName, callback){
				var productsArray = [];
				var productsbyCategory = [];
				$http.get(contextPath+"app/shared/json/ProductConfig.json").success(function(data){
					productsArray = data;
					
					productsArray.forEach(function(obj) {
						console.log(obj.id);
						if(obj.category == categoryId){
							 console.log(obj.category);
							 productsbyCategory.push(obj);
							// product = obj;
							// callback(product);	 
						 }
						
					});
					
			var filterscount = {};
			
			for(var i = 0; i < productsbyCategory.length; i++) {
			    
				var filterObj = productsbyCategory[i][filterName];
				
				var count = (filterscount[filterObj] || 0) + 1;
				
				filterscount[filterObj] = count;
				
				callback(filterscount);

			}
			
			
			
		});
	};
	
});

