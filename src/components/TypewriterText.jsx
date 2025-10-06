import { useEffect, useState } from "react";

export function TypewriterText({ text, speed = 40 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplayed("");

    let i = 0;
    let cancelled = false;

    const typeNext = () => {
      if (cancelled) return;
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i < text.length) {
        setTimeout(typeNext, speed + Math.random() * 20 - 10); // slight natural randomness
      }
    };

    typeNext();

    return () => {
      cancelled = true;
    };
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className="animate-blink">█</span>
    </span>
  );
}

