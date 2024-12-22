<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table = 'product';

    protected $fillable = [
        'name',
        'category_id',
        'qty',
        'image',
        'product_in',
        'product_out',
        'description',
        'discount',
        'create_by',
    ];


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function orderDetail()
    {
        return $this->hasMany(OrderDetail::class, 'product_id');
    }


}

