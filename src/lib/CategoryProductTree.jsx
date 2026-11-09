import React, {Component} from 'react';
import styled from 'styled-components'
import ProductItem from "./ProductItem";

const CategoryProductTreeStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  border-right: 1px solid #c6ced8;
  box-sizing: border-box;

  .tree-toolbar {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: #ffffff;
    border-bottom: 1px solid #d9dee6;
  }

  .tree-search {
    flex: 1;
    min-width: 0;
  }

  .tree-filter {
    white-space: nowrap;
  }

  .tree-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: #ffffff;
  }

  .tree-empty,
  .tree-loading {
    padding: 16px;
    color: #6b7280;
    text-align: center;
  }

  .tree-row {
    min-height: 32px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eef1f4;
    cursor: pointer;
    user-select: none;
    background: #ffffff;

    &:hover {
      background: #f2f7ff;
    }

    &.checked {
      background: #edf7ed;
    }
  }

  .tree-indent {
    flex: 0 0 auto;
  }

  .tree-toggle {
    width: 26px;
    height: 30px;
    border: 0;
    background: transparent;
    color: #3d4b5f;
    padding: 0;
  }

  .tree-checkbox {
    margin: 0 8px 0 2px;
  }

  .tree-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font-size: 14px;
    color: #172033;
  }

  .tree-name.leaf {
    font-weight: 700;
  }

  .tree-meta {
    color: #172033;
    font-size: 14px;
    padding: 0 8px;
    white-space: nowrap;
    font-weight: 700;
  }

  .tree-products {
    background: #f7f8fa;
    border-bottom: 1px solid #d9dee6;
  }

  .tree-products-state,
  .tree-children-state {
    padding: 10px 16px;
    color: #6b7280;
    font-size: 13px;
  }

  .tree-products .tree-product {
    border-left: 3px solid #5b76aa;
  }

  .fa-sync-alt.circular{
    animation: rotate-left 1s infinite linear;
  }

  @keyframes rotate-left {
    100% { transform: rotate(360deg); }
  }
`;

export default class CategoryProductTree extends Component {
    knownCategoryIds = {};

    state = {
        expanded: {},
        checked: {},
        search: '',
        selectedOnly: true,
    }

    componentDidMount() {
        this.syncCheckedFromItems(this.props.items);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.items !== this.props.items) {
            this.syncCheckedFromItems(this.props.items);
        }
        const previousSearchItems = prevProps.sourceCatalog?.search?.items;
        const searchItems = this.props.sourceCatalog?.search?.items;
        if (previousSearchItems !== searchItems) {
            this.syncCheckedFromItems(searchItems);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimer);
        if (this.props.actions.clearSourceCategorySearch) {
            this.props.actions.clearSourceCategorySearch();
        }
    }

    normalizeText(value) {
        return (value ?? '').toString().toLowerCase();
    }

    isMatcherVisible(item) {
        return item.matcher_visible === true
            || item.matcher_visible === 1
            || item.matcher_visible === '1'
            || item.matcher_visible === 'true';
    }

    persistCategorySelection(updates) {
        if (updates.length > 0 && this.props.actions.selectSourceCategories) {
            this.props.actions.selectSourceCategories(updates);
        }
    }

    collectDescendants(item) {
        const children = this.getChildren(item);
        return children.reduce((items, child) => {
            items.push(child);
            return items.concat(this.collectDescendants(child));
        }, []);
    }

    syncCheckedFromItems(items = []) {
        const updates = [];
        const checked = {...this.state.checked};

        const setChecked = (item, selected, persist = false) => {
            if (checked[item.id] === selected) {
                return;
            }
            checked[item.id] = selected;
            if (persist) {
                updates.push({categoryId: item.id, selected: selected});
            }
        };

        const walk = (nodes = [], ancestors = []) => {
            nodes.forEach((item) => {
                if (!this.knownCategoryIds[item.id]) {
                    this.knownCategoryIds[item.id] = true;
                    setChecked(item, this.isMatcherVisible(item));
                }
                if (checked[item.id]) {
                    ancestors.forEach((ancestor) => {
                        setChecked(ancestor, true, true);
                    });
                }
                walk(this.getChildren(item), ancestors.concat(item));
            });
        };

        walk(items);
        this.setState({checked: checked}, () => {
            this.persistCategorySelection(updates);
        });
    }

    getChildren(item) {
        return Array.isArray(item.items) ? item.items : [];
    }

    getCategoryName(item) {
        return item.name ?? item.value ?? '';
    }

    hasKnownNoChildren(item) {
        return item.hasChildren === false
            || item.has_children === false
            || item.hasChildren === 0
            || item.has_children === 0
            || item.hasChildren === '0'
            || item.has_children === '0';
    }

    isChildrenLoaded(item) {
        return !!item.childrenLoaded || this.hasKnownNoChildren(item);
    }

    isLeaf(item) {
        return this.hasKnownNoChildren(item)
            || (this.isChildrenLoaded(item) && this.getChildren(item).length === 0);
    }

    isCategoryLoading(item) {
        const sourceCatalog = this.props.sourceCatalog ?? {};
        const loadingByCategoryId = sourceCatalog.loadingByCategoryId ?? {};
        return !!loadingByCategoryId[item.id];
    }

    getCategoryError(item) {
        const sourceCatalog = this.props.sourceCatalog ?? {};
        const errorByCategoryId = sourceCatalog.errorByCategoryId ?? {};
        return errorByCategoryId[item.id];
    }

    getProductState(item) {
        const p = this.props;
        const byCategoryId = (p.categoryProducts ?? {}).byCategoryId ?? {};
        return byCategoryId[item.id] ?? {};
    }

    hasCheckedDescendant(item) {
        const checked = this.state.checked;
        if (checked[item.id]) {
            return true;
        }
        return this.getChildren(item).some((child) => this.hasCheckedDescendant(child));
    }

    matchesSearch(item, query) {
        if (!query) {
            return true;
        }
        const label = this.normalizeText(`#${item.id} ${this.getCategoryName(item)}`);
        if (label.indexOf(query) >= 0) {
            return true;
        }
        return this.getChildren(item).some((child) => this.matchesSearch(child, query));
    }

    isVisible(item, query) {
        if (this.state.selectedOnly && !this.hasCheckedDescendant(item)) {
            return false;
        }
        return this.matchesSearch(item, query);
    }

    toggleChecked = (item, ancestors = [], e) => {
        e.stopPropagation();
        const shouldCheck = e.target.checked;
        this.setState((state) => {
            const checked = {...state.checked};
            const updates = [];

            const setChecked = (category, selected) => {
                if (checked[category.id] === selected) {
                    return;
                }
                checked[category.id] = selected;
                updates.push({categoryId: category.id, selected: selected});
            };

            setChecked(item, shouldCheck);
            if (shouldCheck) {
                ancestors.forEach((ancestor) => {
                    setChecked(ancestor, true);
                });
            } else {
                this.collectDescendants(item).forEach((child) => {
                    setChecked(child, false);
                });
            }

            return {checked: checked, pendingSelectionUpdates: updates};
        }, () => {
            this.persistCategorySelection(this.state.pendingSelectionUpdates ?? []);
            this.setState({pendingSelectionUpdates: []});
        });
    }

    loadLeafProducts(item) {
        const products = this.getProductState(item);
        if (!products.items && !products.loading) {
            this.props.actions.loadCategoryProducts(item, this.props.marketplaceId);
        }
    }

    toggleCategory = (item) => {
        const isOpen = !!this.state.expanded[item.id];
        if (isOpen) {
            this.setState((state) => ({
                expanded: {
                    ...state.expanded,
                    [item.id]: false,
                },
            }));
            return;
        }

        this.setState((state) => ({
            expanded: {
                ...state.expanded,
                [item.id]: true,
            },
        }), () => {
            if (!this.isChildrenLoaded(item)) {
                this.props.actions.loadSourceCategories(item, this.props.marketplaceId);
            } else if (this.isLeaf(item)) {
                this.loadLeafProducts(item);
            }
        });
    }

    onSearchChange = (e) => {
        const search = e.target.value;
        const needle = search.trim();
        clearTimeout(this.searchTimer);
        this.setState({search: search});

        if (needle.length < 3) {
            this.props.actions.clearSourceCategorySearch();
            return;
        }

        this.searchTimer = setTimeout(() => {
            this.props.actions.searchSourceCategories(needle);
        }, 300);
    }

    onToggleFilter = () => {
        this.setState((state) => ({selectedOnly: !state.selectedOnly}));
    }

    renderProductExpansion(item, level) {
        if (!this.state.expanded[item.id] || !this.isLeaf(item)) {
            return null;
        }
        const p = this.props;
        const productState = this.getProductState(item);
        const products = productState.items ?? [];
        const style = {paddingLeft: (level + 1) * 18};

        return (
            <div className="tree-products" style={style}>
                {productState.loading &&
                    <div className="tree-products-state">Loading products...</div>
                }
                {productState.error &&
                    <div className="tree-products-state">{productState.error}</div>
                }
                {!productState.loading && !productState.error && products.length === 0 &&
                    <div className="tree-products-state">No products in this category</div>
                }
                {products.map((product, key) =>
                    <div className="tree-product" key={product.id ?? key}>
                        <ProductItem item={product}
                                     showActive={p.showActive}
                                     actions={p.actions}
                                     externalCatalog={p.externalCatalog}
                                     marketplaceId={p.marketplaceId}
                                     selectedProductId={p.selectedProductId}
                                     productSuggestions={p.productSuggestions}/>
                    </div>
                )}
            </div>
        )
    }

    renderChildrenState(item, level) {
        if (!this.state.expanded[item.id]) {
            return null;
        }
        const loading = this.isCategoryLoading(item);
        const error = this.getCategoryError(item);
        if (!loading && !error) {
            return null;
        }
        return (
            <div className="tree-children-state" style={{paddingLeft: (level + 1) * 18}}>
                {loading ? 'Loading categories...' : error}
            </div>
        )
    }

    renderCategory(item, level = 0, ancestors = [], serverSearch = false) {
        const query = serverSearch ? '' : this.normalizeText(this.state.search);
        if (!this.isVisible(item, query)) {
            return null;
        }

        const children = this.getChildren(item);
        const hasChildren = children.length > 0;
        const expanded = !!this.state.expanded[item.id] || (serverSearch && hasChildren) || (!!query && hasChildren);
        const checked = !!this.state.checked[item.id];
        const loading = this.isCategoryLoading(item);
        const visibleChildren = children.map((child) => this.renderCategory(child, level + 1, ancestors.concat(item), serverSearch)).filter(Boolean);
        const productCnt = item.productCnt ?? item.products_count ?? item.productsCount;
        const exportedCnt = item.exportedCnt ?? '?';
        const meta = productCnt === undefined || productCnt === null ? null : exportedCnt + '/' + productCnt;

        return (
            <React.Fragment key={item.id}>
                <div className={'tree-row' + (checked ? ' checked' : '')}
                     onClick={this.toggleCategory.bind(this, item)}
                     title={'#' + item.id + ' - ' + this.getCategoryName(item)}>
                    <span className="tree-indent" style={{width: level * 18}}/>
                    <button type="button"
                            className="tree-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                this.toggleCategory(item);
                            }}>
                        <i className={'fas fa-' + (loading ? 'sync-alt circular' : expanded ? 'chevron-down' : this.isLeaf(item) ? 'box-open' : 'chevron-right')}/>
                    </button>
                    <input type="checkbox"
                           className="tree-checkbox"
                           checked={checked}
                           onClick={(e) => {e.stopPropagation()}}
                           onMouseDown={(e) => {e.stopPropagation()}}
                           onKeyDown={(e) => {e.stopPropagation()}}
                           onChange={this.toggleChecked.bind(this, item, ancestors)}/>
                    <div className={'tree-name' + (this.isLeaf(item) ? ' leaf' : '')}>#{item.id} - {this.getCategoryName(item)}</div>
                    {meta !== undefined && meta !== null &&
                        <div className="tree-meta">{meta}</div>
                    }
                </div>
                {this.renderChildrenState(item, level)}
                {expanded && hasChildren && visibleChildren}
                {this.renderProductExpansion(item, level)}
            </React.Fragment>
        )
    }

    render() {
        const p = this.props;
        const sourceCatalog = p.sourceCatalog ?? {};
        const needle = this.state.search.trim();
        const serverSearch = needle.length >= 3;
        const search = sourceCatalog.search ?? {};
        const searchPending = serverSearch && search.needle !== needle;
        const items = serverSearch ? (search.items ?? []) : (Array.isArray(p.items) ? p.items : []);
        const renderedItems = items.map((item) => this.renderCategory(item, 0, [], serverSearch)).filter(Boolean);

        return (
            <CategoryProductTreeStyled>
                <div className="tree-toolbar">
                    <input className="form-control form-control-sm tree-search"
                           placeholder="Search category"
                           value={this.state.search}
                           onChange={this.onSearchChange}/>
                    <button type="button"
                            className={'btn btn-sm tree-filter btn-' + (this.state.selectedOnly ? 'success' : 'outline-secondary')}
                            onClick={this.onToggleFilter}
                            title="Show all categories or only selected categories">
                        <i className="fas fa-filter"/> {this.state.selectedOnly ? 'Selected' : 'All'}
                    </button>
                </div>
                <div className="tree-content">
                    {!serverSearch && sourceCatalog.loadingRoot &&
                        <div className="tree-loading">Loading categories...</div>
                    }
                    {serverSearch && (searchPending || search.loading) &&
                        <div className="tree-loading">Searching categories...</div>
                    }
                    {!serverSearch && sourceCatalog.loadMsg &&
                        <div className="tree-empty">{sourceCatalog.loadMsg}</div>
                    }
                    {serverSearch && search.error &&
                        <div className="tree-empty">{search.error}</div>
                    }
                    {!sourceCatalog.loadingRoot && !sourceCatalog.loadMsg && !searchPending && !search.loading && !search.error && renderedItems.length === 0 &&
                        <div className="tree-empty">No categories found</div>
                    }
                    {renderedItems}
                </div>
            </CategoryProductTreeStyled>
        )
    }
}
