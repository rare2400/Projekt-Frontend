"use strict";


//function for opening/closing nav-menu
//elements
const openBtn = document.getElementById("open-menu");
const closeBtn = document.getElementById("close-menu");


//eventlisteners
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

/**
 * display/hide the navigationmenu
 * @function toggleMenu
 * @returns {void}
 */
function toggleMenu() {
   const navMenuEl = document.getElementById("nav-menu");

   let style = window.getComputedStyle(navMenuEl)

    //check if the menu is open or closed
   if (style.display === "none") {
       navMenuEl.style.display = "block";
   } else {
       navMenuEl.style.display = "none";
   }
}