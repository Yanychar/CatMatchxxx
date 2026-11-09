import axios from 'axios';

let suggestCategoriesCancelRequest = null;
let sourceCategorySearchCancelRequest = null;

export const CATEGORY_MATCHER_LOAD_MARKETPLACES_REQ  = 'CATEGORY_MATCHER_LOAD_MARKETPLACES_REQ';
export const CATEGORY_MATCHER_LOAD_MARKETPLACES_DONE  = 'CATEGORY_MATCHER_LOAD_MARKETPLACES_DONE';
export const CATEGORY_MATCHER_LOAD_MARKETPLACES_ERR  = 'CATEGORY_MATCHER_LOAD_MARKETPLACES_ERR';

export const CATEGORY_MATCHER_SELECT_MARKETPLACE_REQ  = 'CATEGORY_MATCHER_SELECT_MARKETPLACE_REQ';
export const CATEGORY_MATCHER_SELECT_MARKETPLACE_DONE  = 'CATEGORY_MATCHER_SELECT_MARKETPLACE_DONE';
export const CATEGORY_MATCHER_SELECT_MARKETPLACE_ERR  = 'CATEGORY_MATCHER_SELECT_MARKETPLACE_ERR';

export const CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ  = 'CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ';
export const CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_DONE  = 'CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_DONE';
export const CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_ERR  = 'CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_ERR';

export const CATEGORY_MATCHER_SELECT_CATEGORY_REQ   = 'CATEGORY_MATCHER_SELECT_CATEGORY_REQ';
export const CATEGORY_MATCHER_SELECT_CATEGORY_DONE  = 'CATEGORY_MATCHER_SELECT_CATEGORY_DONE';
export const CATEGORY_MATCHER_SELECT_CATEGORY_ERR   = 'CATEGORY_MATCHER_SELECT_CATEGORY_ERR';

export const CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_REQ   = 'CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_REQ';
export const CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_DONE  = 'CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_DONE';
export const CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_ERR   = 'CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_ERR';

export const CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_REQ = 'CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_REQ';
export const CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_DONE = 'CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_DONE';
export const CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_ERR = 'CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_ERR';
export const CATEGORY_MATCHER_CLEAR_SOURCE_CATEGORY_SEARCH = 'CATEGORY_MATCHER_CLEAR_SOURCE_CATEGORY_SEARCH';

export const CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_REQ   = 'CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_REQ';
export const CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_DONE  = 'CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_DONE';
export const CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_ERR   = 'CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_ERR';

export const CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_REQ   = 'CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_REQ';
export const CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_DONE  = 'CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_DONE';
export const CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_ERR   = 'CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_ERR';

export const CATEGORY_MATCHER_ADD_PRODUCT_REQ   = 'CATEGORY_MATCHER_ADD_PRODUCT_REQ';
export const CATEGORY_MATCHER_ADD_PRODUCT_DONE  = 'CATEGORY_MATCHER_ADD_PRODUCT_DONE';
export const CATEGORY_MATCHER_ADD_PRODUCT_ERR   = 'CATEGORY_MATCHER_ADD_PRODUCT_ERR';

export const CATEGORY_MATCHER_ADD_ALL_PRODUCTS_REQ   = 'CATEGORY_MATCHER_ADD_ALL_PRODUCTS_REQ';
export const CATEGORY_MATCHER_ADD_ALL_PRODUCTS_DONE  = 'CATEGORY_MATCHER_ADD_ALL_PRODUCTS_DONE';
export const CATEGORY_MATCHER_ADD_ALL_PRODUCTS_ERR   = 'CATEGORY_MATCHER_ADD_ALL_PRODUCTS_ERR';

export const CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_REQ   = 'CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_REQ';
export const CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_DONE  = 'CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_DONE';
export const CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_ERR   = 'CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_ERR';

export const CATEGORY_MATCHER_REMOVE_PRODUCT_REQ   = 'CATEGORY_MATCHER_REMOVE_PRODUCT_REQ';
export const CATEGORY_MATCHER_REMOVE_PRODUCT_DONE  = 'CATEGORY_MATCHER_REMOVE_PRODUCT_DONE';
export const CATEGORY_MATCHER_REMOVE_PRODUCT_ERR   = 'CATEGORY_MATCHER_REMOVE_PRODUCT_ERR';

export const CATEGORY_MATCHER_SELECT_TYPEOF  = 'CATEGORY_MATCHER_SELECT_TYPEOF';
export const CATEGORY_MATCHER_SELECT_PRODUCT = 'CATEGORY_MATCHER_SELECT_PRODUCT';
export const CATEGORY_MATCHER_CLEAR_EXTERNAL_SELECTION = 'CATEGORY_MATCHER_CLEAR_EXTERNAL_SELECTION';
export const CATEGORY_MATCHER_CLEAR_SUGGESTIONS = 'CATEGORY_MATCHER_CLEAR_SUGGESTIONS';
export const CATEGORY_MATCHER_DISMISS_SUGGESTIONS = 'CATEGORY_MATCHER_DISMISS_SUGGESTIONS';
export const CATEGORY_MATCHER_SUGGEST_CATEGORIES_REQ = 'CATEGORY_MATCHER_SUGGEST_CATEGORIES_REQ';
export const CATEGORY_MATCHER_SUGGEST_CATEGORIES_DONE = 'CATEGORY_MATCHER_SUGGEST_CATEGORIES_DONE';
export const CATEGORY_MATCHER_SUGGEST_CATEGORIES_ERR = 'CATEGORY_MATCHER_SUGGEST_CATEGORIES_ERR';

export function loadMarketplaces(){
    return (dispatch, getState)=>{
        dispatch({type:CATEGORY_MATCHER_LOAD_MARKETPLACES_REQ})
        axios.get('/api/v1/export-categories/get-marketplaces', {
            headers:{
                'X-Api-Key':  getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data})=>{
            dispatch({type:CATEGORY_MATCHER_LOAD_MARKETPLACES_DONE, payload:{response:data}})
            console.log(data)
        }).catch((e)=>{
            dispatch({type:CATEGORY_MATCHER_LOAD_MARKETPLACES_ERR, payload:{response: e.message}})
            console.error(e)
        })
    }
}

export function loadExportCategories(catalogId){
    return (dispatch, getState)=>{
        dispatch({type:CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_REQ, payload:{params:catalogId}})
        axios.get('/api/v1/export-categories/get-full?catalog='+catalogId, {
            headers:{
                'X-Api-Key':  getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data})=>{
            dispatch({type:CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_DONE, payload:{params:catalogId, response:data}})
            console.log(data)
        }).catch((e)=>{
            dispatch({type:CATEGORY_MATCHER_LOAD_EXPORT_CATEGORIES_ERR, payload:{params:catalogId, response: e.message}})
            console.error(e)
        })
    }
}

export function selectCategory( category, marketplace_id = 9 ){
    return (dispatch, getState)=>{

        dispatch({type:CATEGORY_MATCHER_SELECT_CATEGORY_REQ, payload:{params:category}})

        axios.get('/api/v1/export-categories/get-products?catalog_id=' + marketplace_id + '&category_id='+category.id, {
            headers:{
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data})=>{
            dispatch({type:CATEGORY_MATCHER_SELECT_CATEGORY_DONE, payload:{params:category, response:data}})
            console.log(data)
        }).catch((e)=>{
            dispatch({type:CATEGORY_MATCHER_SELECT_CATEGORY_ERR, payload:{params:category, response: e.message}})
            console.error(e)
        })
    }
}

export function loadSourceCategories(category = false, marketplace_id = 9) {
    return (dispatch, getState) => {
        const categoryId = category && category.id ? category.id : 0;
        const cacheId = categoryId > 0 ? categoryId : 'root';
        const sourceCatalog = getState().sourceCatalog ?? {};
        const loading = (sourceCatalog.loadingByCategoryId ?? {})[cacheId];
        const loaded = (sourceCatalog.loadedByCategoryId ?? {})[cacheId];
        if (loading || loaded) {
            return;
        }
        const params = {};
        if (categoryId > 0) {
            params.categoryId = categoryId;
        }
        dispatch({
            type: CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_REQ,
            payload: {params: {category: category, categoryId: categoryId, cacheId: cacheId}}
        })
        axios.get('/api/v1/categories/tree', {
            params: params,
            headers:{
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data})=>{
            dispatch({
                type: CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_DONE,
                payload: {params: {category: category, categoryId: categoryId, cacheId: cacheId}, response: data}
            })
            const items = data.data ?? data.items ?? (Array.isArray(data) ? data : []);
            if (categoryId > 0 && items.length === 0) {
                dispatch(loadCategoryProducts(category, marketplace_id));
            }
            console.log(data)
        }).catch((e)=>{
            dispatch({
                type: CATEGORY_MATCHER_LOAD_SOURCE_CATEGORIES_ERR,
                payload: {params: {category: category, categoryId: categoryId, cacheId: cacheId}, response: e.message}
            })
            console.error(e)
        })
    }
}

export function searchSourceCategories(needle) {
    return (dispatch, getState) => {
        const normalizedNeedle = String(needle ?? '').trim();
        if (normalizedNeedle.length < 3) {
            dispatch(clearSourceCategorySearch());
            return;
        }

        cancelSourceCategorySearchRequest();
        dispatch({
            type: CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_REQ,
            payload: {params: {needle: normalizedNeedle}},
        });

        const CancelToken = axios.CancelToken;
        axios.get('/api/v1/categories/tree', {
            params: {needle: normalizedNeedle},
            cancelToken: new CancelToken((cancel) => {
                sourceCategorySearchCancelRequest = cancel;
            }),
            headers: {
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            },
        }).then(({data}) => {
            sourceCategorySearchCancelRequest = null;
            dispatch({
                type: CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_DONE,
                payload: {params: {needle: normalizedNeedle}, response: data},
            });
        }).catch((error) => {
            if (axios.isCancel(error)) {
                return;
            }
            sourceCategorySearchCancelRequest = null;
            dispatch({
                type: CATEGORY_MATCHER_SEARCH_SOURCE_CATEGORIES_ERR,
                payload: {params: {needle: normalizedNeedle}, response: error.message},
            });
        });
    }
}

export function clearSourceCategorySearch() {
    return (dispatch) => {
        cancelSourceCategorySearchRequest();
        dispatch({type: CATEGORY_MATCHER_CLEAR_SOURCE_CATEGORY_SEARCH});
    }
}

export function loadCategoryProducts(category, marketplace_id = 9) {
    return (dispatch, getState) => {
        const categoryId = category.id;
        const categoryProducts = getState().categoryProducts ?? {};
        const cached = (categoryProducts.byCategoryId ?? {})[categoryId];
        if (cached && (cached.loading || cached.items)) {
            return;
        }
        dispatch({
            type: CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_REQ,
            payload: {params: {categoryId: categoryId, category: category, marketplaceId: marketplace_id}}
        })
        axios.get('/api/v1/export-categories/get-products?catalog_id=' + marketplace_id + '&category_id=' + categoryId, {
            headers:{
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data})=>{
            dispatch({
                type: CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_DONE,
                payload: {params: {categoryId: categoryId, category: category, marketplaceId: marketplace_id}, response: data}
            })
            console.log(data)
        }).catch((e)=>{
            dispatch({
                type: CATEGORY_MATCHER_LOAD_CATEGORY_PRODUCTS_ERR,
                payload: {params: {categoryId: categoryId, category: category, marketplaceId: marketplace_id}, response: e.message}
            })
            console.error(e)
        })
    }
}

export function selectSourceCategories(categories) {
    return (dispatch, getState) => {
        const rows = (categories ?? [])
            .filter((item) => item && item.categoryId > 0)
            .map((item) => ({
                categoryId: item.categoryId,
                selected: !!item.selected,
            }));
        if (rows.length === 0) {
            return;
        }
        axios.post('/api/v1/categories/select-category', {categories: rows}, {
            headers:{
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            },
        }).then(({data})=>{
            console.log(data)
        }).catch((e)=>{
            console.error(e)
        })
    }
}

export function selectExternalCat(level, item) {
    return (dispatch, getState) => {
        if (item.items.length === 0) {
            axiosGet('/api/v1/export-categories/get-category-type-of',
                CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ,
                {level: level, catId: item.id}
            )(dispatch,getState)

        } else {
            dispatch({type: CATEGORY_MATCHER_SELECT_EXTERNAL_CATEGORY_REQ, payload:{params: {level: level, catId: item.id, notEmpty:true}}})

        }
    }
}

export function selectTypeOf(e) {
    const typeOfId = e.target.value;
    return {type:CATEGORY_MATCHER_SELECT_TYPEOF, payload:typeOfId};

}

export function selectProduct(item, marketplaceId) {
    return (dispatch) => {
        cancelSuggestCategoriesRequest();
        dispatch({type: CATEGORY_MATCHER_CLEAR_EXTERNAL_SELECTION});
        dispatch({type: CATEGORY_MATCHER_SELECT_PRODUCT, payload: {productId: item.id, item}});

        const assignedCategory = Array.isArray(item.categories) && item.categories.length > 0
            ? item.categories[0]
            : null;

        if (assignedCategory && assignedCategory.id) {
            dispatch({type: CATEGORY_MATCHER_CLEAR_SUGGESTIONS, payload: {productId: item.id}});
            dispatch(openCategoryById(assignedCategory.id));
            return;
        }

        dispatch(suggestProductCategories(item.id, marketplaceId, 5));
    };
}

export function suggestProductCategories(productId, marketplaceId, limit = 5) {
    return (dispatch, getState) => {
        cancelSuggestCategoriesRequest();
        dispatch({type: CATEGORY_MATCHER_SUGGEST_CATEGORIES_REQ, payload: {params: {productId, marketplaceId, limit}}});
        const CancelToken = axios.CancelToken;
        axios.get('/api/v1/export-categories/get-cat-suggest', {
            params: {productId, marketplaceId, limit},
            cancelToken: new CancelToken(function executor(c) {
                suggestCategoriesCancelRequest = c;
            }),
            headers: {
                'X-Api-Key': getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            }
        }).then(({data}) => {
            suggestCategoriesCancelRequest = null;
            const response = Array.isArray(data) ? data : (data.data ?? []);
            dispatch({type: CATEGORY_MATCHER_SUGGEST_CATEGORIES_DONE, payload: {params: {productId, marketplaceId, limit}, response}});
        }).catch((e) => {
            if (axios.isCancel(e)) {
                return;
            }
            suggestCategoriesCancelRequest = null;
            dispatch({type: CATEGORY_MATCHER_SUGGEST_CATEGORIES_ERR, payload: {params: {productId, marketplaceId, limit}, response: e.message}});
            console.error(e)
        })
    }
}

export function openSuggestedCategoryPath(path) {
    return (dispatch, getState) => {
        if (!Array.isArray(path) || path.length === 0) {
            return;
        }

        const categories = getState().externalCatalog.categories ?? [];
        let items = categories;

        for (let level = 0; level < path.length; level++) {
            const catId = parseInt(path[level]);
            const found = (items ?? []).find((item) => parseInt(item.id) === catId);
            if (!found) {
                break;
            }

            dispatch(selectExternalCat(level, found));
            items = found.items ?? [];
        }
    }
}

export function openCategoryById(categoryId) {
    return (dispatch, getState) => {
        const id = parseInt(categoryId);
        if (!(id > 0)) {
            return;
        }

        const categories = getState().externalCatalog.categories ?? [];
        const path = findCategoryPath(categories, id);
        if (path.length > 0) {
            dispatch(openSuggestedCategoryPath(path));
        }
    };
}

export function dismissProductSuggestions(productId) {
    return (dispatch) => {
        cancelSuggestCategoriesRequest();
        dispatch({type: CATEGORY_MATCHER_DISMISS_SUGGESTIONS, payload: {productId}});
    };
}

export function addProduct(item, catId, typeOfId, catalogId) {
    return axiosPost('/api/v1/export-categories/add-product',
        CATEGORY_MATCHER_ADD_PRODUCT_REQ,{id:item.id, catId:catId, typeOfId:typeOfId, catalogId: catalogId})
}

export function addAllProducts(catFromId, catToId, typeOfId) {
    return axiosPost('/api/v1/export-categories/add-all-products',
        CATEGORY_MATCHER_ADD_ALL_PRODUCTS_REQ,{catFromId:catFromId, catToId:catToId, typeOfId:typeOfId})
}

export function removeAllProducts(id){
    return axiosPost('/api/v1/export-categories/remove-all-products',
        CATEGORY_MATCHER_REMOVE_ALL_PRODUCTS_REQ,{id:id})
}

export function removeProduct(id, catId, typeOfId){
    return (dispatch, getState)=>{
        dispatch({type:CATEGORY_MATCHER_REMOVE_PRODUCT_REQ, payload:{params:{id:id, catId:catId}}})
        axios.delete('/api/v1/export-categories/remove-product?id='+id+'&category_id='+catId+'&typeOfId='+typeOfId, {
            headers:{
                'X-Api-Key':  getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            },
            data:{id:id, catId:catId, typeOfId:typeOfId }
        }).then(({data})=>{
            if(data.status === 'ok') {
                dispatch({
                    type: CATEGORY_MATCHER_REMOVE_PRODUCT_DONE,
                    payload: {params: {id: id, catId: catId}, response: data}
                })
            }else{
                dispatch({
                    type:CATEGORY_MATCHER_REMOVE_PRODUCT_ERR,
                    payload:{params:{
                        id:id, catId:catId},
                        response: data.msg ?? data,
                    }
                })
                console.log(data)
            }
        }).catch((e)=>{
            dispatch({type:CATEGORY_MATCHER_REMOVE_PRODUCT_ERR, payload:{params:{id:id, catId:catId}, response: e.message}})
            console.error(e)
        })
    }
}

const keys = (constant)=>{
    const tokens = constant.split('_');
    let key = '';
    if(tokens.length === 0){
        console.error('Undefined token');
        return {}
    }else if(tokens.length === 1){
        key = tokens[0];
    }else{
        for(let i=0; i<tokens.length-1;i++){
            key += tokens[i]+'_';
        }
    }
    return key;
}

const axiosPost =  (url, constant, params) => {
    const key = keys(constant)
    return (dispatch, getState) => {
        dispatch({type:key+'REQ', payload:{params:params}});
        axios.post(url, params, {
            headers:{
                'X-Api-Key':  getState().authKey ??'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            },
        } )
            .then(({data}) => {
                if(data.status === 'ok'){
                    dispatch({type:key+'DONE', payload:{params:params, response:data}});
                }else{
                    dispatch({type:key+'ERR', payload:{params:params, response:data.msg?data.msg:data}});
            }
            })
            .catch((e) => {
                console.error(url, key, e);
                dispatch({type:key+'ERR', payload:{params:params, response:e.responseText}});
            });
    };
}

const axiosGet =  (url, constant, params) => {
    const key = keys(constant)
    return (dispatch, getState) => {
        dispatch({type:key+'REQ', payload:{params:params}});
        axios.get(url, {
            params:params,
            headers:{
                'X-Api-Key':  getState().authKey ?? 'aZ3sV80EJBLdcm8ixXzLxxWoysv8OXYY',
            },
        } )
            .then(({data}) => {
                if(data.status === 'ok'){
                    dispatch({type:key+'DONE', payload:{params:params, response:data}});
                }else{
                    dispatch({type:key+'ERR', payload:{params:params, response:data.msg?data.msg:data}});
            }
            })
            .catch((e) => {
                console.error(url, key, e);
                dispatch({type:key+'ERR', payload:{params:params, response:e.responseText}});
            });
    };
}

function findCategoryPath(categories, targetId, parents = []) {
    for (const category of categories ?? []) {
        const nextPath = parents.concat([parseInt(category.id)]);
        if (parseInt(category.id) === parseInt(targetId)) {
            return nextPath;
        }

        const foundPath = findCategoryPath(category.items ?? [], targetId, nextPath);
        if (foundPath.length > 0) {
            return foundPath;
        }
    }

    return [];
}

function cancelSuggestCategoriesRequest() {
    if (typeof suggestCategoriesCancelRequest === 'function') {
        suggestCategoriesCancelRequest();
        suggestCategoriesCancelRequest = null;
    }
}

function cancelSourceCategorySearchRequest() {
    if (typeof sourceCategorySearchCancelRequest === 'function') {
        sourceCategorySearchCancelRequest();
        sourceCategorySearchCancelRequest = null;
    }
}
