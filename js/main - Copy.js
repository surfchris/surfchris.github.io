gsap.registerPlugin(ScrollTrigger);

const bgVvideo = document.querySelector("#bgVideo");

bgVideo.pause();
bgVideo.currentTime = 0;
let bgVideoTl = gsap.timeline({ paused: true, reversed: true });
bgVideoTl.to(bgVideo, { duration: 20, currentTime: 20, ease: "none" })

// for (var i = 0; i < 10; i++) {
    gsap.fromTo(bgVideo, {currentTime: 0}, {
        scrollTrigger: {
          trigger: document.body,
          scrub: 5,
          start: "top bottom",
          end: "bottom bottom",
    // 			markers: true,
        },
        currentTime: 20,
        duration: 20,
        ease: "none",
    });
// };