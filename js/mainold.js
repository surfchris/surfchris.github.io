//console.clear();

const videoFwd = document.querySelector("#bgVideoFwd");
const videoSegments = [2, 3, 6, 8, 10, 13, 15, 17, 20];

gsap.defaultEase = Linear.easeNone;

var times = [];
var pos = [];
var fps;
var intro = "Uncompromised Ultra Efficient Turbine Power, the little engine that can"

var dots = document.querySelector(".dots");
var toolTips = document.querySelectorAll(".toolTip");
var toolTipAnims = [];

var viewSteps = document.querySelectorAll(".step");

var scene = document.querySelector("#scene");
var scrollViewport = document.querySelector("#scroll-container-viewport");
var virtualScrollContainer = document.querySelector("#virtual-scroll-container");
var scrollbarSize = document.querySelector("#scrollbarDummy");
var header = document.querySelector("header");


// var scrollViewportHeight = virtualScrollContainer.clientHeight;
// var scrollViewportWidth = virtualScrollContainer.clientWidth;

var scroller = {
	container: document.querySelector("#scroll-container"),
	viewportHeight: scrollViewport.clientHeight,
	viewportWidth: virtualScrollContainer.clientWidth,
	scrollbarWidth: 20,
	stepPadding: 400,
	scrollHeight: 0,
	scrollToPos: [],
	animationTimeScaleFactor: 1, // time viewport height of step element
	steps: [],
	step: 0,
	anim: 1,
	y: 0,
	ease: 0.04,
	resizeRequest: 1,
	scrollRequest: 0,
};

let dotScrollAnim = gsap.timeline({ paused: true, reversed: true });
var tl = new gsap.timeline({
	paused: true,
});

var info = createInfo();
var requestId = null;

videoFwd.pause();
videoFwd.currentTime = 0;

window.addEventListener("load", onLoad);

function onLoad() { 
  updateScroller(false);  
  window.focus();
  window.addEventListener("resize", onResize);
  scrollViewport.addEventListener("wheel", onScroll); 
}

function onScroll() {
	scroller.scrollRequest++;
	if (dotScrollAnim.isActive()) {
		dotScrollAnim.kill();
	}
	//console.log(scroller.scrollRequest)
	if (!requestId) {
		requestId = requestAnimationFrame(function () { updateScroller(true) });
	}
}

resize();

function onResize() {
  scroller.resizeRequest++;
  if (!requestId) {
    requestId = requestAnimationFrame(function () { updateScroller(false) });
  }
}

function updateScroller(enableEase) {

    var resized = scroller.resizeRequest > 0;
    
    if (resized) {    
//         resize();
		scroller.resizeRequest = 0;
    }

	// scroller.y = window.pageYOffset;
	var scrollY = scrollViewport.scrollTop;
	if (enableEase) {
		scroller.y += (scrollY - scroller.y) * scroller.ease;

		if (Math.abs(scrollY - scroller.y) < 0.05) {
			scroller.y = scrollY;
			scroller.scrollRequest = 0;
// 			pos = [];
// 			times = [];
		}
	} else {
	    scrollViewport.scrollTop = scroller.y;
		scroller.scrollRequest = 0;
	}
	//  console.log(scroller.step, scroller.anim);
	tl.time(scroller.y);

	requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(function () { updateScroller(true) }) : null;
	// requestId = null;
//	updateInfo();
}

function resize() {

	scroller.scrollbarWidth = scene.clientWidth - virtualScrollContainer.clientWidth;
	scroller.viewportHeight = scrollViewport.clientHeight;
	scroller.viewportWidth = virtualScrollContainer.clientWidth;

	gsap.set(viewSteps, { height: scroller.viewportHeight, width: scroller.viewportWidth, force3D: true });

	for (var i = 0; i < viewSteps.length; i++) {
		addStep(viewSteps[i], scroller.stepPadding, scroller.animationTimeScaleFactor*(scroller.viewportHeight+1), i);
	};
		

	gsap.set(virtualScrollContainer, { height: scroller.scrollHeight + scroller.viewportHeight });
	gsap.set(scroller.container, { height: scroller.viewportHeight*(viewSteps.length), width: scroller.viewportWidth, force3D: true });
	gsap.set("#video-container", { width: scroller.viewportWidth, force3D: true });

	gsap.set(".dots", { right: scroller.scrollbarWidth + 16, yPercent: -50, force3D: true });
	gsap.set(".toolTips", {right: scroller.scrollbarWidth + 55, yPercent: -50, force3D: true});


}


function addStep(element, padding, animationTimeScale, index) {
	if (index == 0) {
		var videoSegmentLength = videoSegments[index];
	} else {
		var videoSegmentLength = videoSegments[index] - videoSegments[index - 1];
	}

	var step =
	{
		el: element,
		height: element.clientHeight,
		padding: padding,
		position: 10,
		animationTimeScale: animationTimeScale,
		animationHeight: videoSegmentLength * animationTimeScale,
		progress: 0
	};
// 	gsap.set(step.el, { opacity: 0 });
	if (index > 0 && index < viewSteps.length) {

		let dotHoverAnim = gsap.timeline({ paused: true, reversed: true });
		var previous = scroller.steps[index - 1];

		//tl.set(scroller, { anim: 0 }, scroller.scrollHeight - previous.padding)
		//tl.set(scroller, { step: index, anim: 1 }, scroller.scrollHeight )
		tl.to(scroller.container, { duration: previous.height / 2, y: "-=" + previous.height / 2, ease: "power2.out" }, scroller.scrollHeight - previous.padding - previous.height / 2)
	      .to(step.el, { duration: previous.height / 2, opacity: 1 }, scroller.scrollHeight - previous.padding - previous.height / 2)
	      .to(videoFwd, { duration: step.animationHeight, currentTime: videoSegments[index], ease: "none" }, scroller.scrollHeight)
	      .to(scroller.container, { duration: step.height / 2, y: "-=" + step.height / 2, ease: "power2.in" }, scroller.scrollHeight)
		  .to(step.el, { duration: step.height / 2, opacity: 0 }, scroller.scrollHeight);

		
		let newDot = document.createElement("div");
		newDot.className = "dot";
		newDot.index = index - 1;
		//navDots.push(newDot);
		newDot.addEventListener("click", dotScroll);
		newDot.addEventListener("mouseenter", function () { dotHover(this, 1) });
		newDot.addEventListener("mouseleave", function () { dotHover(this, 0) });
		gsap.set(newDot, { scale: 1, opacity: 0.3 });
		newDot.storedValues = {
			scale: gsap.getProperty(newDot, "scale"),
			opacity: gsap.getProperty(newDot, "opacity")
		};
		dots.appendChild(newDot);
		//offsets.push(-slides[index].offsetTop);
		var toolTipsStr = toolTips[index - 1].innerText;
		toolTips[index - 1].innerText = "";
		for (var j = 0; j < toolTipsStr.length; j++) {
			var divEl = document.createElement("div");
			divEl.innerText = toolTipsStr.charAt(j);
			divEl.index = j;
			divEl.style.position = "relative";
			divEl.style.display = "inline-block";
			toolTips[index - 1].appendChild(divEl);
		}
		//		tl.fromTo(toolTips[index-1].children, { x: 10, opacity: 0 }, { yoyo: true, repeat: 1, repeatDelay: step.padding-step.height/2, duration: step.height/2, opacity: 1, x: 0, ease: Power3.easeOut, stagger: {amount: step.height/4} }, scroller.scrollHeight-previous.padding-previous.height/2)
		//		  .to(newDot, { yoyo: true, repeat: 1, repeatDelay: step.padding, duration: step.height/2, scale: 1.75, opacity: 1, ease: Linear.easeNone }, scroller.scrollHeight-previous.padding-previous.height/2)
		//		  .to(newDot, { yoyo: true, repeat: 1, repeatDelay: step.padding, duration: previous.animationHeight, scale: 1.75, opacity: 1, ease: Linear.easeNone }, scroller.scrollHeight-previous.padding-previous.animationHeight)
		tl.to(newDot, { duration: previous.animationHeight, scale: 1.75, opacity: 1, ease: Linear.easeNone, onUpdate: storeValues }, scroller.scrollHeight - previous.padding - previous.animationHeight)
			.to(newDot, { duration: step.animationHeight, scale: 1, opacity: 0.3, ease: Linear.easeNone, onUpdate: storeValues }, scroller.scrollHeight);

		dotHoverAnim.fromTo(toolTips[index - 1].children, { x: 10, opacity: 0 }, { duration: 0.5, opacity: 1, x: 0, ease: Power3.easeOut, stagger: 0.02 }, "+=0")
		//                    .to(newDot, 0.5, { scale: 1.5, opacity:0.5, ease: Linear.easeNone }, 0);
		toolTipAnims.push(dotHoverAnim);

	} else if (index == 0) {
		tl.to(videoFwd, { duration: step.animationHeight, currentTime: videoSegments[index], ease: "none" }, 0)
			.to(scroller.container, { duration: step.height / 2, y: "-=" + step.height / 2 }, 0)
			.to(step.el, { duration: step.height / 2, opacity: 0 }, 0)
	}

	scroller.scrollHeight += (step.padding + step.animationHeight);
	scroller.scrollToPos.push(scroller.scrollHeight - step.padding / 2);
	step.position = scroller.scrollHeight - step.padding / 2;
	scroller.steps.push(step);
}

function addNavDots() {
	for (var i = 0; i < viewSteps.length; i++) {
		

	};

}

function storeValues() {
	this._targets[0].storedValues = {
		scale: gsap.getProperty(this._targets[0], "scale"),
		opacity: gsap.getProperty(this._targets[0], "opacity")
	}
}

function dotHover(elm, fwd) {
	//  if (elm.index != scroller.step) 
	//    if (!scroller.anim) {
	//    toolTipAnims[this.index].reversed() ? toolTipAnims[this.index].timeScale(2).play() : toolTipAnims[this.index].timeScale(1).reverse();
	if (fwd) {
		gsap.to(elm, 0.5, { scale: 1.5, opacity: 0.5, ease: Linear.easeNone }, 0);
		toolTipAnims[elm.index].timeScale(2).play();

	}
	else {
		gsap.to(elm, 0.5, { scale: elm.storedValues.scale, opacity: elm.storedValues.opacity, ease: Linear.easeNone }, 0);
		toolTipAnims[elm.index].timeScale(1).reverse();
	}
	//	  }
}

function currentStep(position) {
	for (var i = 0; i <= (scroller.steps.length); i++) {
		let previousPosition = (i == 0) ? 0 : scroller.steps[i - 1].position;
		if ((position >= previousPosition) && (position < (scroller.steps[i].position + scroller.steps[i].padding / 2))) {
			if ((position >= scroller.steps[i].position - scroller.steps[i].padding / 2) && (position < scroller.steps[i].position + scroller.steps[i].padding / 2)) {
				return [i, false];
			} else {
				return [i, true];
			}
		};
	};
}


function dotScroll() {

	[currStep, currAnim] = currentStep(scroller.y);
	dotScrollAnim.clear();
	let currDir = (this.index >= currStep) ? 1 : -1;
	let currPosition = scroller.y;
	let toPosition = scroller.steps[this.index].position - currDir * scroller.steps[this.index].padding / 2;
	let startPosition = (currAnim) ? currPosition : scroller.steps[currStep].position + currDir * scroller.steps[currStep].padding / 2;
	let jumps = Math.abs(currStep - this.index);
	if (jumps == 0) {
		let toTime = Math.abs(toPosition - startPosition) / (scroller.animationTimeScale);
		if (currAnim) {
			dotScrollAnim.to(scroller, { y: toPosition, duration: toTime, ease: "power2.in", onUpdate: updateDotScroller }, 0);
		} else {
			dotScrollAnim.set(scroller, { y: toPosition, onUpdate: updateDotScroller });
		}
		//         console.log(toTime);    
	} else if (jumps >= 1) {
		let speedFactor;
		if (jumps == 1) {
			speedFactor = 1;
		} else {
			speedFactor = 1.5;
		}
		let toTime = Math.abs(toPosition - startPosition) / (scroller.animationTimeScale * (speedFactor * jumps));
		dotScrollAnim.set(scroller, { y: startPosition, onUpdate: updateDotScroller }, 0);
		if (!currAnim) {
			dotScrollAnim.to(scroller, { y: toPosition, duration: toTime, ease: "none", onUpdate: updateDotScroller });  //power2.inOut      		
			// 			console.log(0);
		} else {
			dotScrollAnim.to(scroller, { y: toPosition, duration: toTime, ease: SplitEase(0.5 / toTime, 0), onUpdate: updateDotScroller });
			// 			console.log(1);
		}
		// 	    console.log(toTime);    

		//     } else if (jumps >= 2) {
		// 		dotScrollAnim.set(scroller, {y: startPosition, onUpdate: updateDotScroller},0);
		// 		if (!currAnim) {
		// 			dotScrollAnim.to(scroller, {y: toPosition, duration: 2, ease: "none", onUpdate: updateDotScroller});  //power2.inOut      		
		// 			console.log(0);
		// 		} else {
		// 			dotScrollAnim.to(scroller, {y: toPosition, duration: 2, ease: SplitEase(0.25, 0), onUpdate: updateDotScroller});
		// 			console.log(1);
		// 		}   	
	}
	dotScrollAnim.set(scroller, { y: scroller.steps[this.index].position, onUpdate: updateDotScroller });
	dotScrollAnim.play();

}



// 	if (this.index > scroller.step) {
//        gsap.to(window, {duration: videoSegments[this.index]-videoSegments[scroller.step], scrollTo: scroller.scrollToPos[this.index]});
//        gsap.to(window, {duration: (scroller.scrollToPos[this.index]-scroller.y)/(3*scroller.animationTimeScale), scrollTo: scroller.scrollToPos[this.index]});
// 	}
// 	var easeDuration=0.5;
// 	var jumps = Math.abs(this.index - scroller.step);
// 	var dir = (this.index - scroller.step)/jumps;
// 	let dotScrollAnim = gsap.timeline({ paused: true, reversed: true });

//    gsap.to(window, {duration: (Math.abs(scroller.y-scroller.steps[this.index].position-dir*scroller.steps[this.index].padding/2))/(2*scroller.animationTimeScale), scrollTo: scroller.steps[this.index].position-dir*scroller.steps[this.index].padding/2, ease: "none"},0);	

//     if (jumps == 0) {
// 		let toPos = scroller.steps[this.index].position-scroller.steps[this.index].padding/2;
// 		let dur = Math.abs(toPos-scroller.y)/(scroller.animationTimeScale);
//         dotScrollAnim.to(scroller, {y: toPos, duration: dur, ease: "power1.inOut", onUpdate: updateDotScroller},0);	// power2.inOut (Math.abs(scroller.y-scroller.steps[this.index].position-dir*scroller.steps[this.index].padding/2))/(2*scroller.animationTimeScale)
//        console.log(toPos-scroller.y, dur);
//     }
//  	if (jumps == 1) {
//  		let durTot=0;
//  		if (!scroller.anim)  {
//  			scroller.y=scroller.steps[scroller.step].position + dir*scroller.steps[scroller.step].padding/2;
// 			window.scroll(0,scroller.y);
// 			tl.time(scroller.y);
// 		    updateInfo(); 			
//  		}
//  	}
// 		for (var i = 0; i <= (jumps); i++) {
// 			j=scroller.step+i*dir;
// 			let toPos = scroller.steps[j].position+dir*scroller.steps[j].padding/2;
// 			let dur = Math.abs(toPos-scroller.y)/(scroller.animationTimeScale);
// 			dotScrollAnim.to(scroller, {y: toPos, duration: dur, ease: "none", onUpdate: updateDotScroller},durTot);	// power2.inOut (Math.abs(scroller.y-scroller.steps[this.index].position-dir*scroller.steps[this.index].padding/2))/(2*scroller.animationTimeScale)
//             durTot += dur;
//             dotScrollAnim.set(scroller, {y:toPos+dir*scroller.steps[j].padding, onUpdate: updateDotScroller}, durTot);
// 		}
//  	}
//  	if (jumps > 1) {

// 		for (var i = scroller.step+1; i <= (this.index); i++) {
// 			let toPos = scroller.steps[i].position-dir*scroller.steps[i].padding/2;
// 			//		console.log(toPos);
//             dotScrollAnim.to(tl, {time: toPos, duration: 1, ease: "none", onUpdate: updateDotScroller}, 0);	// (Math.abs(scroller.y-scroller.steps[this.index].position-dir*scroller.steps[this.index].padding/2))/(2*scroller.animationTimeScale)
// 	    }
//     }
//     dotScrollAnim.play();
// }

function updateDotScroller() {
	scrollViewport.scrollTop = scroller.y;
//	console.log(scroller.y, scrollViewport.scrollTop);
	tl.time(scroller.y);
	updateInfo();
}



// 	function requestUpdate() {
//   	if (!requestId) {
//     	requestId = requestAnimationFrame(update);
//   	}
// 	}



function getDevicePixelRatio() {
	var mediaQuery;
	var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	if (window.devicePixelRatio !== undefined && !is_firefox) {
		return window.devicePixelRatio;
	} else if (window.matchMedia) {
		mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
          (min--moz-device-pixel-ratio: 1.5),\
          (-o-min-device-pixel-ratio: 3/2),\
          (min-resolution: 1.5dppx)";
		if (window.matchMedia(mediaQuery).matches) {
			return 1.5;
		}
		mediaQuery = "(-webkit-min-device-pixel-ratio: 2),\
          (min--moz-device-pixel-ratio: 2),\
          (-o-min-device-pixel-ratio: 2/1),\
          (min-resolution: 2dppx)";
		if (window.matchMedia(mediaQuery).matches) {
			return 2;
		}
		mediaQuery = "(-webkit-min-device-pixel-ratio: 0.75),\
          (min--moz-device-pixel-ratio: 0.75),\
          (-o-min-device-pixel-ratio: 3/4),\
          (min-resolution: 0.75dppx)";
		if (window.matchMedia(mediaQuery).matches) {
			return 0.7;
		}
	} else {
		return 1;
	}
}






function updateInfo() {

	const timenow = performance.now();
	const posnow = scroller.y;
	if (times.length == 0) {
		times[0] = timenow;
		pos[0] = posnow;
		velocity = 0;
		deltaT = 0;
	} else if (times.length == 1) {
		times[1] = timenow;
		pos[1] = posnow;

		velocity = ((pos[1] - pos[0]) / (times[1] - times[0]));
		deltaT = times[1] - times[0];
	} else {
		times[0] = times[1];
		times[1] = timenow;
		pos[0] = pos[1];
		pos[1] = posnow;
		velocity = ((pos[1] - pos[0]) / (times[1] - times[0]) * 1000);
		deltaT = times[1] - times[0];
		//    console.log(velocity)
	}


	info.currStep = scroller.step + "." + scroller.anim;
	//	info.currStepProgress = Math.floor(scroller.steps[scroller.step].progress * 100) + "%";
	info.currPos = Math.round(scroller.y);
	info.currVel = Math.round(velocity) + " px/s";
	info.currFPS = Math.round(1 / deltaT * 1000) + " FPS";
	info.totalProgress = Math.floor(tl.progress() * 100) + "%";
	var videoRate = Math.round(velocity) / 250;
	var limitLow = 0.5;
	var limitHigh = 15;
	var duration = 60;
	// 	if (videoRate >= limitLow && videoRate <= limitHigh) {
	// 		videoFwd.play();
	// 		videoFwd.style.opacity = 1;
	// //		videoBwd.style.opacity = 0;
	// 		//TweenLite.set("#bgVideoFwd", { opacity: 1 });
	// 		//TweenLite.set("#bgVideoBwd", { opacity: 0 });
	// 		videoFwd.playbackRate = Math.abs(videoRate);
	// //		videoBwd.currentTime = duration - videoFwd.currentTime;
	// 	} else if (videoRate <= -limitLow && videoRate >= -limitHigh) {
	// 	//	videoBwd.play();
	// 		// videoBwd.style.opacity = 1;
	// 		// videoFwd.style.opacity = 0;
	// 		//TweenLite.set("#bgVideoBwd", { opacity: 1 });
	// 		//TweenLite.set("#bgVideoFwd", { opacity: 0 });
	// //		videoBwd.playbackRate = Math.abs(videoRate);
	// //		videoFwd.currentTime = duration - videoBwd.currentTime;
	// 	} else if (videoRate > 0 && videoRate < limitLow) {
	// 		videoFwd.playbackRate = 0;
	// //		videoBwd.playbackRate = 0;
	// //		videoBwd.currentTime = duration - videoFwd.currentTime;
	// 	} else if (videoRate > -limitLow && videoRate < 0) {
	// 		videoFwd.playbackRate = 0;
	// //		videoBwd.playbackRate = 0;
	// //		videoFwd.currentTime = duration - videoBwd.currentTime;
	// 	} else if (videoRate == 0) {
	// 		videoFwd.playbackRate = 0;
	// //		videoBwd.playbackRate = 0;
	// 	}
	// console.log(Math.round(velocity) / 500);
	// videoFwd.playbackRate = Math.abs(Math.round(velocity) / 500);

	info.numSteps = scroller.steps.length;
	info.stepPadding = scroller.stepPadding;
	info.scrollHeight = scroller.scrollHeight;
	// info.viewportHeight = scroller.viewportHeight;
	// info.totalHeight = scroller.scrollHeight + scroller.viewportHeight;
}

function createInfo() {

	var info = {};
	var items = Array.from(document.querySelectorAll(".info .value"));

	items.forEach(function (element) {
		Object.defineProperty(info, element.id, {
			set: function (value) { element.textContent = value; }
		});
	});

	return info;
}
