import { Button, Image } from "antd";
import { Config } from "../../util/Config";
import { TbShoppingBagPlus } from "react-icons/tb";
/* eslint-disable react/prop-types */
const ProductItem = ({
  category_name,
  discount,
  name,
  product_out,
  image,
  handlAddTocart,
}) => {
  let final_price = product_out;
  if (discount && discount !== 0) {
    final_price = (product_out - (product_out * discount) / 100).toFixed(2);
  }
  return (
    <div className="shadow-md">
      <Image src={Config.image_path + image} />
      <div className="p-2">
        <h1 className="font-medium">{category_name}</h1>
        <p className="text-[15px]">{name}</p>

        <div className="mt-4">
          {discount && discount !== 0 ? (
            // have discount
            <div className="flex items-center justify-between">
              <p className="line-through text-gray-400 text-sm">
                $ {product_out}
              </p>
              <p className="font-medium text-gray-800 text-[15px]">
                $ {final_price}
              </p>
              <p className="text-sm font-medium text-red-500">-{discount}%</p>
            </div>
          ) : (
            // do not have discount
            <p className="font-medium text-gray-800 text-[15px]">
              $ {product_out}
            </p>
          )}
        </div>
        <Button
          type="primary"
          icon={<TbShoppingBagPlus />}
          onClick={handlAddTocart}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 border-none flex items-center justify-center"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
