import React, {Component} from 'react';
import styled from 'styled-components'
import CatPanel from "./CatPanel";
import ProgressWindow from "./ProgressWindow";
import MarketplaceSelector from "./MarketplaceSelector";
import CategoryProductTree from "./CategoryProductTree";

const CategoryMatcherStyled = styled.div`
  width: 100%;
  height: 100%;
  .cm-panels {
    width: 100%;
    height: 100%;
    background: #eeeeee;
    display: flex;
    justify-content: space-between;

    > div {
      width: 50%;
    }
  }
  .c-left{
    width: 50%;
    background: #ffffff;
    position: relative;
    border: 0px solid #0F0B0B;
    box-sizing: border-box;
    min-width: 0;
  }
  .c-right{
    display: flex;
    flex-direction: column;
    width: 50%;
    position: relative;
    background: green;
    border: 1px solid #0F0B0B;
    box-sizing: border-box;
    .right-inner {
        width: 100%;
        height: calc(100% - 40px);
        display: flex;
        flex: 1;
        box-sizing: border-box;
        }
        >.form-control {
          border-radius: unset;
          border: 0px;
        }
        >.form-control-sm {
          border-radius: unset;
          border: 0px;    
        }
        .fa-sync-alt.circular{
          animation: rotate-left 1s infinite linear;
        }
        
        @keyframes rotate-left {
          100% { transform: rotate(360deg); }
        }
    }
  `;


export default class CategoryMatcher extends Component {
    state = {externalSelected: []}

    getChildCat = (id, level) => {
        const p = this.props;
        const ec = p.externalCatalog;
        const findCat = (id, cats = []) => {
            const intId = parseInt(id);
            let found;
            for (const cat of cats) {
                if (intId === parseInt(cat.id)) {
                    found = cat;
                    break;
                }
                found = findCat(id, cat.items)
                if (found) {
                    break;
                }

            }
            return found;
        }
        const cat = findCat(id, ec.categories)
        if (cat && cat.items && cat.items.length > 0) {
            return <CatPanel level={ec.selected.length - level}
                             currentTypeOf={ec.currentTypeOf}
                             items={cat.items} key={id}
                             selected={ec.selected[ec.selected.length - level]}
                             active={ec.lastSelected}
                             onRemoveProduct={p.cma.removeProduct}
                             onSelect={p.cma.selectExternalCat}/>
        } else {
            return null;
        }

    }

    render() {
        const p = this.props;
        const ec = p.externalCatalog;
        return (
            <CategoryMatcherStyled className="">
                <MarketplaceSelector marketplaceId={p.marketplaceId}
                                     marketplaces={p.marketplaces} cma={p.cma}/>
                <div className="cm-panels">
                    <div className="c-left">
                        <CategoryProductTree items={(p.sourceCatalog ?? {}).categories ?? []}
                                             sourceCatalog={p.sourceCatalog}
                                             categoryProducts={p.categoryProducts}
                                             actions={p.cma}
                                             externalCatalog={ec}
                                             marketplaceId={p.marketplaceId}
                                             showActive={true}
                                             selectedProductId={p.selectedProductId}
                                             productSuggestions={p.productSuggestions}/>
                    </div>
                    <div className="c-right">
                    <select className="form-control"
                            onChange={p.cma.selectTypeOf}
                            value={ec.currentTypeOf}>
                        {
                            ec.typeOfs.map((i, k) => (
                                <option key={k} value={i.id}
                                        title={"#"+i.id + " - " + i.value}>
                                    {i.value}
                                </option>
                            ))
                        }
                    </select>
                    <div className="right-inner">


                        {
                            ec.selected.slice(0).reverse().map(this.getChildCat)
                        }
                        <CatPanel level={0} selected={ec.selected[0]}
                                  currentTypeOf={ec.currentTypeOf}
                                  active={ec.lastSelected}
                                  onSelect={p.cma.selectExternalCat}
                                  onRemoveProduct={p.cma.removeProduct}
                                  items={ec.categories}/>

                    </div>
                    {ec.progress && <ProgressWindow/>}
                </div>
                </div>
            </CategoryMatcherStyled>
        )
    }
}
