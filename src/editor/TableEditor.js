import React, { Component } from 'react';

export default class TableEditor extends Component {

  static defaultProps = {
    onChange() {}
  }

  change = e => {
    const { value } = e.target;
    this.props.onChange(value);
  }

  render() {
    return (
        <textarea
          className="code"
          value={this.props.value}
          onChange={this.change} />
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
