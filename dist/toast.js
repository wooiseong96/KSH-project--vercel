/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var toastContent = document.querySelector('.toast');
var toast = new bootstrap.Toast(toastContent);
function toastMessage(responseText, code) {
  var toastStyle = document.querySelector('.toast-body');
  if (code === 0) {
    toastStyle.classList.remove('bi-x-square-fill');
    toastStyle.classList.add('bi-check-square-fill');
    toastStyle.style.color = 'green';
  } else {
    toastStyle.classList.remove('bi-check-square-fill');
    toastStyle.classList.add('bi-x-square-fill');
    toastStyle.style.color = 'red';
  }
  toastStyle.innerHTML = '&ensp;' + responseText;
  toast.show();
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (toastMessage)));
/******/ })()
;