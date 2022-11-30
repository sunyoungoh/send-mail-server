import nodemailer from 'nodemailer';
import { mailText } from '../mailTemplate.js';

const getFileOption = itemOptionName => {
  let fileOption = itemOptionName;
  fileOption = fileOption.replace('화이트', 'White');
  fileOption = fileOption.replace('다크', 'Dark');
  fileOption = fileOption.replace('라이트', 'Light');
  fileOption = fileOption.replace('인디핑크', 'IndiePink');
  fileOption = fileOption.replace('스카이블루', 'SkyBlue');
  fileOption = fileOption.replace('차콜', 'Charcoal');
  fileOption = fileOption.replace('캔디핑크', 'CandyPink');
  fileOption = fileOption.replace('스케줄', 'Schedule');
  fileOption = fileOption.replace('타임테이블', 'TimeTable');
  fileOption = fileOption.replace('월요일시작', 'Mon');
  fileOption = fileOption.replace('일요일시작', 'Sun');
  return fileOption;
};

const getItemInfo = (itemId, itemOptionName) => {
  let itemInfo = {};
  let fileName = '';
  let fileOption = getFileOption(itemOptionName);

  if (itemId == 5033569) {
    itemInfo.itemName = '2023 심플 플래너';
    fileName = `2022+2023_Simple_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033568) {
    itemInfo.itemName = '2023 모던 플래너';
    fileName = `2022+2023_Modern_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033567) {
    itemInfo.itemName = '2023 타임라인 플래너';
    fileName = `2023_Timeline_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033566) {
    itemInfo.itemName = '2023 먼슬리&데일리 플래너';

    fileName = `2023_Monthly+Daily_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033565) {
    itemInfo.itemName = '31DAYS 플래너';
    fileName = `31DAYS_Planner(${fileOption}).zip`;
  }

  if (itemId == 5033564) {
    itemInfo.itemName = '세로형 인덱스 노트';
    fileName = `Index_Note(Vertical,${fileOption}).pdf`;
  }

  if (itemId == 5033563) {
    itemInfo.itemName = '가로형 인덱스 노트';
    fileName = `Index_Note(Horizontal,${fileOption}).pdf`;
  }

  if (itemId == 5033560) {
    itemInfo.itemName = '독서노트';
    fileName = `Reading_Journal(${fileOption}).zip`;
  }

  if (itemId == 5033558) {
    itemInfo.itemName = '드라마노트';
    fileName = `Drama_Journal(${fileOption}).zip`;
  }

  if (itemId == 5033557) {
    itemInfo.itemName = '먼슬리 트래커북';
    fileName = `12_Months_Goal_Tracker(${fileOption}).zip`;
  }

  if (itemId == 5033561) {
    itemInfo.itemName = '180 베이직 노트패드';
    fileName = `180_Basic_Notepad.zip`;
  }

  if (itemId == 5033559) {
    itemInfo.itemName = '180 체커보드 노트패드';
    fileName = `180_CheckerBoard_Notepad.zip`;
  }

  if (itemId == 5033562) {
    let itemOptionYears = itemOptionName.slice(0, 1);
    itemInfo.itemName = itemOptionYears == 3 ? '3년 일기' : '5년 일기';
    itemOptionName = itemOptionName.split(',')[1];
    fileName = `${itemOptionYears}_Years_Diary(${fileOption}).zip`;
  }

  if (itemOptionName == '') {
    itemInfo.mailTitle = itemInfo.itemName;
  } else {
    itemInfo.itemOptionName = itemOptionName.replaceAll(/,/g, ', ');
    itemInfo.mailTitle =
      itemInfo.itemOptionName.indexOf(',') == -1
        ? `${itemInfo.itemName} ${itemInfo.itemOptionName}`
        : `${itemInfo.itemName} (${itemInfo.itemOptionName})`;
  }
  itemInfo.attachments = {
    filename: fileName,
    path: `./src/file/${fileName}`,
  };
  return itemInfo;
};

const getMonthStr = () => {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  let monthStr = todayMonth;

  if (today.getDate() >= 25) monthStr = todayMonth + 1;
  else if (today.getDate() >= 16) monthStr = `남은 ${todayMonth}`;

  return monthStr;
};

export const sendMail = async (req, res) => {
  const { itemId, itemOptionName, toEmail } = req.body;
  const itemInfo = getItemInfo(itemId, itemOptionName);

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
    subject: `[영로그] ${itemInfo.mailTitle} 속지 보내드립니다 ✨`,
    html: mailText(itemInfo.mailTitle, getMonthStr()),
    attachments: itemInfo.attachments,
  };

  mailTransporter.sendMail(details, (err, info) => {
    if (err) {
      console.log('메일 전송을 실패하였습니다.', err);
      res.status(400).send('메일 전송을 실패하였습니다.');
    } else {
      console.log('메일을 성공적으로 보냈습니다.', info.response);
      res.status(200).json({
        from: details.from,
        to: details.to,
        message: '메일을 성공적으로 보냈습니다.',
      });
      transporter.close();
    }
  });
};
