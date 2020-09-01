console.clear();

const videoFwd = document.querySelector("#bgVideoFwd");
const videoBwd = document.querySelector("#bgVideoBwd");
//TweenLite.set("#bgVideoBwd", { autoAlpha: 0 })
videoBwd.currentTime = 20;

TweenLite.defaultEase = Linear.easeNone;

var times = [];
var pos = [];
var fps;

var viewSteps = document.querySelectorAll(".step");

var viewportHeight = window.innerHeight;

var scroller = {
	container: document.querySelector("#scroll-container"),
	viewportHeight: viewportHeight,
	stepHeight: Math.max(viewportHeight, 2500),
	scrollHeight: 0,
	padding: 400,
	steps: [],
	step: 0,
	y: 0,
	ease: 0.05,
	resizeRequest: 1,
	scrollRequest: 0,
	};

var tl = new TimelineMax({
	paused: true,

}); // onUpdate: updateScroller

for (var i = 0; i < viewSteps.length; i++) {
	addStep(viewSteps[i], scroller.stepHeight, scroller.padding, i);
}

TweenLite.set(document.body, {
	height: scroller.scrollHeight + scroller.viewportHeight
});

TweenLite.set(scroller.container, {
	height: scroller.scrollHeight,
	force3D: true
});

var info = createInfo();
var requestId = null;

window.addEventListener("wheel", onScroll);
//update();
videoFwd.playbackRate = 0;
videoBwd.playbackRate = 0;


function addStep(element, size, padding, index) {

	var step = {
		height: element.clientHeight,
		size: size,
		pad: padding,
		progress: 0
	};

	if (index > 0) {

	var last = scroller.steps[index - 1];

		tl.set(scroller, { step: index - 1 }, scroller.scrollHeight)
		tl.to(scroller.container, last.height, { y: "-=" + last.height }, scroller.scrollHeight);
	}

	tl.set(scroller, { step: index }, scroller.scrollHeight)
	tl.to(step, size, { progress: 1 }, scroller.scrollHeight)

	scroller.scrollHeight += (size + padding);
	scroller.steps.push(step);
}

function updateScroller() {
	// scroller.y = window.pageYOffset;
	var scrollY = window.pageYOffset;
	scroller.y += (scrollY - scroller.y) * scroller.ease;

	if (Math.abs(scrollY - scroller.y) < 0.05) {
		scroller.y = scrollY;
		scroller.scrollRequest = 0;
		pos = [];
		times = [];
	}
	// console.log(Math.floor(scrollY), Math.floor(scroller.y));
	tl.time(scroller.y);

	requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
	// requestId = null;
	updateInfo();
}

// 	function requestUpdate() {
//   	if (!requestId) {
//     	requestId = requestAnimationFrame(update);
//   	}
// 	}

function onScroll() {
	scroller.scrollRequest++;
	//console.log(scroller.scrollRequest)
	if (!requestId) {
		requestId = requestAnimationFrame(updateScroller);
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


	info.currStep = scroller.step + 1;
	info.currStepProgress = Math.floor(scroller.steps[scroller.step].progress * 100) + "%";
	info.currPos = Math.round(scroller.y);
	info.currVel = Math.round(velocity) + " px/s";
	info.currFPS = Math.round(1 / deltaT * 1000) + " FPS";
	info.totalProgress = Math.floor(tl.progress() * 100) + "%";
	var videoRate = Math.round(velocity) / 250;
	var limitLow = 0.5;
	var limitHigh = 15;
	var duration = 60;
	if (videoRate >= limitLow && videoRate <= limitHigh) {
		videoFwd.play();
		videoFwd.style.opacity = 1;
		videoBwd.style.opacity = 0;
		//TweenLite.set("#bgVideoFwd", { opacity: 1 });
		//TweenLite.set("#bgVideoBwd", { opacity: 0 });
		videoFwd.playbackRate = Math.abs(videoRate);
		videoBwd.currentTime = duration - videoFwd.currentTime;
	} else if (videoRate <= -limitLow && videoRate >= -limitHigh) {
		videoBwd.play();
		videoBwd.style.opacity = 1;
		videoFwd.style.opacity = 0;
		//TweenLite.set("#bgVideoBwd", { opacity: 1 });
		//TweenLite.set("#bgVideoFwd", { opacity: 0 });
		videoBwd.playbackRate = Math.abs(videoRate);
		videoFwd.currentTime = duration - videoBwd.currentTime;
	} else if (videoRate > 0 && videoRate < limitLow) {
		videoFwd.playbackRate = 0;
		videoBwd.playbackRate = 0;
		videoBwd.currentTime = duration - videoFwd.currentTime;
	} else if (videoRate > -limitLow && videoRate < 0) {
		videoFwd.playbackRate = 0;
		videoBwd.playbackRate = 0;
		videoFwd.currentTime = duration - videoBwd.currentTime;
	} else if (videoRate == 0) {
		videoFwd.playbackRate = 0;
		videoBwd.playbackRate = 0;
	}
	// console.log(Math.round(velocity) / 500);
	// videoFwd.playbackRate = Math.abs(Math.round(velocity) / 500);

	info.numSteps = scroller.steps.length;
	info.stepHeight = scroller.stepHeight;
	info.padding = scroller.padding;
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