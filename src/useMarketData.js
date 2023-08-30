import { useEffect, useRef, useState } from "react";
import { tsvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

const parseDate = timeParse("%Y-%m-%d");

const parseData = (d) => {
console.log("datapoint : ",d)
  const date = parseDate(d.date);
  date ? (d.date = new Date(date)) : (d.date = new Date(Number(d.date)));

  for (const key in d) {
    if (key !== "date" && Object.prototype.hasOwnProperty.call(d, key)) {
      d[key] = +d[key];
    }
  }

  return d;
};

// https://www.joshwcomeau.com/snippets/react-hooks/use-interval/
const useInterval = (callback, delay) => {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
};

function filterData(d){
    const formattedData = [];
    // console.log(formattedData.length)
            for (let i = 0; i < d.length; i++) {
                console.log(d.length)
                const currentArray = d[i];
                // console.log("Current array :",currentArray)
                const date = currentArray[0];
                const open = currentArray[1];
                const high = currentArray[2];
                const low = currentArray[3];
                const close = currentArray[4];
                const volume =currentArray[5];
                // console.log(date,volume)
                let obj={date:date, open:open, high:high, low:low, close:close,volume:volume}
                // console.log("Obj",obj)
                formattedData.push(obj)
                // console.log("___:",formattedData)
              }
              console.log(formattedData.length)
    return formattedData
}

export function useMarketData(dataSet = "MINUTES", updating = false) {
  const [data, setData] = useState();
  const [length, setLength] = useState(500);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    if (!data) {
        fetch("https://api.bybit.com/v5/market/kline?symbol=BTCUSDT&interval=5&category=spot", requestOptions).then((response) => response.text())
        .then((data)=>JSON.parse(data).result.list)
        .then((data) => {
            
            const res=filterData(data)
            // console.log("formated ",formattedData)
            console.log("response",res)
            return  parseData(res)}
            )
        .then((data) => {
        // console.log("Parsed Data",data)
          setData(data);
        });
    }
  }, [data, dataSet, setData]);

  useInterval(() => {
    if (data && updating) setLength(length + 1);
  }, 1000);

  return {
    data: updating ? data?.slice(0, length + 1) : data,
    loaded: Boolean(data)
  };
}





// import { useEffect, useRef, useState } from "react";
// import { tsvParse } from "d3-dsv";
// import { timeParse } from "d3-time-format";

// const parseDate = timeParse("%Y-%m-%d");

// const parseData = () => (d) => {
//   const date = parseDate(d.date);
//   date ? (d.date = new Date(date)) : (d.date = new Date(Number(d.date)));

//   for (const key in d) {
//     if (key !== "date" && Object.prototype.hasOwnProperty.call(d, key)) {
//       d[key] = +d[key];
//     }
//   }

//   return d;
// };

// // https://www.joshwcomeau.com/snippets/react-hooks/use-interval/
// const useInterval = (callback, delay) => {
//   const intervalRef = useRef(null);
//   const savedCallback = useRef(callback);
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);
//   useEffect(() => {
//     const tick = () => savedCallback.current();
//     if (typeof delay === "number") {
//       intervalRef.current = window.setInterval(tick, delay);
//       return () => window.clearInterval(intervalRef.current);
//     }
//   }, [delay]);
//   return intervalRef;
// };

// export function useMarketData(dataSet = "MINUTES", updating = false) {
//   const [data, setData] = useState();
//   const [length, setLength] = useState(500);

//   useEffect(() => {
//     if (!data) {
//       fetch(
//         `https://raw.githubusercontent.com/reactivemarkets/react-financial-charts/master/packages/stories/src/data/${dataSet}.tsv`
//       )
//         .then((response) => response.text())
//         .then((data) => tsvParse(data, parseData()))
//         .then((data) => {
//             console.log(data)
//           setData(data);
//         });
//     }
//   }, [data, dataSet, setData]);

//   useInterval(() => {
//     if (data && updating) setLength(length + 1);
//   }, 1000);

//   return {
//     data: updating ? data?.slice(0, length + 1) : data,
//     loaded: Boolean(data)
//   };
// }
