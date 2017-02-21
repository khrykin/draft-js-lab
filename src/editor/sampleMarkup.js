// const html =
// `<h1>Header</h1>
// <h3>Header</h3>
// <p>
// <b>Bold text</b>, <i>Italic text</i><br/ >
// <a href="http://www.ski-o.ru" target="__blank">Example link</a>
// </p>
// <ul>
//   <li>To do 1</li><li>To do 2</li>
// </ul>
// <ol>
//   <li>To do 1</li><li>To do 2</li>
// </ol>
// <pre>name  result</pre>
// <figure><img src="image2.jpg" /><figcaption>Caption 2</figcaption></figure>
// <figure><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe><figcaption>Caption 3</figcaption></figure>
// <figure><iframe class="instagram-media instagram-media-rendered" id="instagram-embed-0" src="https://www.instagram.com/p/BMWm4GPjxEV" height="460" data-instgrm="true" data-instgrm-payload-id="instagram-media-payload-0" scrolling="no" style="background:rgb(255, 255, 255);border:0px;margin:1px;max-width:658px;width:calc(100% - 2px);border-radius:4px;box-shadow:rgba(0, 0, 0, 0.498039) 0px 0px 1px 0px, rgba(0, 0, 0, 0.14902) 0px 1px 10px 0px;display:block;padding:0px;"></iframe><figcaption>Caption 4</figcaption><</figure>
// `;

let html = `
<h2>Header</h2>
<p>
  This is plain paragraph. This is a <a href="http://ski-o.ru">link</a>.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet arcu sit amet tortor molestie sodales. Pellentesque neque arcu, lobortis sit amet dui ut, tristique suscipit mi. Sed pulvinar id lectus nec ultrices. Suspendisse faucibus mi vitae efficitur aliquam. Nam sit amet pellentesque elit. Donec a fringilla odio. Aliquam erat lorem, ornare nec tempus quis, tincidunt eu risus. Donec ligula ex, consectetur ac dolor at, commodo venenatis est.
</p>
  This is plain text. This is a <a target="__blank" href="http://ski-o.ru">link</a> with target="__blank". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet arcu sit amet tortor molestie sodales. Pellentesque neque arcu, lobortis sit amet dui ut, tristique suscipit mi. Sed pulvinar id lectus nec ultrices. Suspendisse faucibus mi vitae efficitur aliquam. Nam sit amet pellentesque elit. Donec a fringilla odio. Aliquam erat lorem, ornare nec tempus quis, tincidunt eu risus. Donec ligula ex, consectetur ac dolor at, commodo venenatis est.
<div>
  This is text inside div. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet arcu sit amet tortor molestie sodales. Pellentesque neque arcu, lobortis sit amet dui ut, tristique suscipit mi. Sed pulvinar id lectus nec ultrices. Suspendisse faucibus mi vitae efficitur aliquam. Nam sit amet pellentesque elit. Donec a fringilla odio. Aliquam erat lorem, ornare nec tempus quis, tincidunt eu risus. Donec ligula ex, consectetur ac dolor at, commodo venenatis est.
</div>

<table>
  <tbody>
    <tr>
      <td>This is text</td>
      <td>in a table</td>
    </tr>
  </tbody>
</table>

<h3>Header</h3><ul>
  <li>To do 1</li><li>To do 2</li>
</ul>
<ol>
  <li>To do 1</li><li>To do 2</li>
</ol>

<figure>
  <img src="image.jpg" />
  <figcaption>Caption</figcaption>
</figure>
<div></div>

<figure>
  <img src="image2.jpg" />
  <figcaption>Caption 2</figcaption>
</figure>

<div></div>
`;
//
// import { convertToHTML, convertFromHTML } from 'draft-convert';
// import { convertToRaw, EditorState } from 'draft-js';
// console.log("convertFromHTML", convertToRaw(convertFromHTML({})(html)));

export default html;
