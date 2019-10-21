#ifndef hifi_ScreenshareScriptingInterface_h
#define hifi_ScreenshareScriptingInterface_h

#include <QObject>
#include <DependencyManager.h>

class ScreenshareScriptingInterface : public QObject, public Dependency{
	Q_OBJECT
    SINGLETON_DEPENDENCY
public:
	ScreenshareScriptingInterface(QObject* parent = NULL);
    const QString SCREENSHARE_APPLICATION{ "" };

	Q_INVOKABLE void startScreenshare();
};

#endif // hifi_ScreenshareScriptingInterface_h