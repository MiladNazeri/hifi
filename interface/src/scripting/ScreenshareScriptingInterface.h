#ifndef hifi_ScreenshareScriptingInterface_h
#define hifi_ScreenshareScriptingInterface_h

#include <QObject>
#include <DependencyManager.h>

class ScreenshareScriptingInterface : public QObject, public Dependency {
    Q_OBJECT
public:
	ScreenshareScriptingInterface();
    const QString SCREENSHARE_APPLICATION{ "file:///C:/hifi/hifi/screenshare/screenshare-win32-x64/screenshare.exe" };

	Q_INVOKABLE void startScreenshare(QString displayName, QString userName, QString token, QString sessionID, QString apiKey);
};

#endif // hifi_ScreenshareScriptingInterface_h