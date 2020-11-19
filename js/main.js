gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

var bgVideo = document.querySelector(".background__video-container__video");
var bgVideoSegments = [0, 2, 3, 6, 8, 10, 13, 15, 17, 20];


var intro = "ÆOS300 Uncompromised Ultra Efficient Turbine Power, the small engine that can";

var dots = document.querySelector(".navigation__container__dots");
var viewport = document.querySelector(".viewport");
var scrollToLabels = document.querySelectorAll(".scrollTo_label");
var toolTips = document.querySelectorAll(".navigation__container__toolTips__toolTip");
var sections = gsap.utils.toArray(".content__section");
var content = document.querySelector(".content");
var toolTipAnims = [];
var dotAnims = [];

// var headerLowerDropDownSelect = document.querySelector(".header__lower__navigation");
var header = document.querySelector(".header");
var headerUpper = document.querySelector(".header__upper");
// var headerUpperBackground = document.querySelector(".header__upper-background");
var headerLower = document.querySelector(".header__lower");
// var headerLowerBackground = document.querySelector(".header__lower-background");
var headerLowerLogo = document.querySelector(".header__lower__logo");
var headerLowerBurger = document.querySelector(".header__lower__burger");
var headerLowerBurgerIcon = document.querySelector(".header__lower__burger > .icon");
var headerLowerSeparatorOne = document.querySelector(".header__lower__separator.one");
var headerLowerSeparatorTwo = document.querySelector(".header__lower__separator.two");
var headerLowerNavigation = document.querySelector(".header__lower__navigation");
var headerLowerNavigationTop = document.querySelector(".header__lower__navigation__top");
var headerLowerNavigationBottom = document.querySelector(".header__lower__navigation__bottom");
var headerLowerNavigationBottomText = document.querySelector(".header__lower__navigation__bottom > a");
var headerLowerNavigationWrapper = document.querySelector(".header__lower__navigation .navigation-wrapper");
var headerLowerList = document.querySelector(".header__lower__navigation .list");
var headerLowerListItems = document.querySelectorAll(".header__lower__navigation .list > .item");
var headerLowerListItemText = document.querySelectorAll(".header__lower__navigation .list > .item > a");
var headerLowerItemsWrapper = document.querySelector(".header__lower__navigation .items-wrapper");


var tl = new gsap.timeline({
		paused: true}),
	tlHomeMobile = new gsap.timeline({
		paused: true});

var tmp = false;
headerLowerLogo.addEventListener("click", clickHeaderLowerLogo);
headerLowerNavigationWrapper.addEventListener("click", clickHeaderLowerNavigationWrapper);
headerLowerBurger.addEventListener("click", clickHeaderLowerBurger)

document.addEventListener("touchstart", swipeStart);
document.addEventListener("touchmove", swipeCurrent);
var swipeStartPos = {x: 0, y: 0};
var swipeCurrentPos = {x: 0, y: 0};
var triggered = false;

document.addEventListener("click", closeMenu);
var compactMenu = true;

window.addEventListener("resize", onResize);
var resizeTimer;

var headerLowerHeightMobile = 60;
var headerLowerNavDropdownBottomPaddingMobile = 75;
var headerLowerNavDropdownMenuHeight = 440;

// var styleSheet = document.styleSheets[0].cssRules;
// var ccsDropDownHeightRuleIndex = [];
// var counter = 0;
// for (var i = 0; i < styleSheet.length; i++) {
//     if (styleSheet[i].selectorText == ".header__lower__navigation .items-wrapper.openBurgerMenu") {
// 		ccsDropDownHeightRuleIndex[counter] = i;
// 		counter++;
//     	// break;
// 	}   
// 	if (styleSheet[i].selectorText == ".header__lower__navigation .items-wrapper > .list") {
// 		ccsDropDownHeightRuleIndex[counter] = i;
// 		counter++;
//     	// break;
//     }
// }

var pinning = 2, // 1 second = 100vh
	contentDurationStart = 0;

var isLoading = true;

// bgVideo.pause();
// bgVideo.currentTime = 0;

// sections.forEach((section,i) => {
for (var i = 0; i < sections.length; i++) {

	if (i == (sections.length-1)) {isLoading = false}
    
    var section = sections[i];
    var segmentLength = bgVideoSegments[i+1] - bgVideoSegments[i];

    section.style.height = segmentLength * 100 + "vh";
    
    var contentStart = (bgVideoSegments[i]-1),
        contentEnd = (bgVideoSegments[i+1]-1);

     var dotEase = 0.5;

     var dotHoverToolTip = gsap.timeline({ paused: true, reversed: true });
     var dotHoverBullet = gsap.timeline({ paused: true, reversed: true });

    if (i == 0){
    	segmentLength = segmentLength - 1;
    	contentStart = 0;
    }

	tl.fromTo(content, {force3D: true, y: -contentStart*100 + "vh"}, { force3D: true, duration: segmentLength, y: -contentEnd*100 + "vh", rotation: 0.01, ease: "none" }, contentDurationStart);
// 	tl.to(content, { duration: segmentLength + pinning, onUpdate: setActiveStep, onUpdateParams: [i] }, contentDurationStart);
	

	var newLink = document.createElement("a");
	var newDot = document.createElement("div");
	newLink.setAttribute('href', "#" + scrollToLabels[i].id);
	newDot.className = "navigation__container__dots__dot";
	newDot.index = i;
	newDot.addEventListener("click", clickScroll);
	newDot.addEventListener("mouseenter", dotHover);
	newDot.addEventListener("mouseleave", dotHover);
	newDot.addEventListener("touchstart", touchClick);
	newDot.addEventListener("touchend", touchClick);

    newLink.appendChild(newDot);
	dots.appendChild(newLink);
	
// 	headerLowerListItemText[i].index = i;
// 	headerLowerListItemText[i].innerText = scrollToLabels[i]
    headerLowerListItems[i].index = i;
	headerLowerListItems[i].addEventListener("click", clickScroll);

    if (i > 0) {
        tl.fromTo(newDot, {scale: 1.25, opacity: 0.25}, { duration: dotEase, scale: 2.1, rotation: 0.01, opacity: 1, ease: "none", onUpdate: setActive}, contentDurationStart + 0.75);
    }
    
    contentDurationStart += segmentLength + pinning;

	if (i < (sections.length-1)) {
        tl.fromTo(newDot, {scale: 2.1, opacity: 1}, { duration: dotEase, scale: 1.25, rotation: 0.01, opacity: 0.25, ease: "none", onUpdate: setActive}, contentDurationStart + 0.50);
    }
    
    splitInnerText(toolTips[i]);
    dotHoverToolTip.fromTo(toolTips[i].children, { x: 10, opacity: 0 }, { duration: 0.5, opacity: 1, rotation: 0.01, x: 0, ease: Power3.easeOut, stagger: 0.02 }, "+=0");
    toolTipAnims.push(dotHoverToolTip);


    dotHoverBullet.fromTo(newDot, { scale: 1.25, opacity: 0.25 }, { duration: 0.25, scale: 1.5, rotation: 0.01, opacity:0.75, ease: Linear.easeNone }, 0);
    dotAnims.push(dotHoverBullet);
    
    scrollToLabels[i].style.top = contentDurationStart * 100 + "vh";

    

}

gsap.set(".navigation__container__toolTips", {opacity: 1});

var contentDurationEnd = contentDurationStart;
document.body.style.height = (contentDurationEnd+1)*100 + "vh";

// tl.to(bgVideo, { duration: contentDurationEnd, currentTime: 20, rotation: 0.01, ease: "none" }, 0);

ScrollTrigger.create({
    animation: tl,
    trigger: document.body,
    start: "top top", 
    end: "bottom bottom",
    scrub: 1,
});

var headerHeight = headerLower.offsetHeight,headerLowerItemsWrapper
	headerLowerItems = gsap.utils.toArray(".header__lower__item"),
	tconst = 1; //for debugging

// tlHomeMobile.to(headerLowerBackground, { force3D: true, duration: 1.5*tconst, bottom: -2*headerHeight, rotation: 0.0, ease: "power3.inOut"}, 0.25*tconst);
tlHomeMobile.to(header, { force3D: true, duration: 1.5*tconst, height: 2*headerHeight, rotation: 0.0, ease: "power3.inOut"}, 0.25*tconst);
tlHomeMobile.to(headerLowerItemsWrapper, { force3D: true, duration: 0.75*tconst, autoAlpha: 0, rotation: 0.0, ease: "power3.inOut"}, 0.25*tconst);
tlHomeMobile.to(headerLowerItemsWrapper, { force3D: true, duration: 1.5*tconst, y: headerHeight, rotation: 0.0, ease: "power3.inOut"}, 0.25*tconst);
tlHomeMobile.to(headerLowerItemsWrapper, { force3D: true, duration: 0.75*tconst, autoAlpha: 1, rotation: 0.0, ease: "power3.inOut"}, 1*tconst);

// tlHomeMobile.to(headerLowerBackground, { force3D: true, duration: 1.5*tconst, top: headerHeight - 1, rotation: 0.0, ease: "power3.inOut"}, 0.5*tconst);
tlHomeMobile.to(headerUpper, { force3D: true, duration: 1.5*tconst, height: headerHeight, rotation: 0.0, ease: "power3.inOut"}, 0.5*tconst);
tlHomeMobile.to(headerLowerItems, {force3D: true, duration: 0.5*tconst, stagger: 0.0625*tconst, autoAlpha: 0, y: 10, rotation: 0.0, ease: "power3.inOut"}, 0.4*tconst); //tlHomeMobile
tlHomeMobile.set(headerLowerItems, {y: headerHeight - 10}, 1.15*tconst); //tlHomeMobile
tlHomeMobile.set(".header__lower__logo", {display: "none"}, 1.15*tconst); //tlHomeMobile
// tlHomeMobile.set(".header__lower__logo__pic", {display: "block"}, 1.15*tconst); //tlHomeMobile
tlHomeMobile.to(headerLowerItems, {force3D: true, duration: 0.5*tconst, stagger: 0.0625*tconst, autoAlpha: 1, y: headerHeight, rotation: 0.0, ease: "power3.inOut"}, 1.15*tconst); //tlHomeMobile

tlHomeMobile.reversed(true);
tlHomeMobile.timeScale(10000).play();
// setTimeout(function(){ }, 100);

isLoading=false;

var stateCheck = setInterval(function(){
	if (document.readyState === 'complete') {
		clearInterval(stateCheck);
		viewport.style.visibility = "visible";
		// console.log("x");
			setTimeout(function(){ tlHomeMobile.timeScale(1).reverse(); }, 1500);
	}
}, 100);

// setActive();

function viewHeight() {
	
}

function height() {
	return Math.max(viewport.clientHeight, viewport.offsetHeight );
}

function width() {
	return Math.max(viewport.clientWidth, viewport.offsetWidth );
}



function onResize(evnt) {
// 	height = Math.max(viewport.clientHeight, viewport.offsetHeight );
// 	width = Math.max(viewport.clientWidth, viewport.offsetWidth );

	if (width() < 640) {
		compactMenu = true;
	} else {
		compactMenu = false;
	}

	if (evnt != -1) {
		document.body.classList.add("resize-animation-stopper");
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){ document.body.classList.remove("resize-animation-stopper"); }, 500);
	}

	// if (isMobile.any) {

		// if (height > width) {
		// 	if (height < (headerLowerHeightMobile + headerLowerNavDropdownBottomPaddingMobile + headerLowerNavDropdownMenuHeight)) {
		// 		styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = height - headerLowerHeightMobile - headerLowerNavDropdownBottomPaddingMobile + "px";
		// 		styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = height - headerLowerHeightMobile - headerLowerNavDropdownBottomPaddingMobile + "px";
		// 	} else {
		// 		styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = headerLowerNavDropdownMenuHeight + "px"
		// 		styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = headerLowerNavDropdownMenuHeight + "px"
		// 	}
		// } else {
		// 	if (height < (headerLowerHeightMobile + headerLowerNavDropdownMenuHeight)) {
		// 		styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = height - headerLowerHeightMobile + "px" ;
		// 		styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = height - headerLowerHeightMobile + "px" ;
		// 	} else {
		// 		styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = headerLowerNavDropdownMenuHeight + "px"
		// 		styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = headerLowerNavDropdownMenuHeight + "px"
		// 	}
		// }
	// }
}


function setActive() {
   	if (!isLoading) {
	    var dotsX = document.querySelectorAll('.navigation__container__dots__dot');
   	    var index = this._targets[0].index;
// 		dotsX.forEach((dot,i) => {
	    for (var i = 0; i < dotsX.length; i++) {
			if (i != index) {
				if (dotsX[i].classList.contains('active')) {
					dotsX[i].classList.remove('active');
				}
				if (sections[i].classList.contains('active')) {
					sections[i].classList.remove('active');
				}
				if (headerLowerListItemText[i].classList.contains('active')) {
					headerLowerListItemText[i].classList.remove('active');
				}
			}
		}
		if (!dotsX[index].classList.contains("active")) {
			dotsX[index].classList.add('active');
		}
		if (!sections[index].classList.contains("active")) {
			sections[index].classList.add('active');
		}
		if (!headerLowerListItemText[index].classList.contains("active")) {
			headerLowerListItemText[index].classList.add('active');
		}
		if (window.location.href.indexOf("#" + scrollToLabels[index].id) < 0) {
			history.replaceState(null, null, "#" +  scrollToLabels[index].id);
		}
		// var dropDownTitle = document.querySelector(".header-center > a");
		// var activeItem = document.querySelector(".header__lower__navigation .list > .item > a.active");
		if (headerLowerNavigationBottomText) {
    		// dropDownTitle.innerHTML = scrollToLabels[index].id + "<i class=\"fas fa-chevron-down\"></i>";			
    		headerLowerNavigationBottomText.innerHTML = scrollToLabels[index].id; // + "<i class=\"arrow1\"></i><i class=\"arrow2\"></i>";			
		}
   	}
}


function splitInnerText(el) {

	var toolTipsStr = el.textContent;
	el.innerText = "";
	for (var j = 0; j < toolTipsStr.length; j++) {
		var divEl = document.createElement("div");
		divEl.index = j;
		if (toolTipsStr.charAt(j) == " ") {
			divEl.innerText = "-";
			divEl.style.visibility = "hidden";
		} else {
			divEl.innerText = toolTipsStr.charAt(j);
		} 
		divEl.style.position = "relative";
		divEl.style.display = "inline-block";
		el.appendChild(divEl);
	}
}

function swipeStart(evnt) {
	if (evnt.targetTouches != "undefined") {
		swipeStartPos.x = evnt.targetTouches[0].screenX;
		swipeStartPos.y = evnt.targetTouches[0].screenY;
	} else {
		swipeStartPos.x = evnt.screenX;
		swipeStartPos.y = evnt.screenY;
	}
    triggered = false;

//     console.log(evnt.targetTouches[0].screenX,evnt.targetTouches[0].screenY)
}

function swipeCurrent(evnt) {
	if (evnt.targetTouches != "undefined") {
		swipeCurrentPos.x = evnt.targetTouches[0].screenX;
		swipeCurrentPos.y = evnt.targetTouches[0].screenY;
	} else {
		swipeCurrentPos.x = evnt.screenX;
		swipeCurrentPos.y = evnt.screenY;
	}
    var changeY = swipeCurrentPos.y - swipeStartPos.y;
    var startStopTmp = 0;
    if ((window.scrollY == 0) && (tlHomeMobile.reversed()) && (!triggered)) {
    	if (changeY > 100) {
			tlHomeMobile.play();
			triggered = true;
			console.log(tlHomeMobile.reversed());
		}
	} else if (!tlHomeMobile.reversed() && !triggered) {
		tlHomeMobile.reverse();
// 		console.log(startStop);
	}

// 	console.log(triggered, window.scrollY, tlHomeMobile.time());
}

function closeMenu(evnt) {
	// 	if ((isMobile.any) && (((headerLowerNavigation.classList.contains('dropDownOpen')) && !(evnt.target === headerLowerDropDownSelect) && !(evnt.target === headerLowerDropDownMenu)))) {
	if ((compactMenu) && (headerLowerItemsWrapper.classList.contains('openBurgerMenu')) && (!headerLowerBurger.contains(evnt.target))) { //!(evnt.target.closest(".header__lower__burger"))
		// evnt.preventDefault();
		headerLowerItemsWrapper.classList.toggle('openBurgerMenu');
		headerLowerBurgerIcon.classList.toggle('openBurgerMenu');
		return;
	}

// 	if (((!headerUpper.contains(evnt.target)) || (!headerUpperBackground.contains(evnt.target))) && (!tlHomeMobile.reversed())) {
    if (((!header.contains(evnt.target))) && (!tlHomeMobile.reversed())) {
		tlHomeMobile.reverse();
		return;
	}


// 	console.log(evnt.target.closest(".header__lower__burger"));
	// 	}
}

function clickHeaderLowerLogo(evnt) {
	onResize(-1);
	tlHomeMobile.reversed() ? tlHomeMobile.play() : tlHomeMobile.reverse();
	// headerLowerLogo.classList.toggle('openUpperMenu');
	// headerLowerNavigationWrapper.classList.toggle('openUpperMenu');
	// headerLowerBurger.classList.toggle('openUpperMenu');
	// headerLowerBackground.classList.toggle('openUpperMenu');
	// headerLowerSeparatorOne.classList.toggle('openUpperMenu');
	// headerLowerSeparatorTwo.classList.toggle('openUpperMenu');
	// headerLowerItemsWrapper.classList.toggle('openUpperMenu');
}

function clickHeaderLowerNavigationWrapper(evnt) {
	onResize(-1);
	if (!tlHomeMobile.reversed()) {
		tlHomeMobile.reverse();
		setTimeout(function(){ 
			headerLowerNavigationTop.classList.toggle('engineSelect');		
		}, 1250);
	} else {
		headerLowerNavigationTop.classList.toggle('engineSelect');		
	}
}

function clickHeaderLowerBurger(evnt) {
	onResize(-1);
	if (!tlHomeMobile.reversed()) {
		tlHomeMobile.reverse();
		setTimeout(function(){ 
			headerLowerItemsWrapper.classList.toggle('openBurgerMenu');
	        headerLowerBurgerIcon.classList.toggle('openBurgerMenu');
		}, 1000);
	} else {
		headerLowerItemsWrapper.classList.toggle('openBurgerMenu');
	    headerLowerBurgerIcon.classList.toggle('openBurgerMenu');
		
	}
	// console.log(evnt.target); //.closest(".header__lower__burger header__lower__item"));

}

function dotHover(evnt) {
    evnt.preventDefault();
//     let dotsX = document.querySelectorAll('.dot');
    if (evnt.type == "mouseenter") {
    	toolTipAnims[this.index].timeScale(2).play();
    	if (!this.classList.contains("active")) {
            dotAnims[this.index].timeScale(2).play();
        } 
//         console.log("mouseenter");
    } else {
     	toolTipAnims[this.index].timeScale(1).reverse();
     	if (!this.classList.contains("active")) {
        	 dotAnims[this.index].timeScale(1).reverse();   	
        }   
//         console.log("mouseleave")
    }
//     toolTipAnims[this.index].reversed() ? toolTipAnims[this.index].timeScale(2).play() : toolTipAnims[this.index].timeScale(1).reverse();
//     if (!this.classList.contains("active")) {
//         dotAnims[this.index].reversed() ? dotAnims[this.index].timeScale(2).play() : dotAnims[this.index].timeScale(1).reverse();   	
}

function clickScroll(evnt) {

    evnt.preventDefault();
    var  toIndex = this.index,
		 toID = "#" + scrollToLabels[this.index].id,
		 fromIndex = document.querySelector(".navigation__container__dots > a > .active").index,
		 duration = 1.5,
		 inc = Math.abs(scrollToLabels[this.index].getBoundingClientRect().top/viewport.getBoundingClientRect().height);
    
    if ((Math.abs(toIndex -fromIndex) <= 1) || (inc < duration)) {
        duration = inc;
    } 
//     console.log("click");    
    gsap.to(window, {duration: duration, scrollTo: toID, ease: "none"});
}

function touchClick(evnt) {

//     evnt.preventDefault();
//     let dotsX = document.querySelectorAll('.dot');
    var el = this;
    if (evnt.type == "touchstart") {
    	toolTipAnims[el.index].timeScale(2).play();
    	if (!el.classList.contains("active")) {
            dotAnims[el.index].timeScale(2).play();
        } 
//         console.log("touchstart");
    } else {
        setTimeout(function(){ 
            if (!el.classList.contains("active")) {
        	    dotAnims[el.index].timeScale(1).reverse();  
            }
            toolTipAnims[el.index].timeScale(1).reverse(); 
        }, 250);
//         console.log("touchend")
    }
}

function createHomeMenuTL(el, dur, start) {
	tlHomeMobile.to(el, { duration: dur, scale: 1.25, rotation: 0.01, opacity: 0.25, ease: "none", onUpdate: setActive}, contentDurationStart + 0.50);

}