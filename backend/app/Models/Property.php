<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'price_per_night',
        'weekly_discount_rate',
        'monthly_discount_rate',
        'address',
        'latitude',
        'longitude',
        'category',
        'status',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
