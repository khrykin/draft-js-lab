import React, { Component } from 'react';
import Button from './Button';

export default class AddButton extends Component {
  state = {
    show: false
  };

  toggleShow = e => {
    this.setState({ show: !this.state.show });
  }

  delegate = (handler=() => {}) => e => {
    e.preventDefault();
    this.setState({ show: false });
    handler();
  }

  render() {
    const { show } = this.state;
    return (
      <div
        style={this.props.style}
        className="absolute z-index-3 tc w2"
        >
        <div
          onClick={this.toggleShow}
          ref={this.props.DOMNodeRef}
          className="ml1 pointer dib bg-white silver tc flex flex-column justify-center items-center w2 h2 ba br-100 animate-bg hover-bg-silver hover-white">
         <i className={`fa fa-${show ? 'minus' : 'plus'}`}/>
        </div>
        { show && (
          <div className="gray mt1">
            <div className="">
              <Button
                className=""
                onClick={this.delegate(this.props.addPhoto)}>
                <i className="fa fa-picture-o"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addHTML)}>
                <i className="fa fa-code"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addYoutube)}>
                <i className="fa fa-film"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.props.addInstagram)}>
                <i className="fa fa-instagram"/>
              </Button>
            </div>
            <div>
              <Button
                className=""
                onClick={this.delegate(this.addAttachment)}>
                <i className="fa fa-paperclip"/>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
