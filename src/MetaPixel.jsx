// src/MetaPixel.jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PIXEL_ID = "2346615959428743";

export default function MetaPixel() {
  const location = useLocation();
  const lastPage = useRef("");

  // 1. Script load + init (একবারই)
  useEffect(() => {
    if (!PIXEL_ID || typeof window === "undefined") return;

    // পিক্সেল স্ক্রিপ্ট লোড করা
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

    // পিক্সেল ইনিশিয়ালাইজ করা (টেস্ট কোড সহ)
    if (!window.__takeItEasyNewPixelInitialized) {
      if (window.fbq) {
        // ✅ এখানে TEST24827 যোগ করা হয়েছে
        window.fbq("init", PIXEL_ID, { test_event_code: "TEST24827" });
      }
      window.__takeItEasyNewPixelInitialized = true;
    }
  }, []);

  // 2. PageView — শুধু pathname change-এ (search param নয়)
  useEffect(() => {
    // পিক্সেল রেডি হওয়ার আগেই যেন ট্র্যাকিং মিস না হয়, তাই চেক দেওয়া হলো
    if (!window.__takeItEasyNewPixelInitialized) return;

    const currentPage = location.pathname;
    if (lastPage.current === currentPage) return;
    lastPage.current = currentPage;

    // রেন্ডার সেটেল হওয়ার পর PageView ট্র্যাক করা
    const id = setTimeout(() => {
      if (window.fbq) {
        try {
          window.fbq("track", "PageView");
        } catch (e) {
          console.error("Meta Pixel PageView Error:", e);
        }
      }
    }, 0);

    return () => clearTimeout(id);
  }, [location.pathname]);

  return null;
}
