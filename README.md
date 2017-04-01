Video Delay App
===============

Basically using the chrome web apis (webrtc) to capture video from your webcam and delay it

```
App -> Devices
    -> VideoRecorder -> VideoDelay
```

We also added electron support!

Installation
------------
```bash
npm i
# Dev mode
npm start
# Dev mode in electron
npm run start:electron
# Build for production (prep for electron)
npm run build
# Build electron (currently osx + win)
npm run pack
```

Notes
-----
We currently are just recording videos and replaying them based on the interval. This isn't the best way, but I was trying MediaStream and other Chrome APIs and they just aren't that reliable?
