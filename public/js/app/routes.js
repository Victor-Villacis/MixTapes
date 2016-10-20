

//init angular app
angular.module("myProductsApp",["ngRoute"])
	.config(function($routeProvider){

	        $routeProvider
	            .when("/", {
	                controller: "myProductAppCtrl",
	                controllerAs: "vm",
	                templateUrl: "/js/app/templates/index.html"
	            }) 
	            .when("/", {
	            		controller: "myProductsApp",
	            		controllerAs: "vm",
	            		templateUrl: "/js/app/templates/splash.html"
	            })      
	            .when("/", {
	            		controller: "myProductsApp",
	            		controllerAs: "vm",
	            		templateUrl: "/js/app/templates/carousel.html"
	            })
	            .when("/list", {
	                controller: "myProductAppCtrl",
	                controllerAs: "vm",
	                templateUrl: "/js/app/templates/list_products.html"
	            })
	            .when("/product/new", {
	                controller: "myProductAppCtrl",
	                controllerAs: "vm",
	                templateUrl: "/js/app/templates/new_product.html"
	            })
	            .when("/product/:id", {
	                controller: "myProductAppViewCtrl",
	                controllerAs: "vm",
	                templateUrl: "/js/app/templates/show_product.html"
	            })

	            .when("/sound", {
	                controller: "myProductAppCtrl",
	                templateUrl: "/js/app/templates/landing.html"
	            })
	            .otherwise({
			        redirectTo: "/"
			    });
	    });

