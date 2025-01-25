import {
  useState,
  // useCallback,
  useEffect,
  useRef,
  useCallback
} from 'react';

type Props = {
  disabled?: boolean;
};

export function useTabFocusDetection({ disabled }: Props = { disabled: false }) {
  const [tabFocusStatus, setTabFocusStatus] = useState(true);
  const focusRef = useRef(true);

  /**
   * Tab Un-Focus:
   * When page goes out of focus/visibility set tab unfocus status true
   */
  // const visibilityChange = useCallback(() => {
  //   setTabFocusStatus(!document.hidden);
  // }, []);

  const focusSwitch = useCallback((x: boolean, type: string) => {
    if (type === "blur") {
      if (!x && focusRef.current === false) {
        return;
      } else {
        focusRef.current = x;
        setTabFocusStatus(x);
      }
    }

    if (type === "focus") {
      if (x && focusRef.current === true) {
        return;
      } else {
        focusRef.current = x;
        setTabFocusStatus(x);
      }
    }

    if (type === "visibilityAPI") {
      focusRef.current = x;
      setTabFocusStatus(x);
    }
  }, []);

  useEffect(() => {
    if (disabled) return;

    const handleVisibilityOnBlur = () => {
      if (!focusRef.current) {
        return;
      }
      // const newVisibilityState = !document.hidden;
      // setTabFocusStatus(false);
      // dup.current = false;
      focusSwitch(false, "blur");
      // onVisibilityChange?.(newVisibilityState);
    };

    const handleVisibilityOnFocus = () => {
      if (focusRef.current) {
        return;
      }
      // setTabFocusStatus(true);
      // dup.current = true;
      focusSwitch(true, "focus");
    };

    const handlePageVisibilityChange = () => {
      const isDocumentVisible = !document.hidden;
      const isWindowFocused = document.hasFocus();
      const newVisibilityState = isDocumentVisible && isWindowFocused;

      // setTabFocusStatus(newVisibilityState);
      focusSwitch(newVisibilityState, "visibilityAPI");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(e.metaKey, e.key);
      if (e.key !== "F5") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Handle initial state
    // handleVisibilityOnBlur();

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', handlePageVisibilityChange, false);

    // Listen for focus changes (window/element focus)
    // window.addEventListener('focus', handleVisibilityOnFocus, false);
    // window.addEventListener('blur', handleVisibilityOnBlur, false);

    // Listen for focus changes at document level
    document.addEventListener('focus', handleVisibilityOnFocus, false);
    document.addEventListener('blur', handleVisibilityOnBlur, false);

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      console.log("running cleanup to remove eventlistener");
      document.removeEventListener('visibilitychange', handlePageVisibilityChange);
      window.removeEventListener('focus', handleVisibilityOnFocus);
      window.removeEventListener('blur', handleVisibilityOnBlur);
    };
  }, [disabled]);

  return { tabFocusStatus };
}
