//
//  Created by Ryan Huffman on 1/10/2017
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

/* globals utils */

(function () {
    Script.include('utils.js');

    function ShortbowClient() {
    }
    ShortbowClient.prototype = {
        preload: function (entityID) {
            this.entityID = entityID;
            this.commChannel = "shortbow-" + Entities.getEntityProperties(entityID);
        },
        signalAC: function () {
            Messages.sendMessage(this.commChannel, JSON.stringify({
                type: 'root-moved'
            }));
        },
    };

    ShortbowClient.prototype.stopFarTrigger = ShortbowClient.prototype.signalAC;
    ShortbowClient.prototype.clickReleaseOnEntity = ShortbowClient.prototype.signalAC;

    return new ShortbowClient();
});
