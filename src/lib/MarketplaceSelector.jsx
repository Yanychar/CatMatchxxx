import React, {PureComponent} from 'react';
import styled from 'styled-components'

const MarketplaceSelectorStyled = styled.div`
`;


export default class MarketplaceSelector extends PureComponent {
    onChange = (e) => {
        this.props.cma.loadExportCategories(e.target.value)
    }
    render() {
        const p = this.props;
//        const s = this.state;
        return (
            <MarketplaceSelectorStyled className="">
                <select className="form-control form-control-sm"
                        value={p.marketplaceId} onChange={this.onChange}>
                    {p.marketplaces.map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                </select>
            </MarketplaceSelectorStyled>
        )
    }
}
