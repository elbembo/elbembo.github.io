/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/




const fragment = document.createDocumentFragment();
let cMTarget;//contextMenu right click target section 
let sections;
let timerMenu;
let lastSectionNum;
let sectionTemp;// some content for sections
/**
 * End Global Variables
 * Start Helper Functions
 * 
*/


let autoHide = () => {
    clearTimeout(timerMenu);

    const header = document.querySelector('.page__header');

    header.style.top = `0`;
    timerMenu = setTimeout(() => {
        //i had to change it like that to make the nave hide smothly when nav extend in mobile or pc

        header.style.top = `-${header.offsetHeight}px`;
    }, 4000)
}
let toTop = (con, ele) => {
    const toTopBtn = document.querySelector('#nav-top');
    switch (con) {
        case "show":
            toTopBtn.classList.remove("hide");
            break;
        case "hide":
            toTopBtn.classList.add("hide");
            break;
        case true:
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            break;

    }

}
/**
 * 
 * @param {true/false} show 
 * @param {event} e 
 */
let contextMenu = (show, e = null) => {
    let contextMenuUI = document.querySelector("#contextMenu");
    if (show) {
        contextMenuUI.style.display = "block";
        contextMenuUI.style.top = (window.scrollY + e.clientY) + "px";
        contextMenuUI.style.left = (window.scrollX + e.clientX) + "px";
    } else {
        contextMenuUI.style.display = "none";
    }

}
/**
 * i don't know if there something better to catch 
 * if element member of section node tree 
 * after browser crash many time i get that function 
 * i hope to discuss that with some one
 * @param {element right clicked} target 
 * @returns true / false
 */
function isTargetInSection(target) {
    var nodeN = target.nodeName;
    //run until reach body node to check all element tree
    while (target.nodeName != "BODY") {
        target = target.parentNode;
        nodeN = target.nodeName;
        if (nodeN == "SECTION") {
            cMTarget = target
            //console.log(nodeN);
            return true;
        }
    }
    return false;
}
/**
 * reference 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
let getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
/** 
 * Add new section to page and get a randoum content from other section 
*/
let addSection = () => {
    const main = document.querySelector('main');
    sections = document.querySelectorAll('section');

    // get a random index from sections list to clone
    if (sections.length !== 0) {
        let randNum = getRandomInt(0, sections.length);

        sectionTemp = sections[randNum].innerHTML
    }
    let newSection = document.createElement('section');
    newSection.setAttribute('id', `section${lastSectionNum + 1}`);
    newSection.dataset.nav = `Section ${lastSectionNum + 1}`;
    newSection.innerHTML = sectionTemp;
    newSection.querySelector('div').querySelector('h2').innerHTML = `Section ${lastSectionNum + 1}`;
    lastSectionNum += 1;
    main.appendChild(newSection);
    navBuilder();

}
/**
 * 
 * @param {*} 
 */
let deleteSection = () => {

    if (cMTarget != null) {
        cMTarget.style.opacity = 0;
        setTimeout(() => {
            // cMTarget.remove(); didnt work so workaround
            cMTarget.parentNode.removeChild(cMTarget);
            navBuilder();
        }, 500)
        /* cMTarget.addEventListener('animationend', () => {
            cMTarget.parentNode.removeChild(cMTarget);
        });
        */
    }
    contextMenu(false);
}
/** 
 * contextmenu
 */
let rightClick = (e) => {

    if (isTargetInSection(e.target)) {
        e.preventDefault()
        contextMenu(true, e);

    } else {
        contextMenu(false);
    }
}
/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
let navBuilder = () => {
    sections = document.querySelectorAll('section');
    const nav = document.querySelector('#navbar__list');

    /*
    i have to add this line so when i refresh the menu 
    on console by navBuilder() don't get any duplication .
    and why i need to refresh menu , that for when add a section to page
    programmably it has to be refreshed
    */
    nav.innerHTML = '';

    for (let section of sections) {
        let navItem = document.createElement('li');
        navItem.innerHTML = `<li><a class="menu__link" href="#${section.getAttribute('id')}">${section.dataset.nav}</a></li>`
        fragment.appendChild(navItem);
    }
    /** in add section function we generate a new section with id based on prev section 
     * here we get a nuber we we generate after sections
     */
    if (lastSectionNum == null)
        lastSectionNum = sections.length;
    /** start content to use if user delete all section and try to add new one */
    if (sectionTemp == null)
        sectionTemp = sections[0].innerHTML;
    nav.appendChild(fragment);
    autoHide();
}

// Add class 'active' to section when near top of viewport
function scrolling(e) {
    sections = document.querySelectorAll('section');
    //reassign the sections variable for any section added programmably ;)
    //@reference https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
    sections.forEach(function (section, index) {
        let i = index + 1;
        // here we get next section offset and in last section we get the document height so 
        // section will be still active until next section or end of the doc
        //https://developer.mozilla.org/en-US/docs/Web/API/Document/height ;
        let nextSection = (index < (sections.length - 1)) ? sections[i].offsetTop : document.documentElement.scrollHeight;
        if (window.scrollY > (section.offsetTop - 100) && window.scrollY < (nextSection - 100)) {
            section.classList.add('active');
            document.querySelector(`.menu__link[href='#${section.getAttribute('id')}']`).classList.add('active');
        } else {
            section.classList.remove('active');
            document.querySelector(`.menu__link[href='#${section.getAttribute('id')}']`).classList.remove('active');
        };
    })
    /**show and hide the top button  */
    let toTopSwitsh = (window.scrollY > 500) ? toTop("show") : toTop("hide");

    autoHide();
    /** add new section when rich the bottom of the page */
    //console.log(window.innerHeight , window.scrollY,document.documentElement.scrollHeight);
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) addSection();

}

// Scroll to anchor ID using scrollTO event

let clickEvent = (e) => {
    e.preventDefault();
    //close contextMenu with normal click
    contextMenu(false);
    if (e.target.nodeName == "A" && e.target.classList.contains('menu__link')) {
        //event.preventdefault();
        let targetPos = document.querySelector(`${e.target.getAttribute("href")}`).offsetTop;
        /*
            @reference https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
        */
        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    }
    // collaps section when click on h2 element 
    if (e.target.nodeName == "H2") {
        e.target.parentElement.parentElement.classList.toggle('collaps');
    }

}
/**
 * show the nav bar if hide when mouse pointer near top of
 *  the page and user didn't make any scrolling
 */
let mouseMove = (e) => {
    if (e.clientY < 100) autoHide();

}
/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu
document.addEventListener("DOMContentLoaded", navBuilder);
// Scroll to section on link click
document.addEventListener("click", clickEvent);
// Set sections as active
document.addEventListener("scroll", scrolling);
/**
 * right click to remove section :) 
 * javascript is so fun . i have php background
*/
document.addEventListener('contextmenu', rightClick);
/** 
 * detect if mouse pointer close to the viewport to sho nav if hidden
 */
document.addEventListener("mousemove", mouseMove);
/**
 * switch between dark/light mode depend on browser theme
 */
document.addEventListener("DOMContentLoaded", () => {
    let theme = window.matchMedia('(prefers-color-scheme: light)');
    theme.addEventListener('change', ()=>{
        if (theme.matches) {
            document.body.classList.add('light')
        }else{
            document.body.classList.remove('light')
        }
    });

})