import React, {Component} from 'react';
import styled from 'styled-components'

const FindCategoryStyled = styled.div`
  padding: 6px 8px;
  background: #f4f6fb;
  border-bottom: 1px solid #d8dfeb;

  .input-group-text {
    min-width: 48px;
    justify-content: center;
    color: #5f6c86;
    background: #ffffff;
    border-color: #cfd7e6;
  }

  .form-control {
    border-radius: 8px 0 0 8px;
    border-color: #cfd7e6;
    box-shadow: none;
  }

  .form-control:focus {
    border-color: #7d93c8;
    box-shadow: 0 0 0 0.15rem rgba(93, 118, 170, 0.15);
  }

  .btn-clear {
    border: 1px solid #cfd7e6;
    border-left: 0;
    background: #ffffff;
    color: #6f7a90;
    border-radius: 0 8px 8px 0;
  }

  .btn-clear:hover {
    background: #eef2fb;
    color: #34405c;
  }
`;

export default class FindCategory extends Component {
    onChange = (e) => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e.target.value);
        }
    }

    onClear = () => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange('');
        }
    }

    render() {
        const p = this.props;
        const value = p.value ?? '';
        const resultCount = p.resultCount ?? 0;

        return (
            <FindCategoryStyled className="">
                <div className="input-group input-group-sm">
                    <input
                        className="form-control"
                        placeholder="Search category name"
                        value={value}
                        onChange={this.onChange}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text">{value !== '' ? resultCount : 'A-Z'}</span>
                    </div>
                    {value !== '' &&
                    <div className="input-group-append">
                        <button type="button" className="btn btn-clear" onClick={this.onClear} title="Clear search">
                            <i className="fas fa-times"/>
                        </button>
                    </div>
                    }
                </div>
            </FindCategoryStyled>
        )
    }
}
