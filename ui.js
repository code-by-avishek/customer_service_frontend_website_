/*=========================================================
                    UI HELPERS
=========================================================*/

const UI = {

    /*-------------------------
        Format Currency
    -------------------------*/

    formatPrice(price){

        return new Intl.NumberFormat("en-IN",{

            style:"currency",

            currency:"INR",

            maximumFractionDigits:0

        }).format(price);

    },

    /*-------------------------
        Generate Stars
    -------------------------*/

    generateStars(rating){

        let stars = "";

        const full = Math.floor(rating);

        const half = rating % 1 >= 0.5;

        for(let i=0;i<full;i++){

            stars += '<i class="fas fa-star"></i>';

        }

        if(half){

            stars += '<i class="fas fa-star-half-alt"></i>';

        }

        while((stars.match(/fa-star/g)||[]).length < 5){

            stars += '<i class="far fa-star"></i>';

        }

        return stars;

    },

    /*-------------------------
        Query Helpers
    -------------------------*/

    qs(selector){

        return document.querySelector(selector);

    },

    qsa(selector){

        return [...document.querySelectorAll(selector)];

    }

};




/*=========================================================
                    TOAST
=========================================================*/

UI.showToast = function(message, type = "success") {

    const container = document.querySelector(".toast-container");

    if (!container) return;

    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success}"></i>

        <div class="toast-content">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <p>${message}</p>
        </div>

        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.remove();
    }, 3000);

};




/*=========================================================
                    COUNTERS
=========================================================*/

UI.updateCounters = function(){

    const cartCounter =

        document.querySelectorAll(".cart-count");

    const wishCounter =

        document.querySelectorAll(".wishlist-count");

    cartCounter.forEach(counter=>{

        counter.textContent =

            StorageAPI.getCartCount();

    });

    wishCounter.forEach(counter=>{

        counter.textContent =

            StorageAPI.getWishlistCount();

    });

};


/*=========================================================
                SKELETON LOADING
=========================================================*/

UI.createSkeleton = function(count=8){

    let html = "";

    for(let i=0;i<count;i++){

        html += `

        <div class="product-card skeleton">

            <div class="skeleton-image"></div>

            <div class="skeleton-text"></div>

            <div class="skeleton-text short"></div>

        </div>

        `;

    }

    return html;

};



/*=========================================================
                PRODUCT CARD
=========================================================*/

UI.productCard = function(product){

    return `

    <article class="product-card">

        <div class="product-image">

            <img src="${product.images[0]}"

            alt="${product.name}">

            <span class="badge">

                ${product.badge}

            </span>

            <div class="product-actions">

                <button

                    class="wishlist-btn"

                    data-id="${product.id}">

                    <i class="far fa-heart"></i>

                </button>

                <button

                    class="quick-view-btn"

                    data-id="${product.id}">

                    <i class="fas fa-eye"></i>

                </button>

            </div>

        </div>

        <div class="product-content">

            <span class="category">

                ${product.category}

            </span>

            <h3>

                ${product.name}

            </h3>

            <div class="rating">

                ${UI.generateStars(product.rating)}

                <span>

                    (${product.reviews})

                </span>

            </div>

            <div class="price">

                <span class="new-price">

                    ${UI.formatPrice(product.price)}

                </span>

                <span class="old-price">

                    ${UI.formatPrice(product.oldPrice)}

                </span>

            </div>

            <button

                class="btn add-cart"

                data-id="${product.id}">

                Add to Cart

            </button>

        </div>

        <button class="wishlist-btn ${StorageAPI.wishlistContains(product.id) ? "active": ""}"data-id="${product.id}">
        <i class="fa${StorageAPI.wishlistContains(product.id)? "s": "r"} fa-heart"></i>

        </button>

    </article>

    `;

};




/*=========================================================
                PRODUCT GRID
=========================================================*/

UI.renderProducts = function(

    container,

    products

){

    if(!container) return;

    container.innerHTML =

        products

        .map(

            UI.productCard

        )

        .join("");

};



/*=========================================================
                    EXPORT
=========================================================*/

window.UI = UI;


/*=========================================================
                MODAL MANAGER
=========================================================*/

UI.openModal = function(selector){

    const modal = document.querySelector(selector);

    if(!modal) return;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

};

UI.closeModal = function(selector){

    const modal = document.querySelector(selector);

    if(!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

};

/* Close modal using close button */

document.addEventListener("click",(event)=>{

    if(event.target.matches(".modal-close")){

        const modal = event.target.closest(".modal");

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }

});

/* Close modal using overlay */

document.addEventListener("click",(event)=>{

    if(event.target.matches(".modal-overlay")){

        const modal = event.target.parentElement;

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }

});





/*=========================================================
                QUICK VIEW
=========================================================*/

UI.quickView = function(id){

    const product = ProductAPI.getProductById(id);

    if(!product) return;

    const modalBody = document.querySelector(".modal-product");

    if(!modalBody) return;

    modalBody.innerHTML = `

        <div class="modal-gallery">

            <img src="${product.images[0]}"

            alt="${product.name}">

        </div>

        <div class="modal-info">

            <h2>${product.name}</h2>

            <div class="rating">

                ${UI.generateStars(product.rating)}

                <span>

                    (${product.reviews})

                </span>

            </div>

            <div class="modal-price">

                <span class="new-price">

                    ${UI.formatPrice(product.price)}

                </span>

                <span class="old-price">

                    ${UI.formatPrice(product.oldPrice)}

                </span>

            </div>

            <p>

                ${product.description}

            </p>

            <button

                class="btn add-cart"

                data-id="${product.id}">

                Add To Cart

            </button>

        </div>

    `;

    UI.openModal(".modal");

};




/*=========================================================
                LOADER
=========================================================*/

UI.showLoader = function(){

    const loader = document.querySelector(".loader");

    if(loader){

        loader.classList.add("active");

    }

};

UI.hideLoader = function(){

    const loader = document.querySelector(".loader");

    if(loader){

        loader.classList.remove("active");

    }

};





/*=========================================================
                SMOOTH SCROLL
=========================================================*/

UI.scrollTo = function(selector){

    const element = document.querySelector(selector);

    if(!element) return;

    element.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

};



/*=========================================================
                LAZY LOAD
=========================================================*/

UI.lazyLoad = function(){

    const images =

        document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    const img = entry.target;

                    img.src = img.dataset.src;

                    img.removeAttribute("data-src");

                    observer.unobserve(img);

                }

            });

        },

        {

            threshold:.2

        }

    );

    images.forEach(img=>observer.observe(img));

};


/*=========================================================
                DEBOUNCE
=========================================================*/

UI.debounce = function(fn,delay=300){

    let timer;

    return (...args)=>{

        clearTimeout(timer);

        timer = setTimeout(()=>{

            fn(...args);

        },delay);

    };

};



/*=========================================================
                THROTTLE
=========================================================*/

UI.throttle = function(fn,limit=200){

    let waiting = false;

    return (...args)=>{

        if(waiting) return;

        fn(...args);

        waiting = true;

        setTimeout(()=>{

            waiting = false;

        },limit);

    };

};




/*=========================================================
                EVENTS
=========================================================*/

document.addEventListener("click",(event)=>{

    /* Quick View */

    const quick = event.target.closest(".quick-view-btn");

    if(quick){

        UI.quickView(

            Number(

                quick.dataset.id

            )

        );

    }

});



