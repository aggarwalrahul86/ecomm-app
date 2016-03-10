app.controller("CartController", function($scope,$http) {
	
	$scope.TabNumber = 0;
	$scope.customerInfo = {};
	
    $http.get("app/shared/json/MasterData.json").success( function(response) {
        $scope.states = response.states;
     });
		
	$http.get("app/shared/json/CheckoutOptions.json").success(
			function(response) {
				$scope.tabs = response.tabs;
				$scope.nextPage = "."+$scope.tabs[1].tabName;
			});
	
	$scope.setUpTabs = function(index) {
        $scope.TabNumber = index;
    }
	
	function getTableRow(index,id, name,quantity,price) {
	    return '\
	        <tr style= text-align:center;>\
	    		<td style=border:1px solid #666;>' + index + '\</td>\
	            <td style=border:1px solid #666;>' + id + '\</td>\
	            <td style=border:1px solid #666;>' + name + '</td>\
	            <td style=border:1px solid #666;>' + quantity + '</td>\
	            <td style=border:1px solid #666;>' + price + '</td>\
	        </tr>';
	}
	
	function getEmailHeader(){
		return '<h3>Dear '+ $scope.customerInfo.firstname+' '+ $scope.customerInfo.lastname + ',</h3><p>Greetings from Frames4u!</p><p>We are pleased to inform you that following items in your Order have been packed by the seller and are ready to be shipped. Once the item(s) are shipped, you will receive an email with the Courier Tracking ID and the link where you can track your order. </p><p>Item Details:</p><br/>';
	}
	
	function getEmailfooter(){
		return '<br/><div>The shipment will be sent to: : </div><div> '+$scope.customerInfo.firstname+' '+$scope.customerInfo.lastname+
		',</div><div>'+$scope.customerInfo.address+'</div><div>'+$scope.customerInfo.city+'</div><div>'+$scope.customerInfo.state+'-'+$scope.customerInfo.pin+'</div><div>'+$scope.customerInfo.country+'</div>'
		+'<div>Phone: '+$scope.customerInfo.phone+'</div><br/><div>You can always visit your order page to view your order status and to contact us regarding this order.</div>'
		+'<div>Regards,</div><div>Frame4uTeam</div>'
	}
	
	$scope.sendEmail = function(){
		
		var domStructure = getEmailHeader();
		
		console.log("shopping cart",$scope.cart.items);
		//var styles = "<style>table.dataTable{width:100%; border-radius:8px; border:1px solid #666; padding:5px;}</style>";
		if ($scope.cart.items != 0) {
			//domStructure += styles;
			domStructure += "<table style='width:100%; border:1px solid #666; padding:5px;'><tbody><tr><th >No.</th><th >ID</th><th >NAME</th><th >QUANTITY</th><th >PRICE</th></tr>";

			$scope.cart.items.forEach(function(item, index) {
				console.log("item name",item.id);
				domStructure +=getTableRow((index+1),item.id,item.name,item.quantity,item.price);		
			});
			domStructure += "</tbody></table>"
		}
		
		domStructure += getEmailfooter();
		console.log("inner html",domStructure);
		console.log("email",$scope.customerInfo.email);
		
		data = {};
		
		data.body = domStructure;
		data.from = "aggarwalrahul86@gmail.com";
		data.to = $scope.customerInfo.email;
		data.toName = $scope.customerInfo.firstname+' '+$scope.customerInfo.lastname;
		
		
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