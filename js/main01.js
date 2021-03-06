gsap.registerPlugin(ScrollTrigger);

const bgVvideo = document.querySelector("#bgVideo");
const bgVideoSegments = [0, 2, 3, 6, 8, 10, 13, 15, 17, 20];

var intro = "Uncompromised Ultra Efficient Turbine Power, the small engine that can"

var dots = document.querySelector(".dots");
var headerItem = document.querySelectorAll(".header_item");
var toolTips = document.querySelectorAll(".toolTip");
var toolTipAnims = [];
var dotAnims = [];

let navDots = [];

var viewSteps = document.querySelectorAll(".step");

let dotScrollAnim = gsap.timeline({ paused: true, reversed: true });
var tl = new gsap.timeline({
	paused: true,
});

let sections = gsap.utils.toArray(".step");


bgVideo.pause();
bgVideo.currentTime = 0;


sections.forEach((step,i) => {

    let segmentLength = bgVideoSegments[i+1] - bgVideoSegments[i];
    step.style.height = segmentLength*100 + "vh";
    ScrollTrigger.create({
        trigger: step,
        start: "bottom bottom", 
        end: "+=500", // 200px past the start 
        pin: true,
        anticipatePin: 1,
        onUpdate: self => console.log("progress:", self.animation),
    });

	// gsap.to(bgVideo, {
	// 	scrollTrigger: {
	// 		trigger: step,
    //         scrub: 3,
    //         pin: true,
	// 		start: "top bottom",
	// 		end: "bottom bottom",
	// 	},
	// 	currentTime: bgVideoSegments[i+1],
	// 	duration: segmentLength,
    // 	ease: "none",
    //  immediateRender: false,
	// });

});

// gsap.fromTo(bgVideo, {currentTime: 0}, {
//     scrollTrigger: {
//         trigger: '.scroll-container',
//         scrub: 2,
//         start: "top bottom",
//         end: "bottom bottom",
//     },
//     currentTime: 20,
//     duration: 20,
//     ease: "none",
// });



addNavDots();


function addNavDots() {
    for (var i = 0; i < sections.length; i++) {

        let dotHoverToolTip = gsap.timeline({ paused: true, reversed: true });
        let dotHoverBullet = gsap.timeline({ paused: true, reversed: true });

        let newDot = document.createElement("div");
        newDot.className = "dot";
        newDot.index = i;
//         navDots.push(newDot);
        newDot.addEventListener("click", dotScroll);
        newDot.addEventListener("mouseenter", dotHover);
        newDot.addEventListener("mouseleave", dotHover);

        dots.appendChild(newDot);
        //offsets.push(-slides[index].offsetTop);
        var toolTipsStr = toolTips[i].innerText;
        toolTips[i].innerText = "";
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
            toolTips[i].appendChild(divEl);
        };

		gsap.fromTo(newDot, {scale: 1, opacity: 0.3}, {
			scrollTrigger: {
				trigger: sections[i],
				scrub: true,
				start: "top 50%",
				end: "top 25%",
//  				markers: true,
			},
			scale: 1.5,
			opacity: 1,
		});

		gsap.fromTo(newDot, {scale: 1.5, opacity: 1}, {
			scrollTrigger: {
				trigger: sections[i],
				scrub: true,
		    	start: "bottom 75%",
		    	end: "bottom 50%",
  				toggleClass: {targets: newDot, className: "active"},
//  				markers: true,
			},
			scale: 1,
			opacity: 0.3,
		});

        gsap.set(newDot, {scale: 1, opacity: 0.3});


        dotHoverToolTip.fromTo(toolTips[i].children, { x: 10, opacity: 0 }, { duration: 0.5, opacity: 1, x: 0, ease: Power3.easeOut, stagger: 0.02 }, "+=0");
        toolTipAnims.push(dotHoverToolTip);
        dotHoverBullet.to(newDot, { duration: 1, scale: 1.25, opacity:0.5, ease: Linear.easeNone }, 0);
        dotAnims.push(dotHoverBullet);
    };

}


function dotHover() {
    toolTipAnims[this.index].reversed() ? toolTipAnims[this.index].timeScale(2).play() : toolTipAnims[this.index].timeScale(1).reverse();

    if (!this.classList.contains("active")) {
        dotAnims[this.index].reversed() ? dotAnims[this.index].timeScale(2).play() : dotAnims[this.index].timeScale(1).reverse();   	
    }
}

function dotScroll() {
 var arwtr=1;
}