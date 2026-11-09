import React, {Component} from 'react';
import styled from 'styled-components'

const ProdOverlayStyled = styled.div`
         background: white;
         padding: 10px;
         width: 100%;
         border-bottom: 1px solid #c6c6c6;

`;


export default class ProdOverlay extends Component {
    onClickRemove = (e) => {
        e.stopPropagation()
        this.props.onRemove()
    }

    render() {
        const p = this.props;
//        const s = this.state;
        return (
            <ProdOverlayStyled className="overlay">
                <div title="показать товары в категории"
                     className="d-flex justify-content-between">
                    <div>
                        #{p.item.id} - {p.item.product_name}
                    </div>
                    <div>
                        <div><button className="far fa-trash-alt"
                                     disabled={p.item.removeProgress}
                                     onClick={this.onClickRemove}/></div>

                    </div>
                </div>


            </ProdOverlayStyled>
        )
    }
}