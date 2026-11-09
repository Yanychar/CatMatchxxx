import React, {PureComponent} from 'react';
import styled from 'styled-components'

const FlPlus = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>);
const PlusButtonStyled = styled.button`
  size: 25px;
  height: 44px;
  width: 44px;
  border: 0;
  border-radius: 10px;
  background-color: #F3F7FF;
  transition: ease-in-out 0.1s;
  &:hover {
    background-color: #5B76AA;
    path{
      stroke: white;
    }

  }
  path {
    stroke: #5B76AA;
  }
  &:disabled {
    background-color: #F3F7FF;
    path{
      stroke: #d0d0d0;
    }
  }
`


export default class PlusButton extends PureComponent {
    render() {
        const p = this.props;
        const s = this.state;
        return (
            <PlusButtonStyled {...p}>
                <FlPlus/>
            </PlusButtonStyled>
        )
    }
}