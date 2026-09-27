/*=========================================================
                MAIN APPLICATION
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    App.init();

});

const App={

    /*------------------------------------
            INITIALIZE
    ------------------------------------*/

    init(){

        this.loader();

        this.navbar();

        this.mobileMenu();

        this.theme();

        this.heroSlider();

        this.scrollProgress();

        this.backToTop();

        this.initializeCounters();

        UI.lazyLoad();

        this.touchSlider();

        this.scrollAnimations();

        this.countdown();

        this.newsletter();

    },

    /*------------------------------------
            COUNTERS
    ------------------------------------*/

    initializeCounters(){

        UI.updateCounters();

    },

    /*------------------------------------
            PAGE LOADER
    ------------------------------------*/

    loader(){

        window.addEventListener("load",()=>{

            const loader=document.querySelector(".loader");

            if(!loader) return;

            loader.classList.add("hide");

            setTimeout(()=>{

                loader.remove();

            },600);

        });

    },

    /*------------------------------------
            STICKY NAVBAR
    ------------------------------------*/

    navbar(){

        const header=document.querySelector(".header");

        if(!header) return;

        const onScroll=UI.throttle(()=>{

            if(window.scrollY>80){

                header.classList.add("scrolled");

            }

            else{

                header.classList.remove("scrolled");

            }

        },50);

        window.addEventListener("scroll",onScroll);

    },

    /*------------------------------------
            MOBILE MENU
    ------------------------------------*/

    mobileMenu(){

        const menuBtn=document.querySelector(".menu-btn");

        const nav=document.querySelector(".nav-links");

        const overlay=document.querySelector(".mobile-overlay");

        if(!menuBtn || !nav || !overlay) return;

        menuBtn.addEventListener("click",()=>{

            nav.classList.toggle("active");

            overlay.classList.toggle("active");

            document.body.classList.toggle("menu-open");

        });

        overlay.addEventListener("click",()=>{

            nav.classList.remove("active");

            overlay.classList.remove("active");

            document.body.classList.remove("menu-open");

        });

    }

};



/*=========================================================
                    THEME
=========================================================*/

App.theme=function(){

    const toggle=document.querySelector(".theme-toggle");

    if(!toggle) return;

    const saved=StorageAPI.getTheme();

    if(saved==="dark"){

        document.body.classList.add("dark");

    }

    toggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        const theme=

            document.body.classList.contains("dark")

            ? "dark"

            : "light";

        StorageAPI.saveTheme(theme);

    });

};



/*=========================================================
                SCROLL PROGRESS
=========================================================*/

App.scrollProgress=function(){

    const bar=document.querySelector(".progress-bar");

    if(!bar) return;

    const update=UI.throttle(()=>{

        const total=

            document.documentElement.scrollHeight-

            window.innerHeight;

        const progress=

            (window.scrollY/total)*100;

        bar.style.width=progress+"%";

    },20);

    window.addEventListener("scroll",update);

};

/*=========================================================
                BACK TO TOP
=========================================================*/

App.backToTop=function(){

    const button=document.querySelector(".back-to-top");

    if(!button) return;

    window.addEventListener("scroll",

        UI.throttle(()=>{

            button.classList.toggle(

                "show",

                window.scrollY>500

            );

        },100)

    );

    button.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

};




/*=========================================================
                HERO SLIDER
=========================================================*/

App.heroSlider=function(){

    const slides=document.querySelectorAll(".hero-slide");

    if(!slides.length) return;

    const prev=document.querySelector(".hero-prev");
    const next=document.querySelector(".hero-next");
    const dots=document.querySelectorAll(".hero-dot");

    let current=0;
    let interval;

    function showSlide(index){

        if(index>=slides.length) index=0;
        if(index<0) index=slides.length-1;

        slides.forEach(slide=>{

            slide.classList.remove("active");

        });

        dots.forEach(dot=>{

            dot.classList.remove("active");

        });

        slides[index].classList.add("active");

        if(dots[index]){

            dots[index].classList.add("active");

        }

        current=index;

    }

    function nextSlide(){

        showSlide(current+1);

    }

    function previousSlide(){

        showSlide(current-1);

    }

    function start(){

        interval=setInterval(nextSlide,5000);

    }

    function stop(){

        clearInterval(interval);

    }

    if(next){

        next.addEventListener("click",()=>{

            stop();
            nextSlide();
            start();

        });

    }

    if(prev){

        prev.addEventListener("click",()=>{

            stop();
            previousSlide();
            start();

        });

    }

    dots.forEach((dot,index)=>{

        dot.addEventListener("click",()=>{

            stop();
            showSlide(index);
            start();

        });

    });

    document.addEventListener("keydown",(event)=>{

        if(event.key==="ArrowRight"){

            stop();
            nextSlide();
            start();

        }

        if(event.key==="ArrowLeft"){

            stop();
            previousSlide();
            start();

        }

    });

    showSlide(0);

    start();

};





/*=========================================================
                TOUCH SWIPE
=========================================================*/

App.touchSlider=function(){

    const slider=document.querySelector(".hero");

    if(!slider) return;

    let startX=0;

    slider.addEventListener("touchstart",(event)=>{

        startX=event.touches[0].clientX;

    });

    slider.addEventListener("touchend",(event)=>{

        const endX=event.changedTouches[0].clientX;

        const distance=startX-endX;

        if(Math.abs(distance)<60) return;

        if(distance>0){

            document.querySelector(".hero-next")?.click();

        }else{

            document.querySelector(".hero-prev")?.click();

        }

    });

};



/*=========================================================
                SCROLL ANIMATION
=========================================================*/

App.scrollAnimations=function(){

    const elements=document.querySelectorAll(

        ".animate"

    );

    if(!elements.length) return;

    const observer=new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.classList.add("fade-in");

                    observer.unobserve(entry.target);

                }

            });

        },

        {

            threshold:.15

        }

    );

    elements.forEach(item=>{

        observer.observe(item);

    });

};


/*=========================================================
                COUNTDOWN
=========================================================*/

App.countdown=function(){

    const boxes=document.querySelectorAll(".time-box h3");

    if(boxes.length!==4) return;

    const end=new Date();

    end.setDate(end.getDate()+5);

    function update(){

        const now=new Date();

        const diff=end-now;

        if(diff<=0) return;

        const days=Math.floor(diff/86400000);

        const hours=Math.floor(diff%86400000/3600000);

        const minutes=Math.floor(diff%3600000/60000);

        const seconds=Math.floor(diff%60000/1000);

        boxes[0].textContent=days;
        boxes[1].textContent=hours;
        boxes[2].textContent=minutes;
        boxes[3].textContent=seconds;

    }

    update();

    setInterval(update,1000);

};




/*=========================================================
                NEWSLETTER
=========================================================*/

App.newsletter=function(){

    const form=document.querySelector(

        ".newsletter-form"

    );

    if(!form) return;

    form.addEventListener("submit",(event)=>{

        event.preventDefault();

        const input=form.querySelector("input");

        const email=input.value.trim();

        if(email===""){

            UI.showToast(

                "Please enter your email.",

                "error"

            );

            return;

        }

        UI.showToast(

            "Subscribed successfully!"

        );

        form.reset();

    });

};