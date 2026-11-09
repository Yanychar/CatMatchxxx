import {
    CATEGORY_MATCHER_ADD_ALL_PRODUCTS_DONE,
    CATEGORY_MATCHER_ADD_ALL_PRODUCTS_ERR,
    CATEGORY_MATCHER_ADD_ALL_PRODUCTS_REQ,
    CATEGORY_MATCHER_ADD_PRODUCT_DONE,
    CATEGORY_MATCHER_ADD_PRODUCT_ERR,
    CATEGORY_MATCHER_ADD_PRODUCT_REQ,
    CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_DONE,
    CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_ERR,
    CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_REQ,
    CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_DONE,
    CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_ERR,
    CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_REQ,
    CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_DONE,
    CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_ERR,
    CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_REQ,
    CATEGORY_MATCHER_CLEAR_SOURCE_CATEGORY_SEARCH,
    CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_DONE,
    CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_ERR,
    CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_REQ,
    CATEGORY_MATCHER_REMOVE_PRODUCT_DONE,
    CATEGORY_MATCHER_REMOVE_PRODUCT_ERR,
    CATEGORY_MATCHER_REMOVE_PRODUCT_REQ,
    CATEGORY_MATCHER_SELECT_CATEGORY_DONE,
    CATEGORY_MATCHER_SELECT_CATEGORY_ERR,
    CATEGORY_MATCHER_SELECT_CATEGORY_REQ,
    CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_DONE,
    CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_ERR,
    CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ,
    CATEGORY_MATCHER_SELECT_PRODUCT,
    CATEGORY_MATCHER_CLEAR_EXTERNAL_SELECTION,
    CATEGORY_MATCHER_CLEAR_SUGGESTIONS,
    CATEGORY_MATCHER_DISMISS_SUGGESTIONS,
    CATEGORY_MATCHER_SELECT_TYPEOF,
    CATEGORY_MATCHER_SUGGEST_CATEGORIES_DONE,
    CATEGORY_MATCHER_SUGGEST_CATEGORIES_ERR,
    CATEGORY_MATCHER_SUGGEST_CATEGORIES_REQ
} from "./categoryMatcherActions";

const initialState = {
    category: {
        loadProgress:false,
        items:[
         ]
    },
    categoryProducts: {
        byCategoryId: {},
    },
    sourceCatalog: {
        categories: [],
        loadingByCategoryId: {},
        errorByCategoryId: {},
        loadedByCategoryId: {},
        loadingRoot: false,
        search: {
            needle: '',
            items: [],
            loading: false,
            error: false,
        },
    },
    externalCatalog: {
        typeOfs: [],
        lastSelected: 0,
        selected:[],
        load:true,
        categories:[],
        scrollTargetId: 0,
    },
    selectedProductId: 0,
    productSuggestions: {
        productId: 0,
        loading: false,
        error: false,
        errorMsg: '',
        items: [],
        dismissed: false,
    },
    marketplaces: [],
    marketplaceId: 1,
};

export default function (state = initialState, action) {
    const pl = action.payload;
    let ns = state;
    switch (action.type) {
        case CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ:{
            ns = {...ns, externalCatalog: {...ns.externalCatalog, selected:ns.externalCatalog.selected.slice()}}
            ns.externalCatalog.selected[pl.params.level] = pl.params.catId;
            ns.externalCatalog.lastSelected = pl.params.catId;
            ns.externalCatalog.selected.splice(pl.params.level+1)
            ns.externalCatalog.currentTypeOf = 0;
            ns.externalCatalog.typeOfs = [];
            ns.externalCatalog.scrollTargetId = pl.params.catId;
            if(!pl.params.notEmpty) {
                ns.externalCatalog.progress = true;
                ns.externalCatalog.errorMsg = false
            }

            break;
        }
        case CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_DONE:{
//            console.log(pl.response)
            ns = {...ns,externalCatalog:{...ns.externalCatalog}}
            ns.externalCatalog.progress = false
            ns.externalCatalog.typeOfs = pl.response.typeOfs;
            if(ns.externalCatalog.typeOfs.length > 0){
                ns.externalCatalog.currentTypeOf = ns.externalCatalog.typeOfs[0].id;
            }
            break
        }
        case CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_ERR:{
//            console.log(pl);
            ns = {...ns,externalCatalog:{...ns.externalCatalog}}
            ns.externalCatalog.progress = false
            ns.externalCatalog.errorMsg = pl.response.msg


            break
        }



        case CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_REQ:{
            ns = {...ns, externalCatalog: {...ns.externalCatalog, load:true, loadErr:false, loadMsg:false}}
            break;
        }
        case CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_DONE:{
            ns = {...ns,
                externalCatalog: {...ns.externalCatalog, load:false, categories:pl.response},
                categoryProducts: {byCategoryId: {}},
                selectedProductId: 0,
                productSuggestions: {
                    productId: 0,
                    loading: false,
                    error: false,
                    errorMsg: '',
                    items: [],
                    dismissed: false,
                },
            }
            if(+ns.marketplaceId !== +pl.params){
                ns.category = {loadProgress: false, items: []};
                ns.marketplaceId = pl.params
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_ERR:{
            ns = {...ns, externalCatalog: {...ns.externalCatalog, load:false, loadErr:false, loadMsg:pl.response}}
            break;
        }
        case CATEGORY_MATCHER_SELECT_CATEGORY_REQ:{
            ns = {...state, category:{...pl.params, items:[], loadingProgress:true, loadingError:false, loadingMsg:false}}
            break;
        }
        case CATEGORY_MATCHER_SELECT_CATEGORY_DONE:{
            getCategoryById(-1, ns.externalCatalog.categories, (cat, categories, id)=>{
                if(Array.isArray(categories[id].products) && categories[id].products.length > 0){
                    categories[id] = {...categories[id], products:[]}
                }
            })
            for(const i of pl.response.data ?? []){
                if(!i.categories){
                    i.categories = [];
                }else {
                    const newCategories = []
                    for(let cn in i.categories) {
                        getCategoryById(i.categories[cn], ns.externalCatalog.categories, (cat, categories, n) => {
                            const products = cat.products ? cat.products.slice() : [];
                            products.unshift(i)
                            newCategories.push(cat)
                            return {...cat, products: products}
                        })
                    }
                    i.categories = newCategories;
                }
            }
            ns = {...state,
                category:{...state.category, items:pl.response.data ?? [], loadingProgress:false},
                externalCatalog:{...ns.externalCatalog, categories:ns.externalCatalog.categories.slice()}
            }
            break;
        }
        case CATEGORY_MATCHER_SELECT_CATEGORY_ERR:{
            ns = {...state, category:{...state.category, loadingProgress:false, loadingError:true, loadingMsg:pl.response}}
            break;
        }
        case CATEGORY_MATCHER_CLEAR_EXTERNAL_SELECTION:{
            ns = {
                ...ns,
                externalCatalog: {
                    ...ns.externalCatalog,
                    lastSelected: 0,
                    selected: [],
                    currentTypeOf: 0,
                    typeOfs: [],
                    progress: false,
                    errorMsg: false,
                    scrollTargetId: 0,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_SELECT_PRODUCT:{
            ns = {
                ...ns,
                selectedProductId: parseInt(pl.productId),
                productSuggestions: {
                    productId: parseInt(pl.productId),
                    loading: false,
                    error: false,
                    errorMsg: '',
                    items: [],
                    dismissed: false,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_CLEAR_SUGGESTIONS:{
            ns = {
                ...ns,
                productSuggestions: {
                    productId: parseInt(pl.productId),
                    loading: false,
                    error: false,
                    errorMsg: '',
                    items: [],
                    dismissed: false,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_DISMISS_SUGGESTIONS:{
            ns = {
                ...ns,
                productSuggestions: {
                    productId: parseInt(pl.productId),
                    loading: false,
                    error: false,
                    errorMsg: '',
                    items: [],
                    dismissed: true,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_SUGGEST_CATEGORIES_REQ:{
            ns = {
                ...ns,
                productSuggestions: {
                    productId: parseInt(pl.params.productId),
                    loading: true,
                    error: false,
                    errorMsg: '',
                    items: [],
                    dismissed: false,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_SUGGEST_CATEGORIES_DONE:{
            ns = {
                ...ns,
                productSuggestions: {
                    productId: parseInt(pl.params.productId),
                    loading: false,
                    error: false,
                    errorMsg: '',
                    items: Array.isArray(pl.response) ? pl.response : [],
                    dismissed: false,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_SUGGEST_CATEGORIES_ERR:{
            ns = {
                ...ns,
                productSuggestions: {
                    productId: parseInt(pl.params.productId),
                    loading: false,
                    error: true,
                    errorMsg: pl.response,
                    items: [],
                    dismissed: false,
                }
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_REQ:{
            const cacheId = pl.params.cacheId;
            const loadingByCategoryId = ns.sourceCatalog.loadingByCategoryId ?? {};
            const errorByCategoryId = ns.sourceCatalog.errorByCategoryId ?? {};
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    loadingRoot: cacheId === 'root' ? true : ns.sourceCatalog.loadingRoot,
                    loadingByCategoryId: {
                        ...loadingByCategoryId,
                        [cacheId]: true,
                    },
                    errorByCategoryId: {
                        ...errorByCategoryId,
                        [cacheId]: false,
                    },
                }
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_DONE:{
            const cacheId = pl.params.cacheId;
            const categoryId = pl.params.categoryId;
            const loadingByCategoryId = ns.sourceCatalog.loadingByCategoryId ?? {};
            const loadedByCategoryId = ns.sourceCatalog.loadedByCategoryId ?? {};
            const categories = normalizeSourceCategories(extractCategoryItems(pl.response));
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    categories: categoryId > 0
                        ? setSourceCategoryChildren(ns.sourceCatalog.categories, categoryId, categories)
                        : categories,
                    loadingRoot: cacheId === 'root' ? false : ns.sourceCatalog.loadingRoot,
                    loadingByCategoryId: {
                        ...loadingByCategoryId,
                        [cacheId]: false,
                    },
                    loadedByCategoryId: {
                        ...loadedByCategoryId,
                        [cacheId]: true,
                    },
                }
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_ERR:{
            const cacheId = pl.params.cacheId;
            const loadingByCategoryId = ns.sourceCatalog.loadingByCategoryId ?? {};
            const errorByCategoryId = ns.sourceCatalog.errorByCategoryId ?? {};
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    loadingRoot: cacheId === 'root' ? false : ns.sourceCatalog.loadingRoot,
                    loadingByCategoryId: {
                        ...loadingByCategoryId,
                        [cacheId]: false,
                    },
                    errorByCategoryId: {
                        ...errorByCategoryId,
                        [cacheId]: pl.response,
                    },
                }
            }
            break;
        }
        case CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_REQ:{
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    search: {
                        needle: pl.params.needle,
                        items: [],
                        loading: true,
                        error: false,
                    },
                },
            }
            break;
        }
        case CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_DONE:{
            if (ns.sourceCatalog.search?.needle !== pl.params.needle) {
                break;
            }
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    search: {
                        needle: pl.params.needle,
                        items: normalizeSourceCategories(extractCategoryItems(pl.response)),
                        loading: false,
                        error: false,
                    },
                },
            }
            break;
        }
        case CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_ERR:{
            if (ns.sourceCatalog.search?.needle !== pl.params.needle) {
                break;
            }
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    search: {
                        needle: pl.params.needle,
                        items: [],
                        loading: false,
                        error: pl.response,
                    },
                },
            }
            break;
        }
        case CATEGORY_MATCHER_CLEAR_SOURCE_CATEGORY_SEARCH:{
            ns = {
                ...ns,
                sourceCatalog: {
                    ...ns.sourceCatalog,
                    search: {
                        needle: '',
                        items: [],
                        loading: false,
                        error: false,
                    },
                },
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_REQ:{
            const categoryId = pl.params.categoryId;
            const byCategoryId = ns.categoryProducts.byCategoryId ?? {};
            ns = {
                ...ns,
                categoryProducts: {
                    ...ns.categoryProducts,
                    byCategoryId: {
                        ...byCategoryId,
                        [categoryId]: {
                            ...(byCategoryId[categoryId] ?? {}),
                            category: pl.params.category,
                            loading: true,
                            error: false,
                        }
                    }
                }
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_DONE:{
            const categoryId = pl.params.categoryId;
            const byCategoryId = ns.categoryProducts.byCategoryId ?? {};
            ns = {
                ...ns,
                externalCatalog: {
                    ...ns.externalCatalog,
                    categories: ns.externalCatalog.categories.slice(),
                },
            }
            const products = normalizeProducts(pl.response.data ?? [], ns.externalCatalog.categories);
            ns = {
                ...ns,
                categoryProducts: {
                    ...ns.categoryProducts,
                    byCategoryId: {
                        ...byCategoryId,
                        [categoryId]: {
                            category: pl.params.category,
                            loading: false,
                            error: false,
                            items: products,
                        }
                    }
                }
            }
            break;
        }
        case CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_ERR:{
            const categoryId = pl.params.categoryId;
            const byCategoryId = ns.categoryProducts.byCategoryId ?? {};
            ns = {
                ...ns,
                categoryProducts: {
                    ...ns.categoryProducts,
                    byCategoryId: {
                        ...byCategoryId,
                        [categoryId]: {
                            ...(byCategoryId[categoryId] ?? {}),
                            category: pl.params.category,
                            loading: false,
                            error: pl.response,
                        }
                    }
                }
            }
            break;
        }
        case CATEGORY_MATCHER_ADD_PRODUCT_REQ:{
            const id = parseInt(pl.params.id);
            for(let n in ns.category.items){
                if(parseInt(ns.category.items[n].id) === id){
                    ns = {...ns, category:{...ns.category, items:ns.category.items.slice(),}}
                    ns.category.items[n] = {...ns.category.items[n], addProgress:true, addError:false, addMsg:false}
                    break;
                }
            }
            ns = updateCachedProduct(ns, id, (item) => ({
                ...item,
                addProgress: true,
                addError: false,
                addMsg: false,
            }))
            break;
        }
        case CATEGORY_MATCHER_ADD_PRODUCT_DONE:{
            const id = parseInt(pl.params.id);
            let addedCategory = false;
            for(let n in ns.category.items){
                if(parseInt(ns.category.items[n].id) === id){
                    ns = {...ns,
                        category:{
                            ...ns.category,
                            items:ns.category.items.slice(),
                        },
                        externalCatalog: {
                            ...ns.externalCatalog,
                            categories:ns.externalCatalog.categories.slice(),
                        }
                    }
                    getCategoryById(pl.params.catId, ns.externalCatalog.categories, (cat, categories, id)=>{
                        categories[id].products = categories[id].products?categories[id].products.slice():[]
                        categories[id].products.push(ns.category.items[n])
                        ns.category.items[n] = {
                            ...ns.category.items[n],
                            addProgress:false,
                            categories: ns.category.items[n].categories?ns.category.items[n].categories.slice():[]
                        }
                        ns.category.items[n].categories.push(categories[id])
                        addedCategory = categories[id];
                        return categories[id]
                    })
                    break;
                }
            }
            if (!addedCategory) {
                ns = {
                    ...ns,
                    externalCatalog: {
                        ...ns.externalCatalog,
                        categories: ns.externalCatalog.categories.slice(),
                    }
                }
                const cachedProduct = getCachedProduct(ns, id);
                addedCategory = getCategoryById(pl.params.catId, ns.externalCatalog.categories, (cat) => {
                    if (!cachedProduct) {
                        return cat;
                    }
                    const products = cat.products ? cat.products.slice() : [];
                    if (!products.some((product) => parseInt(product.id) === id)) {
                        products.push(cachedProduct);
                    }
                    return {...cat, products: products};
                });
            }
            ns = updateCachedProduct(ns, id, (item) => {
                const categories = item.categories ? item.categories.slice() : [];
                if (addedCategory && !categories.some((cat) => parseInt(cat.id) === parseInt(addedCategory.id))) {
                    categories.push(addedCategory);
                }
                return {
                    ...item,
                    addProgress: false,
                    categories: categories,
                }
            })
            break;
        }
        case CATEGORY_MATCHER_ADD_PRODUCT_ERR:{
            const id = parseInt(pl.params.id);
            for(let n in ns.category.items){
                if(parseInt(ns.category.items[n].id) === id){
                    ns = {...ns, category:{...ns.category, items:ns.category.items.slice(),}}
                    ns.category.items[n] = {...ns.category.items[n], addProgress:false, addError:true, addMsg:pl.response}
                    break;
                }
            }
            ns = updateCachedProduct(ns, id, (item) => ({
                ...item,
                addProgress: false,
                addError: true,
                addMsg: pl.response,
            }))
            break;
        }
        case CATEGORY_MATCHER_REMOVE_PRODUCT_REQ:{
            ns = {...ns}
            getProductCategory(ns, pl, (state, item, n, cat, cc)=>{
                state.category = {...state.category, items: state.category.items.slice()}
                state.category.items[n] = {
                    ...state.category.items[n],
                    categories:item.categories.slice()
                }
                state.category.items[n].categories[cc]  = {
                    ...cat,
                    removeProgress: true,
                    removeError: false,
                    removeMsg: false
                }
            })
            ns = updateCachedProductCategory(ns, pl.params.id, pl.params.catId, (cat) => ({
                ...cat,
                removeProgress: true,
                removeError: false,
                removeMsg: false,
            }))
            getExportCategoryProduct(ns, pl, (products, n)=>{
                products[n] = {
                    ...products[n],
                    removeProgress: true,
                    removeError: false,
                    removeMsg: false}
            })
            break;
        }
        case CATEGORY_MATCHER_ADD_ALL_PRODUCTS_REQ:{
            ns = {...ns, category:{...ns.category, addAllProgress:true, addAllErr:false, addAllMsg:false, }}
            break;
        }
        case CATEGORY_MATCHER_ADD_ALL_PRODUCTS_DONE:{
            ns = {...ns, category:{...ns.category, addAllProgress:false, addAllErr:true, addAllMsg:pl.response, }}
            ns.category.items = ns.category.items.slice();
            const catId = parseInt(pl.params.catToId)
            getCategoryById(catId, ns.externalCatalog.categories,(cat, cats, n) => {
                cats[n] = {...cats[n], products:[]}
                function isHavingCat(categories){
                    for(const pc of categories){
                        if(parseInt(pc.id) === catId){
                            return true;
                        }
                    }
                    return false;
                }
                for(const p of ns.category.items) {
                    if(pl.response.products.includes(p.id)) {
                        cats[n].products.push(p)
                        if (Array.isArray(p.categories)) {
                            if (!isHavingCat(p.categories)) {
                                p.categories.unshift(cats[n])
                            }
                        }else{
                            p.categories = [cats[n]]
                        }
                    }
                }

            })
            break;
        }
        case CATEGORY_MATCHER_ADD_ALL_PRODUCTS_ERR:{
            ns = {...ns, category:{...ns.category, addAllProgress:false, addAllErr:true, addAllMsg:pl.response, }}
            break;
        }
        case CATEGORY_MATCHER_REMOVE_PRODUCT_DONE: {
            ns = {...ns}
            getProductCategory(ns, pl, (state, item, n, cat, cc) => {
                state.category = {...state.category, items: state.category.items.slice()}
                state.category.items[n] = {
                    ...state.category.items[n],
                    categories: item.categories.slice()
                }
                state.category.items[n].categories.splice(cc, 1)
            })
            ns = removeCachedProductCategory(ns, pl.params.id, pl.params.catId)
            getExportCategoryProduct(ns, pl, (products, n)=> {
                products.splice(n, 1);
            })
            break;
        }
        case CATEGORY_MATCHER_REMOVE_PRODUCT_ERR:{
            ns = {...ns}
            getProductCategory(ns, pl, (state, item, n, cat, cc)=>{
                state.category = {...state.category, items: state.category.items.slice()}
                state.category.items[n] = {
                    ...state.category.items[n],
                    categories:item.categories.slice()
                }
                state.category.items[n].categories[cc]  = {
                    ...cat,
                    removeProgress: false,
                    removeError: true,
                    removeMsg: pl.response
                }
            })
            ns = updateCachedProductCategory(ns, pl.params.id, pl.params.catId, (cat) => ({
                ...cat,
                removeProgress: false,
                removeError: true,
                removeMsg: pl.response,
            }))
            getExportCategoryProduct(ns, pl, (products, n)=>{
                products[n] = {
                    ...products[n],
                    removeProgress: false,
                    removeError: true,
                    removeMsg: pl.response,
                }
            })
            break;
        }
        case CATEGORY_MATCHER_SELECT_TYPEOF:{
            ns = {...ns, externalCatalog: {...ns.externalCatalog}}
            ns.externalCatalog.currentTypeOf = pl
            break
        }
        default:
            return ns;
    }
    return ns;
}

function extractCategoryItems(response) {
    if (Array.isArray(response)) {
        return response;
    }
    return response?.data ?? response?.items ?? [];
}

function normalizeSourceCategories(categories) {
    return categories.map((category) => ({
        ...category,
        items: Array.isArray(category.items) ? normalizeSourceCategories(category.items) : [],
        childrenLoaded: (Array.isArray(category.items) && category.items.length > 0) || isKnownLeafCategory(category),
    }))
}

function isKnownLeafCategory(category) {
    return category.hasChildren === false
        || category.has_children === false
        || category.hasChildren === 0
        || category.has_children === 0
        || category.hasChildren === '0'
        || category.has_children === '0';
}

function setSourceCategoryChildren(categories, categoryId, children) {
    return (categories ?? []).map((category) => {
        if (parseInt(category.id) === parseInt(categoryId)) {
            return {
                ...category,
                items: children,
                childrenLoaded: true,
            }
        }
        if (Array.isArray(category.items) && category.items.length > 0) {
            return {
                ...category,
                items: setSourceCategoryChildren(category.items, categoryId, children),
            }
        }
        return category;
    })
}

function normalizeProducts(products, categories) {
    return products.map((i) => {
        const product = {...i};
        if(!product.categories){
            product.categories = [];
        }else {
            const newCategories = []
            for(let cn in product.categories) {
                const sourceCategory = product.categories[cn];
                const categoryId = sourceCategory && sourceCategory.id ? sourceCategory.id : sourceCategory;
                const cat = getCategoryById(categoryId, categories, (cat, categories, n) => {
                    const catProducts = categories[n].products ? categories[n].products.slice() : [];
                    if (!catProducts.some((p) => parseInt(p.id) === parseInt(product.id))) {
                        catProducts.unshift(product)
                    }
                    const nextCat = {...cat, products: catProducts};
                    categories[n] = nextCat;
                    return nextCat;
                })
                if (cat) {
                    newCategories.push(cat)
                } else if (sourceCategory && sourceCategory.id) {
                    newCategories.push(sourceCategory)
                }
            }
            product.categories = newCategories;
        }
        return product;
    })
}

function getCategoryById(id, categories, callback){
    const intId = parseInt(id);
    let found;
    for(let n in categories ?? []){
        let cat = categories[n];
        if(id === -1){
            callback(cat, categories, n)
            getCategoryById(id, cat.items ?? [], callback);
            continue;
        }else if(intId === parseInt(cat.id)){
            const newCat = callback(cat, categories, n)
            if(newCat && newCat !== categories[n]){
                categories[n] = newCat;
            }
            found = categories[n];
            break;
        }
        found = getCategoryById(id, cat.items ?? [], callback);
        if(found){
            break;
        }
    }
    return found;
}

function getExportCategoryProduct(state, pl, callback){
    const catId = parseInt(pl.params.catId);
    getCategoryById(catId, state.externalCatalog.categories, (cat, categories, n)=>{
        const id = parseInt(pl.params.id);
        for( let pid in cat.products ?? []){
            if(parseInt(cat.products[pid].id) === id){
                callback(cat.products, pid )
            }
        }
    })
}

function getProductCategory(state, pl, callback){
    const id = parseInt(pl.params.id);
    for(let n in state.category.items ?? []){
        const item = state.category.items[n];
        if(parseInt(item.id) === id){
            const catId = parseInt(pl.params.catId);
            for(let cc in item.categories ?? []) {
                const cat = item.categories[cc];
                if(parseInt(cat.id) === catId) {
                    callback(state, item, n, cat, cc)
                    break;
                }
            }
            break;
        }
    }

}

function updateCachedProduct(state, productId, callback) {
    const categoryProducts = state.categoryProducts ?? {byCategoryId: {}};
    const byCategoryId = categoryProducts.byCategoryId ?? {};
    let nextByCategoryId = byCategoryId;
    let found = false;

    Object.keys(byCategoryId).forEach((categoryId) => {
        const entry = byCategoryId[categoryId];
        if (!Array.isArray(entry.items)) {
            return;
        }
        const index = entry.items.findIndex((item) => parseInt(item.id) === parseInt(productId));
        if (index < 0) {
            return;
        }
        if (!found) {
            nextByCategoryId = {...byCategoryId};
            found = true;
        }
        const items = entry.items.slice();
        items[index] = callback(items[index], categoryId, index);
        nextByCategoryId[categoryId] = {...entry, items: items};
    })

    if (!found) {
        return state;
    }
    return {
        ...state,
        categoryProducts: {
            ...categoryProducts,
            byCategoryId: nextByCategoryId,
        }
    }
}

function getCachedProduct(state, productId) {
    const byCategoryId = state.categoryProducts?.byCategoryId ?? {};
    for (const categoryId of Object.keys(byCategoryId)) {
        const entry = byCategoryId[categoryId];
        if (!Array.isArray(entry.items)) {
            continue;
        }
        const product = entry.items.find((item) => parseInt(item.id) === parseInt(productId));
        if (product) {
            return product;
        }
    }
    return false;
}

function updateCachedProductCategory(state, productId, catId, callback) {
    return updateCachedProduct(state, productId, (item) => {
        let changed = false;
        const categories = (item.categories ?? []).map((cat) => {
            if (parseInt(cat.id) !== parseInt(catId)) {
                return cat;
            }
            changed = true;
            return callback(cat);
        })
        if (!changed) {
            return item;
        }
        return {...item, categories: categories};
    })
}

function removeCachedProductCategory(state, productId, catId) {
    return updateCachedProduct(state, productId, (item) => ({
        ...item,
        categories: (item.categories ?? []).filter((cat) => parseInt(cat.id) !== parseInt(catId)),
    }))
}
