<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'category';

    protected $fillable = [
        'name',
        'description',
        'status',
        'create_by',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
