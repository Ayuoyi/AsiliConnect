import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase: any;
  }
}

export function ChatbaseWidget() {
  useEffect(() => {
    // Initialize chatbase
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target: any, prop: string) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    // Load the script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "GN63DgYOiPn498bpjHnYp";
    script.setAttribute("domain", "www.chatbase.co");
    
    document.body.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.getElementById("GN63DgYOiPn498bpjHnYp");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null;
}