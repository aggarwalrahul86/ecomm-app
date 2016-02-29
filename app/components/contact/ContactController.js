app.controller("ContactController", function($scope, $http) {

	$scope.message = 'Checking contact Populated.';

	loadScript();

});

function initialize() {
	var mapProp = {
		center : new google.maps.LatLng(22.6047, 88.4161),
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"), mapProp);
}

function loadScript() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?key=&sensor=false&callback=initialize";
	document.body.appendChild(script);
}