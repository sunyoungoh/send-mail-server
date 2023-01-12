import nodemailer from 'nodemailer';
import { mailText } from '../mailTemplate.js';
import { getFileName } from '../utils/fileName.js';

const getItemInfo = (itemId, itemOption) => {
  const { itemName, fileName } = getFileName(itemId, itemOption);
  let itemInfo = {};

  // 메일 제목에 들어갈 상품 이름
  if (!itemOption) {
    itemInfo.itemName = itemName;
  } else {
    itemInfo.itemOption = itemOption.replaceAll(/,/g, ', ');
    itemInfo.itemName =
      itemInfo.itemOption.indexOf(',') == -1
        ? `${itemName} ${itemInfo.itemOption}`
        : `${itemName} (${itemInfo.itemOption})`;
  }
  // 첨부 파일 정보
  itemInfo.attachments = {
    filename: fileName,
    path: `./src/file/${fileName}`,
  };

  return itemInfo;
};

const getOrderList = items => {
  // 아이템 정보 가져오기 (상품이름, 첨부파일)
  const itemInfo = items.map(item => {
    return getItemInfo(item.itemId, item.itemOption);
  });

  // 메일 타이틀
  const title = itemInfo.map(item => item.itemName);

  // 첨부 파일 리스트
  const files = itemInfo.map(item => item.attachments);

  // 파일 여러개일 때 본문 파일 리스트 내용
  let list = '';
  if (files.length > 1) {
    list = title
      .map((val, index) => {
        return `${index + 1}. ${val} <br/>`;
      })
      .join('');
  } else {
    list = title;
  }
  return { title, files, list };
};

export const sendMail = async (req, res) => {
  const { store, items, toEmail, comment, autoSend } = req.body;
  const orderList = getOrderList(items);

  let mailTransporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  let details = {
    from: `영로그 ${process.env.NODEMAILER_USER}`,
    to: toEmail,
    bcc: autoSend ? process.env.NODEMAILER_USER : '',
    subject: `[${store}] ${orderList.title.join(' / ')} 속지 보내드립니다 ✨`,
    html: mailText(orderList.list, comment),
    attachments: orderList.files,
  };

  mailTransporter.sendMail(details, (err, info) => {
    if (err) {
      console.error('메일 전송을 실패하였습니다.', err);
      res.status(400).send('메일 전송을 실패하였습니다.');
    } else {
      console.log(`메일을 성공적으로 보냈습니다. ${info.accepted}`);
      let result = {
        result: info,
        message: '메일을 성공적으로 보냈습니다.',
      };
      res.status(200).json(result);
      transporter.close();
    }
  });
};
