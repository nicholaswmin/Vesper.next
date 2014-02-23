// Additional Functionality added by ''Nicholas Kyriakides''. 


//Function that iterates over all ''Selected Elements'' and pushes them to the back of the ''DOM''(Paper.js uses something else, not exactly a DOM)
//Some functions such as the following, i copied and pasted the ''Cut'' function code and altered it a bit, so their undo string still points to ''cut''. 
//Not sure what to replace ''cut'' with in undo for these functions.

function bringToBackSelection() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].sendToBack();
	}
	undo.snapshot("Cut");
}

//Function that iterates over all ''Selected Elements'' and pushes them to the front.
function bringToFrontSelection() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].bringToFront();
	}
	undo.snapshot("Cut");
}

//The BoolOps/3D algorithms that are supposed to be plugged in later identify ''Material/Holes/Raster Engravings/Vector Engravings'' by their HTML colors. 
// So we need to ''illuminate'' each element on the canvas with it's respective HTML color. The HTML colors also help the user know what elementType he is currently
//using

// The elementType functions get their respective HTML colors from the ext-globalVariables.js file, since these are the startup settings variables.
// Also each elementType functions sets a variable in that file with the HTML color so next time the user draws a path, it's drawn with the currently
//selected elementType HTML color. 


//Function that sets the elementType as ''Material''
function setElementTypeMaterial() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= cutColor;
		selected[i].opacity= 0.5;
		currentToolColor=cutColor;
	}
	undo.snapshot("Cut");
}

//Function that sets the elementType as ''Hole''

function setElementTypeHole() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= holeColor;
		selected[i].opacity= 0.5;
		currentToolColor=holeColor;
	}
	undo.snapshot("Cut");
}

//Function that sets the elementType as ''Vector Engraving''
function setElementTypeVectorEngrave() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= vectorEngraveColor;
		selected[i].opacity= 0.5;
		currentToolColor=vectorEngraveColor;
	}
	undo.snapshot("Cut");
}

//Function that sets the elementType as ''Raster Engraving''

function setElementTypeRasterEngrave() {
	clipboard = captureSelectionState();
	var selected = paper.project.selectedItems;
	for (var i = 0; i < selected.length; i++) {
		selected[i].fillColor= rasterEngraveColor;
		selected[i].opacity= 0.5;
		currentToolColor=rasterEngraveColor;
	}
	undo.snapshot("Cut");
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

//Cannot figure out how to place an element in absolute coordinates. Both x/y positions functions are empty.

function setElementXPosition() {
	
}

function setElementYPosition() {
	
}

//Function that hides the right tools when nothing is selected. Triggered by clicking on the canvas.

function hideRightTools(){
	var selected = paper.project.selectedItems;
	if (selected.length<1){
		$('#tools_right').hide();

	}
}

//Function that prevents the user from typing anything ELSE than NUMBERS in the x/y width/height input fields in the HTML file. Uses ''numeric.js'' file.

$(document).ready(function() {



$("#elementXPosition,#elementYPosition,#elementWidth,#elementHeight").numeric();
});

$(document).ready(function() {

//The following path is added at startup of the editor. It's supposed to represent the material size selected by the user
//which is used for showing the users where to concentrate his elements. The boolOp/3D algorithms use this for the cutting rectangle.
//The user is allowed to draw outside his rectangle but whatever is outside this rectangle is ''clipped'' by the BoolOp/3D algos.
//We need to find a way to make this rectangle non-selectable by the user, similar to pointer-events:none of SVG.

var path2 = new paper.Path.Rectangle(new paper.Point(100, 100), materialWidth,materialHeight);
	path2.strokeColor ='black';

//The following functions are the triggers for the additional functionality added in this file. They ''glue'' together the buttons from the HTML file and the 
//additional functionality in this file.

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


    $("#tool-moveFront").click(function() {
		bringToBackSelection();
	});

	$("#tool-moveFrontMost").click(function() {
		bringToFrontSelection();
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

});