import ExcelJS from 'exceljs';

export const generateTransactionExcel = async (data, filePath) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions');

  sheet.columns = [
    { header: 'Date', key: 'date' },
    { header: 'Type', key: 'type' },
    { header: 'Amount', key: 'amount' },
    { header: 'Balance', key: 'balance' },
    { header: 'Closing Balance', key: 'closingBalance' },
    { header: 'Bank', key: 'bank' },
    { header: 'Account', key: 'account' },
  ];

  sheet.addRows(data);
  await workbook.xlsx.writeFile(filePath);
};
