var CHOOSE_INTERVAL = 600; // pictures chosen every 10 minutes

document.addEventListener('DOMContentLoaded', function() {
    getAllOptions(tabtrekker);
});


function tabtrekker(data) {
    var now = Date.now();
    now = (now - now % 1000) / 1000;
    var lastMidnight = now - now % 86400;

    if(data["images_lastupdated"] === undefined || data["images_lastupdated"] < lastMidnight) {
        // TODO Get new pictures
        var nextImageSet = (data["images_currentset"] + 1) % ImageSets.length;
        // console.log(nextImageSet);
        $("#image_spinner").css("opacity", 1);
        getNextImageSet(nextImageSet);
        $("#location_name").text(ImageSets[nextImageSet].name);
        var setLength = ImageSets[nextImageSet].images.length;
        saveAllOptions(["images_lastupdated", "images_lastchosen", "images_current", "images_num_images", "images_currentset"], [now, now, 0, setLength, nextImageSet]);
    }
    else {
        loadStoredImages().then(function(result) {
            var currImgNum = data["images_current"];
            if(now - data["images_lastchosen"] > CHOOSE_INTERVAL) { // if need to choose new picture
                currImgNum = (currImgNum + 1) % data["images_num_images"];
                saveAllOptions(["images_lastchosen", "images_current"], [now, currImgNum]);
            }
            // console.log(currImgNum);
            // saveAllOptions(["images_lastchosen", "images_current","images_lastupdated"], [now, 0,0]);
            var imageName = "url(\"" + result[currImgNum].blobUrl + "\")";//"url(/data/images/" + currImgNum + ".jpg)";
            // console.log(imageName);
            $("#location_name").text(ImageSets[data["images_currentset"]].name);
            $("#image_link").attr("href", ImageSets[data["images_currentset"]].images[currImgNum].infoUrl);
            $("#background_image").css("backgroundImage", imageName);
            $("#background_image").css("opacity", 1);
            // console.log(now);


        });
    }
    initTime();
}


function initTime() {
    changeTime();

    // var now = new Date();
    // var millis = now.getMilliseconds() + now.getSeconds() * 1000;
    // setTimeout(changeTime, 60000 - millis); // updates time for the first minute
    // setTimeout(function() {setInterval(changeTime, 60000);}, 60000 - millis); // updates time for every subsequent minute
    setInterval(changeTime, 1000);
}


function changeTime() {
    var now = new Date();
    var hours = now.getHours() % 12;
    if(hours === 0) hours = 12;
    var mins = now.getMinutes();

    var timeString = "" + hours + ":" + ("0" + mins).slice(-2);
    var amOrPmString = (now.getHours() / 12 >= 1) ? "PM" : "AM";
    if($("#time").text() !== timeString) $("#time").text(timeString);
    if($("#am_or_pm").text() !== amOrPmString) $("#am_or_pm").text(amOrPmString);
}


function getNextImageSet(setNum) {
    for(var i = 0; i < ImageSets[setNum].images.length; i++) {
        (function(i) {
            var url = ImageSets[setNum].images[i].imageUrl;
            fetch(url).then(function(response) {
                return response.blob();
            }).then(function(blob) {
                saveCollectedBlobs("tabtrekker_images", [{
                    blob: blob,
                    uuid: url.match(/([^\/]*)\/*$/)[1] // gets the image name
                }]);
                if(i === 0) { // display first image
                    $("#image_spinner").css("opacity", 0);
                    $("#background_image").css("backgroundImage", "url(\"" + URL.createObjectURL(blob) + "\")");
                    $("#background_image").css("opacity", 1);
                }
            });
        })(i);
    }
}
