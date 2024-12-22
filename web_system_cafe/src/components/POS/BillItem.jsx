/* eslint-disable react/prop-types */
import { Button, Image } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Config } from "../../util/Config";

const BillItem = ({
  key,
  name,
  product_out,
  image,
  cart_qty,
  handleOnIncrease,
  handleOnDescrease,
  discount,
  index,
  handleDeleteRowProduct,
  handleCalSummary,
}) => {
  var final_price = product_out;
  if (discount && discount != 0) {
    final_price = product_out - (product_out * discount) / 100;
    final_price = final_price.toFixed(2);
  }
  return (
    <tr key={key} className="transition-all duration-200 ease-in-out border-b">
      <td className="py-3 text-gray-800">{index + 1}</td>
      <td className="w-44 py-3 border-x text-gray-800">{name}</td>
      <td className="border-x px-1 text-gray-800">
        {discount && discount !== 0 ? (
          <>
            <span className="text-red-500">$OFF {final_price}</span> | $
            <span className="text-gray-700">{product_out}</span>
          </>
        ) : (
          <span>${product_out}</span>
        )}
      </td>

      <td className="border-x">
        <div className="flex items-center justify-center space-x-2">
          <Button
            className="h-8 w-8 bg-gray-200 rounded-full flex items-center hover:bg-gray-300 text-black transition-all text-lg"
            onClick={handleOnDescrease}
          >
            -
          </Button>
          <span className="text-gray-800 text-lg">{cart_qty}</span>
          <Button
            className="h-8 w-8 bg-blue-500 rounded-full hover:bg-blue-600 hover:text-black text-white transition-all text-lg"
            onClick={handleOnIncrease}
          >
            +
          </Button>
        </div>
      </td>
      <td className="p-1 border-x">
        <div className="w-14 h-14 overflow-hidden mx-auto shadow-md">
          <Image
            src={Config.image_path + image}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className="py-3 border-x">
        <div className="flex items-center gap-3 text-gray-800">
          <span>{(final_price * cart_qty).toFixed(2)} $</span>
          <span
            className="text-red-500 cursor-pointer hover:text-red-700 transition-all text-xl"
            onClick={handleDeleteRowProduct}
          >
            <RiDeleteBin6Line />
          </span>
        </div>
      </td>
    </tr>
  );
};

export default BillItem;
