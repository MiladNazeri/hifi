"use strict";
//
//  initAudioGainLevels.js
//
//  Authors: Milad Nazeri
//  Created: 2019-06-31
//  Copyright 2019 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

module.exports = function() {
    // START AUDIO GAIN INIT
    Audio.avatarGain = Settings.getValue("audioSettings/peopleVolume", Audio.avatarGain);
    Audio.serverInjectorGain = Settings.getValue("audioSettings/environmentVolume", Audio.serverInjectorGain);
    Audio.localInjectorGain = Settings.getValue("audioSettings/environmentVolume", Audio.localInjectorGain);
    Audio.systemInjectorGain = Settings.getValue("audioSettings/uiFXVolume", Audio.systemInjectorGain);
    // END AUDIO GAIN INIT
};
