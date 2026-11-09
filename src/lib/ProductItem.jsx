import React, {Component} from 'react';
import styled from 'styled-components'
import CatOverlay from "./CatOverlay";
import ReactModal from "react-modal";
import PlusButton from "./PlusButton";
import DeleteButton from "./DeleteButton";

const ProductItemStyled = styled.div`
  background: #F5F5F5;
  min-height: 110px;
  border-top: 1px solid #F0F0F0;
  display: flex;
  cursor: pointer;

  &.selected-product {
    background: #eef4ff;
    box-shadow: inset 4px 0 0 #5b76aa;
  }

  .modal-body {
    background: antiquewhite;

    .product-full-pic {
      display: block;
      max-height: 70vh;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  > .pi-selector{
    width: 20px;
    height: 20px;
    border: 1px solid #5B76AA;
    border-radius: 2px;
    margin-left: 24px;
    margin-right: 16px;
    margin-top: 35px;
    background: #ffffff;
  }

  &.selected-product > .pi-selector {
    background: #5B76AA;
  }

  > .pi-image {
    height: 58px;
    width: 63px;
    margin: 16px 16px 17px 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  > .langindicator {
    display: none;
    font-size: 11px;
  }

  > .prodname {
    flex: 1;
    font-size: 14px;
    line-height: 16.5px;
    text-align: left;
    padding-left: 16px;
    padding-right: 20px;
    padding-top: 18px;
    min-width: 0;

    .prod-title {
      font-weight: 600;
      color: #1f2b44;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .suggestions {
      padding: 8px 10px;
      background: #ffffff;
      border: 1px solid #d8dfeb;
      border-radius: 10px;
    }

    .suggestions-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 6px;
      color: #5f6c86;
      font-size: 12px;
      font-weight: 600;
    }

    .suggestions-title-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .suggestions-close {
      border: 0;
      background: transparent;
      color: #7a879f;
      width: 24px;
      height: 24px;
      border-radius: 999px;
      font-size: 15px;
      line-height: 24px;
      padding: 0;
    }

    .suggestions-close:hover {
      background: #eef4ff;
      color: #24324f;
    }

    .suggestions-loader {
      color: #5B76AA;
      font-size: 12px;
    }

    .suggestions-error {
      color: #b94a48;
      font-size: 12px;
    }

    .suggestion-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      border: 0;
      background: #eef4ff;
      color: #24324f;
      border-radius: 8px;
      padding: 6px 8px;
      text-align: left;
    }

    .suggestion-item:hover {
      background: #dfe9ff;
    }

    .suggestion-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .suggestion-name-en {
      display: block;
      color: #5f6c86;
      font-size: 11px;
      margin-top: 2px;
    }

    .suggestion-score {
      flex-shrink: 0;
      background: #5B76AA;
      color: #ffffff;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 700;
    }
  }

  > .controls {
    font-size: 15px;
    padding-top: 22px;
    padding-right: 14px;
    padding-left: 16px;

    .flex-container {
      display: inline-flex;
      align-items: center;

      button {
        size: 25px;
        padding: 0 4px;
        height: 44px;
        width: 44px;
        line-height: 15px;
        border-radius: 10px;
        &.btn-delete{
          background-color: #FFEDF0;
        }
      }
    }
  }

  .catnumber {
    display: inline-block;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    width: 60px;
    overflow: hidden;
    white-space: nowrap;
  }

  .chevrondiv {
    position: relative;

    .overlay {
      position: absolute;
      background: mintcream;
      padding: 5px;
      width: 30vw;
      border: 1px solid #000000;
      border-radius: 4px;
      right: 0;
      z-index: 2;
      display: none;
      top: 44px;
    }

    &:hover {
      .overlay {
        display: block;
      }
    }
  }
`;

export default class ProductItem extends Component {
    state = {}

    isHavingAveActive(i){
        const id = parseInt(this.props.externalCatalog.lastSelected);
        for(const c of i.categories ?? []){
            if(parseInt(c.id) === id){
                return true;
            }
        }
        return false;
    }

    getPictire(i, size = '50x50'){
        let url = '';
        if(Array.isArray(i.pictures) && i.pictures.length > 0){
            url += i.pictures[0]
        }else{
            url += 'https://fortrexs.eu/en/oz/image/36808764-a2e1-46da-9c19-5ae2c33af8f5.jpg'
        }
        return url;
    }

    onSelectProduct = () => {
        this.props.actions.selectProduct(this.props.item, this.props.marketplaceId);
    }

    onOpenImage = (e) => {
        e.stopPropagation();
        this.setState({imgOpen:true})
    }

    onOpenSuggestion = (path, e) => {
        e.stopPropagation();
        this.props.actions.openSuggestedCategoryPath(path);
        this.props.actions.dismissProductSuggestions(this.props.item.id);
    }

    onDismissSuggestions = (e) => {
        e.stopPropagation();
        this.props.actions.dismissProductSuggestions(this.props.item.id);
    }

    formatSuggestionName = (suggestion) => {
        return [suggestion.name_ru, suggestion.name_en]
            .filter((part) => part && String(part).trim() !== '')
            .join(' / ');
    }

    renderSuggestions = (isSelected) => {
        const suggestionsState = this.props.productSuggestions ?? {};
        const categories = this.props.item.categories ?? [];
        if (!isSelected || categories.length > 0) {
            return null;
        }

        const suggestions = suggestionsState.items ?? [];
        if (suggestionsState.dismissed) {
            return null;
        }

        return (
            <div className="suggestions">
                <div className="suggestions-title">
                    <div className="suggestions-title-left">
                        <span>Suggested categories</span>
                        {suggestionsState.loading && <span className="suggestions-loader"><i className="fas fa-sync-alt circular"/> loading</span>}
                    </div>
                    <button type="button" className="suggestions-close" title="Hide suggestions" onClick={this.onDismissSuggestions}>
                        <i className="fas fa-times"/>
                    </button>
                </div>
                {suggestionsState.error &&
                <div className="suggestions-error">Failed to load suggestions</div>
                }
                {!suggestionsState.loading && !suggestionsState.error && suggestions.length === 0 &&
                <div className="suggestions-error">No suggestions</div>
                }
                {!suggestionsState.loading && suggestions.length > 0 &&
                <div className="suggestion-list">
                    {suggestions.map((suggestion, index) => (
                        <button
                            type="button"
                            className="suggestion-item"
                            key={suggestion.id ?? index}
                            onClick={this.onOpenSuggestion.bind(this, suggestion.path ?? [])}
                        >
                            <span className="suggestion-name">
                                {this.formatSuggestionName(suggestion)}
                            </span>
                            <span className="suggestion-score">{Math.round((parseFloat(suggestion.score) || 0) * 100)}%</span>
                        </button>
                    ))}
                </div>
                }
            </div>
        );
    }

    render() {
        const p = this.props;
        const s = this.state;
        const isHavingActie = this.isHavingAveActive(p.item)
        if(!p.showActive && isHavingActie){
            return null
        }

        const addDisabled = p.item.addProgress || !(p.externalCatalog.lastSelected > 0) || isHavingActie;
        const cats = p.item.categories ?? [];
        const isSelected = parseInt(p.selectedProductId) === parseInt(p.item.id);

        return (
            <ProductItemStyled className={isSelected ? 'selected-product' : ''} onClick={this.onSelectProduct}>
                <div className="pi-selector">

                </div>
                <div className="pi-image" onClick={this.onOpenImage}>
                    <img alt="Product pictures"
                         src={this.getPictire(p.item)}/>
                </div>
                {s.imgOpen &&
                    <ReactModal caption={'#' + p.item.id + ' - ' + p.item.product_name}
                                fade="2"
                                footer={false} bs4 size="lg"
                                onClose={e=>{this.setState({imgOpen:false})}}>
                        <img className="product-full-pic" alt="Product pictures"
                             src={this.getPictire(p.item, '600x600')}/>
                    </ReactModal>}
                <div className="langindicator">
                    <div>EN</div>
                    <div>DE</div>
                    <div>RU</div>
                </div>
                <div className="prodname" title={p.item.product_name+'\n'+p.item.meta_desc}>
                    <div className="prod-title">{p.item.product_name}</div>
                    {this.renderSuggestions(isSelected)}
                </div>
                <div className="controls" onClick={(e) => {e.stopPropagation();}}>
                    <div className="flex-container">
                        <div>
                            <PlusButton className="btn-plus"
                                onClick={p.actions.addProduct.bind(this, p.item, p.externalCatalog.lastSelected, p.externalCatalog.currentTypeOf, p.marketplaceId )}
                                disabled={addDisabled}>
                            </PlusButton>
                        </div>
                        <div>
                            <span title="в скольких категриях товар ##"
                                  className="catnumber">
                                {cats.length>0?cats.length:''}
                            </span>
                        </div>
                        <div className="chevrondiv">
                            <DeleteButton disabled={cats.length === 0}/>
                            {cats.length > 0 &&
                            <div title="показать товары в категории" className="overlay">
                                {cats.map((c, key) =>
                                    <CatOverlay item={c} key={key}
                                                onRemove={p.actions.removeProduct.bind(this, p.item.id, c.id, p.externalCatalog.currentTypeOf)}/>) }
                            </div>
                            }
                        </div>

                    </div>
                </div>
            </ProductItemStyled>
        )
    }
}


