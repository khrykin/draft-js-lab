import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

import Button, { UploadButton } from './Button';

export default class AttachmentEditor extends Component {
  static defaultProps = {
    data: {},
    onChange: () => {},
    onClose: () => {},
    onUpload() {},
    onAttachLocalFile() {}
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.href && nextProps.href !== this.state.href) {
      this.setState({ href: nextProps.href });
    }
  }

  close = e => {
    if (e.key === 'Enter') {
     this.props.onClose();
   }
  }

  attachLocalFile = file => e => {
    e.preventDefault();
    this.props.onChange({
      href: file.href,
      filename: getFilenameFromURL(file.href)
    });
  }

  render() {
    const { data, attachments } = this.props;

    return (
      <div
        ref={this.props.DOMNodeRef}
        className="absolute pa1 dt bg-black white shadow-4 white br2 z99"
        style={this.props.style}>
        { data.filename ? (
          <div>
            <div className="dib pa2">
              <a className="white" target="__blank" href={data.href}>
                <FileInfo {...data} />
              </a>
            </div>
            <Button
              onClick={this.props.onRemove}>
              <i className="fa fa-close"/>
            </Button>
          </div>
        ) : (
          <div className="dib">
            { attachments.length > 0 && (
              <div className="pa2 bb b--white-20">
                <div className="mb2">
                  <strong className="white ttu f6 mb2">Загружено</strong>
                </div>
                { attachments.map(file => {
                  return (
                    <a className="db pointer link dim pb1" key={file.id} onClick={this.attachLocalFile(file)}>
                      <FileInfo {...file} />
                    </a>
                  );
                })}
              </div>
            )}
            <UploadButton
              onChange={this.props.onUpload}>
              Загрузить
            </UploadButton>
            <Button
              className="fr"
              onClick={this.props.onRemove}>
              <i className="fa fa-close"/>
            </Button>
          </div>
        )}
      </div>
    )
  }
}


function getFilenameFromURL(url = "") {
  return url.split('/').pop().split('#')[0].split('?')[0];
}

function getExtensionFromURL(url = "") {
  const ext = url.split('/').pop().split('#')[0].split('?')[0].split('.')[1]
  return ext &&  ext.toLowerCase();
}

function FileIcon({ href }) {
  const filename = getFilenameFromURL(href);
  const extension = getExtensionFromURL(href);

  let iconClassName = 'fa-file-o';
  switch (extension) {
    case 'pdf':
      iconClassName = 'fa-file-pdf-o';
      break;
    case 'jpg':
      iconClassName = 'fa-file-image-o';
      break;
    case 'jpeg':
      iconClassName = 'fa-file-image-o';
      break;
    case 'png':
      iconClassName = 'fa-file-image-o';
      break;
    case 'gif':
      iconClassName = 'fa-file-image-o';
      break;
    case 'doc':
      iconClassName = 'fa-file-word-o';
      break;
    case 'docx':
      iconClassName = 'fa-file-word-o';
      break;
    case 'xls':
      iconClassName = 'fa-file-excel-o';
      break;
    case 'xslx':
      iconClassName = 'fa-file-excel-o';
      break;
  }

  return (
    <i className={`fa ${iconClassName}`} />
  );
}


function FileInfo({ href, size, filename }) {
  return (
    <div>
      <FileIcon href={href} />
      {' '}
      { filename }
      {' '}
      <small className="light-gray">{ size }</small>
    </div>
  );
}
