// @ts-nocheck
// ts 忽略本页面的错误提示

// 进入全屏模式
function enterFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element?.mozRequestFullScreen) {
    /* Firefox */
    return element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    return element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    return element.msRequestFullscreen();
  } else {
    return Promise.reject('Fullscreen API is not supported.');
  }
}

// 退出全屏模式
function exitFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    return document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    return document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    return document.msExitFullscreen();
  } else {
    return Promise.reject('Fullscreen API is not supported.');
  }
}

// 检查当前是否处于全屏模式
function isFullscreen() {
  return (
    !!document.fullscreenElement ||
    !!document.mozFullScreenElement ||
    !!document.webkitFullscreenElement ||
    !!document.msFullscreenElement
  );
}

// 切换全屏模式
function toggleFullscreen() {
  if (isFullscreen()) {
    return exitFullscreen();
  } else {
    return enterFullscreen();
  }
}

export const FullscreenUtils = {
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  toggleFullscreen,
};
