//Skipper.js is used to ommit items from being Undoed or Exported. It can also be used to prevent items from getting deleted when File->New Drawing or anything else

//Skipper.js uses event dispatching to listen just before exports/undo's are about to be called in which case it removes the bucket items from the Scenegraph, 
//performs the undo's or export snapshots and then it redraw's the item it removed. This way undo/export snapshot do not contain the elements that must be skipped.

//Limitations: Don't use on items that can be moved around or selected(not sure what happens in that scenario). 
//I am not sure how good it is performance wise. 
//Newer paper.js versions might not work with it
//It should be prone to bugs - Just a hunch
"use strict";

var bucket = {};
bucket.bucketListNoUndo = [];
bucket.bucketListNoExport = [];
bucket.bucketListNoClear = [];
bucket.bucketListNoSaveSource =[];

bucket.addItem = function (item, noUndo, noExport, noClear, noSaveSource) {
        if (noUndo) {
            bucket.bucketListNoUndo = bucket.bucketListNoUndo.filter(function (e) {
                return e.name !== item.name;
            });
            bucket.bucketListNoUndo.push(item);
        }
 

        if (noExport) {
            bucket.bucketListNoExport = bucket.bucketListNoExport.filter(function (e) {
                return e.name !== item.name;
            });
            bucket.bucketListNoExport.push(item);
        }

        if (noClear) {
            bucket.bucketListNoClear = bucket.bucketListNoClear.filter(function (e) {
            return e.name !== item.name;
            });
            bucket.bucketListNoClear.push(item);
        }

           if (noSaveSource) {
            bucket.bucketListNoSaveSource = bucket.bucketListNoSaveSource.filter(function (e) {
            return e.name !== item.name;
            });
            bucket.bucketListNoSaveSource.push(item);
        }
         
    }


bucket.ommitItemUndo = function () {
    if (bucket.bucketListNoUndo.length > 0) {
        for (var i = 0; i < bucket.bucketListNoUndo.length; i++) {
            bucket.bucketListNoUndo[i].remove();
        };
    }
}

bucket.ommitItemExport = function () {
    if (bucket.bucketListNoExport.length > 0) {
        for (var i = 0; i < bucket.bucketListNoExport.length; i++) {
            bucket.bucketListNoExport[i].remove();
        };
    }
}

bucket.ommitItemClear = function () {
    if (bucket.bucketListNoClear.length > 0) {
        for (var i = 0; i < bucket.bucketListNoClear.length; i++) {
            bucket.bucketListNoClear[i].remove();
        };
    }
}

bucket.ommitItemSaveSource = function () {
    if (bucket.bucketListNoSaveSource.length > 0) {
        for (var i = 0; i < bucket.bucketListNoSaveSource.length; i++) {
            bucket.bucketListNoSaveSource[i].remove();
        };
    }
}

bucket.redrawItemUndo = function () {
    if (bucket.bucketListNoUndo.length > 0) {
        for (var i = 0; i < bucket.bucketListNoUndo.length; i++) {
            project.activeLayer.insertChild(i, bucket.bucketListNoUndo[i]);
        };
    }
}

bucket.redrawItemExport = function () {
    if (bucket.bucketListNoExport.length > 0) {
        for (var i = 0; i < bucket.bucketListNoExport.length; i++) {
            project.activeLayer.insertChild(i, bucket.bucketListNoExport[i]);
        };
    }
}

bucket.redrawItemClear = function () {
    if (bucket.bucketListNoClear.length > 0) {
        for (var i = 0; i < bucket.bucketListNoClear.length; i++) {
            project.activeLayer.insertChild(i, bucket.bucketListNoClear[i]);
        };
    }
}

bucket.redrawItemSaveSource = function () {
    if (bucket.bucketListNoSaveSource.length > 0) {
        for (var i = 0; i < bucket.bucketListNoSaveSource.length; i++) {
            project.activeLayer.insertChild(i, bucket.bucketListNoSaveSource[i]);
        };
    }
}


//The event listeners below listen on event dispatchers that are usually placed immediately before exportingSVG or JSON's and immediately after too.


//Place the corresponding event - dispatcher just before taking an Undo snapshot.
document.addEventListener("ommitSnapshot", function (e) {
    bucket.ommitItemUndo();
});

//Immediately after taking the Undo snapshot
document.addEventListener("snapshotEnded", function (e) {
    bucket.redrawItemUndo();
});

//Immediately after restoring an Undo (e.g Undo triggered by user).
document.addEventListener("snapshotRestored", function (e) {
    bucket.redrawItemUndo();
});

//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("ommitExport", function (e) {
    bucket.ommitItemExport();
});

//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("exportEnded", function (e) {
    bucket.redrawItemExport();
});


//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("ommitClear", function (e) {
    bucket.ommitItemClear();
});

//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("clearEnded", function (e) {
    bucket.redrawItemClear();
});



//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("ommitSaveSource", function (e) {
    bucket.ommitItemSaveSource();
});

//Before exportSVG or JSON (only for user triggered exports)
document.addEventListener("saveSourceEnded", function (e) {
    bucket.redrawItemSaveSource();
});