import React, { useEffect } from 'react';

export default function useKeypress(key, action) {
  useEffect(() => {
    function onKeyup(e) {
      if (key === e.key) action();
    }
    function onKeydown(e) {
      if (key === e.key) window.addEventListener('keyup', onKeyup);
      return () => window.removeEventListener('keyup', onKeyup);
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
}
