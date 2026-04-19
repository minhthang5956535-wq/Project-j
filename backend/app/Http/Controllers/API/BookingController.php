<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Store a newly created booking.
     * Logic: Includes "Anti-Double Booking" check using transactions.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $property = Property::findOrFail($request->property_id);
        $checkIn = $request->check_in_date;
        $checkOut = $request->check_out_date;

        try {
            return DB::transaction(function () use ($property, $checkIn, $checkOut, $request) {
                // Check for overlapping bookings (Double Booking Logic)
                $isBooked = Booking::where('property_id', $property->id)
                    ->where(function ($query) use ($checkIn, $checkOut) {
                        $query->where(function ($q) use ($checkIn) {
                            $q->where('check_in_date', '<=', $checkIn)
                              ->where('check_out_date', '>', $checkIn);
                        })
                        ->orWhere(function ($q) use ($checkOut) {
                            $q->where('check_in_date', '<', $checkOut)
                              ->where('check_out_date', '>=', $checkOut);
                        })
                        ->orWhere(function ($q) use ($checkIn, $checkOut) {
                            $q->where('check_in_date', '>=', $checkIn)
                              ->where('check_out_date', '<=', $checkOut);
                        });
                    })
                    ->exists();

                if ($isBooked) {
                    return response()->json([
                        'message' => 'Rất tiếc, phòng đã có người đặt trong khoảng thời gian này.'
                    ], 409);
                }

                // Calculate duration
                $checkInDate = new \DateTime($checkIn);
                $checkOutDate = new \DateTime($checkOut);
                $days = $checkInDate->diff($checkOutDate)->days;
                
                $basePrice = $days * $property->price_per_night;
                $discountRate = 0;
                $discountAmount = 0;

                // Step 3: Branching logic for discounts
                if ($days >= 28) {
                    $discountRate = $property->monthly_discount_rate;
                } elseif ($days >= 7) {
                    $discountRate = $property->weekly_discount_rate;
                }

                if ($discountRate > 0) {
                    $discountAmount = ($basePrice * $discountRate) / 100;
                }

                $totalPrice = $basePrice - $discountAmount;

                // Create booking
                $booking = Booking::create([
                    'property_id' => $property->id,
                    'guest_id' => auth()->id() ?? 1,
                    'check_in_date' => $checkIn,
                    'check_out_date' => $checkOut,
                    'total_price' => $totalPrice,
                    'discount_amount' => $discountAmount,
                    'status' => 'pending'
                ]);

                return response()->json([
                    'message' => 'Đặt phòng thành công!',
                    'booking' => $booking
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đặt phòng.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
