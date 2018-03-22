//
//  NewModelDialog.qml
//  qml/hifi
//
//  Created by Seth Alves on 2017-2-10
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

import QtQuick 2.5
import QtQuick.Controls 1.4
import QtQuick.Dialogs 1.2 as OriginalDialogs

import "../../styles-uit"
import "../../controls-uit"
import "../dialogs"

Rectangle {
    id: newModelDialog
    // width: parent.width
    // height: parent.height
    HifiConstants { id: hifi }
    color: hifi.colors.baseGray;
    signal sendToScript(var message);
    property bool keyboardEnabled: false
    property bool punctuationMode: false
    property bool keyboardRasied: false

    function errorMessageBox(message) {
        return desktop.messageBox({
            icon: hifi.icons.warning,
            defaultButton: OriginalDialogs.StandardButton.Ok,
            title: "Error",
            text: message
        });
    }

    Item {
        id: column1
        anchors.rightMargin: 10
        anchors.leftMargin: 10
        anchors.bottomMargin: 10
        anchors.topMargin: 10
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: keyboard.top

        Text {
            id: text1
            text: qsTr("Model URL")
            color: "#ffffff"
            font.pixelSize: 12
        }

        TextInput {
            id: modelURL
            height: 20
            text: qsTr("")
            color: "white"
            anchors.top: text1.bottom
            anchors.topMargin: 5
            anchors.left: parent.left
            anchors.leftMargin: 0
            anchors.right: parent.right
            anchors.rightMargin: 0
            font.pixelSize: 12

            onAccepted: {
                newModelDialog.keyboardEnabled = false;
            }

            onTextChanged : {
                 button1.enabled = true;
            }
            
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    newModelDialog.keyboardEnabled = HMD.active
                    parent.focus = true;
                    parent.forceActiveFocus();
                    modelURL.cursorPosition = modelURL.positionAt(mouseX, mouseY, TextInput.CursorBetweenCharaters);
                }
            }
        }

        Rectangle {
            id: textInputBox
            color: "white"
            anchors.fill: modelURL
            opacity: 0.1
        }

        Row {
            id: row1
            height: 400
            spacing: 30
            anchors.top: modelURL.top
            anchors.topMargin: 25
            anchors.left: parent.left
            anchors.leftMargin: 0
            anchors.right: parent.right
            anchors.rightMargin: 0

            Column {
                id: column2
                width: 200
                height: 400
                spacing: 10

                CheckBox {
                    id: dynamic
                    text: qsTr("Dynamic")
                }

                Row {
                    id: row2
                    width: 200
                    height: 400
                    spacing: 20

                    Text {
                        id: text2
                        width: 160
                        x: dynamic.width / 2
                        color: "#ffffff"
                        text: qsTr("Models with automatic collisions set to 'Exact' cannot be dynamic, and should not be used as floors")
                        wrapMode: Text.WordWrap
                        font.pixelSize: 12
                    }
                }
            }

            Column {
                id: column3
                height: 400
                spacing: 10

                Text {
                    id: text3
                    text: qsTr("Automatic Collisions")
                    color: "#ffffff"
                    font.pixelSize: 12
                }

                ComboBox {
                    id: collisionType

                    property int priorIndex: 0
                    property string staticMeshCollisionText: "Exact - All polygons"
                    property var collisionArray: ["No Collision",
                                                  "Basic - Whole model",
                                                  "Good - Sub-meshes",
                                                  staticMeshCollisionText, 
                                                  "Box", 
                                                  "Sphere"]

                    width: 200
                    z: 100
                    transformOrigin: Item.Center
                    model: collisionArray

                    onCurrentIndexChanged: {
                        if (collisionArray[currentIndex] === staticMeshCollisionText) {
                            
                            if (dynamic.checked) {
                                currentIndex = priorIndex;

                                errorMessageBox("Models with Automatic Collisions set to \"" 
                                                    + staticMeshCollisionText + "\" cannot be dynamic.");
                                //--EARLY EXIT--( Can't have a static mesh model that's dynamic )
                                return;
                            }

                            dynamic.enabled = false;
                        } else {
                            dynamic.enabled = true;
                        }

                        priorIndex = currentIndex;
                    }
                }

                Row {
                    id: row3
                    width: 200
                    height: 400
                    spacing: 5

                    anchors.horizontalCenter: column3.horizontalCenter
                    anchors.horizontalCenterOffset: -20

                    Button {
                        id: button1
                        text: qsTr("Add")
                        z: -1
                        enabled: false
                        onClicked: {
                            newModelDialog.sendToScript({
                                method: "newModelDialogAdd",
                                params: {
                                    textInput: modelURL.text,
                                    checkBox: dynamic.checked,
                                    comboBox: collisionType.currentIndex
                                }
                            });
                        }
                    }

                    Button {
                        id: button2
                        z: -1
                        text: qsTr("Cancel")
                        onClicked: {
                            newModelDialog.sendToScript({method: "newModelDialogCancel"})
                        }
                    }
                }
            }
        }
    }

    Keyboard {
        id: keyboard
        raised: parent.keyboardEnabled
        numeric: parent.punctuationMode
        anchors {
            bottom: parent.bottom
            left: parent.left
            right: parent.right
        }
    }
}
