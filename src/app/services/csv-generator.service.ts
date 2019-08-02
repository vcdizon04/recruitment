import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvGeneratorService {

  constructor() { }

  generateCsv(fileName, rows) {
    let csv = '';
    for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (let j = 0; j < row.length; j++) {
          let val = row[j] === null ? '' : row[j].toString();
            val = val.replace(/\t/gi, " ");
            if (j > 0)
                csv += '\t';
            csv += val;
        }
        csv += '\n';
    }

    // for UTF-16
    let cCode, bArr = [];
    bArr.push(255, 254);
    for (let i = 0; i < csv.length; ++i) {
        cCode = csv.charCodeAt(i);
        bArr.push(cCode & 0xff);
        bArr.push(cCode / 256 >>> 0);
    }

    let blob = new Blob([new Uint8Array(bArr)], { type: 'text/csv;charset=UTF-16LE;' });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
      let link = document.createElement("a");
        if (link.download !== undefined) {
            var url = window.URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    }
}

}
