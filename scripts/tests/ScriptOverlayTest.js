var SERVER_TO_CHANGE = "hifi://www/-3.41855,-9.83895,16.3447/0,-0.757411,0,0.652938";

var overlayIDs = [];
var entityProps = {
    type: "Box",
    position: MyAvatar.position,
    name: "testBox Delete"
};
var mainEnt, overlayEnt;
console.log("## \n\n ADDING MAIN ENT");
mainEnt = Entities.addEntity(entityProps);
var SITTABLE_IMAGE_URL_DESKTOP = Script.resolvePath("./clickToSit.png");
var TIMEOUT_MS = 2000;

function addOverlayEnt() {
    console.log("## \n\n ADDING OVERLAY ENT");
    overlayEnt = Entities.addEntity({
        type: "Image",
        grab: {
            grabbable: false
        },
        dynamic: false,
        parentID: mainEnt,
        imageURL: SITTABLE_IMAGE_URL_DESKTOP,
        visible: true,
        emissive: true
    },
    "local"
    );

    Script.setTimeout(function() {
        console.log("## \n\n DELETING MAIN ENT");
        Entities.deleteEntity(mainEnt);
    }, TIMEOUT_MS);
}

Script.setTimeout(addOverlayEnt, TIMEOUT_MS);

Script.scriptEnding.connect(function() {
    Entities.deleteEntity(mainEnt);
});