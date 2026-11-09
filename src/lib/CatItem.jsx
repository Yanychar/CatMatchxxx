import React, {Component} from 'react';
import styled from 'styled-components'
import ProdOverlay from "./ProdOverlay";

const CatItemStyled = styled.div`
    position: relative;
    background: gray;
    min-height: 25px;
    border-top: 1px solid #0F0B0B;
    display: flex;
    min-width: 0;

    >img{
      max-height: 100%;
      width: 50px;
      }


    >.prodname {
      flex:1;
      text-align: left;
      padding: 0 8px;
      background: azure;
      font-size: 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .ci-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .ci-score {
        flex-shrink: 0;
        background: #5B76AA;
        color: #ffffff;
        border-radius: 999px;
        padding: 2px 7px;
        font-size: 11px;
        font-weight: 700;
      }

      };
    >.controls {
      display: flex;
      font-size: 15px;
      color: black;
      min-width: 0;
      button {
        color: #eeeeee;
        background: steelblue;
        padding: 0px 4px;
        height: 25px;
        line-height: 25px;
        border-radius: 3px;
      }
      .goodsnumber {
        display: inline-block;
        background: white;
        text-align: center;
        font-weight: bold;
        width: 50px;
        overflow: hidden;
        white-space: nowrap;
      }
    }


    &.selected{
      >.prodname{
        background: yellow;

      }
    }
    &.active{
      >.prodname{
        background: #ffcaca;
      }

    }

    &.suggestion-1 > .prodname {
      background: #dff5ef;
    }

    &.suggestion-2 > .prodname {
      background: #e8f0ff;
    }

    &.suggestion-3 > .prodname {
      background: #f0f4fb;
    }

    .ci-overlay-container{
      position: absolute;
      width: 100%;
      background: white;
      border:1px solid #c6c6c6;
      border-radius: 0 0 4px 4px;
      padding:5px;
      box-shadow: 10px 10px 20px 5px rgba(0,0,0,0.3);
      height: 50vh;
      overflow-y: auto;
      z-index: 10;
      top: 24px;
    }
`;

export default class CatItem extends Component {
    state = {open: false}
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.itemRef = React.createRef();
    }
    componentDidMount() {
        this.scrollIntoViewIfNeeded();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.scrollTargetId !== this.props.scrollTargetId || prevProps.active !== this.props.active || prevProps.selected !== this.props.selected) {
            this.scrollIntoViewIfNeeded();
        }
    }
    onClickOpenOvl = (open) => {
        if(open !== this.state.open) {
            if (open) {
                window.addEventListener('mousedown', this.onClickCloseOvl)
                window.addEventListener('touchstart', this.onClickCloseOvl)
            } else {
                window.removeEventListener('mousedown', this.onClickCloseOvl)
                window.removeEventListener('touchstart', this.onClickCloseOvl)
            }
            this.setState({open: open})
        }
    }
    onClickCloseOvl = (e) => {
        if(this.container.current && !this.container.current.contains(e.target)) {
            this.onClickOpenOvl(false)
        }
    }

    onClickSuggested = (e) => {
        const p = this.props;
        if (Array.isArray(p.suggestionPath) && p.suggestionPath.length > 0 && typeof p.onSuggestionSelect === 'function') {
            e.stopPropagation();
            p.onSuggestionSelect(p.suggestionPath);
        }
    }
    scrollIntoViewIfNeeded = () => {
        const p = this.props;
        const targetId = parseInt(p.scrollTargetId);
        if (!(targetId > 0) || targetId !== parseInt(p.item.id) || !this.itemRef.current) {
            return;
        }

        this.itemRef.current.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }

    render() {
        const p = this.props;
        const s = this.state;
        const classes = [];
        const id = parseInt(p.item.id)
        if(parseInt(p.active) === id){
            classes.push('active');
        } else if(parseInt(p.selected) === id){
            classes.push('selected');
        }
        if (p.suggestionRank) {
            classes.push('suggestion-' + p.suggestionRank);
        }
        const ps = p.item.products ?? [];
        return (
            <CatItemStyled className={classes.join(' ')} ref={this.itemRef}>
                <div title={'#'+p.item.id+' - '+p.item.name} className="prodname"
                     onClick={p.suggestionPath ? this.onClickSuggested : p.onSelect.bind(this, p.item)}>
                    <span className="ci-label">{p.item.name}</span>
                    {typeof p.suggestionScore === 'number' &&
                    <span className="ci-score">{Math.round(p.suggestionScore * 100)}%</span>
                    }
                </div>
                <div className="controls">

                        <div className="chevrondiv">
                            <button className="btn btn-sm"
                                    disabled={!(ps.length > 0)}
                                    onClick={this.onClickOpenOvl.bind(this, !s.open)}>
                                <i className="fas fa-angle-double-down"/>
                            </button>
                        </div>
                        <span title="количество товаров в категории"
                              className="goodsnumber">
                            {ps.length>0?ps.length:''}
                        </span>
                        <button><i className="far fa-trash-alt"/></button>
                </div>

                {s.open &&
                    <div className="ci-overlay-container" ref={this.container} onClick={e=>{e.stopPropagation()}}>
                        {ps.map((i, key) => (
                            <ProdOverlay key={key} item={i}
                                         onRemove={p.onRemoveProduct.bind(this, i.id, p.item.id, p.currentTypeOf)}/>
                        ))}
                    </div>
                }
            </CatItemStyled>
        )
    }
}
