import nodemailer from 'nodemailer';
import { mailText } from '../mailTemplate.js';
import { getFileName } from '../utils/fileName.js';
import { getDecodeKey } from '../utils/crypto.js';
const TelegramBot = require('node-telegram-bot-api');

const getItemInfo = (itemId, itemOption) => {
  const { itemName, fileName } = getFileName(itemId, itemOption);
  let itemInfo = {};

  // 옵션이 없거나 교환일기 경우 메일 제목 (itemId 적힌 건 교환일기)
  if (!itemOption || itemId == 5161944 || itemId == 7917862453) {
    itemInfo.itemName = itemName;
  } else {
    // 3,5년 다이어리 & 영화, 드라마 노트 컬러 옵션만 메일 제목 표기
    // 타임라인 플래너 추가
    const arr = [5033562, 6339448390, 5033558, 7118280906, 5033567, 7551229680];
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
        return `${index + 1}. ${val} <br>`;
      })
      .join('');
  } else {
    list = title;
  }
  return { title, files, list };
};

/**
 * 발송 성공하면 텔레그램으로 메시지 보내는 함수
 */
const pushTelegram = (store, toEmail, orderInfo, orderList) => {
  const { ordererName, shippingMemo, paymentDate } = orderInfo;

  const msgTitle =
    store == '영로그'
      ? '💚 네이버 자동발송 성공 💚'
      : '💛 텐바이텐 자동발송 성공 💛';

  const list = orderList.includes('<br>')
    ? orderList.replaceAll('<br>', '\n')
    : `1. ${orderList}`;

  const msg = `<b>${msgTitle}</b>\n
- 주문자: ${ordererName}
- 배송메시지: ${shippingMemo}
- 이메일: ${toEmail}
- 결제일시: ${paymentDate}
- 발송일시: ${new Date().toLocaleString('ko-kr')}

------------- 🔖 주문내역 -------------
${list}`;

  const token = process.env.TELE_BOT_TOKEN;
  const chatId = process.env.TELE_CHAT_ID;
  const telebot = new TelegramBot(token);
  telebot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
};

/**
 * 영로그 커스텀 메일 발송
 */
export const sendMail = async (req, res) => {
  const { store, items, toEmail, comment, autoSend, orderInfo } = req.body;
  const orderList = getOrderList(items);

  const mailTransporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const details = {
    from: `영로그 ${process.env.NODEMAILER_USER}`,
    to: toEmail,
    // 자동발송이면 숨은참조 -> 탤래그램 봇으로 변경
    // bcc: autoSend ? process.env.NODEMAILER_USER : '',
    subject: `[${store}] ${orderList.title.join(' / ')} 파일을 보내드립니다 💌`,
    html: mailText(orderList.list, comment),
    attachments: orderList.files,
  };

  mailTransporter.sendMail(details, (err, info) => {
    if (err) {
      console.error('메일 전송을 실패하였습니다.', err);
      res.status(400).send('메일 전송을 실패하였습니다.');
    } else {
      if (autoSend) {
        pushTelegram(store, toEmail, orderInfo, orderList.list);
      }
      console.log(
        `${new Date().toLocaleTimeString(
          'ko-kr'
        )} | 메일을 성공적으로 보냈습니다. ${info.accepted}`
      );
      const result = {
        result: info,
        message: '메일을 성공적으로 보냈습니다.',
      };
      res.status(200).json(result);
      transporter.close();
    }
  });
};

/**
 * 다른 사용자도 사용할 수 있는 일반적인 메일 발송
 */
export const sendMailForEveryone = async (req, res) => {
  const {
    brandName,
    toEmail,
    title,
    content,
    userEmail,
    publicUrl,
    fileName,
    password,
  } = req.body;

  const userPass = getDecodeKey(password);

  const mailTransporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
      user: userEmail,
      pass: userPass,
    },
  });

  // 첨부파일 정보
  const attachFile =
    publicUrl && fileName
      ? {
          filename: fileName,
          href: publicUrl,
        }
      : '';

  const details = {
    from: `${brandName} ${userEmail}`,
    to: toEmail,
    // bcc: userEmail, //숨은참조
    subject: title,
    html: content,
    attachments: attachFile,
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
