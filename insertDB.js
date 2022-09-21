const express = require('express');
const app = express();
const fs = require('fs/promises');
const mysql = require('mysql2');
const pool = require('./utils/db');
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
//   // = 建立寵物商品店家
//   await (async () => {
//     let storeArr = [
//       '寵愛一生',
//       '寵沙啦',
//       '毛手毛腳',
//       '毛落趣',
//       '貓咪加百二',
//       '米米貓貓',
//       '躲貓貓',
//       '汪汪先輩',
//       '汪東汪西',
//       '嗷嗚嗚嗚嗚',
//     ];
//     for (const item of storeArr) {
//       try {
//         let r = await pool.execute(
//           'INSERT IGNORE INTO store (name) VALUE (?)',
//           [item]
//         );
//         console.log(r);
//       } catch (error) {
//         console.log('error', error);
//       }
//     }
//   })();

//   // = 寫入寵物商品假資料
//   await (async () => {
//     let result = await fs.readFile(`./json/total.json`, 'utf-8');
//     result = JSON.parse(result);
//     for (const [index, item] of result.entries()) {
//       try {
//         let r = await pool.execute(
//           'INSERT IGNORE INTO product (product_type_id, name, store_id, description, price, product_status, per_score) VALUE (?, ?, ?, ?, ?, ?, ?)',
//           [
//             4,
//             item.title,
//             Number(item.store),
//             item.desciption,
//             index + 500,
//             1,
//             4 + (index % 10 === 0 ? 1 : (index % 10) / 10),
//           ]
//         );
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
//           let [store_result] = await pool.execute(
//             'INSERT IGNORE INTO store (name) VALUE (?)',
//             [`Oh!DogCat ${type} 分館 - 測試商家${index + 1}`]
//           );
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
//               let [photo_result] = await pool.execute(
//                 'INSERT IGNORE INTO product_photo (product_id, file_name) VALUE (?, ?)',
//                 [product_result.insertId, r_temp[index][i]]
//               );
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

// = 穗懷修改景點商品
// (async () => {
//   let file = await fs.readFile(`./json/fun_product.json`, 'utf-8');
//   let data = JSON.parse(file);
//   for (const item of data) {
//     let result = await pool.execute(
//       'UPDATE product SET name= ? , intro= ? , description = ?, product_tag = ? WHERE id = ?',
//       [item.name, item.intro, item.description, item.product_tag, item.id]
//     );
//     // let [result] = await pool.execute(
//     //   'SELECT name FROM product WHERE id = ?',
//     //   [item.id]
//     // );
//     console.log('====================================');
//     console.log(result);
//     console.log('====================================');
//   }
// })();

app.get('/', async (req, res) => {
  // = 穗懷修改景點商品
  // let file = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  // res.send(JSON.parse(file));

  // let result = await fs.readFile(`./json/fun_product.json`, 'utf-8');
  // res.send(JSON.parse(result));
  // data = data;
  // let data = await fs.readFile(`./data/狗-外出用品.json`, 'utf-8');
  // res.json(JSON.parse(data));
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at ${process.env.SERVER_PORT}`);
});
