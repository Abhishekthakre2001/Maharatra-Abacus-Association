const formatExcelData = (data, columns) => {
  return data.map((item, index) => {
    const row = {
      "Sr No": index + 1,
    };

    columns.forEach((col) => {
      row[col.label] = item[col.key]??"";
    });

    return row;
  });
};

module.exports = formatExcelData;