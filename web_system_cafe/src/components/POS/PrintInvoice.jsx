import React from "react";

const PrintInvoice = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="w-[80mm] p-3 bg-white text-black"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-1 py-0.5 text-left">មុខទំនិញ</th>
            <th className="border px-1 py-0.5 text-left">តម្លៃ</th>
            <th className="border px-1 py-0.5 text-left">ចំនួន</th>
            <th className="border px-1 py-0.5 text-left">Discount</th>
            <th className="border px-1 py-0.5 text-left">តម្លៃសរុប $</th>
            <th className="border px-1 py-0.5 text-left">តម្លៃសរុប ៛</th>
          </tr>
        </thead>
        <tbody>
          {props.cart_list?.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="border px-1 py-0.5">{item.name}</td>
              <td className="border px-1 py-0.5 text-right">
                {item.product_out}
              </td>
              <td className="border px-1 py-0.5 text-center">{item.qty}</td>
              <td className="border px-1 py-0.5 text-right">{item.discount}</td>
              <td className="border px-1 py-0.5 text-right">{item.discount}</td>
              <td className="border px-1 py-0.5 text-right">
                {item.discount * item.qty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintInvoice;
