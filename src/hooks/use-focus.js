import { useEffect, useRef, useState } from "react";

export default function useFocus() {
  const [isFocusing, setIsFocusing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => {
      setIsFocusing(true);
    };
    const handleBlur = () => {
      setIsFocusing(false);
    };

    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    return () => {
      if (element) {
        element.removeEventListener("focus", handleFocus);
        element.removeEventListener("blur", handleBlur);
      }
    };
  }, [ref]);

  return { isFocusing, ref };
}
