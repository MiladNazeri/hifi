#include "ScreenshareScriptingInterface.h"
#include <iostream>
#include <QProcess>
using namespace std;

ScreenshareScriptingInterface::ScreenshareScriptingInterface(QObject* parent) {};

void ScreenshareScriptingInterface::startScreenshare(){
	qDebug() << "\n\n TESTING SCREENSHARE OPEN \n\n";
    cout << "TRYING TO SEE IF THERE IS A DIFFERENCE WITH COUT";
    // QProcess *process = new QProcess(this);
    // process->start(SCREENSHARE_APPLICATION);
}
