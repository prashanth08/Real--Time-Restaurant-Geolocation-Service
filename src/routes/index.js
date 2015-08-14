var express = require('express');
var router = express.Router();

var async = require('async');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/cloud');

var QUERY_LIMIT = 205;

var restaurantSchema = new Schema({
  name1:  String,
  name2: String,
  name:  String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  phone: String
});

var Res = mongoose.model('restaurants', restaurantSchema);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Restaurants' });
});

router.get('/details', function(req, res, next) {

	var main_res = res;
	console.log(req.param('place'));
	var place = req.param('place');
	console.log("place -> "+ place);

	var latt = req.param('Latitude');
	var longg = req.param('Longitude');
	var radius = req.param('radius') || 0;
	console.log("radius -> "+ radius);

	var latlng_flag = false, place_flag = false;
	if(latt && longg) {
		latlng_flag = true
	} else {
		place_flag = true;
	}

	var geocoderProvider = 'google';
	var httpAdapter = 'https';
	// optionnal 
	var extra = {
		apiKey: 'AIzaSyB8h8HMaOZfI9TVDxf1pTtoZFnwxDl3D48', 
		formatter: null        
	};

	if(place_flag) {
		//https://www.npmjs.com/package/node-geocoder
	var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
	geocoder.geocode(place, function(err, user_res) {
	    //console.log(res);

		var user_pin = user_res[0].zipcode;

		var user_latlng = {
			latitude : user_res[0].latitude,
			longitude : user_res[0].longitude
		};
		
		var res_latlng = [];
		Res.find({pincode : user_pin}, function (err, docs) {
			var documents = [];
			for (var i = 0; i < docs.length; i++) {

				if(i == QUERY_LIMIT)
					break;

				docs[i].count = i + 1;
				documents.push(docs[i]);
			};

			if(docs.length == 0) {
				main_res.render('index', { 
					title: 'Restaurants'
				});
			}

			async.eachSeries(documents, function(doc, callback) {
				var res_address = doc.name+ "," + doc.street +","+ doc.city +","+ doc.state +","+ doc.pincode;
        		var res_geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
        		res_geocoder.geocode(res_address, function(err, restaurant_res) {
        			
        			//console.log("restaurant_res -> ", restaurant_res);
        			var pin = restaurant_res[0].zipcode;
        			var tmp_latlng = {latitude: restaurant_res[0].latitude, longitude: restaurant_res[0].longitude};
					if(radius) {
						var d = distance(user_res[0].latitude, user_res[0].longitude, restaurant_res[0].latitude, restaurant_res[0].longitude);
						if(d <= radius) {
							//documents.push(doc[i]);
							res_latlng.push(tmp_latlng);
							doc.dist = d;
							console.log("<" + res_address + ">" + " | " + "<" + d + ">");
						}
					} else {
						
					}
					setTimeout(function() {
						callback();
					}, 150);
				});
			
			},function(err){
			    // if any of the file processing produced an error, err would equal that error
	 		   if( err ) {
      				console.log('an error in the geocode -> ', err);
	   			} else {
      				console.log('All files have been processed successfully');
					main_res.render('index', { 
						title: 'Restaurants',
						data: docs,
						user_latlng : user_latlng,
						res_latlng : res_latlng,
						data_count : docs.length
					});
	    		}
			});			
		});
	});
	} 
	else {

		var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
		geocoder.reverse(latt, longg, function(err, user_res) {

	    var user_pin = user_res[0].zipcode;

		var user_latlng = {
			latitude : user_res[0].latitude,
			longitude : user_res[0].longitude
		};
		
		var res_latlng = [];
			Res.find({pincode : user_pin}, function (err, docs) {
			var documents = [];
			for (var i = 0; i < docs.length; i++) {

				if(i == QUERY_LIMIT)
					break;

				docs[i].count = i + 1;
				documents.push(docs[i]);
			};

			if(docs.length == 0) {
				main_res.render('index', { 
					title: 'Restaurants'
				});
			}

			async.eachSeries(documents, function(doc, callback) {
				var res_address = doc.street +","+ doc.city +","+ doc.state +","+ doc.pincode;
        		var res_geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
        		res_geocoder.geocode(res_address, function(err, restaurant_res) {
        			console.log("res_address -> ",res_address);
        			console.log("restaurant_res -> ", restaurant_res);
        			var pin = restaurant_res[0].zipcode;
        			var tmp_latlng = {latitude: restaurant_res[0].latitude, longitude: restaurant_res[0].longitude};
					if(radius) {
						var d = distance(user_res[0].latitude, user_res[0].longitude, restaurant_res[0].latitude, restaurant_res[0].longitude);
						if(d <= radius) {
							res_latlng.push(tmp_latlng);
							doc.dist = d;
						}
					} else {
						res_latlng.push(tmp_latlng);
						doc.dist = 0;
					}
					setTimeout(function() {
						callback();
					}, 150);
				});
			
			},function(err){
			    // if any of the file processing produced an error, err would equal that error
	 		   if( err ) {
      				console.log('an error in the geocode -> ', err);
	   			} else {
      				console.log('All files have been processed successfully');
					main_res.render('index', { 
						title: 'Restaurants',
						data: docs,
						user_latlng : user_latlng,
						res_latlng : res_latlng,
						data_count : docs.length
					});
	    		}
			});			
		});
	});
	}
});
//referred http://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2, unit) {

	//console.log("distance called->  ", lat1, lon1, lat2, lon2, unit);

	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }


	//console.log("distance -> "+ dist);
	return dist
}  

module.exports = router;
