var tl = gsap.timeline();
window.addEventListener("DOMContentLoaded", slider);

function locoIntialize() {
  const scroll = new LocomotiveScroll({
    el: document.querySelector(".main"),
    smooth: true,
  });

  // Tell ScrollTrigger to use Locomotive for scrolling
  gsap.registerPlugin(ScrollTrigger);

  scroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(".main", {
    scrollTop(value) {
      return arguments.length
        ? scroll.scrollTo(value, 0, 0)
        : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector(".main").style.transform
      ? "transform"
      : "fixed",
  });

  // Refresh both ScrollTrigger and Locomotive
  ScrollTrigger.addEventListener("refresh", () => scroll.update());
  ScrollTrigger.refresh();
}
locoIntialize();

function swiper() {
  const images = [
    "./Assets/Case_studies_image_1.webp",
    "https://picsum.photos/id/1016/1200/800",
    "https://picsum.photos/id/1018/1200/800",
    "https://picsum.photos/id/1020/1200/800",
  ];

  const slidesContainer = document.getElementById("slides");
  let currentIndex = 0;

  // Create slides dynamically
  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    if (i === 0) slide.classList.add("active");
    slide.style.backgroundImage = `url(${src})`;
    slidesContainer.appendChild(slide);
  });

  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  function showSlide(nextIndex, direction) {
    const current = slides[currentIndex];
    const next = slides[nextIndex];

    // Animate incoming slide
    gsap.fromTo(
      next,
      {
        x: direction === "next" ? "100%" : "-100%",
        rotationY: direction === "next" ? 45 : -45,
        opacity: 0,
      },
      { x: "0%", rotationY: 0, opacity: 1, duration: 1, ease: "power4.out" }
    );

    // Animate outgoing slide
    gsap.to(current, {
      x: direction === "next" ? "-50%" : "50%",
      rotationY: direction === "next" ? -30 : 30,
      opacity: 0,
      duration: 1,
      ease: "power4.in",
    });

    current.classList.remove("active");
    next.classList.add("active");
    currentIndex = nextIndex;
  }

  nextBtn.addEventListener("click", () => {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex, "next");
  });

  prevBtn.addEventListener("click", () => {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex, "prev");
  });

  // Common function for showing/hiding arrows
  function showArrow(arrow, xMove) {
    gsap.to(arrow, { opacity: 1, x: xMove, duration: 0.3 });
  }
  function hideArrow(arrow) {
    gsap.to(arrow, { opacity: 0, x: 0, duration: 0.3 });
  }

  const hoverLeft = document.querySelector(".hover-left");
  const hoverRight = document.querySelector(".hover-right");

  // LEFT
  hoverLeft.addEventListener("mouseenter", () => showArrow(prevBtn, 15));
  hoverLeft.addEventListener("mouseleave", (e) => {
    if (!prevBtn.matches(":hover")) hideArrow(prevBtn); // only hide if not hovering on arrow
  });
  prevBtn.addEventListener("mouseleave", () => hideArrow(prevBtn));
  prevBtn.addEventListener("mouseenter", () => showArrow(prevBtn, 15));

  // RIGHT
  hoverRight.addEventListener("mouseenter", () => showArrow(nextBtn, -15));
  hoverRight.addEventListener("mouseleave", (e) => {
    if (!nextBtn.matches(":hover")) hideArrow(nextBtn);
  });
  nextBtn.addEventListener("mouseleave", () => hideArrow(nextBtn));
  nextBtn.addEventListener("mouseenter", () => showArrow(nextBtn, -15));
}

swiper();

function slider() {
  const carousel = document.querySelector(".carousel"),
    firstImg = carousel.querySelectorAll(".imgContainer")[0],
    arrowIcons = document.querySelectorAll("#slider i");

  let isDragStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;
  const showHideIcons = function () {
    // Showing and Hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display =
      carousel.scrollLeft == scrollWidth ? "none" : "block";
  };

  arrowIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
      let firstImgWidth = firstImg.clientWidth + 14; // 14 margin
      carousel.scrollLeft +=
        icon.id === "left" ? -firstImgWidth : firstImgWidth;
      setTimeout(showHideIcons, 60);
    });
  });

  const autoSlide = function () {
    // if there is no img left to scroll then return from here
    if (carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth)
      return;

    positionDiff = Math.abs(positionDiff);
    let firstImgWidth = firstImg.clientWidth + 14;

    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = firstImgWidth - positionDiff;
    if (carousel.scrollLeft > prevScrollLeft) {
      // if user is scrolling to the right
      return (carousel.scrollLeft +=
        positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
    }
    // if user is scrolling to the left
    carousel.scrollLeft -=
      positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
  };

  const dragStart = function (e) {
    // Updating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
  };

  const dragging = function (e) {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
  };

  const dragStop = function () {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if (!isDragging) return;
    isDragging = false;
    autoSlide();
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("touchstart", dragStart);

  carousel.addEventListener("mousemove", dragging);
  carousel.addEventListener("touchmove", dragging);

  carousel.addEventListener("mouseup", dragStop);
  carousel.addEventListener("mouseleave", dragStop);
  carousel.addEventListener("touchend", dragStop);
}
slider();

function industryCarousel() {
  // Data array jisme aap images, number, heading aur description rakhoge
  const carouselData = [
    {
      number: 1,
      title: "Foodtech",
      desc: "Smart solutions to simplify ordering, delivery, and customer engagement.",
      img: "./Assets/Industry-1.webp",
    },
    {
      number: 2,
      title: "Traveltech",
      desc: "Seamless platforms for bookings, itineraries, and personalized travel experiences.",
      img: "./Assets/Industry-2.webp",
    },
    {
      number: 3,
      title: "Healthcare",
      desc: "Digital tools that enhance patient care, access, and efficiency.",
      img: "./Assets/Industry-3.webp",
    },
    {
      number: 4,
      title: "Edtech",
      desc: "Smart learning tools to empower students and educators.",
      img: "./Assets/Industry-4.webp",
    },
  ];

  // Carousel container select karo
  const carousel = document.querySelector(".carousel");

  // Loop karke dynamic HTML inject karo
  carouselData.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("imgContainer");
    div.setAttribute("draggable", "false");

    div.innerHTML = `
    <div class="number-wrapper">
        <div class="number">
            <p>${item.number}</p>
        </div>
    </div>
    <div class="innerContainer">
        <h1>${item.title}</h1>
        <p>${item.desc}</p>
    </div>
    <img src="${item.img}" alt="${item.title}">
  `;

    carousel.appendChild(div);
  });
}
industryCarousel();

function portfolioProjects() {
  const projectImages = [
    {
      imageUrl: "./Assets/Project-1.webp",
      type: "Mobile App",
      typeIcon: "./Assets/mobile-icon.svg",
      softwareUsedIcon: "./Assets/flutter-icon.svg",
    },
    {
      imageUrl: "./Assets/Project-2.webp",
      type: "Web App",
      typeIcon: "./Assets/react-icon.svg",
      softwareUsedIcon: "./Assets/react-icon.svg",
    },
    {
      imageUrl: "./Assets/Project-3.webp",
      type: "Mobile App",
      typeIcon: "./Assets/mobile-icon.svg",
      softwareUsedIcon: "./Assets/react-icon.svg",
    },
  ];

  // Select all existing project cards
  const projectCards = document.querySelectorAll(".project-card");

  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour12: false });
  }

  // Loop through cards and set dynamic content
  projectCards.forEach((card, index) => {
    const data = projectImages[index];

    if (!data) return; // Skip if no data

    // Set background image
    const projectImageDiv = card.querySelector(".project-image");
    projectImageDiv.style.backgroundImage = `url('${data.imageUrl}')`;
    projectImageDiv.style.backgroundSize = "cover";
    projectImageDiv.style.backgroundPosition = "center";

    // Set description
    const projectTypeP = projectImageDiv.querySelector(".descr-title p");
    const typeIconImg = projectImageDiv.querySelector(".project-type img");
    const softwareIconImg = projectImageDiv.querySelector(
      ".softaware-used img"
    );

    if (projectTypeP) projectTypeP.textContent = data.type;
    if (typeIconImg) typeIconImg.src = data.typeIcon;
    if (softwareIconImg) softwareIconImg.src = data.softwareUsedIcon;

    // Set live clock
    const clockText = projectImageDiv.querySelector(".clock p");
    if (clockText) clockText.textContent = getTime();
  });

  // Update clock every second
  setInterval(() => {
    document
      .querySelectorAll(".project-card .project-image .clock p")
      .forEach((clock) => {
        clock.textContent = getTime();
      });
  }, 1000);
}

portfolioProjects();

function testimonial() {
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector(
    "#seventh-section .testimonial-wrapper"
  );

  ScrollTrigger.create({
    trigger: "#seventh-section",
    start: "top top",
    end: "+=150%",
    scrub: true,
    pin: true,
    onUpdate: (self) => {
      if (self.progress > 0.2) {
        // inline cards
        gsap.to(wrapper, {
          flexDirection: "row",
          gap: "2rem",
          duration: 1,
          ease: "power2.out",
        });
        gsap.to(".testimonial-card", {
          width: "20rem",
          duration: 1,
          ease: "power2.out",
        });
      } else {
        // back to stacked
        gsap.to(wrapper, {
          flexDirection: "column",
          duration: 1,
          ease: "power2.in",
        });
        gsap.to(".testimonial-card", {
          width: "100%",
          duration: 1,
          ease: "power2.in",
        });
      }
    },
  });
}
// testimonial();
function brandColor() {
  document.addEventListener("DOMContentLoaded", function () {
    // List of scroll lines to target
    const scrollLines = ["scroll-line3", "scroll-line4"];

    // Example data (replace or customize for each scroll line if needed)
    const brands = [
      { name: "Light Foot", logo: "https://via.placeholder.com/40x40?text=A" },
      { name: "Fast Wheels", logo: "https://via.placeholder.com/40x40?text=B" },
      { name: "Red Runner", logo: "https://via.placeholder.com/40x40?text=C" },
      { name: "Dark Speed", logo: "https://via.placeholder.com/40x40?text=D" },
      { name: "Power Drive", logo: "https://via.placeholder.com/40x40?text=E" },
      { name: "Mega Ride", logo: "https://via.placeholder.com/40x40?text=F" },
    ];

    scrollLines.forEach((lineId) => {
      const scrollItem = document.querySelector(`#${lineId} .scroll-item`);
      if (!scrollItem) return;

      brands.forEach((brand, index) => {
        // create button
        const btn = document.createElement("button");
        btn.classList.add("brand-name");

        // top line
        const topLine = document.createElement("div");
        topLine.classList.add("top-line");

        // logo
        const logo = document.createElement("div");
        logo.classList.add("brand-logo");
        logo.style.backgroundImage = `url(${brand.logo})`;

        // name
        const name = document.createElement("p");
        name.classList.add("name");
        name.textContent = brand.name;

        // append elements
        btn.appendChild(topLine);
        btn.appendChild(logo);
        btn.appendChild(name);
        scrollItem.appendChild(btn);

        // style (repeat every 3 cards)
        const pattern = index % 3;
        if (pattern === 0) {
          btn.style.background = "white";
          name.style.color = "#ed313a";
          topLine.style.background = "#ed313a";
          logo.style.backgroundColor = "#383636";
        } else if (pattern === 1) {
          btn.style.background = "#ed313a";
          name.style.color = "white";
          topLine.style.background = "white";
          logo.style.backgroundColor = "#383636";
        } else {
          btn.style.background = "#383636";
          btn.style.border = "2px solid white";
          name.style.color = "white";
          topLine.style.background = "white";
          topLine.style.border = "1px solid white";
          logo.style.backgroundColor = "#ed313a";
        }
      });
    });
  });
}

brandColor();
function tagScroller() {
  const scrollLines = document.querySelectorAll(".scroll-line");

  scrollLines.forEach((line) => {
    const startX = line.dataset.start || "100%"; // default 100% agar data attribute na ho
    const scrollItems = line.querySelectorAll(".scroll-item");

    scrollItems.forEach((item) => {
      gsap.fromTo(
        item,
        { x: startX },
        {
          x: "0%",
          ease: "power3.out",
          scrollTrigger: {
            scroller: ".main",
            trigger: item,
            start: "top 80%",
            end: "bottom 0%",
            scrub: 4,
            markers: true,
          },
        }
      );
    });
  });
}

tagScroller();
