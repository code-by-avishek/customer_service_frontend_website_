/*=========================================================
                    STORAGE KEYS
=========================================================*/

const STORAGE_KEYS = {

    CART: "woodcraft_cart",

    WISHLIST: "woodcraft_wishlist",

    THEME: "woodcraft_theme",

    RECENT: "woodcraft_recent",

    USER: "woodcraft_user"

};

/*=========================================================
                    STORAGE MANAGER
=========================================================*/

class StorageManager {

    /*-------------------------
            GET
    -------------------------*/

    static get(key){

        try{

            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : null;

        }

        catch(error){

            console.error(error);

            return null;

        }

    }

    /*-------------------------
            SET
    -------------------------*/

    static set(key,value){

        try{

            localStorage.setItem(

                key,

                JSON.stringify(value)

            );

            return true;

        }

        catch(error){

            console.error(error);

            return false;

        }

    }

    /*-------------------------
            REMOVE
    -------------------------*/

    static remove(key){

        localStorage.removeItem(key);

    }

    /*-------------------------
            CLEAR
    -------------------------*/

    static clear(){

        localStorage.clear();

    }

}


/*=========================================================
                    CART
=========================================================*/

function getCart(){

    return StorageManager.get(STORAGE_KEYS.CART) || [];

}

function saveCart(cart){

    return StorageManager.set(

        STORAGE_KEYS.CART,

        cart

    );

}

function addToCart(id,quantity=1,product=null){

    const cart = getCart();

    const item = cart.find(

        product => product.id === id

    );

    if(item){

        item.quantity += quantity;

        if(product){

            item.product = product;

        }

    }

    else{

        cart.push({

            id,

            quantity,

            ...(product ? {product} : {})

        });

    }

    if(!saveCart(cart)){

        return null;

    }

    return cart;

}

function removeFromCart(id){

    const cart = getCart()

        .filter(

            item => item.id !== id

        );

    saveCart(cart);

    return cart;

}

function updateCartQuantity(id,quantity){

    const cart = getCart();

    const item = cart.find(

        p => p.id === id

    );

    if(item){

        item.quantity = quantity;

    }

    saveCart(cart);

    return cart;

}

function clearCart(){

    saveCart([]);

}


/*=========================================================
                    WISHLIST
=========================================================*/

function getWishlist(){

    return StorageManager.get(

        STORAGE_KEYS.WISHLIST

    ) || [];

}

function saveWishlist(list){

    StorageManager.set(

        STORAGE_KEYS.WISHLIST,

        list

    );

}

function addToWishlist(id){

    const list = getWishlist();

    if(!list.includes(id)){

        list.push(id);

    }

    saveWishlist(list);

}

function removeFromWishlist(id){

    const list = getWishlist()

        .filter(

            item => item !== id

        );

    saveWishlist(list);

}

function wishlistContains(id){

    return getWishlist()

        .includes(id);

}

function clearWishlist(){

    saveWishlist([]);

}



/*=========================================================
                    THEME
=========================================================*/

function saveTheme(theme){

    StorageManager.set(

        STORAGE_KEYS.THEME,

        theme

    );

}

function getTheme(){

    return StorageManager.get(

        STORAGE_KEYS.THEME

    ) || "light";

}




/*=========================================================
                    COUNTERS
=========================================================*/

function getCartCount(){

    return getCart()

        .reduce(

            (total,item)=>

            total + item.quantity,

            0

        );

}

function getWishlistCount(){

    return getWishlist().length;

}




/*=========================================================
                    EXPORT
=========================================================*/

window.StorageAPI = {

    get: StorageManager.get,

    set: StorageManager.set,

    getCart,

    saveCart,

    addToCart,

    removeFromCart,

    updateCartQuantity,

    clearCart,

    getWishlist,

    addToWishlist,

    removeFromWishlist,

    wishlistContains,

    clearWishlist,

    getCartCount,

    getWishlistCount,

    saveTheme,

    getTheme

};