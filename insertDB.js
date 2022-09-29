const express = require('express');
const app = express();
const fs = require('fs/promises');
const mysql = require('mysql2');
const pool = require('./utils/db');
const moment = require('moment');
require('dotenv').config();
let products = [];
// = 整理 josn
// (async () => {
//   for (let index = 0; index < 48; index++) {
//     let result = await fs.readFile(`./json/貓-罐頭/${index}.json`, 'utf-8');
//     result = JSON.parse(result).Data.MoreInfo;
//     let item = { title: result.SaleProduct_Title, desciption: result.SaleProductDesc_Content };
//     products.push(item);
//   }
//   let fileInfo = JSON.stringify(products);
//   fs.writeFile('./data/貓-罐頭.json', fileInfo);
// })();

// (async () => {
<<<<<<< HEAD
=======
  // = 建立寵物商品店家
  await (async () => {
    let storeArr = [
      '寵愛一生',
      '寵沙啦',
      '毛手毛腳',
      '毛落趣',
      '貓咪加百二',
      '米米貓貓',
      '躲貓貓',
      '汪汪先輩',
      '汪東汪西',
      '嗷嗚嗚嗚嗚',
    ];
    for (const item of storeArr) {
      try {
        let r = await pool.execute(
          'INSERT IGNORE INTO store (name) VALUE (?)',
          [item]
        );
        console.log(r);
      } catch (error) {
        console.log('error', error);
      }
    }
  })();
>>>>>>> ec-product-detail
//   // = 建立寵物商品店家
//   await (async () => {
//     let storeArr = ['寵愛一生', '寵沙啦', '毛手毛腳', '毛落趣', '貓咪加百二', '米米貓貓', '躲貓貓', '汪汪先輩', '汪東汪西', '嗷嗚嗚嗚嗚'];
//     for (const item of storeArr) {
//       try {
//         let r = await pool.execute('INSERT IGNORE INTO store (name) VALUE (?)', [item]);
//         console.log(r);
//       } catch (error) {
//         console.log('error', error);
//       }
<<<<<<< HEAD
=======
//     }
//   })();
>>>>>>> ec-product-detail
// // = 建立寵物商品店家
// await (async () => {
//   let storeArr = [
//     '寵愛一生',
//     '寵沙啦',
//     '毛手毛腳',
//     '毛落趣',
//     '貓咪加百二',
//     '米米貓貓',
//     '躲貓貓',
//     '汪汪先輩',
//     '汪東汪西',
//     '嗷嗚嗚嗚嗚',
//   ];
//   for (const item of storeArr) {
//     try {
//       let r = await pool.execute(
//         'INSERT IGNORE INTO store (name) VALUE (?)',
//         [item]
//       );
//       console.log(r);
//     } catch (error) {
//       console.log('error', error);
//     }
//   }
// })();

//   // = 寫入寵物商品假資料
//   await (async () => {
//     let result = await fs.readFile(`./json/total.json`, 'utf-8'); // todo: 讀檔案
//     result = JSON.parse(result); // todo: 檔案內容轉 JSON
//     // todo: 針對剛剛的結果跑 for
//     for (const [index, item] of result.entries()) {
//       try {
//         // todo: 寫進資料庫
//         let r = await pool.execute('INSERT IGNORE INTO product (product_type_id, name, store_id, description, price, product_status, per_score) VALUE (?, ?, ?, ?, ?, ?, ?)', [
//           4,
//           item.title,
//           Number(item.store),
//           item.desciption,
//           index + 500,
//           1,
//           4 + (index % 10 === 0 ? 1 : (index % 10) / 10),
//         ]);
//         // console.log(4 + (index % 10 === 0 ? 1 : (index % 10) / 10));
//         console.log('寵物商品第' + (index + 1) + '筆已寫入');
//       } catch (error) {
//         console.log('error', error);
//       }
//     }
//   })();

//   // = 整理圖片後讀取素材資料，一併寫入 DB
//   let product_type = await fs.readdir(`./public/product`);
//   function product_type_num(name) {
//     if (name == 'living') return 1;
//     if (name == 'fun') return 2;
//     if (name == 'restaurant') return 3;
//     if (name == 'pet') return 4;
//   }
//   for (const type of product_type) {
//     await (async () => {
//       let r_temp = [];
//       for (let i = 0; i < 20; i++) {
//         let r = await fs.readdir(`./public/product/${type}/${i + 1}`);
//         r_temp.push([]);
//         for (const item of r) {
//           let a = item.split('_');
//           let b = a[2].split('.');
//           let obj = { name: a[0], num: a[1], photo_num: b[0], file_type: b[1] };
//           r_temp[r_temp.length - 1].push(obj);
//         }
//       }
//       for (let i = 0; i < r_temp.length; i++) {
//         let sortArr = r_temp[i].sort((old, current) => {
//           return old.photo_num - current.photo_num;
//         });
//         r_temp[i] = sortArr;
//       }
//       for (const [index, item] of r_temp.entries()) {
//         for (const [num, i] of item.entries()) {
//           let fileName = `${i.name}_${i.num}_${i.photo_num}.${i.file_type}`;
//           r_temp[index][num] = fileName;
//         }
//       }
//       console.log('r_temp', r_temp);

//       let result = await fs.readFile(`./json/${type}_product.json`, 'utf-8');
//       result = JSON.parse(result);
//       for (const [index, item] of result.entries()) {
//         try {
//           let [store_result] = await pool.execute('INSERT IGNORE INTO store (name) VALUE (?)', [`Oh!DogCat ${type} 分館 - 測試商家${index + 1}`]);
//           let [product_result] = await pool.execute(
//             'INSERT IGNORE INTO product (product_type_id, name, store_id, description, price, product_status, per_score, intro, main_photo, photo_path) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [
//               product_type_num(type),
//               item.name,
//               Number(store_result.insertId),
//               item.description,
//               item.price,
//               1,
//               4 + (index % 10 === 0 ? 1 : (index % 10) / 10),
//               item.intro,
//               r_temp[index][0],
//               `/product/${type}/${index + 1}`,
//             ]
//           );
//           console.log(product_result.insertId);
//           for (const [i, item] of r_temp[index].entries()) {
//             if (i > 0) {
//               let [photo_result] = await pool.execute('INSERT IGNORE INTO product_photo (product_id, file_name) VALUE (?, ?)', [product_result.insertId, r_temp[index][i]]);
//               console.log(r_temp[index][i]);
//             }
//           }
//         } catch (error) {
//           console.log('error', error);
//         }
//       }
//     })();
//   }
// })();

// = 穗懷修改餐廳商品
(async () => {
  let file = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  let data = JSON.parse(file);
  for (const item of data) {
    let result = await pool.execute(
      'UPDATE product SET name= ? , intro= ? , description = ?, product_tag = ? WHERE id = ?',
      [item.name, item.intro, item.description, item.product_tag, item.id]
    );
    //     // let [result] = await pool.execute(
    //     //   'SELECT name FROM product WHERE id = ?',
    //     //   [item.id]
    // //     // );
    // console.log('====================================');
    // console.log(result);
    // console.log('====================================');
  }
})();

// (async () => {
//   // try {
//   //   for (let i = 0; i < 10; i++) {
//   //     if (true) {
//   //       let file = JSON.parse(await fs.readFile(`./json/pet_product/${i}.json`, 'utf-8')); // ? 單一檔案
//   //       console.log('讀取第 ' + i + ' 個檔案');
//   //       console.log('該檔案長度為 ' + file.length);
//   //       let mainPhotoArr = []; // ? 單一檔案內資料所需要的個別封面圖
//   //       for (let index = 0; index < file.length; index++) {
//   //         let photoFolder = await fs.readdir(`./public/product/pet/${i}/${index}`);
//   //         if (photoFolder.length === 0) mainPhotoArr.push('');
//   //         if (photoFolder.length > 0) mainPhotoArr.push(photoFolder[0]);
//   //       }
//   //       console.log('圖片資料夾數量為 ' + mainPhotoArr.length);
//   //       console.log('開始寫入資料庫 ...');
//   //       for (let index = 0; index < file.length; index++) {
//   //         console.log(`開始寫入第 ${i} 個檔案中的第 ${index} 筆資料`);
//   //         let data = [
//   //           4,
//   //           file[index].title,
//   //           Number(file[index].store),
//   //           file[index].desciption,
//   //           file[index].price,
//   //           1,
//   //           4 + (index % 10 === 0 ? 1 : (index % 10) / 10),
//   //           file[index].tags,
//   //           mainPhotoArr[index],
//   //           `/product/pet/${i}/${index}`,
//   //         ];
//   //         // console.log('data', data);
//   //         let [insert] = await pool.execute(
//   //           'INSERT INTO product (product_type_id, name, store_id, description, price, product_status, per_score, product_tag,main_photo,photo_path) VALUE (?,?,?,?,?,?,?,?,?,?)',
//   //           data
//   //         );
//   //         console.log('insert product success id = ' + insert.insertId);
//   //         let photoFolder = await fs.readdir(`./public/product/pet/${i}/${index}`);
//   //         for (let num = 0; num < photoFolder.length; num++) {
//   //           if (num > 0) {
//   //             await pool.execute('INSERT INTO product_photo (product_id ,file_name ) VALUE (?,?)', [insert.insertId, photoFolder[num]]);
//   //           }
//   //         }
//   //         console.log('id = ' + insert.insertId + ' 已新增 ' + (photoFolder.length - 1) + ' 照片');
//   //       }
//   //     }
//   //   }
//   // } catch (error) {
//   //   console.error(error);
//   // }
//   // = 刪除本次資料
//   // await pool.execute(`DELETE FROM product WHERE id < 519`);
//   // await pool.execute(`DELETE FROM product_photo WHERE product_id < 519`);
// })();

// = 寫入用戶假資料
// (async () => {
//   let user = [
//     '貓巷少女萬莉',
//     'Nicholas Grote',
//     '貝爾',
//     '娜娜',
//     'MIRIAM',
//     '嚇死人的婉瑄',
//     '自戀的宛于',
//     '內向的顯晴',
//     '熱心的睿余',
//     '善良的光玉',
//     'OLIVE',
//     '善於打架的雷神歌王',
//     '幽默的定輝',
//     '溫柔的正全',
//     '貼心的靚宜',
//     '玉珊還有玉山高',
//     'ALAYNA',
//     '愛吃飯的家寧',
//     '風景秀麗',
//     '默默無聞超級無敵海景矮冬瓜',
//     '小魚',
//     '溫溫的宥禎',
//     '竹筍竹筍蹦蹦開',
//     '精明的靜怡',
//     'NOELLE',
//     '可靠的若家',
//     '熱血沸騰天真可愛十三世',
//     '帥氣的裕明',
//     '大寶的娘_采平',
//     '大寶',
//     '強效柯',
//     'Megan Maggie',
//     '發福的家豪',
//     '靦腆的少華',
//     '狂怒修道士',
//     '暄玲小姐姐',
//     'JOSHUA',
//     '效率的中鴻',
//     '吐了一地的奕祥',
//     '很高的偉倫',
//     '聰明的子源',
//     'RainOuO',
//     '大哥阿尼基的異想世界',
//     'MALACHI',
//     '小好停',
//     '安靜的家羽',
//     '唐詩與宋詞',
//     'ㄎㄧㄤ掉的怡方',
//     '喝醉的雲登',
//     '熱情的魚莎',
//     '吵死人的穗懷',
//   ];
//   for (const [index, name] of user.entries()) {
//     await pool.execute('INSERT INTO user (email, social_name, photo, create_time) VALUE (?, ?, ?, ?)', [
//       `MFEE27U${index}@gmail.com`,
//       name,
//       `/user/px-${index}.jpg`,
//       moment().format('YYYY-MM-DD HH:mm:ss'),
//     ]);
//     console.log(name);
//   }
//   // await pool.execute('DELETE FROM user WHERE id > 68');
// })();

app.get('/', async (req, res) => {

  // = 穗懷修改景點商品
  // let file = JSON.parse(await fs.readFile(`./json/pet_product/${0}.json`, 'utf-8'));
  // res.json(file);
  // let file = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  // res.send(JSON.parse(file));
  // let result = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  // = 穗懷修改餐廳商品
  let file = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  res.json(JSON.parse(file));
  // let result = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  // res.send(JSON.parse(result));
  // data = data;
  // let data = await fs.readFile(`./data/狗-外出用品.json`, 'utf-8');
  // res.json(JSON.parse(data));
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at ${process.env.SERVER_PORT}`);
});
