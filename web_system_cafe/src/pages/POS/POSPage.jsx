import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Empty,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Select,
} from "antd";
import { request } from "../../store/Configstore";
import MainPage from "../../components/layouts/auth/MainPage";
import ProductItem from "../../components/POS/ProductItem";
import BillItem from "../../components/POS/BillItem";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../components/POS/PrintInvoice";
const POSPage = () => {
  const [state, setState] = useState({
    loading: true,
    list: [],
    category_fillter: [],
    cart_list: [],
    customer: [],
    paymentMedthod: [],
  });
  const [filter, setFilter] = useState({
    search: "",
    category_id: "",
  });
  const [objSummary, setObjSummary] = useState({
    save_discount: 0,
    total_price: 0,
    total_price_discount_USD: 0,
    total_price_discount_KHR: 0,
    total_qty: 0,
    remark: null,
    paid_amount: 0,

    customer_id: null,
    payment_method: null,
  });
  const refInvoice = React.useRef(null);
  useEffect(() => {
    getAll();
    getCategory();
    getCustomer();
    getPaymentMedthod();
  }, []);
  // add menu for fillter

  const getCustomer = async () => {
    try {
      const resCustomer = await request("customer", "get");
      // console.log(resCustomer);
      if (resCustomer) {
        setState((pre) => ({
          ...pre,
          customer: resCustomer.getAll,
        }));
      }
    } catch (error) {
      message.warning(error);
    }
  };
  const getPaymentMedthod = async () => {
    try {
      const respayment = await request("payments", "get");
      // console.log(respayment);
      // console.log(resCustomer);
      if (respayment) {
        setState((pre) => ({
          ...pre,
          paymentMedthod: respayment.data,
        }));
      }
    } catch (error) {
      message.warning(error);
    }
  };
  const getCategory = async () => {
    try {
      const resCategory = await request("category", "get");
      if (resCategory) {
        setState((pre) => ({
          ...pre,
          category_fillter: resCategory.getAll,
        }));
      }
    } catch (error) {
      message.warning(error);
    }
  };

  const getAll = async () => {
    try {
      const param = {
        ...filter,
      };
      const res = await request("product", "get", param);
      // console.log("s" + res);
      if (res) {
        if (res.getAll?.length == 1) {
          handlAddTocart(res.getAll);
          setState((pre) => ({
            ...pre,
            loading: false,
          }));
          return;
        }
        setState((pre) => ({
          ...pre,
          loading: false,
          list: res.getAll,
        }));
      }
    } catch (error) {
      message.warning(error);
    }
  };
  // search
  const onFilter = () => {
    getAll(filter);
  };

  // add to cart
  const handlAddTocart = (item) => {
    var cart_temp = state.cart_list;
    var findIndex = cart_temp.findIndex((row) => row.id == item.id);

    var isNoStock = false;
    if (findIndex == -1) {
      if (item.qty > 0) {
        cart_temp.push({ ...item, cart_qty: 1 });
      } else {
        isNoStock = true;
      }
    } else {
      cart_temp[findIndex].cart_qty++;

      if (item.qty < cart_temp[findIndex].cart_qty) {
        isNoStock = true;
      }
    }
    //check has stock
    if (isNoStock) {
      notification.info({
        message: "Warning",
        description:
          "No stock!. Currently quantity in stock available " + item.qty,
        placement: "topRight",
        showProgress: true,
      });

      return;
    }
    // alert(item.qty);
    setState((pre) => ({
      ...pre,
      cart_list: cart_temp,
    }));
    handleCalSummary();
  };

  const handleOnIncrease = (item, index) => {
    state.cart_list[index].cart_qty += 1;
    if (item.qty < state.cart_list[index].cart_qty) {
      notification.info({
        message: "Warning",
        description: `No stock! Currently, the quantity in stock is ${item.qty}.`,
        placement: "topRight",
        showProgress: true,
      });
      return;
    }
    setState((p) => ({ ...p, cart_list: state.cart_list }));
    handleCalSummary();
  };
  const handleOnDescrease = (item, index) => {
    if (item.cart_qty > 1) {
      state.cart_list[index].cart_qty--;

      setState((pre) => ({ ...pre, cart_list: state.cart_list }));
    }
    handleCalSummary();
  };

  const handleDeleteRowProduct = (item) => {
    var removeList = state.cart_list.filter((itemNew) => itemNew.id != item.id);

    setState((pre) => ({
      ...pre,
      cart_list: removeList,
    }));
    handleCalSummary();
  };

  const handleClearCar = () => {
    setState((pre) => ({ ...pre, cart_list: [] }));

    setObjSummary((pre) => ({
      ...pre,
      save_discount: 0,
      total_price: 0,
      total_price_discount_USD: 0,
      total_price_discount_KHR: 0,
      total_qty: 0,
      remark: null,
      paid_amount: 0,

      customer_id: null,
      payment_method: null,
    }));
  };

  const handleCalSummary = useCallback(() => {
    const exchangeRate = 4000;

    let total_qty = 0,
      sub_total = 0,
      save_discount = 0,
      total = 0,
      original_total = 0;

    state.cart_list.forEach((item) => {
      total_qty += item.cart_qty;

      let final_price = item.product_out;
      if (item.discount !== 0 && item.discount !== null) {
        final_price =
          item.product_out - (item.product_out * item.discount) / 100;
      }

      // Calculate original total (before discount)
      original_total += item.cart_qty * item.product_out;

      // Calculate subtotal (after discount)
      sub_total += item.cart_qty * final_price;
    });

    total = sub_total;

    // Calculate the discount amount
    save_discount = original_total - sub_total;

    // Convert the subtotal to USD and KHR
    const totalPriceDiscountUSD = sub_total;
    const totalPriceDiscountKHR = sub_total * exchangeRate;

    setObjSummary((prev) => ({
      ...prev,
      total_qty: total_qty,
      sub_total: sub_total.toFixed(2),
      save_discount: save_discount.toFixed(2),
      total: total.toFixed(2),
      total_price_discount_USD: totalPriceDiscountUSD.toFixed(2),
      total_price_discount_KHR: totalPriceDiscountKHR.toLocaleString(),
    }));
  }, [state.cart_list]);

  const handleCheckOut = async () => {
    let order_detail = [];

    // Loop through the cart list and calculate totals
    state.cart_list.forEach((item) => {
      let total = Number(item.cart_qty) * Number(item.product_out);

      // Apply discount if available
      if (item.discount && item.discount !== null && item.discount !== 0) {
        total = total - (total * Number(item.discount)) / 100;
      }

      const obj_item = {
        product_id: Number(item.id),
        qty: Number(item.cart_qty),
        price: Number(item.product_out),
        discount: Number(item.discount),
        total: total,
      };

      order_detail.push(obj_item);
    });
    const params = {
      customer_id: objSummary.customer_id,
      paid_amount: objSummary.paid_amount,
      payment_method: objSummary.payment_method,
      remark: objSummary.remark,

      order_detail: order_detail,
    };
    console.log("Payment MEd:", objSummary.payment_method);

    console.log("Order Details:", order_detail);
    console.log("Request Payload:", params);

    try {
      const resOrder = await request("order", "post", params);

      console.log("Response:", resOrder);

      if (resOrder && resOrder.order) {
        message.success("Order Complete");
      } else {
        message.warning("Order not complete!");
      }
      handleClearCar();
      // setState((p) => ({ ...p, cart_list: [] }));
      // setObjSummary((p)=>({...p,}))
    } catch (error) {
      console.error("Error in checkout:", error);
      message.error("An error occurred while creating the order.");
    }
  };
  const onBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const onAfterPrint = React.useCallback((event) => {
    // handleClearCart();
    console.log("`onAfterPrint` called", event);
  }, []);

  const onPrintError = React.useCallback(() => {
    console.log("`onPrintError` called");
  }, []);

  const handlePrintInvoice = useReactToPrint({
    contentRef: refInvoice,
    onBeforePrint: onBeforePrint,
    onAfterPrint: onAfterPrint,
    onPrintError: onPrintError,
  });

  return (
    <MainPage loading={state.loading}>
      <div className="hidden">
        <PrintInvoice
          ref={refInvoice}
          objSummary={objSummary}
          cart_list={state.cart_list}
        />
      </div>
      <Row gutter={14} className="flex h-screen bg-w">
        <Col span={10} className="sticky top-0 w-1/3 ">
          {/* Header */}
          <div className="static top-0 z-20">
            <div className="flex items-center gap-3 p-2 mb-2 bg-[#f5f5f5] rounded-md">
              <p>អ្នកលក់ : Panha</p>
              <p>|</p>
              <p>Customer</p>
              <Select
                allowClear
                className="w-60"
                placeholder="Please Select Customer"
                onChange={(value) => {
                  setObjSummary((prev) => ({
                    ...prev,
                    customer_id: value,
                  }));
                }}
              >
                {state.customer.map((customer) => (
                  <Select.Option key={customer.id} value={customer.id}>
                    {customer.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Bill Item render*/}
            <div>
              <div className="overflow-y-auto h-[526px] border-gray-200">
                <table className="min-w-full table-auto relative">
                  <thead className="sticky top-0 z-50 bg-white border-b-2">
                    <tr className="border-b-2">
                      <th className="text-left font-semibold text-gray-700">
                        #
                      </th>
                      <th className="w-44 border-x text-left font-semibold text-gray-700">
                        មុខទំនិញ
                      </th>
                      <th className="border-x text-left font-semibold text-gray-700">
                        តម្លៃ
                      </th>
                      <th className="text-left font-semibold text-gray-700">
                        ចំនួន
                      </th>
                      <th className="text-left border-x font-semibold text-gray-700">
                        រូបភាព
                      </th>
                      <th className="text-left border-x font-semibold text-gray-700">
                        តម្លៃសរុប($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.cart_list.map((item, index) => (
                      <BillItem
                        key={index}
                        {...item}
                        index={index}
                        handleOnDescrease={() => handleOnDescrease(item, index)}
                        handleOnIncrease={() => handleOnIncrease(item, index)}
                        handleDeleteRowProduct={() =>
                          handleDeleteRowProduct(item)
                        }
                      />
                    ))}
                    {!state.cart_list.length && <Empty />}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total money all product */}
            <div className="border-t-2">
              <div className="flex items-center justify-between my-3">
                <p className="text-xl">
                  <p>
                    <span className="font-battambang">ចំនួនសរុប</span> :{" "}
                    <span> {objSummary.total_qty}</span>
                  </p>
                  <span className="font-battambang">តម្លៃសរុប:</span>{" "}
                  <span>${objSummary.total}</span>
                </p>
                <p className="text-xl">
                  <span className="font-battambang">បញ្ចុះតម្លៃ:</span>{" "}
                  <span>${objSummary.save_discount}</span>
                </p>
              </div>
              <Row gutter={14} className="mb-2">
                <Col span={12}>
                  <InputNumber
                    placeholder="Amount to be paid"
                    className="w-full"
                    value={objSummary.paid_amount}
                    onChange={(value) => {
                      setObjSummary((prev) => ({
                        ...prev,
                        paid_amount: value,
                      }));
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    placeholder="Select Payment"
                    className="w-full"
                    value={objSummary.payment_method}
                    onChange={(value) => {
                      const selectedPayment = state.paymentMedthod.find(
                        (paymentMethod) => paymentMethod.id === value
                      );
                      setObjSummary((prev) => ({
                        ...prev,
                        payment_method: selectedPayment
                          ? selectedPayment.payment_name
                          : "",
                      }));
                    }}
                  >
                    {state.paymentMedthod.map((paymentMethod) => (
                      <Select.Option
                        key={paymentMethod.id}
                        value={paymentMethod.id}
                      >
                        {paymentMethod.payment_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mb-2">
                  <Input.TextArea
                    placeholder="Remark"
                    className="w-full"
                    value={objSummary.remark}
                    onChange={(e) =>
                      setObjSummary((prev) => ({
                        ...prev,
                        remark: e.target.value,
                      }))
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="bg-black text-white">
                  <div className="flex items-center justify-between py-2 px-1">
                    <div>
                      <h1 className="text-3xl font-battambang">សរុប</h1>
                    </div>
                    <div>
                      <p className="text-lg">
                        ${objSummary.total_price_discount_USD}
                      </p>
                      <p>
                        <span className="text-lg font-battambang">៛</span>
                        <span className="text-lg">
                          {objSummary.total_price_discount_KHR.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <button
                    className="w-full py-2 bg-[#FF7A3E] font-battambang text-2xl hover:bg-[#FF7A3E]"
                    onClick={handleClearCar}
                  >
                    ផ្កាកការកម្មង់
                  </button>
                </Col>
                <Col span={12}>
                  <button
                    disabled={state.cart_list.length == 0}
                    className="w-full py-2 bg-[#82EA82] font-battambang text-2xl hover:bg-[#82EA82]"
                    onClick={handleCheckOut}
                  >
                    ទូទាត់ប្រាក់
                  </button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button
                    className="w-full py-2 bg-[#82EA82] font-battambang text-2xl hover:bg-[#82EA82]"
                    onClick={handlePrintInvoice}
                  >
                    Print
                  </button>
                </Col>
              </Row>
            </div>
          </div>
          {/* {state.cart_list?.map((item, index) => (
            <BillItem key={index} {...item} />
          ))}
          {!state.cart_list.length && <Empty />} */}
        </Col>

        {/* product Item render */}
        <Col span={14} className="overflow-y-auto w-2/3">
          <div className="mb-4">
            <Input.Search
              placeholder="Search products..."
              onChange={(event) =>
                setFilter((p) => ({ ...p, search: event.target.value }))
              }
              onSearch={onFilter}
              allowClear
              className="w-1/3"
            />

            <Select
              placeholder="Select category"
              className="w-48 mx-1"
              allowClear
              onChange={(id) => setFilter((p) => ({ ...p, category_id: id }))}
            >
              {state.category_fillter?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
            <Button onClick={onFilter} type="primary">
              Filter
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            {state.list.map((item, index) => (
              <Col key={index} span={6}>
                <ProductItem
                  {...item}
                  handlAddTocart={() => handlAddTocart(item)}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </MainPage>
  );
};

export default POSPage;

// cart_qty
// :
// 1
// category_id
// :
// 8
// category_name
// :
// "Hot Coffee"
// create_by
// :
// "Admin"
// created_at
// :
// "2024-12-22 08:54:53"
// description
// :
// "Espresso"
// discount
// :
// 0
// id
// :
// 81
// image
// :
// "products/IlbySGWXE6dE0vrYjMnKgcRSpxAlQa9PLNt53mhs.jpg"
// name
// :
// "Espresso"
// product_in
// :
// "1.95"
// product_out
// :
// "1.95"
// qty
// :
// 80
// updated_at
// :
// "2024-12-22 09:01:10"
