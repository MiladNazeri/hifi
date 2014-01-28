//
//  Node.h
//  hifi
//
//  Created by Stephen Birarda on 2/15/13.
//  Copyright (c) 2013 High Fidelity, Inc. All rights reserved.
//

#ifndef __hifi__Node__
#define __hifi__Node__

#include <ostream>
#include <stdint.h>

#ifdef _WIN32
#include "Syssocket.h"
#else
#include <sys/socket.h>
#endif

#include <QtCore/QDebug>
#include <QtCore/QMutex>
#include <QtCore/QUuid>
#include <QMutex>

#include "HifiSockAddr.h"
#include "NodeData.h"
#include "SimpleMovingAverage.h"

typedef quint8 NODE_TYPE;
const NODE_TYPE NODE_TYPE_DOMAIN = 'D';
const NODE_TYPE NODE_TYPE_VOXEL_SERVER = 'V';
const NODE_TYPE NODE_TYPE_PARTICLE_SERVER = 'P';
const NODE_TYPE NODE_TYPE_METAVOXEL_SERVER = 'm';
const NODE_TYPE NODE_TYPE_ENVIRONMENT_SERVER = 'E';
const NODE_TYPE NODE_TYPE_AGENT = 'I';
const NODE_TYPE NODE_TYPE_AUDIO_MIXER = 'M';
const NODE_TYPE NODE_TYPE_AVATAR_MIXER = 'W';
const NODE_TYPE NODE_TYPE_ANIMATION_SERVER = 'a';
const NODE_TYPE NODE_TYPE_UNASSIGNED = 1;

class Node : public QObject {
    Q_OBJECT
public:
    Node(const QUuid& uuid, char type, const HifiSockAddr& publicSocket, const HifiSockAddr& localSocket);
    ~Node();

    bool operator==(const Node& otherNode) const { return _uuid == otherNode._uuid; }
    bool operator!=(const Node& otherNode) const { return !(*this == otherNode); }

    char getType() const { return _type; }
    void setType(char type) { _type = type; }
    const char* getTypeName() const;

    const QUuid& getUUID() const { return _uuid; }
    void setUUID(const QUuid& uuid) { _uuid = uuid; }

    quint64 getWakeMicrostamp() const { return _wakeMicrostamp; }
    void setWakeMicrostamp(quint64 wakeMicrostamp) { _wakeMicrostamp = wakeMicrostamp; }

    quint64 getLastHeardMicrostamp() const { return _lastHeardMicrostamp; }
    void setLastHeardMicrostamp(quint64 lastHeardMicrostamp) { _lastHeardMicrostamp = lastHeardMicrostamp; }

    const HifiSockAddr& getPublicSocket() const { return _publicSocket; }
    void setPublicSocket(const HifiSockAddr& publicSocket);
    const HifiSockAddr& getLocalSocket() const { return _localSocket; }
    void setLocalSocket(const HifiSockAddr& localSocket);

    const HifiSockAddr* getActiveSocket() const { return _activeSocket; }

    void activatePublicSocket();
    void activateLocalSocket();

    NodeData* getLinkedData() const { return _linkedData; }
    void setLinkedData(NodeData* linkedData) { _linkedData = linkedData; }

    bool isAlive() const { return _isAlive; }
    void setAlive(bool isAlive) { _isAlive = isAlive; }

    void  recordBytesReceived(int bytesReceived);
    float getAverageKilobitsPerSecond();
    float getAveragePacketsPerSecond();

    int getPingMs() const { return _pingMs; }
    void setPingMs(int pingMs) { _pingMs = pingMs; }

    int getClockSkewUsec() const { return _clockSkewUsec; }
    void setClockSkewUsec(int clockSkew) { _clockSkewUsec = clockSkew; }
    QMutex& getMutex() { return _mutex; }
    
    friend QDataStream& operator<<(QDataStream& out, const Node& node);
    friend QDataStream& operator>>(QDataStream& in, Node& node);

private:
    // privatize copy and assignment operator to disallow Node copying
    Node(const Node &otherNode);
    Node& operator=(Node otherNode);

    NODE_TYPE _type;
    QUuid _uuid;
    quint64 _wakeMicrostamp;
    quint64 _lastHeardMicrostamp;
    HifiSockAddr _publicSocket;
    HifiSockAddr _localSocket;
    HifiSockAddr* _activeSocket;
    SimpleMovingAverage* _bytesReceivedMovingAverage;
    NodeData* _linkedData;
    bool _isAlive;
    int _pingMs;
    int _clockSkewUsec;
    QMutex _mutex;
};

QDebug operator<<(QDebug debug, const Node &message);

#endif /* defined(__hifi__Node__) */
