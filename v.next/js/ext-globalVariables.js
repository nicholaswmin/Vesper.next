//Global variables used for startup-settings of the app. I know globals are a bad way so this must be remedied in the future.

var materialWidth=500;
var materialHeight=500;

var cutColor="#3498db";
var holeColor="#ecf0f1";
var vectorEngraveColor="#2980b9";
var rasterEngraveColor="#2c3e50";

var defaultToolOpacity = 0.5;
var currentToolName = 'material';

var upperZoomLimit = 30;
var lowerZoomLimit = 0.40;

var expertModeOn=false;


//When elementType is pressed it sets this variable as well so next time we draw a path it starts drawing with the currently selected elementType. e.g elementType 
//is either material,hole,engraving,vector engraving. They are identified by HTML colors.
var currentToolColor=cutColor;


