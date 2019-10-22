#include "ScreenshareScriptingInterface.h"
#include <QProcess>
#include <QThread>
#include <QDesktopServices>
#include <QUrl>

ScreenshareScriptingInterface::ScreenshareScriptingInterface(){};

void ScreenshareScriptingInterface::startScreenshare(QString displayName, QString userName, QString token, QString sessionID, Qstring apiKey) {
    if (QThread::currentThread() != thread()) {
        // I added this because it said I can't start a process on a different thread 
        QMetaObject::invokeMethod(this, "startScreenshare");
        return;
    }

    qDebug() << "\n\n TESTING SCREENSHARE OPEN \n\n" + SCREENSHARE_APPLICATION;
    QStringList arguments;
    arguments << "--userName=" + userName;
    arguments << "--displayName=" + displayName; 
    arguments << "--token=" + token; 
    arguments << "--apiKey=" + apiKey; 
    arguments << "--sessionID=" + sessionID; 

    /*
    // attempt 1
    QProcess* process = new QProcess(this);
    // I tried both of these
    process->start("C:\hifi\hifi\screenshare\screenshare-win32-x64\screenshare.exe", arguments);
    process->start(SCREENSHARE_APPLICATION, arguments);

    // None of these print either
    connect(process, &QProcess::errorOccurred,
            [=](QProcess::ProcessError error) { qDebug() << "error enum val = " << error << endl; });
    connect(process, &QProcess::started, [=]() { qDebug() << "PROCESS STARTED"; });
    connect(process, &QProcess::stateChanged,
            [=](QProcess::ProcessState newState) { qDebug() << "process state" << newState; });
    */


    /*
    // attempt 2
    // Another method I saw, but also doesn't do anything
    QProcess::startDetached(SCREENSHARE_APPLICATION, arguments);
    */
    

    // attempt 3, this one worked well, but with a popup asking if I am sure I want to open this url
    // I don't think we can pass arguments in this way either so I'd say a no go.  
    // QDesktopServices::openUrl(QUrl(SCREENSHARE_APPLICATION));
    
    // attempt 4
};
