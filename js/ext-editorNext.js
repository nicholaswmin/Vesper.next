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

//The BoolOps/3D algorithms that are supposed to be plugged in later identify ''Materia;/Holes/Raster Engravings/Vector Engravings'' by their HTML colors. 
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
});