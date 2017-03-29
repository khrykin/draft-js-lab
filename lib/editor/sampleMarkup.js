"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
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

var html = "\n<h2>\u0427\u0435\u043C\u043F\u0438\u043E\u043D\u0430\u0442 \u0438 \u041F\u0435\u0440\u0432\u0435\u043D\u0441\u0442\u0432\u043E \u0433.\u041C\u043E\u0441\u043A\u0432\u044B, \u043B\u044B\u0436\u043D\u0430\u044F \u0433\u043E\u043D\u043A\u0430 \u2013 \u043B\u043E\u043D\u0433 (65 / 75 \u043C\u0438\u043D)</h2>\n<h3>\u0426\u0435\u043B\u0438 \u0438 \u0437\u0430\u0434\u0430\u0447\u0438</h3>\n<p>\u0420\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u0438 <a data-skio-attachment=\"true\" data-skio-attachment-size=\"16 kB\" href=\"http://ski-o.ru/docs/info.pdf\">\u043F\u043E\u043F\u0443\u043B\u044F\u0440\u0438\u0437\u0430\u0446\u0438\u044F</a> \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F, \u043A\u0430\u043A \u043C\u0430\u0441\u0441\u043E\u0432\u043E- \u043E\u0437\u0434\u043E\u0440\u043E\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0438 \u0440\u0430\u0437\u0432\u0438\u0432\u0430\u044E\u0449\u0435\u0433\u043E \u0432\u0438\u0434\u0430 \u0441\u043F\u043E\u0440\u0442\u0430 \u0441\u0440\u0435\u0434\u0438 \u0432\u0441\u0435\u0445 \u0441\u043B\u043E\u0435\u0432 \u043D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u044F; \u0432\u044B\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0438\u043B\u044C\u043D\u0435\u0439\u0448\u0438\u0445 \u0441\u043F\u043E\u0440\u0442\u0441\u043C\u0435\u043D\u043E\u0432 \u0433.\u041C\u043E\u0441\u043A\u0432\u044B, \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u0438 \u0443\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u0438\u0435 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0445 \u0438 \u0434\u0440\u0443\u0436\u0435\u0441\u043A\u0438\u0445 \u0441\u0432\u044F\u0437\u0435\u0439.</p>\n<h3>\u041E\u0440\u0433.\u043A\u043E\u043C\u0438\u0442\u0435\u0442 \u0441\u043E\u0440\u0435\u0432\u043D\u043E\u0432\u0430\u043D\u0438\u0439 </h3>\n<ul>\n   <li>\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0443\u0434\u044C\u044F \u2013 \u0415\u043B\u0435\u043D\u0430 \u0425\u0435\u043B\u044C\u0434\u0435\u0440\u0442 (\u04211\u041A), lenahel@mail.ru </li>\n   <li>\u0417\u0430\u043C. \u043F\u043E \u0421\u0422\u041E \u2013 \u041E\u043B\u0435\u0433 \u041A\u0430\u043B\u0438\u043D\u0438\u043D (\u04211\u041A) </li>\n   <li>\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0435\u043A\u0440\u0435\u0442\u0430\u0440\u044C - \u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u0424\u0438\u043B\u0438\u043C\u043E\u043D\u043E\u0432\u0430 (\u04211\u041A) </li>\n   <li>\u0421\u0443\u0434\u044C\u044F \u0444\u0438\u043D\u0438\u0448\u0430 \u2013 \u041F\u0430\u0432\u0435\u043B \u0422\u0451\u043C\u043A\u0438\u043D (\u04211\u041A)</li>\n</ul>\n<h3>\u0421\u0440\u043E\u043A\u0438 \u0438 \u043C\u0435\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F</h3>\n<p>19 \u0444\u0435\u0432\u0440\u0430\u043B\u044F 2017 \u0433. (\u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435) \u2013 \u043B/\u043F \u0420\u043E\u043C\u0430\u0448\u043A\u043E\u0432\u043E. \u0420\u0430\u0437\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u043D\u0430 \u0441\u0442\u0430\u0434\u0438\u043E\u043D\u0435 \xAB\u041C\u0435\u0434\u0438\u043A\xBB (\u0443\u043B. \u041C\u0430\u0440\u0448\u0430\u043B\u0430 \u0422\u0438\u043C\u043E\u0448\u0435\u043D\u043A\u043E, \u0434.1)</p>\n<p></p>" +
// `<figure><img src="image.jpg"><figcaption>Подпись</figcaption></figure>`
// +
// `<p>Район соревнований <strong>ЗАКРЫТ</strong> для тренировок с картами до 19 февраля!</p>
// <h3>Участники <small>соревнований</small></h3>
// <ul>
//    <li>М12А (2005-2006г.г.), </li>
//    <li>М14 (2003-2004г.г.), </li>
//    <li>М17 (2000-2002г.г.), </li>
//    <li>М20 (1997-1999г.г.), </li>
//    <li>М21 (1996г. и старше – МС, КМС, 1р.) </li>
//    <li>Ж12А (2005-2006г.г.), </li>
//    <li>Ж14 (2003-2004г.г.), </li>
//    <li>Ж17 (2000-2002г.г.), </li>
//    <li>Ж20 (1997-1999г.г.), </li>
//    <li>Ж21(1996г. и старше – МС, КМС, 1р.) </li>
//    <li>М12Б и Ж12Б (2007г. и младше, начинающие 2005-2006г.), </li>
//    <li>О1, О2 (открытые группы). </li>
// </ul>
// <p>Допускаются иногородние участники, которые не участвуют в розыгрыше медалей ЧиП г.Москвы.</p>
// <p>Чемпионат г.Москвы проводится среди участников групп М21 и Ж21 согласно Положению о Чемпионате г.Москвы по спортивному ориентированию на лыжах 2017г. Участники групп МЖ12–20 участвуют в зачёте Первенства г.Москвы согласно Положению о Первенстве г.Москвы по спортивному ориентированию на лыжах 2017г. Ответственность за безопасность и сохранность жизни и здоровья участников в лесу (на дистанции) и во время соревнований (до старта и после финиша) возлагается на представителей команд, тренеров, самих участников. Участники соревнований до 20 лет включительно допускаются только при наличии допуска врача. </p>
// <p><a class="Attachment" href="http://ski-o.ru/index.pdf">Нумерация</a></p>
// <h3>Программа соревнований </h3>
// `
// +
// `<figure>
//    <table>
//       <tbody>
//          <tr>
//             <th></th>
//             <th></th>
//          </tr>
//          <tr>
//             <td>09:00</td>
//             <td>Начало работы секретариата </td>
//          </tr>
//          <tr>
//             <td>11:00</td>
//             <td>Начало старта Чемпионата и Первенства Москвы </td>
//          </tr>
//          <tr>
//             <td>11:30-13:30</td>
//             <td>Свободный старт открытых групп </td>
//          </tr>
//          <tr>
//             <td>14:00</td>
//             <td>Начало награждения <a href="/">2</a> на Медике (по мере формирования окончательных протоколов)</td>
//          </tr>
//       </tbody>
//    </table>
//    <figcaption>Таблица 1</figcaption>
// </figure>`
// + `<p></p>
// <h3>Спортивно-техническая информация</h3>`
// +
// `<figure><span data-skio-html="true"><blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:62.4537037037037% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BSG34FpD5hQ/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">After driving along the twists and turns of Switzerland’s Maloja Pass, Jonas Skorpil (@zrodyr) released his drone to take this nighttime shot. “I set it to a long exposure and tried my luck,” he says. #TheWeekOnInstagram Photo by @zrodyr</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">Публикация от Instagram (@instagram) <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2017-03-26T16:05:02+00:00">Мар 26 2017 в 9:05 PDT</time></p></div></blockquote> <script async defer src="//platform.instagram.com/en_US/embeds.js"></script></span><figcaption>Twitter</figcaption></figure>`
// +
// `<p>Местность среднепересеченная, перепад на склоне до 50 м. Трассы подготовлены снегоходами с бороной. В районе соревнований есть стационарная лыжная трасса протяженностью 17 км. Процентное соотношение лыжней: Скоростная - 35% Быстрая - 65% Карта зимняя, масштаб в таблице, сечение рельефа 2,5м, не герметизирована. У групп М21 и М20 - переворот карты (не в месте старта), последний КП первого круга на карте второго круга обозначен знаком старта, нумерация сквозная. Остальные дистанции в один круг. Нумерация КП у всех групп двойная. Опасные места – лыжная трасса, крутые спуски на ней. Для удобства понимания направления движения по лыжной трассе будет использован специальный знак поверх знака лыжной трассы – красные стрелочки. Чтению карты он не мешает.</p>
// ` +
"<figure><div class=\"Embed\"><iframe src=\"https://www.youtube.com/?v=dQw4w9WgXcQ\" frameborder=\"0\" allowfullscreen=\"\"></iframe></div><figcaption>How do you do</figcaption></figure>";
// +
// `<figure><span data-skio-html="true"><blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:62.4537037037037% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BSG34FpD5hQ/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">After driving along the twists and turns of Switzerland’s Maloja Pass, Jonas Skorpil (@zrodyr) released his drone to take this nighttime shot. “I set it to a long exposure and tried my luck,” he says. #TheWeekOnInstagram Photo by @zrodyr</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">Публикация от Instagram (@instagram) <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2017-03-26T16:05:02+00:00">Мар 26 2017 в 9:05 PDT</time></p></div></blockquote> <script async defer src="//platform.instagram.com/en_US/embeds.js"></script></span><figcaption>Twitter</figcaption></figure>`
// ;
//
// import { convertToHTML, convertFromHTML } from 'draft-convert';
// import { convertToRaw, EditorState } from 'draft-js';
// console.log("convertFromHTML", convertToRaw(convertFromHTML({})(html)));

exports.default = html;