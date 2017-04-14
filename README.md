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

### Main Menu’s Name
On macOS the label of the application menu’s first item is always your app’s name, no matter what label you set. To change it, modify your app bundle’s Info.plist file.

* https://electron.atom.io/docs/api/menu/

Notes
-----
We currently are just recording videos and replaying them based on the interval. This isn't the best way, but I was trying MediaStream and other Chrome APIs and they just aren't that reliable?

TODO
----
* Download video
* Pause, rewind
* Fade - sorta done
* Add service worker
