import React from "react";
import logo from "../../assets/image/logo.png";
import { formatDate } from "../../store/Configstore";
const PrintInvoice = React.forwardRef((props, ref) => {
  const findTotalItemUSD = (item) => {
    let total = item.cart_qty * item.product_out;
    if (item.discount) {
      let discount_price = (total * item.discount) / 100;
      total = total - discount_price;
    }
    return total.toFixed(2);
  };

  const findTotalItemKHR = (item) => {
    const exchangeRate = 4000;

    // Calculate the total in USD
    let total = item.cart_qty * item.product_out;

    // Apply discount if available
    if (item.discount) {
      let discount_price = (item.product_out * item.discount) / 100;
      total -= discount_price * item.cart_qty; // Subtract discount from total
    }

    // Convert to KHR
    let totalKHR = (total * exchangeRate).toLocaleString();

    return totalKHR;
  };
  console.log("Invo :", props.cart_list);
  return (
    <div
      ref={ref}
      className="w-[100mm] p-3 bg-white text-black"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div className="flex items-center justify-center gap-3">
        <div>
          <h1>លេខរងចាំទី: Queue no</h1>
          <p className="text-center">19</p>
        </div>
        <div className="w-24">
          <img src={logo} alt="" className="w-full" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h2>អតិថិជន:</h2>
          <h2>{props?.objSummary?.customer_id}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h2>កាលបរិច្ឆេទ:</h2>
          <h2>
            {formatDate(props?.objSummary.order_date, "YYYY/MM/DD h:mm ss A")}
          </h2>
          {/* <h2>{objSummary?.customer_id}</h2> */}
        </div>
        <div className="flex items-center justify-between">
          <h2>លេខរៀងវិក្កយបត្រ:</h2>
          {/* <h2>{new Date().toLocaleDateString()}</h2> */}
          <h2>{props?.objSummary.order_num}</h2>
        </div>
        <div className="flex items-center justify-between">
          <h2>អ្នកគិតលុយ:</h2>
          {/* <h2>{new Date().toLocaleDateString()}</h2> */}
          <h2>Cashier</h2>
        </div>
      </div>
      <table className="w-full border-collapse border text-xs my-3">
        <thead>
          <tr className="bg-gray-200">
            <th className=" px-1 py-0.5 text-left">មុខទំនិញ</th>
            <th className=" px-1 py-0.5 text-left">តម្លៃ</th>
            <th className=" px-1 py-0.5 text-left">ចំនួន</th>
            <th className=" px-1 py-0.5 text-left">Discount</th>
            <th className=" px-1 py-0.5 text-left">តម្លៃសរុប $</th>
            <th className=" px-1 py-0.5 text-left">តម្លៃសរុប ៛</th>
          </tr>
        </thead>
        <tbody>
          {props.cart_list?.map((item, index) => (
            <tr key={index} className="border-b">
              <td className=" px-1 py-0.5">{item.name}</td>
              <td className=" px-1 py-0.5 text-right">{item.product_out}</td>
              <td className=" px-1 py-0.5 text-center">{item.cart_qty}</td>
              <td className=" px-1 py-0.5 text-right">{item.discount}</td>
              <td className=" px-1 py-0.5 text-right">
                {" "}
                {findTotalItemUSD(item)}$
              </td>
              <td className=" px-1 py-0.5 text-right">
                {findTotalItemKHR(item)}៛
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="">
        <div className="flex items-center justify-between border-b">
          <span className="font-battambang">ចំនួនសរុប:</span>{" "}
          <span> {props?.objSummary.total_qty}</span>
        </div>

        <div className="flex items-center justify-between border-b">
          <span className="font-battambang">បញ្ចុះតម្លៃ:</span>{" "}
          <span>${props?.objSummary.save_discount}</span>
        </div>
        <div className="flex items-center justify-between border-b">
          <span className="font-battambang">តម្លៃសរុប:</span>{" "}
          <span>${props?.objSummary.total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-battambang">តម្លៃសរុប:</span>
          <span className="text-lg">
            {props?.objSummary.total_price_discount_KHR.toLocaleString()}៛
          </span>
        </div>
      </div>
      <div className="border-t-2">
        <h1 className="text-center">Thank you For purchase!!</h1>
      </div>
    </div>
  );
});

export default PrintInvoice;
