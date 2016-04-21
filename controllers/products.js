var product_controller = function(mongo){

	var productSchema = require('../models/product');
	
	this.findAll = function(res){

		var Product = mongo.model('Product', productSchema);

		// get all the products
	  	Product.find({}, function(err, products) {
		    if (err) es.json(err);

		    // object of all the users
		    console.log(products);
		    res.json(products);

	  	});

	}

	this.findByOne = function(req, res)
	{
		var Product = mongo.model('Product', productSchema);

		Product.findById(req.params.id, function (err, product) {
		  if (err) throw err;
		  res.json(product);
		});

	}

	this.save = function(req,res)
	{
		var Product = mongo.model('Product', productSchema);
		//create model 
		Product = new Product({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price
		});

		Product.save(function(err, product){
		    if(err){
		    	console.log(err);
		        res.json({'status_data' : {'status':false, 'message': "Error save product."}});
		  	}else{
		  		res.json({'status_data' : {'status':true, 'message': "Product save successfully."}});
		  	}
	  	});

	}

	this.saveComment = function(req,res,ip)
	{
		var Product = mongo.model('Product', productSchema);
		
		Product.findById(req.body.product_id, function (err, product) {
		    if (err) throw err;
			
			//create comment
			product.comments.push({
				user_ip: ip,
				text: req.body.text
			})
			//save comment
			product.save(function(err){
			    if(err){
			    	console.log(err);
			        res.json({'status_data' : {'status':false, 'message': "Error save comment."}});
			  	}else{
			  		res.json({
			  			'product': product,
			  			'status_data': {'status':true, 'message': "Comment save successfully."}
			  		});
			  	}
		  	});
		});

	}

	return this;
}

module.exports = product_controller;