gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

var bgVideo = document.querySelector(".background__video-container__video");
var bgVideoSegments = [0, 2, 3, 6, 8, 10, 13, 15, 17, 20];


var intro = "Uncompromised Ultra Efficient Turbine Power, the small engine that can";

var dots = document.querySelector(".navigation__container__dots");
var viewport = document.querySelector(".viewport");
var headerDropDownSelect = document.querySelector(".header__navigation__dropdown-button");
var headerList = document.querySelector(".header__navigation .list");
var headerWrapper = document.querySelector(".header__navigation > .wrapper");
var headerListItems = document.querySelectorAll(".header__navigation .list > .item");
var headerListItemText = document.querySelectorAll(".header__navigation .list > .item > a");
var scrollToLabels = document.querySelectorAll(".scrollTo_label");
var toolTips = document.querySelectorAll(".navigation__container__toolTips__toolTip");
var sections = gsap.utils.toArray(".content__section");
var content = document.querySelector(".content");
var toolTipAnims = [];
var dotAnims = [];


var tl = new gsap.timeline({
	paused: true,
});

headerDropDownSelect.addEventListener("click", clickHeaderDropDown);
window.addEventListener("resize", onResize);
var resizeTimer;

var headerHeightMobile = 60;
var headerNavDropdownBottomPaddingMobile = 75;
var headerNavDropdownMenuHeight = 440;

var styleSheet = document.styleSheets[0].cssRules;
var ccsDropDownHeightRuleIndex = [];
var counter = 0;
for (var i = 0; i < styleSheet.length; i++) {
    if (styleSheet[i].selectorText == ".header__navigation > .wrapper.dropDownOpen") {
		ccsDropDownHeightRuleIndex[counter] = i;
		counter++;
    	// break;
	}   
	if (styleSheet[i].selectorText == ".header__navigation > .wrapper > .list") {
		ccsDropDownHeightRuleIndex[counter] = i;
		counter++;
    	// break;
    }
}
// styleSheet[43].style.height= "300px";

var pinning = 2, // 1 second = 100vh
	contentDurationStart = 0;

var isLoading = true;



// bgVideo.pause();
// bgVideo.currentTime = 0;

// sections.forEach((section,i) => {
for (var i = 0; i < sections.length; i++) {
    
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
	
// 	headerListItemText[i].index = i;
// 	headerListItemText[i].innerText = scrollToLabels[i]
    headerListItems[i].index = i;
	headerListItems[i].addEventListener("click", clickScroll);

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
    
//     console.log(contentDurationStart);

}

gsap.set(".navigation__container__toolTips", {opacity: 1});

var contentDurationEnd = contentDurationStart;
document.body.style.height = (contentDurationEnd+1)*100 + "vh";

tl.to(bgVideo, { duration: contentDurationEnd, currentTime: 20, rotation: 0.01, ease: "none" }, 0);

ScrollTrigger.create({
    animation: tl,
    trigger: document.body,
    start: "top top", 
    end: "bottom bottom",
    scrub: 1,
});

isLoading=false;
// setActive();

function viewHeight() {
	
}

function onResize(evnt) {
	if (isMobile.any) {
		var height = Math.max(viewport.clientHeight, viewport.offsetHeight ),
			width = Math.max(viewport.clientWidth, viewport.offsetWidth );
		if (evnt != -1) {
			document.body.classList.add("resize-animation-stopper");
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function(){ document.body.classList.remove("resize-animation-stopper"); }, 500);
		}
		if (height > width) {
			if (height < (headerHeightMobile + headerNavDropdownBottomPaddingMobile + headerNavDropdownMenuHeight)) {
				styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = height - headerHeightMobile - headerNavDropdownBottomPaddingMobile + "px";
				styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = height - headerHeightMobile - headerNavDropdownBottomPaddingMobile + "px";
			} else {
				styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = headerNavDropdownMenuHeight + "px"
				styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = headerNavDropdownMenuHeight + "px"
			}
		} else {
			if (height < (headerHeightMobile + headerNavDropdownMenuHeight)) {
				styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = height - headerHeightMobile + "px" ;
				styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = height - headerHeightMobile + "px" ;
			} else {
				styleSheet[ccsDropDownHeightRuleIndex[0]].style.height = headerNavDropdownMenuHeight + "px"
				styleSheet[ccsDropDownHeightRuleIndex[1]].style.height = headerNavDropdownMenuHeight + "px"
			}
		}
	}
}


function setActive() {
    var dotsX = document.querySelectorAll('.navigation__container__dots__dot');
   	var index = this._targets[0].index;
   	if (!isLoading) {
// 		dotsX.forEach((dot,i) => {
	    for (var i = 0; i < dotsX.length; i++) {
			if (i != index) {
				if (dotsX[i].classList.contains('active')) {
					dotsX[i].classList.remove('active');
				}
				if (sections[i].classList.contains('active')) {
					sections[i].classList.remove('active');
				}
				if (headerListItemText[i].classList.contains('active')) {
					headerListItemText[i].classList.remove('active');
				}
			}
		}
		if (!dotsX[index].classList.contains("active")) {
			dotsX[index].classList.add('active');
		}
		if (!sections[index].classList.contains("active")) {
			sections[index].classList.add('active');
		}
		if (!headerListItemText[index].classList.contains("active")) {
			headerListItemText[index].classList.add('active');
		}
		if (window.location.href.indexOf("#" + scrollToLabels[index].id) < 0) {
			history.replaceState(null, null, "#" +  scrollToLabels[index].id);
		}
		var dropDownTitle = document.querySelector(".header__navigation__dropdown-button > a");
		var activeItem = document.querySelector(".header__navigation .list > .item > a.active");
		if (activeItem && dropDownTitle) {
    		// dropDownTitle.innerHTML = scrollToLabels[index].id + "<i class=\"fas fa-chevron-down\"></i>";			
    		dropDownTitle.innerHTML = scrollToLabels[index].id; // + "<i class=\"arrow1\"></i><i class=\"arrow2\"></i>";			
		}

   	}
}


function splitInnerText(el) {

	var toolTipsStr = el.innerText;
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

function clickHeaderDropDown(evnt) {
    onResize(-1);
	headerWrapper.classList.toggle('dropDownOpen');
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
