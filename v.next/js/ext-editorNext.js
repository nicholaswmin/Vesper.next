// Additional Functionality added by ''Nicholas Kyriakides''. 


$( document ).ready(function() {
	paper.install(window);
//Disable right-click context menu on canvas
$('body').on('contextmenu', '#canvas', function(e){ return false; });
//Hide right toolbar on loading the app
$('#tools_right').hide();
//numeric is a JS plugin that dissalows the user from typing anything other than numbers in the width/height/x/y textfields
$("#elementXPosition,#elementYPosition,#elementWidth,#elementHeight").numeric();
//Hide the alertBox
$('#alertBox').hide();

//Initialize Slider for path-simplifier
$('#simplifySlider').slider();

//Hide the Slider
$('#simplifySliderDiv').hide();
//The following path is added at startup of the editor. It's supposed to represent the material size selected by the user
//which is used for showing the users where to concentrate his elements. The boolOp/3D algorithms use this for the cutting rectangle.
//The user is allowed to draw outside his rectangle but whatever is outside this rectangle is ''clipped'' by the BoolOp/3D algos.
//We need to find a way to make this rectangle non-selectable by the user, similar to pointer-events:none of SVG.


//The following functions are the triggers for the additional functionality added in this file. They ''glue'' together the buttons from the HTML file and the 
//additional functionality in this file.

    $("#tool-expertMode").click(function() {
		expertMode();
	});

    $("#tool-placeImageUrlDropdown").click(function() {
		placeImage();
	});

	$("#tool-placeImageUrlModal").click(function() {
		placeImage();
	});

    $("#tool-material").click(function() {
		setElementTypeMaterial();
	});

	$("#tool-hole").click(function() {
		setElementTypeHole();
	});

	$("#tool-vectorEngrave").click(function() {
		setElementTypeVectorEngrave();
	});

	$("#tool-rasterEngrave").click(function() {
		setElementTypeRasterEngrave();
	});

    $("#tool-sendToBack").click(function() {
		sendToBack();
	});

	$("#tool-bringFrontMost").click(function() {
		bringFrontMost();
	});

	$("#tool-sendBackOne").click(function() {
		tool-sendBackOne();
	});

	$("#tool-bringFrontOne").click(function() {
		bringFrontOne();
	});

	$("#toolRotateClockwise").click(function() {
		rotateClockwise();
	});

	$("#toolRotateCounterClockwise").click(function() {
		rotateCounterClockwise();
	});

	$("#toolFlipHorizontally").click(function() {
		flipHorizontally();
	});

	$("#toolFlipVertically").click(function() {
		flipVertically();
	});


	$("#toolFullScreen").click(function() {
		goFullScreen();
	});

	$("#toolExportSVG").click(function() {
		prepareSVGExport();
	});

    $("#tool-simplifyPath").click(function() {
		simplifyPath();
	});

	 $("#tool-smoothPath").click(function() {
		smoothPath();
	});


//The following functions are triggered on an ''onChange'' event. The same functions are triggered when pressing ''ENTER'' key while typing. See section below this
//snippet
	$("#elementHeight").change(function() {
		setElementHeight();
	});

	$("#elementWidth").change(function() {
		setElementWidth();
	});

		$("#elementYPosition").change(function() {
		setElementYPosition();
	});

		$("#elementXPosition").change(function() {
		setElementXPosition();
	});



		$("#canvas").click(function() {
				hideRightTools();

	});

//Here the previous functions are also triggered on pressing ''ENTER'' key while typing. Keycode 13 is the ''ENTER'' key
document.getElementById('elementHeight').onkeydown = function(event) {
    if (event.keyCode == 13) {
      setElementHeight();
    }
};

document.getElementById('elementWidth').onkeydown = function(event) {
    if (event.keyCode == 13) {
      setElementWidth();
    }
};
document.getElementById('elementYPosition').onkeydown = function(event) {
    if (event.keyCode == 13) {
      setElementYPosition();
    }
};
document.getElementById('elementXPosition').onkeydown = function(event) {
    if (event.keyCode == 13) {
      setElementXPosition();
    }
};


$('#elementXPosition,#elementYPosition,#elementWidth,#elementHeight').click(function () {
    this.select();

});

//Trigger function on simplifier Slider. .
//On each increment the function checks whether a clone of the selected path exists. If it exists it deletes the clone and creates a new one with the current slider value
//This allows the user to drag the slider up/down with the effects of the slider applying on the original path form instead of the effects applying on the previous simplification.
//The function checks which clone relates to which original path. This prevents the deletion of unrelated clones of other paths when moving the slider.

//The object below is holds the clone of the path and its associated id. We need the associatedId otherwise we would be unable to know which clone relates to which selected path.
//We must keep track of this to prevent the deletion of clones that are unrelated to the currently selected path.
//The object below pollutes the global-scope.
var copy = {
    associatedClone:"noClone",
    associatedId : 13294812938491283423
};

$('#simplifySlider').on('slide', function (ev) {
   clipboard = captureSelectionState();
   var selected = paper.project.selectedItems;
   if (copy.associatedClone === "noClone") {
   console.log("nothing to remove");
   }
   else
   {
   if (copy.associatedId === selected[0].id){
   copy.associatedClone.remove();
   console.log("removed");
}
else
{
	console.log("non-associated id");
}
   }
   var value = ($('#simplifySlider').val());
   copy.associatedClone = selected[0].clone();
   copy.associatedClone.simplify(value);
   copy.associatedId = selected[0].id;
    });


function smoothPath(){

	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		if (selected[i].name === "boundingBoxRect") continue;
		selected[i].smooth();
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}


function expertMode(){

	var children = project.activeLayer.children;

     for (var i = 0; i < children.length; i++) {
	  var child = children[i];
	  console.log(child.fillColor);

	   if (child.fillColor===null) {
	   	currentToolColor = cutColor;
	    switch (child.name) {
	    
	    case 'material': 
	    child.fillColor = cutColor;
	    break;
 
	    case "hole": 
	    child.fillColor = holeColor;
	    break;

	    case "vectorEngrave" :
	    child.fillColor = vectorEngraveColor;
	    break;

	    case "rasterEngrave" : 
        child.fillColor = rasterEngraveColor;
	    break;
        }

	   }
	   else {
	   child.fillColor = null;
	   expertModeOn = true;
	   currentToolColor = null;
	   }

     }
}


//The function below allows the user to place a Raster Image on the canvas(he might want to trace over it with a path).
//The function also checks via jQuery if the image link is valid or not. If it is then we proceed with placing it on the canvas, if not we through an error in the console.

function placeImage() {
    var imgUrl = prompt("Please enter your url");
    var isLinkImg = "";
    $("<img>", {
    src: imgUrl,
    error: function() { 
    $('#myModal').modal('hide');
    $("#alertBox").show();
    window.setTimeout(function() { $("#alertBox").hide() }, 3000); 
    console.log("this shit aint an image son! GET YOUR SHIT TOGETHER!");
    },
    load: function() { 
    document.getElementById("mona").src=imgUrl;
    var raster = new paper.Raster('mona');
	raster.addChild;
    raster.position = paper.view.center;
    raster.selected = true;
    raster.index = 0;
	undo.snapshot("Cut");
	//hide the place image modal because the image was placed succesfully
	$('#myModal').modal('hide');
    }
    });
}



//Invoke HTML5File API for placeImage.

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
      $('#myModal').modal('hide');
      $("#alertBox").show();
      window.setTimeout(function() { $("#alertBox").hide() }, 3000); 
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
         var span = e.target.result;
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
        var raster = new Raster(imgObj);
        raster.addChild;
        raster.position = paper.view.center;
        raster.selected = true;
        raster.index = 0;
	    undo.snapshot("Cut");
	    //hide the place image modal because the image was placed succesfully
	    $('#myModal').modal('hide');
        }
     
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
//Event listeners for the FileAPI upload buttons.
 document.getElementById('tool-placeImageFileModal').addEventListener('change', handleFileSelect, false);
 document.getElementById('tool-placeImageFileDropdown').addEventListener('change', handleFileSelect, false);

//Function that iterates over all ''Selected Elements'' and pushes them to the back of the ''DOM''(Paper.js uses something else, not exactly a DOM)
//Some functions such as the following, i copied and pasted the ''Cut'' function code and altered it a bit, so their undo string still points to ''cut''. 
//Not sure what to replace ''cut'' with in undo for these functions.
window.onload = function() {
		// Get a reference to the canvas object
		// Create an empty project and a view for the canvas:
		paper.install(window);
	};


function sendToBack() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].sendToBack();
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}


function simplifyPath() {
	$('#simplifySliderDiv').toggle();
	$('#simplifySlider').slider('setValue', 0);
}

//Function that iterates over all ''Selected Elements'' and pushes them to the front.
function bringFrontMost() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].bringToFront();
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

//Here we need to get the current index of the selected element in order to add +1 or substract -1 from the current index in order to move the selected in steps.
//We add a name property to the bounding box in editor.js in order to have something to identify it, because we need to disregard it here. The bbox gets selected as well
//and it messes up the calculations.
function bringFrontOne() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		if (selected[i].name === "boundingBoxRect") continue;
		var finalPosition = selected[i].index +1 ;
		project.activeLayer.insertChild(finalPosition, selected[i]);
		console.log(selected[i].index);
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}


function sendBackOne() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		if (selected[i].name === "boundingBoxRect") continue;
		if (selected[i].index > 0)
		{
		var finalPosition = selected[i].index -1 ;
		project.activeLayer.insertChild(finalPosition, selected[i]);
		console.log(selected[i].index); 
	    }
	    else
	    {
	    	console.log("Reached the bottom of the selected index stack");
	    }
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}


//The BoolOps/3D algorithms that are supposed to be plugged in later identify ''Material/Holes/Raster Engravings/Vector Engravings'' by their ''name''. Paper allows us to set a name property
//for items which is Paper converts to the ID when exporting in SVG.

//However the user identifies each type of element by their fill color. 
//Therefore we need to set the currentToolName, the currentToolColor in ext-GlobalVariables, and ALSO convert all selected items to the respective element type.


//Function that sets the elementType as ''Material''
function setElementTypeMaterial() {
	clipboard = captureSelectionState();
	currentToolColor=cutColor;
	currentToolName = "material";
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= cutColor;
		selected[i].opacity= 0.5;
		selected[i].name = "material";
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

//Function that sets the elementType as ''Hole''

function setElementTypeHole() {
	clipboard = captureSelectionState();
	currentToolColor=holeColor;
	currentToolName = "hole";
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= holeColor;
		selected[i].opacity= 0.5;
		selected[i].name = "hole";
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

//Function that sets the elementType as ''Vector Engraving''
function setElementTypeVectorEngrave() {
	clipboard = captureSelectionState();
	currentToolColor=vectorEngraveColor;
	currentToolName = "vectorEngrave";
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= vectorEngraveColor;
		selected[i].opacity= 0.5;
		selected[i].name = "vectorEngrave";
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

//Function that sets the elementType as ''Raster Engraving''

function setElementTypeRasterEngrave() {
	currentToolColor=rasterEngraveColor;
	currentToolName = "rasterEngrave";
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= rasterEngraveColor;
		selected[i].opacity= 0.5;
		selected[i].name = "rasterEngrave";
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

//Function that sets the selected element height. Because we cannot set the width/heights in absolute terms we sample what the current size and what the intended size
//is. From those 2 values we calculate a coefficient we use for the scaling.
	
function setElementHeight() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	var newHeight = document.getElementById('elementHeight').value;

	//Do an if/else here to detect if "0" is passed as the new height. If that's true then set the element height to 1 because ''0'' is actually an invalid value
	for (var i = 0; i < selected.length; i++) {
		 if (newHeight==0) {
	document.getElementById("elementHeight").value =1;//Also set the input text to ''1'
	var currentHeight = selected[i].bounds["height"];
	var newHeight = 1;
	var scaleCoefficient = newHeight/currentHeight;
	selected[i].scale(1,scaleCoefficient);
	 	
	 }
	     else {

	var currentHeight = selected[i].bounds["height"];
	var newHeight = document.getElementById('elementHeight').value;
	console.log(currentHeight);
	var scaleCoefficient = newHeight/currentHeight;
	selected[i].scale(1,scaleCoefficient);
}
	}
	undo.snapshot("Cut");
}

//Function that sets the selected element width. Because we cannot set the width/heights in absolute terms we sample what the current size and what the intended size
//is. From those 2 values we calculate a coefficient we use for the scaling.

function setElementWidth() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	var newWidth = document.getElementById('elementWidth').value;
	//Do an if/else here to detect if "0" is passed as the new width. If that's true then set the element width to 1 because ''0'' is actually an invalid value
	for (var i = 0; i < selected.length; i++) {
		 if (newWidth==0) {
	document.getElementById("elementWidth").value =1; //Also set the input text to ''1''
	var currentWidth = selected[i].bounds["width"];
	var newWidth = 1;
	var scaleCoefficient = newWidth/currentWidth;
	selected[i].scale(scaleCoefficient,1);
	 	
	 }
	     else {


	var currentWidth = selected[i].bounds["width"];
	var newWidth = document.getElementById('elementWidth').value;
	var scaleCoefficient = newWidth/currentWidth;
	selected[i].scale(scaleCoefficient,1);
}
	}
	undo.snapshot("Cut");
}

function flipHorizontally() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	//Do an if/else here to detect if "0" is passed as the new width. If that's true then set the element width to 1 because ''0'' is actually an invalid value
	for (var i = 0; i < selected.length; i++) {

	selected[i].scale(-1,1);
//Functions that have to do with recalculating the Bbox of items sometimes fail to do so therefore we need to do it manually.
	updateSelectionState()
	 	
	 }

	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

function flipVertically() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	//Do an if/else here to detect if "0" is passed as the new width. If that's true then set the element width to 1 because ''0'' is actually an invalid value
	for (var i = 0; i < selected.length; i++) {

	selected[i].scale(1,-1);
//Functions that have to do with recalculating the Bbox of items sometimes fail to do so therefore we need to do it manually.
	updateSelectionState()
	 	
	 }

	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}


//Cannot figure out how to place an element in absolute coordinates. Both x/y positions functions are empty.

function setElementXPosition() {

	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	var newXPosition = parseInt(document.getElementById('elementXPosition').value);
	for (var i = 0; i < selected.length; i++) {
	var currentWidth = selected[i].bounds["width"];
	//We need to divide the width by 2 and add it here because .position.x just sets the center position
	finalXPosition = newXPosition + (currentWidth/2);
	selected[i].position.x = (finalXPosition);
	 	
	}
	undo.snapshot("Cut");
}
	
function setElementYPosition() {

	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	var newYPosition = parseInt(document.getElementById('elementYPosition').value);
	for (var i = 0; i < selected.length; i++) {
	var currentHeight = selected[i].bounds["height"];
		//We need to divide the height by 2 and add it here because .position.x just sets the center position
	finalYPosition = newYPosition + (currentHeight/2);
	selected[i].position.y = (finalYPosition);
	 	
	}
	undo.snapshot("Cut");
	
}

//Function to set rotation to +45 degrees on selected elements. Also calls get selectionBounds from editor.js to update the x,y width/heigh input fields upon rotation completion
function rotateClockwise() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].rotate(45);
		getSelectionBounds();
//Functions that have to do with recalculating the Bbox of items sometimes fail to do so therefore we need to do it manually.
		updateSelectionState()
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}

function rotateCounterClockwise() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].rotate(-45);
		getSelectionBounds();
//Functions that have to do with recalculating the Bbox of items sometimes fail to do so therefore we need to do it manually.
		updateSelectionState()
	}
	undo.snapshot("Cut");
//IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
//firing a function.
	view.update();
}
//Function that hides the right tools/Slider when nothing is selected. Triggered by clicking on the canvas.

function hideRightTools(){
	var selected = paper.project.selectedItems;
	if (selected.length<1){
		$('#tools_right').hide();
		$('#simplifySliderDiv').hide();
		$('#simplifySlider').slider('setValue', 0);


	}
}


function goFullScreen() {
	  var
          el = document.documentElement
        , rfs =
               el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen

    ;
    rfs.call(el);
}

function prepareSVGExport(){

var svg = paper.project.exportSVG();
console.log(svg);
}


//Keybidings for various things

$(document).keydown(function(e){
      if( e.which === 90 && e.ctrlKey){
        toolStack.command(function() {
			if (undo.canUndo())
				undo.undo();
		});
      }
}); 

$(document).keydown(function(e){
      if( e.which === 89 && e.ctrlKey){
   	toolStack.command(function() {
			if (undo.canRedo())
				undo.redo();
		});
      }
}); 

$(document).keydown(function(e){
      if(e.which === 46){
         deleteSelection();
      }
}); 

$(document).keydown(function(e){
      if( e.which === 67 && e.ctrlKey){
        copySelection();
      }
}); 

$(document).keydown(function(e){
      if( e.which === 86 && e.ctrlKey){
        pasteSelection();
      }
}); 

$(document).keydown(function(e){
      if( e.which === 38 && e.ctrlKey){
        bringToFrontSelection();
      }
}); 

$(document).keydown(function(e){
      if( e.which === 40 && e.ctrlKey){
        bringToBackSelection();
      }
}); 


});



//The Zoom Tool

//There are 2 values, upperZoomLimit/lowerZoomLimit that are being drawn in from the GlobalVariables.js file.

var toolZoomIn = new paper.Tool();
toolZoomIn.distanceThreshold = 8;
toolZoomIn.mouseStartPos = new paper.Point();
toolZoomIn.mode = 'pan';
toolZoomIn.zoomFactor = 1.3;
toolZoomIn.resetHot = function(type, event, mode) {
};
toolZoomIn.testHot = function(type, event, mode) {
	
};
toolZoomIn.hitTest = function(event) {
	
	setCanvasCursor('cursor-zoom-in');
		
	return true;
};
toolZoomIn.on({

	mouseup: function(event) {
		this.mouseStartPos = event.point.subtract(paper.view.center);
		console.log(this.name)
		this.mode = '';
		this.mode = 'zoom';
		var zoomCenter = event.point.subtract(paper.view.center);
		var moveFactor = this.zoomFactor - 1.0;
		paper.view.zoom *= this.zoomFactor;
		paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor / this.zoomFactor));
		this.hitTest(event);
		this.mode = '';
	},
	
	mousemove: function(event) {
		this.hitTest(event);
	}
});

$(document).ready(function(e) {

$('#canvas').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(e){
        var delta = 0;
        var children = project.activeLayer.children;
        e.preventDefault();
        e = e || window.event;
        if (e.type == 'mousewheel') {       //this is for chrome/IE
                delta = e.originalEvent.wheelDelta;
            }
            else if (e.type == 'DOMMouseScroll') {  //this is for FireFox
                delta = e.originalEvent.detail*-1;  //FireFox reverses the scroll so we force to to re-reverse...
            }
        if((delta > 0) && (paper.view.zoom<upperZoomLimit)) {   //scroll up
        	 var point = paper.DomEvent.getOffset(e.originalEvent, $('#canvas')[0]);
        	point = paper.view.viewToProject(point);
        	var zoomCenter = point.subtract(paper.view.center);
	        var moveFactor = toolZoomIn.zoomFactor - 1.0;
		    paper.view.zoom *= toolZoomIn.zoomFactor;
		    paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor / toolZoomIn.zoomFactor));
		    toolZoomIn.hitTest(e);
		    toolZoomIn.mode = '';

		    //get all elements and divide their stroke widths by the current zoom level to create hairline stroke
            for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        child.strokeWidth = 1 / paper.view.zoom;
	        view.update();
	    }
        }

        else if((delta < 0) && (paper.view.zoom>lowerZoomLimit)){ //scroll down
             var point = paper.DomEvent.getOffset(e.originalEvent, $('#canvas')[0]);
        	point = paper.view.viewToProject(point);
        	var zoomCenter = point.subtract(paper.view.center);   
        	var moveFactor = toolZoomIn.zoomFactor - 1.0;
            paper.view.zoom /= toolZoomIn.zoomFactor;
		    paper.view.center = paper.view.center.subtract(zoomCenter.multiply(moveFactor))

		    //get all elements and divide their stroke widths by the current zoom level to create hairline stroke
            for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	        child.strokeWidth = 1 / paper.view.zoom;
	        view.update();
	    }
        }
    });

 });

//End of mousewheel Zoom Tool by nicholaswmin