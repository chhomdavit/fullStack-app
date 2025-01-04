import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const JsbarcodeUtil = ({ barcode }) => {
  const barcodeRef = useRef();

  useEffect(() => {
    if (barcode) {
      JsBarcode(barcodeRef.current, barcode, {
        format: "CODE128", 
        displayValue: true,
        fontSize: 12,
        height: 40,
        width: 1.1,
      });
    }
  }, [barcode]);

  return <svg ref={barcodeRef}></svg>;
};

export default JsbarcodeUtil;
