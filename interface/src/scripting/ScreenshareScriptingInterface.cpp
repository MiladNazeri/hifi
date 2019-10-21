#include "ScreenshareScriptingInterface.h"
#include <iostream>

ScreenshareScriptingInterface::ScreenshareScriptingInterface(QObject* parent){};

void ScreenshareScriptingInterface::startScreenshare() {
    qDebug() << "\n\n TESTING SCREENSHARE OPEN \n\n";
    // QProcess *process = new QProcess(this);
    // process->start(SCREENSHARE_APPLICATION);
}
