import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PIXEL_ID = "2346615959428743";

export default function MetaPixel() {
  const location = useLocation();

  useEffect(() => {
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;

        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };

        if (!f._fbq) f._fbq = n;

        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];

        t = b.createElement(e);
        t.async = true;
        t.src = v;

        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );
    }

    if (!window.__takeItEasyNewPixelInitialized) {
      window.fbq("init", PIXEL_ID);
      window.__takeItEasyNewPixelInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (!window.fbq) return;

    window.fbq("track", "PageView");
  }, [location.pathname, location.search]);

  return null;
}
