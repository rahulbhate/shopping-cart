var handleBar = require('handlebars');

handleBar.registerHelper("Max", function(A, B){
	return (A > B) ? A : B;
});
handleBar.registerHelper("studyStatus", function(data, options) {
	var len = data.length;
	var returnData = "";
	for (var i = 0; i < len; i++) {
	  data[i].passingYear = (data[i].passingYear < 2015) ? "passed" : "not passed";
	  returnData = returnData + options.fn(data[i]);
	}
	return returnData;

  });
  handleBar.registerHelper('list', function(items, options) {
	var out = "<ul>";
  
	for(var i=0, l=items.length; i<l; i++) {
	  out = out + "<li>" + options.fn(items[i]) + "</li>";
	}
  
	return out + "</ul>";
  });
handleBar.registerHelper("SortByName", function(A, B){
	// Sort by Name Ascending or Descending..
});

handleBar.registerHelper("SortByPrice", function(items, options){
	// Sort by Price Ascending or Descending..
	return items.length;
	//const sortedProducts = prod.sort((a,b) => (a.image < b.image ? 1 : -1));
	//const filteredProducts = prod.filter(p=> p.available_quantity <= 5);
	//console.log("OFFFF");
	//console.log(sortedProducts);
	//return (A > B ) ? A : B;
	// return products;
	// const arrays = products.map((product, i )=>{
	// 	return  product.price;
	// });
	//console.log(sortedProducts.length);

	return new handleBar.SafeString(JSON.stringify(sortedProducts));
});

handleBar.registerHelper("FilterByPrice", function(A, B){
	// Filter by Price.. (Range from 75 - 300)
});

handleBar.registerHelper("FilterBySize", function(A, B){
	// Filter by Size.. (Small, Medium and Large)
});

handleBar.registerHelper("FilterByColor", function(A, B){
	// Filter by Color.. (Red, Green, Blue, Purple)
});

handleBar.registerHelper("FilterByLatestProducts", function(A, B){
	// Filter by Latest Products for Men, Women and Children ..
});

handleBar.registerHelper("GlobalSearch", function(A, B){
	// Global Search...
});


