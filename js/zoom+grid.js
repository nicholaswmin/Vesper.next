//The grid get's redrawn on each mouse-scroll zoom. This ensures "higher" performance since we don't declare a huge static grid to compensate for the large
//viewport when completely zoomed-out. Each zoom scroll OR panning removes the previously placed grid and redraws another one based on the new viewport(after zooming).
//The grid functions below also set a global variable called snappingStep since the grid also causes the Pen tool to snap-to the cell corners.
//The grid makes clever uses of the skipper.js functions since its completely undoable and non-exportable
//Limitations: It's dangerous? The whole logic of this drawGrid-removeGrid-redraw grid coupled with skipper.js makes it a bit prone to errors.
"use strict";


var toolZoomIn = new paper.Tool();
toolZoomIn.distanceThreshold = 8;
toolZoomIn.mouseStartPos = new paper.Point();
toolZoomIn.zoomFactor = 1.3;


$(document).ready(function () {

    //Trigger a drawGrid from a button in the UI
    $("#tool-drawGrid").click(function () {
        grid.drawGrid("drawGridButton");
        $("#tool-drawGrid").blur();
    });


    //Listener for event-dispatcher in editor.js Pan Tool
    document.addEventListener("panFired", function (e) {
        grid.drawGrid("pan");
    });

    //Trigger the update of the grid when resizing the window
    window.onresize = function () {
        grid.drawGrid("resizedView");
    };

    //Listen on the grid settings spinner to change the cell Size and snappingStep values

    $('#gridSpinner').on('change', function (ev) {
        var value = document.getElementById('gridSpinner').value;
        grid.cellSize = value;
        grid.drawGrid("changeGridSettings");
    });


    //Pre-toggle the snap-to-grid toggle
    $('#snappingStepToggle').button('toggle');
    //Listen on the snap-to-grid toggle switch
    $('#snappingStepToggle').click(function () {

        $('#snappingStepToggle').blur();

        if ($('#snappingStepToggle').hasClass('active')) {
            $('#snappingStepToggle').text('Snap Grid Off');
            grid.snappingStepOn = "false";
            grid.drawGrid("changeGridSettings");
        } else {
            $('#snappingStepToggle').text('Snap Grid On');
            grid.snappingStepOn = "true";
            grid.drawGrid("changeGridSettings");
        };
    });





    var grid = {};
    grid.cellSize = 50;
    grid.gridColor = '#D0D0D0';
    grid.snappingStepOn = "true";
    grid.snappingStep = grid.cellSize;
    grid.gridOn = "false";
    grid.gridGroup = new paper.Group;
    grid.gridGroup.locked = true;
    grid.gridGroup.name = "gridGroup";
    grid.gridGroup.data.nonUndoable = true;
    grid.gridGroup.data.nonMovable = true;


    grid.drawGridLines = function () {

        var boundingRect = paper.view.bounds;
        var num_rectangles_wide = paper.view.bounds.width / grid.cellSize;
        var num_rectangles_tall = paper.view.bounds.height / grid.cellSize;

        for (var i = 0; i <= num_rectangles_wide; i++) {
            var correctedLeftBounds = Math.ceil(boundingRect.left / grid.cellSize) * grid.cellSize;
            var xPos = correctedLeftBounds + i * grid.cellSize;
            var topPoint = new paper.Point(xPos, boundingRect.top);
            var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
            var gridLine = new paper.Path.Line(topPoint, bottomPoint);
            gridLine.strokeColor = grid.gridColor;
            gridLine.strokeWidth = 1 / paper.view.zoom;
            gridLine.name = "gridLine";

            grid.gridGroup.addChild(gridLine);

        }

        for (var i = 0; i <= num_rectangles_tall; i++) {
            var correctedTopBounds = Math.ceil(boundingRect.top / grid.cellSize) * grid.cellSize;
            var yPos = correctedTopBounds + i * grid.cellSize;
            var leftPoint = new paper.Point(boundingRect.left, yPos);
            var rightPoint = new paper.Point(boundingRect.right, yPos);
            var gridLine = new paper.Path.Line(leftPoint, rightPoint);
            gridLine.strokeColor = grid.gridColor;
            gridLine.strokeWidth = 1 / paper.view.zoom;
            gridLine.name = "gridLine";

            grid.gridGroup.addChild(gridLine);



        }

        view.update();


    }

    grid.drawGrid = function (originOfCall) {

        switch (originOfCall) {

        case "drawGridButton":
            if (grid.gridOn === "false") {
                if (grid.snappingStepOn === "true") {
                    snappingStep = grid.cellSize;
                } else {
                    snappingStep = 1;
                }
                grid.drawGridLines();
                grid.gridOn = "true";
            } else {
                grid.gridGroup.removeChildren();
                snappingStep = 1;
                view.update();
                grid.gridOn = "false";
                view.update();
            }
            break;

        case "resizedView":
        case "changeGridSettings":
        case "scrollZoom":
        case "pan":
            if (grid.gridOn === "true") {

                grid.gridGroup.removeChildren();
                grid.drawGridLines();
                if (grid.snappingStepOn === "true") {
                    snappingStep = grid.cellSize;
                } else {
                    snappingStep = 1;
                }

            }
            break;
        }
        grid.gridGroup.sendToBack();
    }



    //Start of mouse scroll zoom. The mouse zoom ''homes in'' on the current mouse position. 
    //Each mouse scroll calls the drawGrid function which checks if there is a previously drawed grid, deletes it if yes, and starts drawing a new grid.

    $('#canvas').bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (e) {

        var delta = 0;
        var children = project.activeLayer.children;

        e.preventDefault();
        e = e || window.event;
        if (e.type == 'mousewheel') { //this is for chrome/IE
            delta = e.originalEvent.wheelDelta;
        } else if (e.type == 'DOMMouseScroll') { //this is for FireFox
            delta = e.originalEvent.detail * -1; //FireFox reverses the scroll so we force to to re-reverse...
        }

        if ((delta > 0) && (paper.view.zoom < upperZoomLimit)) {
            //scroll up
            var point = paper.DomEvent.getOffset(e.originalEvent, $('#canvas')[0]);
            point = paper.view.viewToProject(point);
            var zoomCenter = point.subtract(paper.view.center);
            var moveFactor = toolZoomIn.zoomFactor - 1.0;
            paper.view.zoom *= toolZoomIn.zoomFactor;
            paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor / toolZoomIn.zoomFactor));
            toolZoomIn.mode = '';
            //Call draw grid with appropriate parameter
            grid.drawGrid("scrollZoom");

        } else if ((delta < 0) && (paper.view.zoom > lowerZoomLimit)) { //scroll down
            var point = paper.DomEvent.getOffset(e.originalEvent, $('#canvas')[0]);
            point = paper.view.viewToProject(point);
            var zoomCenter = point.subtract(paper.view.center);
            var moveFactor = toolZoomIn.zoomFactor - 1.0;
            paper.view.zoom /= toolZoomIn.zoomFactor;
            paper.view.center = paper.view.center.subtract(zoomCenter.multiply(moveFactor))

            //Call draw grid with appropriate parameter
            grid.drawGrid("scrollZoom");



        }
    });

});