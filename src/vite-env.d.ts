/// <reference types="vite/client" />

// global.d.ts or fullscreen.d.ts
interface HTMLElement {
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
    webkitExitFullscreen?: () => void;
    msExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
  }
  
