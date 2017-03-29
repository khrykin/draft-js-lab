import React, { Component } from 'react';
import CodeEditor from './CodeEditor';

export default class TableEditor extends Component {

  static defaultProps = {
    onChange() {}
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isEditing && !nextProps.focused) {
      this.setState({ isEditing: false });
    }
  }

  toggleIsEditing = e => {
    e && e.preventDefault();
    this.setState({ isEditing: true });
  }


  state = {
    isEditing: false
  }

  change = value => {
    // const { value } = e.target;
    this.props.onChange({
      ...this.props.data,
      content: value
    });
  }

  render() {
    const { isEditing } = this.state;
    const { data } = this.props;
    return (
      <div>
        { isEditing ? (
          <CodeEditor
            value={data.content}
            onChange={this.change} />
        ) : (
          <span>
            <div dangerouslySetInnerHTML={{__html: CSVToHTML(data.content)}} />
          </span>
        )}
        <div style={{ display: isEditing ? 'none' : 'block' }}>
          <a href="" className="link dim gray"
            onClick={this.toggleIsEditing}>
            <i className="fa fa-pencil" />
          </a>
        </div>
      </div>
    );
  }
}

const DELIMETER = /( {2,}|\t)/g;

export function CSVToHTML(csv, delimeter=DELIMETER) {
  let rows = csv.split('\n');
  for (let i = 0; i < rows.length; i++) {
    const tag = i > 0 ? 'td' : 'th';
    rows[i] = `<tr><${tag}>`
      + rows[i].replace(delimeter, `</${tag}><${tag}>`)
      + `</${tag}></tr>`
      ;
  }

  let out = '<table>' + rows.join('') + '</table>';
  return out;
}

export function HTMLToCSV(html, delimeter='\t') {
  let out = html;
  const parent = document.createElement('TABLE');
  parent.innerHTML = html;
  let rows = [...parent.children[0].children];

  for (let i = 0; i < rows.length; i++) {
    let cols = [];
    for (let j = 0; j < rows[i].children.length; j++) {
      cols.push(rows[i].children[j].innerHTML);
    }
    rows[i] = cols.join(delimeter);
  }

  return rows.join('\n');
}
