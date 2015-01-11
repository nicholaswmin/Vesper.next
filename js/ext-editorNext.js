// Additional Functionality added by ''Nicholas Kyriakides''. 
$(document).ready(function () {

    //Startup initialization for various elements
    paper.install(window);
    $('body').on('contextmenu', '#canvas', function (e) {
        return false;
    });

    $('#simplifySlider').slider();

    $('#simplifySliderDiv').hide();
    $('.tools_right').hide();
    $('.tools_right_alignment').hide();
    $('#alertBox').hide();

    $("#elementXPosition,#elementYPosition,#elementWidth,#elementHeight").numeric();

    var drawingArea = new paper.Path.Rectangle(new paper.Point(0, 0), materialWidth, materialHeight);
    drawingArea.name = "drawingArea";
    drawingArea.strokeColor = 'black';
    drawingArea.strokeWidth = 5;
    //Lock the drawing area so it doesn't respond to hit events. Also excluded from the intersection test in editor.js
    drawingArea.locked = true;
    drawingArea.data.nonUndoable = true;
    drawingArea.data.nonMovable = true;

    paper.view.update();

    paper.view.scrollBy(-80, -100);
    paper.view.zoom = 0.50;

    //Click triggers for various tools

    $("#tool-clearCanvas").click(function () {
        clearCanvas();
    });

    $("#tool-expertMode").click(function () {
        expertMode();
    });

    $("#tool-placeImageUrlDropdown").click(function () {
        placeImage();
    });

    $("#tool-material").click(function () {
        setElementTypeMaterial();
    });

    $("#tool-hole").click(function () {
        setElementTypeHole();
    });

    $("#tool-vectorEngrave").click(function () {
        setElementTypeVectorEngrave();
    });

    $("#tool-rasterEngrave").click(function () {
        setElementTypeRasterEngrave();
    });

    $("#tool-sendToBack").click(function () {
        sendToBack();
    });

    $("#tool-bringFrontMost").click(function () {
        bringFrontMost();
    });

    $("#tool-sendBackOne").click(function () {
        sendBackOne();
    });

    $("#tool-bringFrontOne").click(function () {
        bringFrontOne();
    });

    $("#toolRotateClockwise").click(function () {
        rotateClockwise();
    });

    $("#toolRotateCounterClockwise").click(function () {
        rotateCounterClockwise();
    });

    $("#toolFlipHorizontally").click(function () {
        flipHorizontally();
    });

    $("#toolFlipVertically").click(function () {
        flipVertically();
    });

    $("#tool-exportSourceSVG").click(function () {
        exportSourceSVG();
    });

    $("#tool-simplifyPath").click(function () {
        simplifyPath();
    });

    $("#tool-smoothPath").click(function () {
        smoothPath();
    });

    $("#tool-alignRight").click(function () {
        alignRight();
    });

    $("#tool-alignLeft").click(function () {
        alignLeft();
    });

    $("#tool-alignTop").click(function () {
        alignTop();
    });

    $("#tool-alignBottom").click(function () {
        alignBottom();
    });

    $("#tool-alignCenter").click(function () {
        alignCenter();
    });

    //On change triggers for various tools

    $("#elementHeight").change(function () {
        setElementHeight();
    });

    $("#elementWidth").change(function () {
        setElementWidth();
    });

    $("#elementYPosition").change(function () {
        setElementYPosition();
    });

    $("#elementXPosition").change(function () {
        setElementXPosition();
    });

    //''ENTER'' key triggers for various tools(e.g dimensions input boxes )
    document.getElementById('elementHeight').onkeydown = function (event) {
        if (event.keyCode == 13) {
            setElementHeight();
        }
    };

    document.getElementById('elementWidth').onkeydown = function (event) {
        if (event.keyCode == 13) {
            setElementWidth();
        }
    };

    document.getElementById('elementYPosition').onkeydown = function (event) {
        if (event.keyCode == 13) {
            setElementYPosition();
        }
    };
    document.getElementById('elementXPosition').onkeydown = function (event) {
        if (event.keyCode == 13) {
            setElementXPosition();
        }
    };

    $('#elementXPosition,#elementYPosition,#elementWidth,#elementHeight').click(function () {
        this.select();
    });

    $("#canvas").click(function () {
        hideRightTools();
    });

    //Keybindings for various tools.

    $(document).keydown(function (e) {
        if (e.which === 90 && e.ctrlKey) {
            toolStack.command(function () {
                if (undo.canUndo())
                    undo.undo();
            });
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 89 && e.ctrlKey) {
            toolStack.command(function () {
                if (undo.canRedo())
                    undo.redo();
            });
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 46) {
            deleteSelection();
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 67 && e.ctrlKey) {
            copySelection();
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 86 && e.ctrlKey) {
            pasteSelection();
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 38 && e.ctrlKey) {
            bringToFrontSelection();
        }
    });

    $(document).keydown(function (e) {
        if (e.which === 40 && e.ctrlKey) {
            bringToBackSelection();
        }
    });


     $(document).keydown(function (e) {
        if (e.which === 38) {
            nudgeSelection("up");
        }
    });

      $(document).keydown(function (e) {
        if (e.which === 40) {
            nudgeSelection("down");
        }
    });

         $(document).keydown(function (e) {
        if (e.which === 37) {
            nudgeSelection("left");
        }
    });

            $(document).keydown(function (e) {
        if (e.which === 39) {
            nudgeSelection("right");
        }
    });




    //Event listeners for various tools
    document.getElementById('tool-placeImageFileDropdown').addEventListener('change', handleFileSelect, false);

    document.addEventListener("selectionFired", function (e) {
        var bounds = e.detail.bounds;
        var selected = e.detail.selectedd;
        getSelectionDimensions(bounds, selected);
    });

    //Functions

     function nudgeSelection(direction) {

         var selected = paper.project.selectedItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].name === "boundingBoxRect") continue;

            switch(direction) {
case "up":
    selected[i].position.y = selected[i].position.y - nudgeFactor;
   

    break;
case "down": 
selected[i].position.y = selected[i].position.y + nudgeFactor;


break;
case "left": 
selected[i].position.x = selected[i].position.x - nudgeFactor;

break;
case "right": 
selected[i].position.x = selected[i].position.x + nudgeFactor;


break;


}
 updateSelectionState();
           
        }
        undo.snapshot("Cut");
        //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
        //firing a function.
        view.update();
    }
  

    


    function hideRightTools() {
        var selected = paper.project.selectedItems;
        if (selected.length < 1) {
            $('.tools_right').hide();
            $('.tools_right_alignment').hide();
            $('#simplifySliderDiv').hide();
            $('#simplifySlider').slider('setValue', 0);
        }
    }

    function getSelectionDimensions(bounds, selected) {
        $('.tools_right').show();
        $('.tools_right_alignment').show();
        document.getElementById('elementXPosition').value = (bounds["x"].toFixed(2));
        document.getElementById('elementYPosition').value = (bounds["y"].toFixed(2));
        document.getElementById('elementWidth').value = (bounds["width"].toFixed(2) + " mm");
        document.getElementById('elementHeight').value = (bounds["height"].toFixed(2) + " mm");

        singleSelectionToolsDisable();


    }

    //Function to disable tools that only allow one selected item 
    function singleSelectionToolsDisable() {

        var selected = paper.project.selectedItems;
        if (selected.length > 1 || selected[0].className === "Raster") {
            $("#tool-simplifyPath").last().addClass("disable");
        } else {
            $("#tool-simplifyPath").last().removeClass("disable");
        }

    }


    function clearCanvas() {
        bootbox.confirm("Clearing the canvas will remove everything that you drawed so far. Are you absolutely, positively certain that you want that?", function (result) {
            if (result) {
                paper.project.activeLayer.removeChildren();
            }
        });
    }

    //Import SVG does not use click triggers as other functions do.

    var file = document.getElementById('tool-importSVG');
    file.addEventListener('change', function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.type.match('svg')) {
                project.importSVG(file, {
                    expandShapes: true
                });

            }
        }
    });

    function placeImage() {
        var imgUrl = "";
        bootbox.prompt("Paste here an image URL", function (result) {
            if (result !== null) {
                imgUrl = result;
                var isLinkImg = "";

                $("<img>", {
                    src: imgUrl,
                    error: function () {
                        $("#alertBox").show();
                        $("#alertBox").html("Oops! The link is NOT a valid image");
                        window.setTimeout(function () {
                            $("#alertBox").hide()
                        }, 3000);
                    },

                    load: function () {
                        document.getElementById("mona").src = imgUrl;
                        var raster = new paper.Raster('mona');
                        raster.addChild;
                        raster.position = paper.view.center;
                        raster.selected = true;
                        raster.index = 0;

                        undo.snapshot("Cut");
                    }
                });
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
                $("#alertBox").show();
                $("#alertBox").html("Oops! The link is NOT a valid image");
                window.setTimeout(function () {
                    $("#alertBox").hide()
                }, 3000);
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
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
                    }

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    function exportSourceSVG() {

        clearSelectionBounds();

        var svg = paper.project.exportSVG({
            asString: true
        });
        var blob = new Blob([svg], {
            type: "image/svg+xml;charset=utf-8"
        });
        saveAs(blob, 'image.svg');

    }

    //Functions for settings type of element

    //Function that sets the elementType as ''Material''
    function setElementTypeMaterial() {
        clipboard = captureSelectionState();
        currentToolColor = cutColor;
        currentToolName = "material";
        var selected = paper.project.selectedItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].name === "boundingBoxRect") continue;
            selected[i].fillColor = cutColor;
            selected[i].opacity = 0.5;
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
        currentToolColor = holeColor;
        currentToolName = "hole";
        var selected = paper.project.selectedItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].name === "boundingBoxRect") continue;
            selected[i].fillColor = holeColor;
            selected[i].opacity = 0.5;
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
        currentToolColor = vectorEngraveColor;
        currentToolName = "vectorEngrave";
        var selected = paper.project.selectedItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].name === "boundingBoxRect") continue;
            selected[i].fillColor = vectorEngraveColor;
            selected[i].opacity = 0.5;
            selected[i].name = "vectorEngrave";
        }
        undo.snapshot("Cut");
        //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
        //firing a function.
        view.update();
    }

    //Function that sets the elementType as ''Raster Engraving''

    function setElementTypeRasterEngrave() {
        currentToolColor = rasterEngraveColor;
        currentToolName = "rasterEngrave";
        clipboard = captureSelectionState();
        var selected = paper.project.selectedItems;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].name === "boundingBoxRect") continue;
            selected[i].fillColor = rasterEngraveColor;
            selected[i].opacity = 0.5;
            selected[i].name = "rasterEngrave";
        }
        undo.snapshot("Cut");
        //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
        //firing a function.
        view.update();
    }

    function expertMode() {
        var children = project.activeLayer.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (child.fillColor === null) {
                currentToolColor = cutColor;
                switch (child.name) {

                case 'material':
                    child.fillColor = cutColor;
                    break;

                case "hole":
                    child.fillColor = holeColor;
                    break;

                case "vectorEngrave":
                    child.fillColor = vectorEngraveColor;
                    break;

                case "rasterEngrave":
                    child.fillColor = rasterEngraveColor;
                    break;
                }

            } else {
                child.fillColor = null;
                expertModeOn = true;
                currentToolColor = null;
            }
        }
    }

    //Functions for right toolbar

    //Function that iterates over all ''Selected Elements'' and pushes them to the back of the ''DOM''(Paper.js uses something else, not exactly a DOM)
    //Some functions such as the following, i copied and pasted the ''Cut'' function code and altered it a bit, so their undo string still points to ''cut''. 
    //Not sure what to replace ''cut'' with in undo for these functions.

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
            var finalPosition = selected[i].index + 1;
            project.activeLayer.insertChild(finalPosition, selected[i]);
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
            if (selected[i].index > 0) {
                var finalPosition = selected[i].index - 1;
                project.activeLayer.insertChild(finalPosition, selected[i]);
            } else {
                console.log("Reached the bottom of the selected index stack");
            }
        }
        undo.snapshot("Cut");
        //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
        //firing a function.
        view.update();
    }

    //Function that sets the selected element width. Because we cannot set the width/heights in absolute terms we sample what the current size and what the intended size
    //is. From those 2 values we calculate a coefficient we use for the scaling.

    function setElementWidth() {
        clipboard = captureSelectionState();
        var selected = paper.project.selectedItems;
        var newWidth = document.getElementById('elementWidth').value;
        //Do an if/else here to detect if "0" is passed as the new width. If that's true then set the element width to 1 because ''0'' is actually an invalid value
        for (var i = 0; i < selected.length; i++) {
            if (newWidth == 0) {
                document.getElementById("elementWidth").value = 1; //Also set the input text to ''1''
                var currentWidth = selected[i].bounds["width"];
                var newWidth = 1;
                var scaleCoefficient = newWidth / currentWidth;
                selected[i].scale(scaleCoefficient, 1);

            } else {

                var currentWidth = selected[i].bounds["width"];
                var newWidth = document.getElementById('elementWidth').value;
                var scaleCoefficient = newWidth / currentWidth;
                selected[i].scale(scaleCoefficient, 1);
            }
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
            if (newHeight == 0) {
                document.getElementById("elementHeight").value = 1; //Also set the input text to ''1'
                var currentHeight = selected[i].bounds["height"];
                var newHeight = 1;
                var scaleCoefficient = newHeight / currentHeight;
                selected[i].scale(1, scaleCoefficient);

            } else {

                var currentHeight = selected[i].bounds["height"];
                var newHeight = document.getElementById('elementHeight').value;
                var scaleCoefficient = newHeight / currentHeight;
                selected[i].scale(1, scaleCoefficient);
            }
        }
        undo.snapshot("Cut");
    }

    function flipHorizontally() {
        clipboard = captureSelectionState();
        var selected = paper.project.selectedItems;
        //Do an if/else here to detect if "0" is passed as the new width. If that's true then set the element width to 1 because ''0'' is actually an invalid value
        for (var i = 0; i < selected.length; i++) {

            selected[i].scale(-1, 1);
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

            selected[i].scale(1, -1);
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
            finalXPosition = newXPosition + (currentWidth / 2);
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
            finalYPosition = newYPosition + (currentHeight / 2);
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
    //Trigger function on simplifier Slider. .
    //On each increment the function checks whether a clone of the selected path exists. If it exists it deletes the clone and creates a new one with the current slider value
    //This allows the user to drag the slider up/down with the effects of the slider applying on the original path form instead of the effects applying on the previous simplification.
    //The function checks which clone relates to which original path. This prevents the deletion of unrelated clones of other paths when moving the slider.

    //The object below is holds the clone of the path and its associated id. We need the associatedId otherwise we would be unable to know which clone relates to which selected path.
    //We must keep track of this to prevent the deletion of clones that are unrelated to the currently selected path.
    //The object below pollutes the global-scope.
    var copy = {
        associatedClone: "noClone",
        associatedId: 13294812938491283423
    };

    $('#simplifySlider').on('slide', function (ev) {
        clipboard = captureSelectionState();
        var selected = paper.project.selectedItems;
        if (copy.associatedClone === "noClone") {
            console.log("nothing to remove");
        } else {
            if (copy.associatedId === selected[0].id) {
                copy.associatedClone.remove();
                console.log("removed");
            } else {
                console.log("non-associated id");
            }
        }
        var value = ($('#simplifySlider').val());
        copy.associatedClone = selected[0].clone();
        copy.associatedClone.simplify(value);
        copy.associatedId = selected[0].id;
    });

    function smoothPath() {
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

    //Alignment functions - Declare a tool first that is used to select a reference item - User selects a bunch of elements, selects alignment button, selects a reference item to apply
    //the alignment relative to that reference item.

    toolReferenceItemSelect = new Tool();
    toolReferenceItemSelect.hitSize = 8;

    //A helper function that alerts the user that after he clicks his preferred alignment method, he must click on an item to set it as the Reference Item

    function displayAlignmentInstruction() {
        $("#alertBox").show();
        $("#alertBox").html("Click an element to set it as the Reference Item");
        window.setTimeout(function () {
            $("#alertBox").hide()
        }, 5000);
    }

    function alignRight() {

        displayAlignmentInstruction();

        toolReferenceItemSelect.activate();
        toolReferenceItemSelect.onMouseDown = function onMouseDown(event) {
            this.hitItem = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: toolReferenceItemSelect.hitSize
            });
            toolStack.activate();
            toolStack.setToolMode('tool-select');

            var referenceItem = this.hitItem;
            var referenceItemXPosition = (referenceItem.item.position.x - (referenceItem.item.bounds["width"] / 2));
            var referenceItemX2Position = referenceItemXPosition + referenceItem.item.bounds["width"];

            var selected = paper.project.selectedItems;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].name === "boundingBoxRect") continue;
                if (selected[i].id === referenceItem.item.id) continue;
                selected[i].position.x = referenceItemX2Position - (selected[i].bounds["width"] / 2);

            }
            undo.snapshot("Cut");
            updateSelectionState();
            //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
            //firing a function.
            view.update();

        }

        setCanvasCursor('cursor-arrow-small');

    }

    function alignLeft() {

        displayAlignmentInstruction();

        toolReferenceItemSelect.activate();
        toolReferenceItemSelect.onMouseDown = function onMouseDown(event) {
            this.hitItem = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: toolReferenceItemSelect.hitSize
            });
            toolStack.activate();
            toolStack.setToolMode('tool-select');

            var referenceItem = this.hitItem;
            var referenceItemXPosition = (referenceItem.item.position.x - (referenceItem.item.bounds["width"] / 2));

            var selected = paper.project.selectedItems;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].name === "boundingBoxRect") continue;
                if (selected[i].id === referenceItem.item.id) continue;
                selected[i].position.x = referenceItemXPosition + (selected[i].bounds["width"] / 2);

            }
            undo.snapshot("Cut");
            updateSelectionState();
            //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
            //firing a function.
            view.update();

        }

        setCanvasCursor('cursor-arrow-small');

    }

    function alignTop() {

        displayAlignmentInstruction();

        toolReferenceItemSelect.activate();
        toolReferenceItemSelect.onMouseDown = function onMouseDown(event) {
            this.hitItem = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: toolReferenceItemSelect.hitSize
            });
            toolStack.activate();
            toolStack.setToolMode('tool-select');

            var referenceItem = this.hitItem;
            var referenceItemYPosition = (referenceItem.item.position.y - (referenceItem.item.bounds["height"] / 2));

            var selected = paper.project.selectedItems;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].name === "boundingBoxRect") continue;
                if (selected[i].id === referenceItem.item.id) continue;
                selected[i].position.y = referenceItemYPosition + (selected[i].bounds["height"] / 2);

            }
            undo.snapshot("Cut");
            updateSelectionState();
            //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
            //firing a function.
            view.update();

        }

        setCanvasCursor('cursor-arrow-small');

    }

    function alignBottom() {

        displayAlignmentInstruction();

        toolReferenceItemSelect.activate();
        toolReferenceItemSelect.onMouseDown = function onMouseDown(event) {
            this.hitItem = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: toolReferenceItemSelect.hitSize
            });
            toolStack.activate();
            toolStack.setToolMode('tool-select');

            var referenceItem = this.hitItem;
            var referenceItemYPosition = (referenceItem.item.position.y - (referenceItem.item.bounds["height"] / 2));
            var referenceItemY2Position = referenceItemYPosition + referenceItem.item.bounds["height"];

            var selected = paper.project.selectedItems;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].name === "boundingBoxRect") continue;
                if (selected[i].id === referenceItem.item.id) continue;
                selected[i].position.y = referenceItemY2Position - (selected[i].bounds["height"] / 2);

            }
            undo.snapshot("Cut");
            updateSelectionState();
            //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
            //firing a function.
            view.update();

        }

        setCanvasCursor('cursor-arrow-small');

    }

    function alignCenter() {

        displayAlignmentInstruction();

        toolReferenceItemSelect.activate();
        toolReferenceItemSelect.onMouseDown = function onMouseDown(event) {
            this.hitItem = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: toolReferenceItemSelect.hitSize
            });
            toolStack.activate();
            toolStack.setToolMode('tool-select');

            var referenceItem = this.hitItem;

            var selected = paper.project.selectedItems;
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].name === "boundingBoxRect") continue;
                if (selected[i].id === referenceItem.item.id) continue;
                selected[i].position.y = referenceItem.item.position.y;
                selected[i].position.x = referenceItem.item.position.x;

            }
            undo.snapshot("Cut");
            updateSelectionState();
            //IE AND FF fail to automatically update the view after every change so we need to call it manually, otherwise the effects of a function don't take place until after we move the mouse after
            //firing a function.
            view.update();

        }

        setCanvasCursor('cursor-arrow-small');

    }

});