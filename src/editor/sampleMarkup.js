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

<table><tbody><tr><th>№п/п</th><th>Фамилия, имя</th><th>Коллектив</th><th>Квал</th><th>Номер</th><th>ГР</th><th>Результат</th><th>Отставание</th><th>Место </th></tr><tr><td>1</td><td>Сушко Екатерина</td><td>Ориента-SKI-O</td><td>Iю</td><td>1014</td><td>2005</td><td>00:25:44</td><td>+00:00</td><td>1 </td></tr><tr><td>2</td><td>Хмелевская Варвара</td><td>Хорошево СШ№102</td><td>II</td><td>1013</td><td>2005</td><td>00:26:59</td><td>+01:15</td><td>2 </td></tr><tr><td>3</td><td>Силакова Анастасия</td><td>Ориента-СКРУМ</td><td>Iю</td><td>1019</td><td>2006</td><td>00:27:11</td><td>+01:27</td><td>3 </td></tr><tr><td>4</td><td>Иванова Елизавета</td><td>ЮЗАО-TEAM</td><td>Iю</td><td>1006</td><td>2005</td><td>00:28:46</td><td>+03:02</td><td>4 </td></tr><tr><td>5</td><td>Заблоцкая Василиса</td><td>Ориента-SKI-O</td><td>Iю</td><td>1022</td><td>2005</td><td>00:30:28</td><td>+04:44</td><td>5 </td></tr><tr><td>6</td><td>Шмелёва Алина</td><td>Ориента-SKI-O</td><td>IIю</td><td>1009</td><td>2005</td><td>00:30:40</td><td>+04:56</td><td>6 </td></tr><tr><td>7</td><td>Буртовская Александра</td><td>Ориента-SKI-O</td><td>Iю</td><td>1005</td><td>2005</td><td>00:31:15</td><td>+05:31</td><td>7 </td></tr><tr><td>8</td><td>Темнова Софья</td><td>CRAFT-ОРИЕНТА</td><td>Iю</td><td>1007</td><td>2005</td><td>00:33:36</td><td>+07:52</td><td>8 </td></tr><tr><td>9</td><td>Зверева Ева</td><td>Ориента-SKI-O</td><td>Iю</td><td>1018</td><td>2005</td><td>00:34:12</td><td>+08:28</td><td>9 </td></tr><tr><td>10</td><td>Кунина Екатерина</td><td>Ориента-SKI-O</td><td>Iю</td><td>1011</td><td>2006</td><td>00:34:35</td><td>+08:51</td><td>10 </td></tr><tr><td>11</td><td>Зубкова Дарья</td><td>CRAFT-ОРИЕНТА</td><td>Iю</td><td>1010</td><td>2006</td><td>00:37:34</td><td>+11:50</td><td>11 </td></tr><tr><td>12</td><td>Гомозова Анна</td><td>Ориента-SKI-O</td><td>IIю</td><td>1001</td><td>2005</td><td>00:38:45</td><td>+13:01</td><td>12 </td></tr><tr><td>13</td><td>Овчинникова Анастасия</td><td>Ориента-Кунцево</td><td>IIю</td><td>1021</td><td>2005</td><td>00:49:16</td><td>+23:32</td><td>13 </td></tr><tr><td>14</td><td>Иванова Полина</td><td>Ориента-Восток</td><td>IIю</td><td>1003</td><td>2005</td><td>01:20:25</td><td>+54:41</td><td>14 </td></tr><tr><td>15</td><td>Деришева Елена</td><td>Искатель</td><td>IIю</td><td>1016</td><td>2006</td><td>01:22:36</td><td>+56:52</td><td>15 </td></tr><tr><td>16</td><td>Алексеева Алиса</td><td>Искатель</td><td>IIю</td><td>1004</td><td>2006</td><td>01:34:56</td><td>+09:12</td><td>16 </td></tr></tbody></table>

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
