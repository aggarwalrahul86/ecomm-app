var app = angular.module("myapp", ['ui.router','angulike','imageZoomApp','ncy-angular-breadcrumb','ngCookies']);


app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	  .state('Home', {
	    url: '/Home',
	    templateUrl: 'app/components/home/HomePage.html',
	    controller: 'ProductController',
	    ncyBreadcrumb: {
	        label: 'Home page'
	      }
	  })
	  .state('Contact', {
	    url: '/Contact',
	    templateUrl: 'app/components/contact/contact.html',
		controller: 'ContactController',
		  ncyBreadcrumb: {
			    label: 'Contact page'
			  }
	  })
	  .state('Category', {
	    url: '/category',
	    templateUrl: 'app/components/store/category.html',
		controller: 'ProductController',
		  ncyBreadcrumb: {
			    label: 'Product List'
			  }
	  })
	  .state('Detail', {
	    url: '/detail/:productID',
	    templateUrl: 'app/components/store/detail.html',
		controller: 'ProductDetailController',
        ncyBreadcrumb: {
		    label: 'Product Detail'
		  }
	  })
	  .state('Cart', {
	    url: '/cart',
	    templateUrl: 'app/components/cart/cart.html',
		controller: 'CartController',
		  ncyBreadcrumb: {
			    label: 'Your Cart'
			  }
	  })
	  .state('Checkout', {
	    url: '/checkout',
	    templateUrl: 'app/components/cart/checkout.html',
		controller: 'CartController',
		redirectTo: 'Checkout.Address',
		  ncyBreadcrumb: {
			    label: 'Checkout Cart'
			  }
	  })
	  .state('Checkout.Address', {
	    url: '/checkoutAddress',
	    templateUrl: 'app/components/cart/checkoutAddress.html',
		  ncyBreadcrumb: {
			    label: 'Delivery Address'
			  }
	  })
	  .state('Checkout.Delivery', {
	    url: '/checkoutDelivery',
	    templateUrl: 'app/components/cart/checkoutDelivery.html'
	  })
	  .state('Checkout.Payment', {
	    url: '/checkoutPayment',
	    templateUrl: 'app/components/cart/checkoutPayment.html',
		  ncyBreadcrumb: {
			    label: 'Payment Method'
			  }
	  })
	  .state('Checkout.OrderReview', {
	    url: '/checkoutOrderReview',
	    templateUrl: 'app/components/cart/checkoutOrderreview.html',
		  ncyBreadcrumb: {
			    label: 'Review Order'
			  }
	  });
	
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/Home');
	
});

app.factory('Session', function ($cookies) {
	
	var Session = {
			
			data : {
					   username : $cookies.get('username'),
					   password : $cookies.get('password')
					
			},
			  create : function (username, password) {
				// Can save in localstorage or Cookies need to discuss
				  
				  Session.data.username = username;
				  Session.data.password = password;
			    // Using cookie store for now as cookies are used by most of the website so that it is available to server

			    $cookies.put('username', username);
			    $cookies.put('password', password);
			    
			  },
			  destroy : function () {
				  Session.data.username = null;
				  Session.data.password = null;
			    $cookies.remove('username');
			    $cookies.remove('password');
			  },
			  saveSession : function (){
				  //Save session in db need to discuss
			  }
			  
	};
	
	return Session;
  
	});

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(evt, to, toParams) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, toParams)
      }
    });
}]);

app.factory('filters', function() {
	return {
		category : '',
		color : [],
		price : ''
	};
});

app.filter('customFilter', function() {
	return function(products, filter) {

		var results = [];

		if (filter.color.length == 0) {
			return products;
		} else {

		var isColorSelected = false;

			angular.forEach(filter.color, function(value, key) {
				for ( var key in value) {
					if (value[key] === true) {
						isColorSelected = true;
					}
				}

			});

			if (!isColorSelected) {
				return products;
			}

			var items = {
				colors : filter.color,
				out : []
			};
			angular.forEach(products, function(value, key) {
				items.colors.forEach(function(colorValue, index) {
					if (colorValue[value.color] === true) {
						results.push(value);
					}
				});
			}, results);
			return results;

		}

	};
});

app.directive('onFinishRender', function($timeout) {
	return {
		restrict : 'A',
		link : function(scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function() {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
});


/*
 * app.directive('carouselDirective', function() { return function(scope,
 * element, attrs) { console.log('ROW: index = ', scope.$index);
 * scope.$watch('$last',function(v){ carou });
 *  }; })
 */

app.filter('paginate', function(Paginator) {
    return function(input, rowsPerPage) {
        if (!input) {
            return input;
        }

        if (rowsPerPage) {
            Paginator.rowsPerPage = rowsPerPage;
        }
        
        Paginator.itemCount = input.length;

        return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
    }

})

.filter('forLoop', function() {
    return function(input, start, end) {
        input = new Array(end - start);
        for (var i = 0; start < end; start++, i++) {
            input[i] = start;
        }

        return input;
    }
})


.service('Paginator', function ($rootScope) {
    this.page = 0;
    this.rowsPerPage = 50;
    this.itemCount = 0;
    this.limitPerPage = 5;

    this.setPage = function (page) {
        if (page > this.pageCount()) {
            return;
        }

        this.page = page;
    };

    this.nextPage = function () {
        if (this.isLastPage()) {
            return;
        }

        this.page++;
    };

    this.perviousPage = function () {
        if (this.isFirstPage()) {
            return;
        }

        this.page--;
    };

    this.firstPage = function () {
        this.page = 0;
    };

    this.lastPage = function () {
        this.page = this.pageCount() - 1;
    };

    this.isFirstPage = function () {
        return this.page == 0;
    };

    this.isLastPage = function () {
        return this.page == this.pageCount() - 1;
    };

    this.pageCount = function () {
        return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
    };
    
    this.lowerLimit = function() { 
        var pageCountLimitPerPageDiff = this.pageCount() - this.limitPerPage;
        
        if (pageCountLimitPerPageDiff < 0) { 
            return 0; 
        }
        
        if (this.page > pageCountLimitPerPageDiff + 1) { 
            return pageCountLimitPerPageDiff; 
        } 
        
        var low = this.page - (Math.ceil(this.limitPerPage/2) - 1); 
        
        return Math.max(low, 0);
    };
})

.directive('paginator', function factory() {
    return {
        restrict:'E',
        controller: function ($scope, Paginator) {
            $scope.paginator = Paginator;
        },
        templateUrl: 'paginationControl.html'
    };
});


/**
 * Shopping Cart
 */
app.factory('shoppingCart', function () {
	
	// Constructor
	function shoppingCart(cartName) {
	    this.cartName = cartName;
	    this.clearCart = false;
	    this.checkoutParameters = {};
	    this.items = [];

	    // load items from local storage when initializing
	    this.loadItems();

	    // save items to local storage when unloading
	    var self = this;
	    $(window).unload(function () {
	        if (self.clearCart) {
	            self.clearItems();
	        }
	        self.saveItems();
	        self.clearCart = false;
	    });
	}
	
	// load items from local storage
	shoppingCart.prototype.loadItems = function () {
	    var items = sessionStorage != null ? sessionStorage[this.cartName + "_items"] : null;
	    if (items != null && JSON != null) {
	        try {
	            var items = JSON.parse(items);
	            for (var i = 0; i < items.length; i++) {
	                var item = items[i];
	                if (item.id != null && item.name != null && item.price != null && item.quantity != null) {
	                    item = new cartItem(item.id, item.name, item.price, item.quantity);
	                    this.items.push(item);
	                }
	            }
	        }
	        catch (err) {
	            // ignore errors while loading...
	        }
	    }
	}

	// save items to local storage
	shoppingCart.prototype.saveItems = function () {
	    if (sessionStorage != null && JSON != null) {
	        sessionStorage[this.cartName + "_items"] = JSON.stringify(this.items);
	    }
	}

	// adds an item to the cart
	shoppingCart.prototype.addItem = function (id, name, price, quantity) {
	    quantity = this.toNumber(quantity);
	    if (quantity != 0) {

	        // update quantity for existing item
	        var found = false;
	        for (var i = 0; i < this.items.length && !found; i++) {
	            var item = this.items[i];
	            if (item.id == id) {
	                found = true;
	                item.quantity = this.toNumber(item.quantity + quantity);
	                if (item.quantity <= 0) {
	                    this.items.splice(i, 1);
	                }
	            }
	        }

	        // new item, add now
	        if (!found) {
	            var item = new cartItem(id, name, price, quantity);
	            this.items.push(item);
	        }
	        
	        // save changes
	        this.saveItems();
	    }
	}

	// get the total price for all items currently in the cart
	shoppingCart.prototype.getTotalPrice = function (id) {
	    var total = 0;
	    for (var i = 0; i < this.items.length; i++) {
	        var item = this.items[i];
	        if (id == null || item.id == id) {
	            total += this.toNumber(item.quantity * item.price);
	        }
	    }
	    return total;
	}

	// get the total price for all items currently in the cart
	shoppingCart.prototype.getTotalCount = function (id) {
	    var count = 0;
	    for (var i = 0; i < this.items.length; i++) {
	        var item = this.items[i];
	        if (id == null || item.id == id) {
	            count += this.toNumber(item.quantity);
	        }
	    }
	    return count;
	}

	// clear the cart
	shoppingCart.prototype.clearItems = function () {
	    this.items = [];
	    this.saveItems();
	}

	// define checkout parameters
	shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

	    // check parameters
	    if (serviceName != "PayPal" && serviceName != "Google") {
	        throw "serviceName must be 'PayPal' or 'Google'.";
	    }
	    if (merchantID == null) {
	        throw "A merchantID is required in order to checkout.";
	    }

	    // save parameters
	    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
	}

	// check out
	shoppingCart.prototype.checkout = function (serviceName, clearCart) {

	    // select serviceName if we have to
	    if (serviceName == null) {
	        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
	        serviceName = p.serviceName;
	    }

	    // sanity
	    if (serviceName == null) {
	        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
	    }

	    // go to work
	    var parms = this.checkoutParameters[serviceName];
	    if (parms == null) {
	        throw "Cannot get checkout parameters for '" + serviceName + "'.";
	    }
	    switch (parms.serviceName) {
	        case "PayPal":
	            this.checkoutPayPal(parms, clearCart);
	            break;
	        case "Google":
	            this.checkoutGoogle(parms, clearCart);
	            break;
	        default:
	            throw "Unknown checkout service: " + parms.serviceName;
	    }
	}

	// check out using PayPal
	// for details see:
	// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
	shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

	    // global data
	    var data = {
	        cmd: "_cart",
	        business: parms.merchantID,
	        upload: "1",
	        rm: "2",
	        charset: "utf-8"
	    };

	    // item data
	    for (var i = 0; i < this.items.length; i++) {
	        var item = this.items[i];
	        var ctr = i + 1;
	        data["item_number_" + ctr] = item.id;
	        data["item_name_" + ctr] = item.name;
	        data["quantity_" + ctr] = item.quantity;
	        data["amount_" + ctr] = item.price.toFixed(2);
	    }

	    // build form
	    var form = $('<form/></form>');
	    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
	    form.attr("method", "POST");
	    form.attr("style", "display:none;");
	    this.addFormFields(form, data);
	    this.addFormFields(form, parms.options);
	    $("body").append(form);

	    // submit form
	    this.clearCart = clearCart == null || clearCart;
	    form.submit();
	    form.remove();
	}

	// check out using Google Wallet
	// for details see:
	// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
	// developers.google.com/checkout/developer/interactive_demo
	shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

	    // global data
	    var data = {};

	    // item data
	    for (var i = 0; i < this.items.length; i++) {
	        var item = this.items[i];
	        var ctr = i + 1;
	        data["item_name_" + ctr] = item.id;
	        data["item_description_" + ctr] = item.name;
	        data["item_price_" + ctr] = item.price.toFixed(2);
	        data["item_quantity_" + ctr] = item.quantity;
	        data["item_merchant_id_" + ctr] = parms.merchantID;
	    }

	    // build form
	    var form = $('<form/></form>');
	    // NOTE: in production projects, use the checkout.google url below;
	    // for debugging/testing, use the sandbox.google url instead.
	    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
	    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
	    form.attr("method", "POST");
	    form.attr("style", "display:none;");
	    this.addFormFields(form, data);
	    this.addFormFields(form, parms.options);
	    $("body").append(form);

	    // submit form
	    this.clearCart = clearCart == null || clearCart;
	    form.submit();
	    form.remove();
	}

	// utility methods
	shoppingCart.prototype.addFormFields = function (form, data) {
	    if (data != null) {
	        $.each(data, function (name, value) {
	            if (value != null) {
	                var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
	                form.append(input);
	            }
	        });
	    }
	}
	shoppingCart.prototype.toNumber = function (value) {
	    value = value * 1;
	    return isNaN(value) ? 0 : value;
	}

	//----------------------------------------------------------------
	// checkout parameters (one per supported payment service)
	//
	function checkoutParameters(serviceName, merchantID, options) {
	    this.serviceName = serviceName;
	    this.merchantID = merchantID;
	    this.options = options;
	}

	//----------------------------------------------------------------
	// items in the cart
	//
	function cartItem(id, name, price, quantity) {
	    this.id = id;
	    this.name = name;
	    this.price = price * 1;
	    this.quantity = quantity * 1;
	    this.unitPrice = price;
	}
	
	return shoppingCart;
	
});

//create a data service that provides a store and a shopping cart that
//will be shared by all views (instead of creating fresh ones for each view).
app.factory("DataService", function (shoppingCart) {

 // create store
 //var myStore = new store();

 // create shopping cart
 var myCart = new shoppingCart("MyStore");

 /*// enable PayPal checkout
 // note: the second parameter identifies the merchant; in order to use the 
 // shopping cart with PayPal, you have to create a merchant account with 
 // PayPal. You can do that here:
 // https://www.paypal.com/webapps/mpp/merchant
 myCart.addCheckoutParameters("PayPal", "bernardo.castilho-facilitator@gmail.com");

 // enable Google Wallet checkout
 // note: the second parameter identifies the merchant; in order to use the 
 // shopping cart with Google Wallet, you have to create a merchant account with 
 // Google. You can do that here:
 // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
 myCart.addCheckoutParameters("Google", "500640663394527",
     {
         ship_method_name_1: "UPS Next Day Air",
         ship_method_price_1: "20.00",
         ship_method_currency_1: "USD",
         ship_method_name_2: "UPS Ground",
         ship_method_price_2: "15.00",
         ship_method_currency_2: "USD"
     }
 );*/

 // return data object with store and cart
 return {
     //store: myStore,
     cart: myCart
 };
});