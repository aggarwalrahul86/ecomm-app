app.service('AuthService', function($http){	

	  this.login = function (credentials) {
		  
		  console.log("credetials", credentials);
		  
		  return $http.post("/api/authenticate", credentials,{
		        headers: { 'Content-Type': 'application/json'}
		    });
	  };
});

