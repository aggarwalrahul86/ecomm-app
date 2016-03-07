app.controller("CartController", function($scope,$http) {
	
	$scope.TabNumber = 0;
		
	$http.get("app/shared/json/CheckoutOptions.json").success(
			function(response) {
				$scope.tabs = response.tabs;
				$scope.nextPage = "."+$scope.tabs[1].tabName;
			});
	
	$scope.setUpTabs = function(index) {
        $scope.TabNumber = index;
    }
	
	$scope.sendEmail = function(){
		
		data = {};
		
		data.body = "this is checking put of details";
		data.from = "aggarwalrahul86@gmail.com";
		data.to = "aggarwalrahul86@gmail.com";
		data.fromName = "Rahul aggarwal";
		
		
		$http.post("/api/sendemail", data,{
	        headers: { 'Content-Type': 'application/json'}
	    })
			.success(function (data, status, headers, config) {
				console.log("Response Recieved",data.status);
				
				if(data.status == "Message sent"){
					console.log("Email sent");
					
					//$scope.visitor.isCustomer = "true" ;
					//$scope.visitor.message = "Message Sent";
					
				}else{
					//$scope.visitor.isCustomer = "false" ;
					//$scope.visitor.message = "Login is not successful. Welcome Guest";
				}
				
        	})
	        .error(function (data, status, headers, config) {
	        	$scope.visitor.isCustomer = "false" ;
				$scope.visitor.message = "Login is not successful. Welcome Guest";
	        	 console.log("error Response ", data);
	        });
		
	}
	
});