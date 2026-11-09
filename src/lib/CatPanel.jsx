import React, {Component} from 'react';
import styled from 'styled-components'
import FindCategory from "./FindCategory";
import CatItem from "./CatItem";

const CatPanelStyled = styled.div`

    width: 100%;
    height: 100%;
    background: #eef2f8;
    border: 0px;
    box-sizing: border-box;
    min-width: 0;
    >.p-content{
      background: #eef2f8;
      height: calc(100% - 48px);
      overflow-y: auto;
      padding-right: 8px;
    }

    .search-empty {
      padding: 16px 14px;
      color: #5f6c86;
      font-size: 13px;
      text-align: left;
    }

`;

export default class CatPanel extends Component {
    state = {
        search: '',
    }

    onSearchChange = (value) => {
        this.setState({search: value});
    }

    getSuggestionMap = () => {
        const suggestions = this.props.productSuggestions?.items ?? [];
        const map = {};

        suggestions.forEach((item, index) => {
            map[String(item.id)] = {
                score: parseFloat(item.score) || 0,
                rank: index + 1,
                item,
            };
        });

        return map;
    }

    getVisibleItems = () => {
        const items = this.props.items ?? [];
        const needle = (this.state.search ?? '').trim().toLowerCase();
        const filteredItems = needle === ''
            ? items
            : items.filter((item) => String(item.name ?? '').toLowerCase().indexOf(needle) >= 0);

        const suggestionMap = this.getSuggestionMap();
        const suggested = [];
        const regular = [];

        filteredItems.forEach((item) => {
            if (suggestionMap[String(item.id)]) {
                suggested.push(item);
            } else {
                regular.push(item);
            }
        });

        suggested.sort((a, b) => suggestionMap[String(b.id)].score - suggestionMap[String(a.id)].score);

        return suggested.concat(regular);
    }

    render() {
        const p = this.props;
        const visibleItems = this.getVisibleItems();
        const suggestionMap = this.getSuggestionMap();

        return (
            <CatPanelStyled>
                <div>
                    <FindCategory
                        value={this.state.search}
                        resultCount={visibleItems.length}
                        onChange={this.onSearchChange}
                    />

                </div>
                <div className="p-content">
                    {
                        visibleItems.map(
                            (i,key) => {
                                const suggestion = suggestionMap[String(i.id)] ?? null;
                                return <CatItem item={i} key={key} selected={p.selected}
                                                currentTypeOf={p.currentTypeOf}
                                                active={p.active}
                                                suggestionScore={suggestion?.score}
                                                suggestionRank={suggestion?.rank}
                                                onSuggestionSelect={p.onSuggestionSelect}
                                                suggestionPath={suggestion?.item?.path}
                                                scrollTargetId={p.scrollTargetId}
                                                onRemoveProduct={p.onRemoveProduct.bind(this)}
                                                onSelect={p.onSelect.bind(this, p.level)}/>
                            }
                        )
                    }
                    {visibleItems.length === 0 &&
                    <div className="search-empty">
                        No categories found for this panel.
                    </div>
                    }

                </div>
            </CatPanelStyled>
        )
    }
}
