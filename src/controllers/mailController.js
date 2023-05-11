import nodemailer from 'nodemailer';
import { mailText } from '../mailTemplate.js';
import { getFileName } from '../utils/fileName.js';

const getItemInfo = (itemId, itemOption) => {
  const { itemName, fileName } = getFileName(itemId, itemOption);
  let itemInfo = {};

  // 옵션이 없거나 교환일기 경우 메일 제목 (itemId 적힌 건 교환일기)
  if (!itemOption || itemId == 5161944 || itemId == 7917862453) {
    itemInfo.itemName = itemName;
  } else {
    // 3,5년 다이어리 & 영화, 드라마 노트 컬러 옵션만 메일 제목 표기
    let arr = [5033562, 6339448390, 5033558, 7118280906];
    if (arr.find(e => e == itemId)) {
      itemOption = itemOption.split(',')[1];
    }
    itemInfo.itemOption = itemOption.replaceAll(/,/g, ', ');
    itemInfo.itemName = `${itemName} (${itemInfo.itemOption})`;
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
    bcc: autoSend ? process.env.NODEMAILER_USER : '', // 자동발송이면 숨은참조
    subject: `[${store}] ${orderList.title.join(' / ')} 파일을 보내드립니다 ✨`,
    html: mailText(orderList.list, comment),
    attachments: orderList.files,
  };

  mailTransporter.sendMail(details, (err, info) => {
    if (err) {
      console.error('메일 전송을 실패하였습니다.', err);
      res.status(400).send('메일 전송을 실패하였습니다.');
    } else {
      console.log(
        `${new Date().toLocaleTimeString(
          'ko-kr'
        )} | 메일을 성공적으로 보냈습니다. ${info.accepted}`
      );
      let result = {
        result: info,
        message: '메일을 성공적으로 보냈습니다.',
      };
      res.status(200).json(result);
      transporter.close();
    }
  });
};
