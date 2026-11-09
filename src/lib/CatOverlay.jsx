import React, {Component} from 'react';
import styled from 'styled-components'

const CatOverlayStyled = styled.div`
    background: mintcream;
    border: gray;
    border: 0px;
    width: 100%;
    position: unset;
    display: inline-block;
    .d-flex {
    }
    button {
    height: 25px !important;
     }
`;


export default class CatOverlay extends Component {
    // getCatalogById(id, categories){
    //     const intId = parseInt(id);
    //     let found;
    //     for(const cat of categories){
    //         if(intId === parseInt(cat.id)){
    //             found = cat;
    //             break;
    //         }
    //         found = this.getCatalogById(id, cat.items);
    //         if(found){
    //            break;
    //         }
    //     }
    //     return found;
    // }
    onClickRemove = (e) => {
        e.stopPropagation()
        this.props.onRemove()
    }


    render() {
        const p = this.props;
        const s = this.state;
        //const cat = this.getCatalogById(p.catid, p.externalCatalog.categories);
        const cat = p.item;
        return (
            <CatOverlayStyled className="">
                <div className="d-flex justify-content-between border-bottom border-dark">
                    <div>
                        #{cat.id+" - "+cat.name}
                    </div>
                    <div>
                        <button className="far fa-trash-alt"
                                disabled={cat.removeProgress}
                                onClick={this.onClickRemove}/>
                    </div>
                </div>
            </CatOverlayStyled>
        )
    }
}