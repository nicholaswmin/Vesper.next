// Draw an involute gear in your browswer using JavaScript and SVG
// Tested on Internet Explorer 10 and Firefox 22
// Adapted from: Public Domain Parametric Involute Spur Gear by Leemon Baird, 2011, Leemon@Leemon.com http://www.thingiverse.com/thing:5505
// see also http://grabcad.com/questions/tutorial-how-to-model-involute-gears-in-solidworks-and-show-design-intent
$(document).ready(function () {

    $("#tool-placeGear").click(function () {
        appendGearToCanvas();
        $('#gearsModal').modal('hide');
    });

    $('#gearSpinnerTeeth').on('change', function (ev) {
        var value = document.getElementById('gearSpinnerTeeth').value;
        changeTeeth(value);
    });

    $('#gearSpinnerAxleRadius').on('change', function (ev) {
        var value = document.getElementById('gearSpinnerAxleRadius').value;
        changeAxleRadius(value);
    });

    $('#gearSpinnerAxleRadius').numeric();




    pi = Math.PI;

    // degrees to radians

    function degrees_to_radians(theta) {
        return theta / 180 * pi;
    }

    // polar to cartesian 

    function polar(r, theta) {
        return [r * Math.sin(theta), r * Math.cos(theta)];
    }

    // point on involute curve

    function q6(b, s, t, d) {
        return polar(d, s * (iang(b, d) + t));
    }

    // unwind this many degrees to go from r1 to r2

    function iang(r1, r2) {
        return Math.sqrt((r2 / r1) * (r2 / r1) - 1) - Math.acos(r1 / r2);
    }

    // radius a fraction f up the curved side of the tooth 

    function q7(f, r, b, r2, t, s) {
        return q6(b, s, t, (1 - f) * Math.max(b, r) + f * r2);
    }

    // rotate an array of 2d points

    function rotate(points_array, angle) {
        var answer = [];
        for (var i = 0; i < points_array.length; i++) {
            x = points_array[i][0];
            y = points_array[i][1];
            xr = x * Math.cos(angle) - y * Math.sin(angle);
            yr = y * Math.cos(angle) + x * Math.sin(angle);
            answer.push([xr, yr]);
        }
        return answer;
    }



    // involute gear maker

    function build_gear(number_of_teeth) {

        p = mm_per_tooth * number_of_teeth / pi / 2; // radius of pitch circle
        c = p + mm_per_tooth / pi - clearance; // radius of outer circle
        b = p * Math.cos(pressure_angle); // radius of base circle
        r = p - (c - p) - clearance; // radius of root circle
        t = mm_per_tooth / 2 - backlash / 2; // tooth thickness at pitch circle
        k = -iang(b, p) - t / 2 / p; // angle where involute meets base circle on side of tooth

        // here is the magic - a set of [x,y] points to create a single gear tooth

        points = [polar(r, -3.142 / number_of_teeth), polar(r, r < b ? k : -pi / number_of_teeth),
            q7(0 / 5, r, b, c, k, 1), q7(1 / 5, r, b, c, k, 1), q7(2 / 5, r, b, c, k, 1), q7(3 / 5, r, b, c, k, 1), q7(4 / 5, r, b, c, k, 1), q7(5 / 5, r, b, c, k, 1),
            q7(5 / 5, r, b, c, k, -1), q7(4 / 5, r, b, c, k, -1), q7(3 / 5, r, b, c, k, -1), q7(2 / 5, r, b, c, k, -1), q7(1 / 5, r, b, c, k, -1), q7(0 / 5, r, b, c, k, -1),
            polar(r, r < b ? -k : pi / number_of_teeth), polar(r, 3.142 / number_of_teeth)
        ];

        var answer = [];

        // create every gear tooth by rotating the first tooth

        for (var i = 0; i < number_of_teeth; i++) answer = answer.concat(rotate(points, -i * 2 * pi / number_of_teeth));
        return answer; // returns an array of [x,y] points

    }


    // gear parameter setup

    number_of_teeth = 14; // number of teeth (typically the only parameter to change)
    // note: rest of parameters must be unchanged if you want gears to fit.
    mm_per_tooth = 9 * 2 * pi; // pixel size of one gear tooth (even though it says millimeters, it's pixels) must be same for two gears to fit each other
    pressure_angle = 20; // in degrees, determines gear shape, range is 10 to 40 degrees, most common is 20 degrees
    clearance = 4; // freedom between two gear centers
    backlash = 4; // freedom between two gear contact points
    axle_radius = 25; // center hole radius in pixels
    pressure_angle = degrees_to_radians(pressure_angle); // convet degrees to radians

    // create svg image in webpage

    svg_height = 300;
    svg_width = 400;

    svg_image = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_image.setAttribute("height", svg_height.toString());
    svg_image.setAttribute("width", svg_width.toString());

    // create polygon using pointlist 

    gear1 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    gear1.setAttribute("stroke", "#000000");
    gear1.setAttribute("stroke-width", "1px");
    gear1.setAttribute("fill", "none");


    // create the axle circle in the center of the gear

    axle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    axle1.setAttribute("r", axle_radius.toString());
    axle1.setAttribute("stroke", "#000000");
    axle1.setAttribute("stroke-width", "1px");
    axle1.setAttribute("fill", "none");


    // create a center point

    axle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    axle2.setAttribute("r", 1);
    axle2.setAttribute("stroke", "#000000");
    axle2.setAttribute("stroke-width", "0.5px");
    axle2.setAttribute("fill", "none");


    // move the gear from [0,0] to [315,315] (center image)

    function translateSVG() {
        gear1.setAttribute("transform", "translate(250,150)");
        axle1.setAttribute("transform", "translate(250,150)");
        axle2.setAttribute("transform", "translate(250,150)");
    }


    function scaleSVG() {

        gear1.setAttribute("transform", "scale(0.4 0.4) translate(630 320)");
        axle1.setAttribute("transform", "scale(0.4 0.4) translate(630 320)");
        axle2.setAttribute("transform", "scale(0.4 0.4) translate(630 320)");
    }

    // add the new graphics to the document structure

    svg_image.appendChild(gear1);
    svg_image.appendChild(axle1);
    svg_image.appendChild(axle2);
    document.svg = $("#gearsSVGcontainer").append(svg_image);


    // create a gear and copy points to the polygon gear1

    document.xy_array = build_gear(number_of_teeth);
    gear1.setAttribute("points", document.xy_array.toString());

    scaleSVG();


    function changeTeeth(value) {
        if (number_of_teeth > 5) number_of_teeth--;
        document.xy_array = build_gear(value);
        gear1.setAttribute("points", document.xy_array.toString());
    }


    function changeAxleRadius(value) {
        value = (value / 0.4) / 2;
        console.log(value);
        axle1.setAttribute("r", value);
    }



    function appendGearToCanvas() {

        var item1 = project.importSVG(gear1, {
            expandShapes: true
        });
        var item2 = project.importSVG(axle1, {
            expandShapes: true
        });
        var item3 = project.importSVG(axle2, {
            expandShapes: true
        });

        var path = new CompoundPath({
            children: [
                item1,
                item2,
                item3
            ],
            fillColor: cutColor,
            strokeWidth: 1,
            strokeColor: "black",
            opacity: defaultToolOpacity
        });

    }



});