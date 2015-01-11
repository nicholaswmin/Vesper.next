/* Performance tools 

Here I will TEST functions relating to improving the performance of vector/canvas drawings when high-node designs are used
It is an attempt to solve in various ways this question: http://stackoverflow.com/questions/23884074/cad-in-a-browser-html5-canvas-and-performance-limitations-of-javascript-browser

*/

window.onload = function(){

	//append necessary buttons
	$('body').prepend('<ul class="tools_performance"> <li id="blitTestShapes" class="button"> <img title="Blit test shapes" src="img/testTube.png" /></li><li id="cacheAsBitmap" class="button"><img title="Cache As Bitmaps" src="img/speedometer.png" /></li></ul>');

	$(".tools_performance").css({
		'position': 'fixed',
		'right': '40px',
		'width': 'auto',
		'top': '5px',
		'padding': '0',
		'background': '#fff',
		'background': '#2F2F2C',
		'margin': '0',
		'box-shadow': '0px 3px 6px rgba(0,0,0,0.4)'
	});

	$(".tools_performance img").css({
		'width': '32px',
		'height': '32px'
	});



	$('#blitTestShapes').click(function(){
		blitShapes();
	})

	$('#cacheAsBitmap').click(function(){
		cacheAsBitmap();
	})



	//creates a lot of test shapes to clog performance 

	var startPosX = 0;
	var startPosY = 0;
	var	thetaX = startPosX;
	var	thetaY = startPosY;

	function blitShapes(){
		clipboard = captureSelectionState();
		var pathScaling = 0.05;
		var pathStrokeColor = 'black';
		var pathStrokeWidth = 0.5

		var rowPieces = 50;
		var marginX = -2;
		var marginY = 5;

		var pathData = 'M 236.65625 51.40625 C 233.60716 51.429957 230.54918 51.526678 227.5 51.75 C 221.7954 63.219643 217.30089 75.373546 213.9375 87.3125 C 212.99094 87.463416 212.03448 87.613117 211.09375 87.78125 C 209.01754 88.137224 206.96038 88.562736 204.90625 89.03125 C 202.77105 89.504744 200.66335 90.032392 198.5625 90.59375 C 195.90772 91.15981 193.34371 91.97985 190.78125 92.875 C 188.35699 93.66298 185.96357 94.502657 183.59375 95.40625 C 175.32928 86.180049 166.45 78.120293 156.5625 70.15625 C 149.05177 73.428975 142.22181 78.007126 135.1875 82.15625 C 136.19189 95.247143 138.25815 107.87963 141.25 119.78125 L 139.4375 121.4375 C 136.59346 123.83057 133.81885 126.31643 131.15625 128.90625 L 129.625 130.28125 L 129.875 130.15625 C 129.75497 130.27573 129.61964 130.38013 129.5 130.5 L 129.625 130.28125 L 128.21875 131.8125 C 125.68342 134.4137 123.25359 137.13135 120.90625 139.90625 L 119.09375 141.90625 C 107.65078 138.29399 95.629258 135.48137 83.125 133.53125 C 78.615008 140.31491 74.391454 147.40253 70.71875 154.6875 C 78.155912 165.54954 85.82376 175.22864 94.71875 184.1875 C 93.566823 187.19771 92.495657 190.24622 91.53125 193.34375 C 91.507088 193.41474 91.492696 193.49145 91.46875 193.5625 C 91.443417 193.64429 91.431449 193.73065 91.40625 193.8125 C 91.077898 194.7985 90.766821 195.7792 90.5 196.78125 C 90.481899 196.84461 90.455522 196.90536 90.4375 196.96875 C 90.407305 197.08448 90.37286 197.19649 90.34375 197.3125 C 88.752443 202.95984 87.472178 208.73475 86.53125 214.625 C 74.834961 217.23025 62.650486 220.76832 51.25 225.34375 C 50.697141 233.47312 50.498225 241.61886 51.09375 249.75 C 62.523763 255.43489 74.632065 259.92168 86.53125 263.28125 C 88.208072 273.8295 90.976297 283.99944 94.6875 293.71875 C 85.488897 301.96639 77.445026 310.82361 69.5 320.6875 C 72.772724 328.19823 77.350876 335.02819 81.5 342.0625 C 94.590892 341.05812 107.19035 338.99185 119.09375 336 L 119.5 336.46875 C 125.89528 344.2485 133.0605 351.38921 140.84375 357.78125 L 141.25 358.15625 C 137.63774 369.601 134.82513 381.62074 132.875 394.125 C 139.66045 398.635 146.71504 402.86033 154 406.53125 C 164.84133 399.10707 174.55589 391.4689 183.5 382.59375 C 187.66291 384.18398 191.92279 385.58303 196.25 386.8125 C 196.38317 386.84745 196.5227 386.87274 196.65625 386.90625 C 202.30636 388.49491 208.07578 389.78041 213.96875 390.71875 C 216.574 402.41679 220.11207 414.59774 224.6875 426 C 232.81687 426.55285 240.96261 426.75177 249.09375 426.15625 C 254.77864 414.72623 259.26543 402.61793 262.625 390.71875 C 273.16568 389.04036 283.34978 386.30185 293.0625 382.59375 C 301.30573 391.78517 310.14049 399.8117 320 407.75 C 327.50895 404.47727 334.34069 399.89912 341.375 395.75 C 340.36884 382.66089 338.3356 370.05788 335.34375 358.15625 L 336.03125 357.5625 C 343.86218 351.10101 351.05187 343.86815 357.46875 336 C 368.91172 339.6105 380.96449 342.4231 393.46875 344.375 C 397.97698 337.59134 402.2023 330.53496 405.875 323.25 C 398.44212 312.39597 390.79648 302.67158 381.90625 293.71875 C 385.61759 283.99909 388.38569 273.8299 390.0625 263.28125 C 401.75878 260.67599 413.93972 257.13792 425.34375 252.5625 C 425.89482 244.43313 426.09553 236.28739 425.5 228.15625 C 414.06077 222.46677 401.93971 217.98722 390.03125 214.625 C 388.98563 208.08042 387.53325 201.67942 385.6875 195.4375 C 384.56344 191.63618 383.31053 187.89129 381.90625 184.21875 C 391.11146 175.96709 399.14594 167.11955 407.09375 157.25 C 403.82102 149.73926 399.24287 142.91109 395.09375 135.875 C 382.00286 136.8794 369.37215 138.9144 357.46875 141.90625 L 356.0625 140.34375 C 353.64152 137.46002 351.09186 134.66649 348.46875 131.96875 L 346.96875 130.28125 L 347.15625 130.59375 C 346.98991 130.4268 346.82336 130.25994 346.65625 130.09375 L 346.96875 130.28125 L 345.28125 128.75 C 342.66594 126.21316 339.94605 123.78493 337.15625 121.4375 L 335.34375 119.78125 C 338.95602 108.33828 341.76863 96.285508 343.71875 83.78125 C 336.93508 79.271259 329.84747 75.047704 322.5625 71.375 C 311.68305 78.825288 301.97022 86.491144 293 95.40625 C 292.99059 95.403347 292.97815 95.409158 292.96875 95.40625 C 290.52971 94.476798 288.05913 93.588193 285.5625 92.78125 C 283.09018 91.892406 280.6089 91.081726 278.03125 90.59375 C 275.77807 89.991686 273.51136 89.43841 271.21875 88.9375 C 268.38463 88.266708 265.5526 87.646277 262.65625 87.3125 C 260.04837 75.577978 256.49802 63.34745 251.90625 51.90625 C 246.82539 51.560711 241.73806 51.366738 236.65625 51.40625 z M 233.4375 120.46875 L 246.15625 120.46875 L 246.15625 203.78125 C 254.61121 205.67265 261.96088 210.53947 267.03125 217.21875 L 309.78125 193.375 L 315.96875 204.46875 L 272.78125 228.53125 C 273.78547 231.8409 274.34375 235.33342 274.34375 238.96875 C 274.34375 258.86859 258.1811 275 238.28125 275 C 227.54432 275 217.91351 270.29402 211.3125 262.84375 L 201.84375 267.78125 L 195.5 255.65625 L 204.34375 251.03125 C 203.00039 247.25512 202.25 243.20592 202.25 238.96875 C 202.25 220.70875 215.82444 205.5856 233.4375 203.21875 L 233.4375 120.46875 z';

		var pathWidth,pathHeight;
		for (var i = 0; i < rowPieces; i++) {

			var path = new Path(pathData);
			path.strokeColor = pathStrokeColor;
			path.strokeWidth = pathStrokeWidth;
			path.strokeScaling  = false;
			path.scale(pathScaling);

			pathWidth = path.bounds.width;
			pathHeight = path.bounds.height;

			path.position.x = thetaX;
			path.position.y = thetaY;

			thetaX = thetaX + pathWidth + marginX;
		};
		thetaX = startPosX
		thetaY = thetaY + pathHeight + marginY;

		undo.snapshot("Blit Shapes");
	}

	var rasterGroupCounter = 0;
	var rasterRes = 256;
	function cacheAsBitmap(){

		undo.states = [];
		undo.head = 0;

		var children = project.activeLayer.children;

		window['rasterGroup' + String(rasterGroupCounter)] = new paper.Group;
    	var thisGroup = window['rasterGroup' + String(rasterGroupCounter)];

		for (var i = children.length - 1; i >= 0; i--) {
			if(children[i] instanceof paper.Path && !(children[i].cached)) {
				if(children[i].name ==='drawingArea' || children[i].selected){
					console.log(children[i])
					continue;
				}else{
					children[i]['cached'] = true;
					children[i].data.nonMovable = true;
					thisGroup.addChild(children[i]);
				}
			}
		};

		var thisImg = thisGroup.rasterize(rasterRes);
		thisGroup.visible = false;
		thisGroup.data.cachedGroup = true;
		thisGroup.data.nonUndoable = true;
		thisImg.data.cachedImg = true;
		thisImg.data.nonMovable = true;
		thisImg.data.nonUndoable = true;
		thisImg.attach('mousedown', function(event) {
	        if (thisGroup.contains(event.point)) { //hit test with hidden vector group
	            thisImg.remove(); 
	            thisGroup.visible = true;

	            for (var i = 0; i < thisGroup.children.length; i++) {
	            	thisGroup.children[i].cached = false;
	            	thisGroup.children[i].data.nonMovable = false;
	            	if(thisGroup.children[i].contains(event.point))
	            		thisGroup.children[i].selected = true;
	            };

	            thisGroup.parent.addChildren(thisGroup.removeChildren()); 
        		thisGroup.remove();

        		undo.states = [];
				undo.head = 0;
				undo.snapshot("UnCached Bitmap");


	        }
    	});
		thisImg.sendToBack();
		undo.snapshot("Cached Bitmap");
		rasterGroupCounter++

	}


}





