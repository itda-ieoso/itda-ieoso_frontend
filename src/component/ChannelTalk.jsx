import { useEffect } from "react";

export default function ChannelTalkLoader() {
  useEffect(() => {
    if (window.ChannelIO) return;

    (function () {
      const w = window;
      if (w.ChannelIO) return;
      const ch = function () {
        ch.c(arguments);
      };
      ch.q = [];
      ch.c = function (args) {
        ch.q.push(args);
      };
      w.ChannelIO = ch;

      function l() {
        if (w.ChannelIOInitialized) return;
        w.ChannelIOInitialized = true;
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        const x = document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      }

      if (document.readyState === "complete") {
        l();
      } else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    })();

    window.ChannelIO("boot", {
      pluginKey: "8f99e447-b9a9-4568-9751-67b6d7688c0c",
    });
  }, []);

  return null;
}
