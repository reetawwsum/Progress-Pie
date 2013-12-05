chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create('index.html', {
		'bounds': {
		 	'width': 300,
		 	'height': 400,
		 	'top': 200,
		 	'left': 500
	 	},
	 	'resizable': false
	 });
});