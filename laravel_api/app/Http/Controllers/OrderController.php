<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderDetailRequest;
use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $order = Order::all();
            return response()->json([
                'getAll' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to Order: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'message' => 'Failed to Order.'
            ], 500);
        }
    }

    // Controller method
    public function store(OrderRequest $orderRequest, OrderDetailRequest $orderDetailRequest)
    {
        try {
            $orderNumber = $this->OrderNumber();

            if (!$orderNumber) {
                return response()->json(['message' => 'Failed to generate invoice.'], 500);
            }

            // Validate and prepare order data
            $orderData = $orderRequest->validated();
            $orderData['order_num'] = $orderNumber;
            $orderData['user_id'] = Auth::user()->id;
            $orderData['create_by'] = Auth::user()->name;

            // Create order
            $order_create = Order::create($orderData);

            // Create order details
            $orderDetailRequest->validated();
            foreach ($orderDetailRequest['order_detail'] as $orderDetail) {
                $orderDetail['order_id'] = $order_create->id;

                // Create order detail
                OrderDetail::create($orderDetail);

                // Decrement product qty
                Product::where('id', $orderDetail['product_id'])->decrement('qty', $orderDetail['qty']);
            }

            // Current order data
            $currentOrder = Order::with('orderDetail')->find($order_create->id);

            return response()->json([
                'message' => 'Order successfully created.',
                'order' => $currentOrder,
                'order_detail' => $orderDetailRequest
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to order: ' . $e->getMessage(), [
                'exception' => $e,
                'order_data' => $orderRequest->all(),
                'order_details' => $orderDetailRequest->all(),
            ]);
            return response()->json([
                'message' => 'Failed to order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function OrderNumber()
    {
        try {
            //example : 2024121210
            $currentDateHour = now()->format('YmdH');

            $orderCount = DB::table('order')
                ->whereRaw("DATE_FORMAT(created_at, '%Y%m%d%H') = ?", [$currentDateHour])
                ->count();

            // increment count ++
            $nextOrderNumber = $orderCount + 1;

            // Create invoice number using the date, hour and number
            $invoiceNumber = "INV-WU-" . $currentDateHour . $nextOrderNumber;

            return $invoiceNumber;
        } catch (\Exception $e) {
            Log::error("Error generating invoice number: " . $e->getMessage());
            return null;
        }
    }

    public function show($id)
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'message' => 'Invalid order ID.',
                ], 400);
            }

            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'message' => 'Order not found.',
                ], 404);
            }

            return response()->json([
                'message' => 'Order retrieved successfully.',
                'order' => $order,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve order.', [
                'order_id' => $id,
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to retrieve order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
